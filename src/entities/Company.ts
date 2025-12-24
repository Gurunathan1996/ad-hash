import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('company')
export class Company {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column({ type: "varchar", length: 255, name: "name" })
    name: string;

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

    @OneToMany(() => User, (user) => user.company, { cascade: ["insert"] })
    users: User[];

    @ManyToOne(() => User, (user) => user.createdCompanies, {
        onDelete: "SET NULL",
        onUpdate: "RESTRICT",
    })
    // @ts-ignore
    @JoinColumn({
        name: "created_by_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_company_created_by_id",
    })
    createdBy: User;
}