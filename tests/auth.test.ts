import { AuthService } from '../src/services/authService';
import { AuthController } from '../src/controllers/authController';
import { Request, Response } from 'express';

// Mock the AuthService
jest.mock('../src/services/authService');
const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('AuthController', () => {
    let authController: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Reset the mock constructor
        MockedAuthService.mockClear();

        // Create controller instance
        authController = new AuthController();

        // Mock response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNext = jest.fn();
    });

    describe('login', () => {
        it('should return token for valid credentials', async () => {
            // Setup mock implementation
            const mockInstance = MockedAuthService.mock.instances[0] as jest.Mocked<AuthService>;
            mockInstance.login.mockResolvedValue({
                token: 'mock-jwt-token',
                user: { id: 1, role: 'COMPANY_USER' as any }
            });

            mockRequest = {
                body: { username: 'testuser', password: 'password123' },
            };

            await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                token: 'mock-jwt-token',
                user: { id: 1, role: 'COMPANY_USER' }
            });
            expect(mockInstance.login).toHaveBeenCalledWith('testuser', 'password123');
        });

        it('should call next with error for invalid credentials', async () => {
            // Setup mock implementation
            const mockInstance = MockedAuthService.mock.instances[0] as jest.Mocked<AuthService>;
            mockInstance.login.mockRejectedValue(new Error('Invalid credentials'));

            mockRequest = {
                body: { username: 'testuser', password: 'wrongpassword' },
            };

            await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
            expect(mockInstance.login).toHaveBeenCalledWith('testuser', 'wrongpassword');
        });
    });

    describe('signup', () => {
        it('should create user successfully', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: 'hashedpassword',
                roleId: 1,
                role: {} as any,
                companyId: undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Setup mock implementation
            const mockInstance = MockedAuthService.mock.instances[0] as jest.Mocked<AuthService>;
            mockInstance.signup.mockResolvedValue(mockUser as any);

            mockRequest = {
                body: { username: 'testuser', password: 'password123', role: 'COMPANY_USER' },
            };

            await authController.signup(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
            expect(mockInstance.signup).toHaveBeenCalledWith('testuser', 'password123', 'COMPANY_USER', undefined);
        });
    });
});