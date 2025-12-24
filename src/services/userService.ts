import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Role, RoleName } from '../entities/Role';
import { Company } from '../entities/Company';
import { Shipment } from '../entities/Shipment';
import bcrypt from 'bcrypt';
import { ApiException } from '../error/api-exception';

export class UserService {
    private userRepository = getRepository(User);
    private roleRepository = getRepository(Role);
    private companyRepository = getRepository(Company);
    private shipmentRepository = getRepository(Shipment);

    async createUser(username: string, email: string, password: string, roleName: string, companyId?: number): Promise<User> {
        const role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            throw new ApiException(400, 'Invalid role');
        }
        const existingUser = await this.userRepository.findOne({ where: { username, email } });
        if (existingUser) {
            throw new ApiException(409, 'User with given username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            role,
            roleId: role.id,
            companyId
        });
        return await this.userRepository.save(user);
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id: id }, relations: ['role', 'company'] }) || null;
    }

    async getAllUsers(page: number, limit: number): Promise<{ data: User[], total: number }> {
        const [data, total] = await this.userRepository.findAndCount({
            relations: ['role', 'company'],
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }

    async updateUser(id: number, updateData: any): Promise<User | null> {
        if (updateData.role) {
            const role = await this.roleRepository.findOne({ where: { name: updateData.role } });
            if (!role) {
                throw new ApiException(400, 'Invalid role');
            }
            updateData.roleId = role.id;
            updateData.role = role;
        }
        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        await this.userRepository.update(id, { ...updateData });
        return this.getUserById(id);
    }

    async deleteUser(id: number): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new ApiException(404, 'User not found');
        }
        await this.userRepository.delete(id);
        return 'User deleted successfully';
    }
}