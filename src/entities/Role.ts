import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

export enum RoleName {
    SUPER_ADMIN = 'SUPER_ADMIN',
    COMPANY_USER = 'COMPANY_USER',
    CUSTOMER = 'CUSTOMER'
}

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column({
        type: 'enum',
        enum: RoleName,
        name: "name",
        unique: true
    })
    name: RoleName;

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

    @OneToMany(() => User, (user) => user.role, { cascade: ["insert"] })
    users: User[];
}