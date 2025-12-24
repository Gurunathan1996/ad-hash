import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Shipment } from './Shipment';

export enum ShipmentEventType {
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    ARRIVED_AT_PORT = 'ARRIVED_AT_PORT',
    DELIVERED = 'DELIVERED'
}

@Entity('shipment_event')
export class ShipmentEvent {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column({
        type: "int",
        name: "shipment_id",
    })
    shipmentId: number;

    @Column({
        type: 'enum',
        enum: ShipmentEventType,
        name: "event"
    })
    event: ShipmentEventType;

    @Column({ type: "varchar", length: 255, name: "location", nullable: true })
    location: string;

    @Column({ type: 'text', name: "description", nullable: true })
    description: string;

    @Column("timestamp", {
        name: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    timestamp: Date;

    @ManyToOne(() => Shipment, (shipment) => shipment.events, {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
    })
    // @ts-ignore
    @JoinColumn({
        name: "shipment_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_shipment_event_shipment_id",
    })
    shipment: Shipment;
}