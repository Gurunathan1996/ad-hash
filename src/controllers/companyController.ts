import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/companyService';
import { CreateCompanyDto } from '../dto/company.dto';
import { validateDto } from '../utils/validation';
import { ApiResponse } from '../utils/api-response';
import { ApiException } from '../error/api-exception';
import { UnhandledException } from '../error/unhandled-exception';

export class CompanyController {
    private companyService: CompanyService;

    constructor() {
        this.companyService = new CompanyService();
    }

    public createCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = await validateDto(CreateCompanyDto, req.body);
            const createdById = (req as any).user.id;
            const company = await this.companyService.createCompany(dto.name, createdById);
            res.status(201).send(new ApiResponse(201, company, 'Company created successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public getCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const company = await this.companyService.getCompanyById(parseInt(id));
            if (!company) {
                throw new ApiException(404, 'Company not found');
            }
            res.status(200).send(new ApiResponse(200, company, 'Company fetched successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.companyService.getAllCompanies(page, limit);
            res.status(200).send(new ApiResponse(200, result, 'Companies fetched successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };
}