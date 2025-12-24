import { Request, Response, NextFunction } from 'express';
import { ShipmentService } from '../services/shipmentService';
import { CreateShipmentDto, UpdateShipmentStatusDto, AddShipmentEventDto } from '../dto/shipment.dto';
import { validateDto } from '../utils/validation';
import { ApiResponse } from '../utils/api-response';
import { ApiException } from '../error/api-exception';
import { UnhandledException } from '../error/unhandled-exception';

export class ShipmentController {
    private shipmentService: ShipmentService;

    constructor() {
        this.shipmentService = new ShipmentService();
    }

    public createShipment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const dto = await validateDto(CreateShipmentDto, req.body);
            const newShipment = await this.shipmentService.createShipment({ ...dto, createdById: userId });
            res.status(201).send(new ApiResponse(201, newShipment, 'Shipment created successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public updateShipmentStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shipmentId } = req.params;
            const dto = await validateDto(UpdateShipmentStatusDto, req.body);
            const userId = (req as any).user.id;
            const updatedShipment = await this.shipmentService.updateShipmentStatus(shipmentId, dto.status, userId);
            if (!updatedShipment) {
                throw new ApiException(404, 'Shipment not found');
            }
            res.status(200).send(new ApiResponse(200, updatedShipment, 'Shipment status updated successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public addShipmentEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shipmentId } = req.params;
            const dto = await validateDto(AddShipmentEventDto, req.body);
            const result = await this.shipmentService.addEvent(shipmentId, dto.event, dto.location, dto.description);
            res.status(201).send(new ApiResponse(201, result, 'Event added'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public getAllShipments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.shipmentService.getAllShipments(page, limit);
            res.status(200).send(new ApiResponse(200, result, 'Shipments fetched successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public getShipmentDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shipmentId } = req.params;
            const shipmentDetails = await this.shipmentService.getShipmentDetails(shipmentId);
            if (!shipmentDetails) {
                throw new ApiException(404, 'Shipment not found');
            }
            res.status(200).send(new ApiResponse(200, shipmentDetails, 'Shipment details fetched successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };
}