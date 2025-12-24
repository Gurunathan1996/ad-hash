import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createDatabaseConnection } from './config/database';
import { Request, Response } from 'express';
import { Role, RoleName } from './entities/Role';
import { getRepository } from 'typeorm';
import { errorHandler } from './middleware/errorHandler';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Company } from './entities/Company';
import { swaggerOptions } from './config/swagger-config';

const app = express();
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Shipment Tracking & User Management System');
});

const seedRoles = async () => {
    const roleRepository = getRepository(Role);
    const existingRoles = await roleRepository.find();
    if (existingRoles.length === 0) {
        await roleRepository.save([
            { name: RoleName.SUPER_ADMIN },
            { name: RoleName.COMPANY_USER },
            { name: RoleName.CUSTOMER }
        ]);
        console.log('Roles seeded');
    }
};

const seedCompanies = async () => {
    const companyRepository = getRepository(Company);
    const existingCompanies = await companyRepository.find();
    if (existingCompanies.length === 0) {
        // Create a default company for testing
        await companyRepository.save([
            { name: 'Default Company' }
        ]);
        console.log('Companies seeded');
    }
};

const startServer = async () => {
    try {
        // Create database connection first
        const connection = await createDatabaseConnection();
        console.log('✅ Database connected successfully');

        // Seed roles after connection is established
        await seedRoles();
        
        // Seed companies after roles
        await seedCompanies();

        // Now import and setup routes after database is connected
        const authRoutes = (await import('./routes/authRoutes')).default;
        const shipmentRoutes = (await import('./routes/shipmentRoutes')).default;
        const userRoutes = (await import('./routes/userRoutes')).default;
        const companyRoutes = (await import('./routes/companyRoutes')).default;

        // Setup routes
        app.use('/api/auth', authRoutes);
        app.use('/api/shipments', shipmentRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/companies', companyRoutes);

        // 404 handler for unknown routes (returns structured JSON)
        app.use((req: Request, res: Response) => {
            res.status(404).json({
                status: 404,
                code: 'NOT_FOUND',
                message: `Cannot ${req.method} ${req.originalUrl}`
            });
        });

        // Centralized error handling middleware (must be after routes)
        app.use(errorHandler);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Error connecting to the database', error);
        process.exit(1);
    }
};

// startServer(); // Removed - now called explicitly from index.ts

export { startServer };
export default app;