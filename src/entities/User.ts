import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './Role';
import { Company } from './Company';
import { Shipment } from './Shipment';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column({ type: "varchar", length: 255, name: "username", unique: true })
    username: string;

    @Column({ type: "varchar", length: 255, name: "email", nullable: true, unique: true })
    email: string;

    @Column({ type: "varchar", length: 255, name: "password" })
    password: string;

    @Column({
        type: "int",
        name: "role_id",
    })
    roleId: number;

    @Column({
        type: "int",
        name: "company_id",
        nullable: true,
    })
    companyId: number;

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

    @OneToMany(() => Shipment, (shipment) => shipment.createdBy, { cascade: ["insert"] })
    shipments: Shipment[];

    @OneToMany(() => Company, (company) => company.createdBy, { cascade: ["insert"] })
    createdCompanies: Company[];

    @ManyToOne(() => Role, (role) => role.users, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    // @ts-ignore
    @JoinColumn({
        name: "role_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_user_role_id",
    })
    role: Role;

    @ManyToOne(() => Company, (company) => company.users, {
        nullable: true,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    // @ts-ignore
    @JoinColumn({
        name: "company_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_user_company_id",
    })
    company: Company;
}