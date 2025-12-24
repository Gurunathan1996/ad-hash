import { IsString, IsIn, IsOptional, IsNumber, IsNotEmpty, IsInt } from 'class-validator';
import { Trim } from '../utils/trimmer';
import { ShipmentStatus } from '../entities/Shipment';
import { ShipmentEventType } from '../entities/ShipmentEvent';

export class IdDto {
    @IsString()
    shipmentId: string;
}

export class CreateShipmentDto {
    @Trim()
    @IsString()
    @IsNotEmpty()
    trackingNumber: string;

    @Trim()
    @IsString()
    senderAddress: string;

    @Trim()
    @IsString()
    receiverAddress: string;

    @IsNumber()
    weight: number;

    @IsOptional()
    @Trim()
    @IsString()
    description?: string;
}

export class UpdateShipmentStatusDto {
    @IsString()
    @IsIn(Object.values(ShipmentStatus), { message: 'Invalid status' })
    status: ShipmentStatus;
}

export class AddShipmentEventDto {
    @IsString()
    @IsIn(Object.values(ShipmentEventType), { message: 'Invalid event' })
    event: ShipmentEventType;

    @IsOptional()
    @Trim()
    @IsString()
    location?: string;

    @IsOptional()
    @Trim()
    @IsString()
    description?: string;
}