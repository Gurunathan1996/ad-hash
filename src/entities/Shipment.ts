import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { ShipmentEvent } from './ShipmentEvent';

export enum ShipmentStatus {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    ARRIVED_AT_PORT = 'ARRIVED_AT_PORT',
    DELIVERED = 'DELIVERED'
}

@Entity('shipment')
export class Shipment {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column({ type: "varchar", length: 255, name: "shipment_id", unique: true })
    shipmentId: string; // e.g., SHP123

    @Column({ type: "varchar", length: 255, name: "tracking_number", unique: true, nullable: true })
    trackingNumber: string;

    @Column({ type: "text", name: "sender_address", nullable: true })
    senderAddress: string;

    @Column({ type: "text", name: "receiver_address", nullable: true })
    receiverAddress: string;

    @Column({ type: 'float', name: "weight", nullable: true })
    weight: number;

    @Column({ type: 'text', name: "description", nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ShipmentStatus,
        name: "status",
        default: ShipmentStatus.PENDING
    })
    status: ShipmentStatus;

    @Column({
        type: "int",
        name: "created_by_id",
        nullable: true,
    })
    createdById: number | null;

    @Column("timestamp", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;

    @Column("timestamp", {
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt: Date;

    @OneToMany(() => ShipmentEvent, (event) => event.shipment, { cascade: ["insert"] })
    events: ShipmentEvent[];

    @ManyToOne(() => User, (user) => user.shipments, {
        onDelete: "SET NULL",
        onUpdate: "RESTRICT",
    })
    // @ts-ignore
    @JoinColumn({
        name: "created_by_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_shipment_created_by_user",
    })
    createdBy: User;
}