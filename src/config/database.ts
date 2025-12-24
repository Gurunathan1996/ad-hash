import { createConnection, Connection } from 'typeorm';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { Company } from '../entities/Company';
import { Shipment } from '../entities/Shipment';
import { ShipmentEvent } from '../entities/ShipmentEvent';

export const createDatabaseConnection = async (): Promise<Connection> => {
    return await createConnection({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true, // Temporarily enabled to create tables
        logging: false,
        entities: [User, Role, Company, Shipment, ShipmentEvent],
    });
};