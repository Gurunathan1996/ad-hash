import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Role, RoleName } from '../entities/Role';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    private userRepository = getRepository(User);
    private roleRepository = getRepository(Role);

    async signup(username: string, email: string, password: string, roleId: number, companyId?: number) {
        const roleNames = [RoleName.SUPER_ADMIN, RoleName.COMPANY_USER, RoleName.CUSTOMER];
        const roleName = roleNames[roleId - 1];
        if (!roleName) {
            throw new Error('Invalid role');
        }
        const role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            throw new Error('Invalid role');
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

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { username },
            relations: ['role']
        });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                role: user.role.name
            }
        };
    }

    private generateToken(user: User) {
        return jwt.sign({ id: user.id, role: user.role.name }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }

    async validateToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}