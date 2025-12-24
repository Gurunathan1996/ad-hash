import { UserService } from '../src/services/userService';
import { UserController } from '../src/controllers/userController';
import { Request, Response } from 'express';

// Mock the UserService
jest.mock('../src/services/userService');
const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

// Mock the validation utility
jest.mock('../src/utils/validation');
import { validateDto } from '../src/utils/validation';
const mockedValidateDto = validateDto as jest.MockedFunction<typeof validateDto>;

describe('UserController', () => {
    let userController: UserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Reset the mock constructor
        MockedUserService.mockClear();

        // Create controller instance
        userController = new UserController();

        // Mock response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNext = jest.fn();
    });

    describe('createUser', () => {
        it('should create user successfully', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                roleId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Mock validation
            mockedValidateDto.mockResolvedValue({
                username: 'testuser',
                password: 'password123',
                role: 'COMPANY_USER',
                companyId: 1
            });

            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.createUser.mockResolvedValue(mockUser as any);

            mockRequest = {
                body: {
                    username: 'testuser',
                    password: 'password123',
                    role: 'COMPANY_USER',
                    companyId: 1
                },
                user: { id: 1 }
            } as any;

            await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
            expect(mockInstance.createUser).toHaveBeenCalledWith('testuser', 'password123', 'COMPANY_USER', 1, 1);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 1, username: 'user1', role: { name: 'COMPANY_USER' } },
                { id: 2, username: 'user2', role: { name: 'CUSTOMER' } }
            ];

            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.getAllUsers.mockResolvedValue(mockUsers as any);

            mockRequest = {};

            await userController.getAllUsers(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
            expect(mockInstance.getAllUsers).toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('should return user by id', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                role: { name: 'COMPANY_USER' },
                company: { id: 1, name: 'Test Company' }
            };

            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.getUserById.mockResolvedValue(mockUser as any);

            mockRequest = {
                params: { id: '1' }
            };

            await userController.getUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
            expect(mockInstance.getUserById).toHaveBeenCalledWith(1);
        });

        it('should return 404 for non-existent user', async () => {
            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.getUserById.mockResolvedValue(null);

            mockRequest = {
                params: { id: '999' }
            };

            await userController.getUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const mockUser = {
                id: 1,
                username: 'updateduser',
                roleId: 2,
                updatedAt: new Date()
            };

            // Mock validation
            mockedValidateDto.mockResolvedValueOnce({
                username: 'updateduser',
                role: 'CUSTOMER'
            });

            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.updateUser.mockResolvedValue(mockUser as any);

            mockRequest = {
                params: { id: '1' },
                body: {
                    username: 'updateduser',
                    role: 'CUSTOMER'
                }
            };

            await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
            expect(mockInstance.updateUser).toHaveBeenCalledWith(1, { username: 'updateduser', role: 'CUSTOMER' });
        });

        it('should return 404 for non-existent user', async () => {
            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.updateUser.mockResolvedValue(null);

            mockRequest = {
                params: { id: '999' },
                body: { username: 'newname' }
            };

            await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.deleteUser.mockResolvedValue(true);

            mockRequest = {
                params: { id: '1' }
            };

            await userController.deleteUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockInstance.deleteUser).toHaveBeenCalledWith(1);
        });

        it('should return 404 for non-existent user', async () => {
            // Setup mock implementation
            const mockInstance = MockedUserService.mock.instances[0] as jest.Mocked<UserService>;
            mockInstance.deleteUser.mockResolvedValue(false);

            mockRequest = {
                params: { id: '999' }
            };

            await userController.deleteUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
});