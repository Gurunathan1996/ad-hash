import { getRepository } from 'typeorm';
import { Company } from '../entities/Company';

export class CompanyService {
    private companyRepository = getRepository(Company);

    async createCompany(name: string, createdById: number): Promise<Company> {
        const company = this.companyRepository.create({ name, createdById });
        return await this.companyRepository.save(company);
    }

    async getCompanyById(id: number): Promise<Company | null> {
        return await this.companyRepository.findOne(id) || null;
    }

    async getAllCompanies(page: number, limit: number): Promise<{ data: Company[], total: number }> {
        const [data, total] = await this.companyRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
}