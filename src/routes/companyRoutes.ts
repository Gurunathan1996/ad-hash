import { Router } from 'express';
import { CompanyController } from '../controllers/companyController';
import { authMiddleware } from '../middleware/authMiddleware';
import rbacMiddleware from '../middleware/rbacMiddleware';
import { BodyValidationMiddleware, UrlParamsValidationMiddleware } from '../middleware/validationMiddleware';
import { CreateCompanyDto, IdDto } from '../dto/company.dto';

const router = Router();
const companyController = new CompanyController();

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "ABC Logistics Inc."
 *           example:
 *             name: "ABC Logistics Inc."
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Company created successfully"
 *               company:
 *                 id: 1
 *                 name: "ABC Logistics Inc."
 *                 createdAt: "2024-12-24T08:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Authentication required"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               message: "Insufficient permissions"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation failed"
 *               errors: ["Company name is required"]
 */
router.post('/', authMiddleware, rbacMiddleware(['SUPER_ADMIN']), BodyValidationMiddleware(CreateCompanyDto), companyController.createCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "ABC Logistics Inc."
 *               address: "123 Business Ave, Suite 100, New York, NY 10001"
 *               phone: "+1-555-0123"
 *               email: "contact@abclogistics.com"
 *               createdAt: "2024-12-24T08:00:00Z"
 *               updatedAt: "2024-12-24T08:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Authentication required"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               message: "Insufficient permissions"
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Company not found"
 */
router.get('/:id', authMiddleware, rbacMiddleware(['SUPER_ADMIN', 'COMPANY_USER']), UrlParamsValidationMiddleware(IdDto), companyController.getCompany);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of companies per page
 *         example: 10
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             example:
 *               companies:
 *                 - id: 1
 *                   name: "ABC Logistics Inc."
 *                   address: "123 Business Ave, Suite 100, New York, NY 10001"
 *                   phone: "+1-555-0123"
 *                   email: "contact@abclogistics.com"
 *                   createdAt: "2024-12-24T08:00:00Z"
 *                 - id: 2
 *                   name: "XYZ Shipping Co."
 *                   address: "456 Commerce Blvd, Los Angeles, CA 90210"
 *                   phone: "+1-555-0456"
 *                   email: "info@xyzshipping.com"
 *                   createdAt: "2024-12-24T09:15:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Authentication required"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               message: "Insufficient permissions"
 */
router.get('/', authMiddleware, rbacMiddleware(['SUPER_ADMIN']), companyController.getAllCompanies);

export default router;