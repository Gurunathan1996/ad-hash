import { CompanyService } from '../src/services/companyService';
import { CompanyController } from '../src/controllers/companyController';
import { Request, Response } from 'express';

// Mock the CompanyService
jest.mock('../src/services/companyService');
const MockedCompanyService = CompanyService as jest.MockedClass<typeof CompanyService>;

describe('CompanyController', () => {
    let companyController: CompanyController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Reset the mock constructor
        MockedCompanyService.mockClear();

        // Create controller instance
        companyController = new CompanyController();

        // Mock response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNext = jest.fn();
    });

    describe('createCompany', () => {
        it('should create company successfully', async () => {
            const mockCompany = {
                id: 1,
                name: 'Test Company',
                address: '123 Test St',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Setup mock implementation
            const mockInstance = MockedCompanyService.mock.instances[0] as jest.Mocked<CompanyService>;
            mockInstance.createCompany.mockResolvedValue(mockCompany as any);

            mockRequest = {
                body: {
                    name: 'Test Company'
                },
                user: { id: 1 }
            } as any;

            await companyController.createCompany(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCompany);
            expect(mockInstance.createCompany).toHaveBeenCalledWith('Test Company', 1);
        });
    });

    describe('getAllCompanies', () => {
        it('should return all companies', async () => {
            const mockCompanies = [
                { id: 1, name: 'Company A', address: 'Address A' },
                { id: 2, name: 'Company B', address: 'Address B' }
            ];

            // Setup mock implementation
            const mockInstance = MockedCompanyService.mock.instances[0] as jest.Mocked<CompanyService>;
            mockInstance.getAllCompanies.mockResolvedValue(mockCompanies as any);

            mockRequest = {};

            await companyController.getAllCompanies(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCompanies);
            expect(mockInstance.getAllCompanies).toHaveBeenCalled();
        });
    });

    describe('getCompany', () => {
        it('should return company by id', async () => {
            const mockCompany = {
                id: 1,
                name: 'Test Company',
                address: '123 Test St',
                users: [
                    { id: 1, username: 'user1' },
                    { id: 2, username: 'user2' }
                ]
            };

            // Setup mock implementation
            const mockInstance = MockedCompanyService.mock.instances[0] as jest.Mocked<CompanyService>;
            mockInstance.getCompanyById.mockResolvedValue(mockCompany as any);

            mockRequest = {
                params: { id: '1' }
            };

            await companyController.getCompany(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCompany);
            expect(mockInstance.getCompanyById).toHaveBeenCalledWith(1);
        });

        it('should return 404 for non-existent company', async () => {
            // Setup mock implementation
            const mockInstance = MockedCompanyService.mock.instances[0] as jest.Mocked<CompanyService>;
            mockInstance.getCompanyById.mockResolvedValue(null);

            mockRequest = {
                params: { id: '999' }
            };

            await companyController.getCompany(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Company not found' });
        });
    });
});