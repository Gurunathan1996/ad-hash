import { getRepository } from 'typeorm';
import { Shipment } from '../entities/Shipment';
import { ShipmentEvent } from '../entities/ShipmentEvent';
import { ShipmentStatus } from '../entities/Shipment';
import { ShipmentEventType } from '../entities/ShipmentEvent';
import { User } from '../entities/User';

export class ShipmentService {
    private shipmentRepository = getRepository(Shipment);
    private eventRepository = getRepository(ShipmentEvent);
    private userRepository = getRepository(User);

    async createShipment(data: { createdById: number; trackingNumber?: string; senderAddress?: string; receiverAddress?: string; weight?: number; description?: string; }): Promise<Shipment> {
        const shipmentId = 'SHP' + Date.now(); // Simple ID generation
        const shipment = this.shipmentRepository.create({
            shipmentId,
            status: ShipmentStatus.PENDING,
            createdById: data.createdById,
            trackingNumber: data.trackingNumber,
            senderAddress: data.senderAddress,
            receiverAddress: data.receiverAddress,
            weight: data.weight,
            description: data.description
        });
        return await this.shipmentRepository.save(shipment);
    }

    async updateShipmentStatus(id: string, status: ShipmentStatus, userId: number): Promise<Shipment | null> {
        const shipment = await this.shipmentRepository.findOne({ where: { shipmentId: id }, relations: ['createdBy'] });
        if (!shipment) {
            return null;
        }
        // Ensure the acting user exists and belongs to the same company as the shipment creator
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.companyId !== shipment.createdBy.companyId) {
            throw new Error('Unauthorized');
        }
        shipment.status = status;
        await this.shipmentRepository.save(shipment);
        // Map shipment status -> shipment event type and add event
        let eventType: ShipmentEventType;
        switch (status) {
            case ShipmentStatus.PICKED_UP:
                eventType = ShipmentEventType.PICKED_UP;
                break;
            case ShipmentStatus.IN_TRANSIT:
                eventType = ShipmentEventType.IN_TRANSIT;
                break;
            case ShipmentStatus.ARRIVED_AT_PORT:
                eventType = ShipmentEventType.ARRIVED_AT_PORT;
                break;
            case ShipmentStatus.DELIVERED:
                eventType = ShipmentEventType.DELIVERED;
                break;
            default:
                // For other cases (like PENDING) we skip creating an event
                eventType = null as any;
        }
        if (eventType) {
            await this.addEvent(id, eventType);
        }
        return shipment;
    }

    async addEvent(shipmentId: string, event: ShipmentEventType, location?: string, description?: string): Promise<void> {
        const shipment = await this.shipmentRepository.findOne({ where: { shipmentId } });
        if (!shipment) {
            throw new Error('Shipment not found');
        }
        const shipmentEvent = this.eventRepository.create({
            shipment,
            shipmentId: shipment.id,
            event,
            location,
            description,
            
        });
        await this.eventRepository.save(shipmentEvent);
    }

    async getShipmentDetails(shipmentId: string): Promise<any> {
        const shipment = await this.shipmentRepository.findOne({
            where: { shipmentId },
            relations: ['events']
        });
        if (!shipment) {
            return null;
        }
        return {
            shipmentId: shipment.shipmentId,
            status: shipment.status,
            trackingNumber: shipment.trackingNumber,
            senderAddress: shipment.senderAddress,
            receiverAddress: shipment.receiverAddress,
            weight: shipment.weight,
            description: shipment.description,
            events: shipment.events.map(e => ({
                event: e.event,
                location: e.location,
                description: e.description,
                timestamp: e.timestamp
            }))
        };
    }

    async getAllShipments(page: number, limit: number): Promise<{ data: Shipment[], total: number }> {
        const [data, total] = await this.shipmentRepository.findAndCount({
            relations: ['events'],
            skip: (page - 1) * limit,
            take: limit
        });
        return { data, total };
    }
}