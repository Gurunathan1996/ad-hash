import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import { Role, RoleName } from '../entities/Role';
import { Company } from '../entities/Company';
import { User } from '../entities/User';

async function run() {
    const connection = await createConnection();
    try {
        const roleRepo = getRepository(Role);
        const companyRepo = getRepository(Company);
        const userRepo = getRepository(User);

        // Ensure roles
        for (const name of [RoleName.SUPER_ADMIN, RoleName.COMPANY_USER, RoleName.CUSTOMER]) {
            const exists = await roleRepo.findOne({ where: { name } });
            if (!exists) {
                const r = roleRepo.create({ name });
                await roleRepo.save(r);
            }
        }

        // Create a sample company
        let company = await companyRepo.findOne({ where: { name: 'Default Company' } });
        if (!company) {
            company = companyRepo.create({ name: 'Default Company' });
            await companyRepo.save(company);
        }

        // Create a sample user for that company
        const role = await roleRepo.findOne({ where: { name: RoleName.COMPANY_USER } });
        let user = await userRepo.findOne({ where: { username: 'companyuser' } });
        if (!user) {
            user = userRepo.create({
                username: 'companyuser',
                email: 'companyuser@example.com',
                password: 'password',
                roleId: role ? role.id : undefined,
                companyId: company.id
            });
            await userRepo.save(user);
        }

        console.log('Seeding complete');
    } catch (err) {
        console.error('Seed error', err);
    } finally {
        await connection.close();
    }
}

run().catch(err => console.error(err));
