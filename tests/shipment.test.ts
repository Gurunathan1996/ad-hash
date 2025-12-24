import { ShipmentService } from '../src/services/shipmentService';
import { ShipmentController } from '../src/controllers/shipmentController';
import { Request, Response } from 'express';

// Mock the ShipmentService
jest.mock('../src/services/shipmentService');
const MockedShipmentService = ShipmentService as jest.MockedClass<typeof ShipmentService>;

// Mock the validation utility
jest.mock('../src/utils/validation');
import { validateDto } from '../src/utils/validation';
const mockedValidateDto = validateDto as jest.MockedFunction<typeof validateDto>;

describe('ShipmentController', () => {
    let shipmentController: ShipmentController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Reset the mock constructor
        MockedShipmentService.mockClear();

        // Create controller instance
        shipmentController = new ShipmentController();

        // Mock response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNext = jest.fn();
    });

    describe('createShipment', () => {
        it('should create shipment successfully', async () => {
            const mockShipment = {
                id: 1,
                shipmentId: 'SHP123',
                status: 'PENDING',
                createdById: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.createShipment.mockResolvedValue(mockShipment as any);

            mockRequest = {
                user: { id: 1 }
            } as any;

            await shipmentController.createShipment(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockShipment);
            expect(mockInstance.createShipment).toHaveBeenCalledWith({ createdById: 1 });
        });
    });

    describe('getAllShipments', () => {
        it('should return paginated shipments', async () => {
            const mockShipments = [
                {
                    id: 1,
                    shipmentId: 'SHP1',
                    status: 'PENDING',
                    createdById: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    events: []
                },
                {
                    id: 2,
                    shipmentId: 'SHP2',
                    status: 'IN_TRANSIT',
                    createdById: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    events: []
                }
            ];
            const mockResult = {
                shipments: mockShipments as any,
                total: 2,
                page: 1,
                totalPages: 1
            };

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.getAllShipments.mockResolvedValue(mockResult);

            mockRequest = {
                query: { page: '1', limit: '10' }
            };

            await shipmentController.getAllShipments(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
            expect(mockInstance.getAllShipments).toHaveBeenCalledWith(1, 10);
        });

        it('should use default pagination values', async () => {
            const mockResult = {
                shipments: [],
                total: 0,
                page: 1,
                totalPages: 0
            };

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.getAllShipments.mockResolvedValue(mockResult);

            mockRequest = {
                query: {}
            };

            await shipmentController.getAllShipments(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockInstance.getAllShipments).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('getShipmentDetails', () => {
        it('should return shipment details', async () => {
            const mockShipment = {
                id: 1,
                status: 'PENDING',
                events: [],
                createdBy: { id: 1, username: 'user1' }
            };

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.getShipmentDetails.mockResolvedValue(mockShipment as any);

            mockRequest = {
                params: { id: '1' }
            };

            await shipmentController.getShipmentDetails(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockShipment);
            expect(mockInstance.getShipmentDetails).toHaveBeenCalledWith('1');
        });

        it('should return 404 for non-existent shipment', async () => {
            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.getShipmentDetails.mockResolvedValue(null);

            mockRequest = {
                params: { id: '999' }
            };

            await shipmentController.getShipmentDetails(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Shipment not found' });
        });
    });

    describe('updateShipmentStatus', () => {
        it('should update shipment status successfully', async () => {
            const mockShipment = {
                id: 1,
                shipmentId: 'SHP1',
                status: 'IN_TRANSIT',
                updatedAt: new Date()
            };

            // Mock validation
            mockedValidateDto.mockResolvedValueOnce({ status: 'IN_TRANSIT' });

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.updateShipmentStatus.mockResolvedValue(mockShipment as any);

            mockRequest = {
                params: { id: '1' },
                body: { status: 'IN_TRANSIT' },
                user: { id: 1 }
            } as any;

            await shipmentController.updateShipmentStatus(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockShipment);
            expect(mockInstance.updateShipmentStatus).toHaveBeenCalledWith('1', 'IN_TRANSIT', 1);
        });

        it('should return 404 for non-existent shipment', async () => {
            // Mock validation
            mockedValidateDto.mockResolvedValueOnce({ status: 'DELIVERED' });

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.updateShipmentStatus.mockResolvedValue(null);

            mockRequest = {
                params: { id: '999' },
                body: { status: 'DELIVERED' },
                user: { id: 1 }
            } as any;

            await shipmentController.updateShipmentStatus(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Shipment not found' });
        });
    });

    describe('addShipmentEvent', () => {
        it('should add shipment event successfully', async () => {
            // Mock validation
            mockedValidateDto.mockResolvedValueOnce({ event: 'Package picked up' });

            // Setup mock implementation
            const mockInstance = MockedShipmentService.mock.instances[0] as jest.Mocked<ShipmentService>;
            mockInstance.addEvent.mockResolvedValue(undefined);

            mockRequest = {
                params: { id: '1' },
                body: { event: 'Package picked up' }
            };

            await shipmentController.addShipmentEvent(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event added' });
            expect(mockInstance.addEvent).toHaveBeenCalledWith('1', 'Package picked up');
        });
    });
});