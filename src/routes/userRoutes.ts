import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import rbacMiddleware from '../middleware/rbacMiddleware';
import { BodyValidationMiddleware, UrlParamsValidationMiddleware } from '../middleware/validationMiddleware';
import { CreateUserDto, UpdateUserDto, IdDto } from '../dto/user.dto';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: "jane.smith"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.smith@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "securepass123"
 *               role:
 *                 type: string
 *                 example: "COMPANY_USER"
 *                 description: "SUPER_ADMIN | COMPANY_USER | CUSTOMER"
 *               companyId:
 *                 type: integer
 *                 example: 1
 *                 description: "Required for COMPANY_USER role"
 *             example:
 *               username: "jane.smith"
 *               email: "jane.smith@example.com"
 *               password: "securepass123"
 *               role: "COMPANY_USER"
 *               companyId: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 id: 2
 *                 username: "jane.smith"
 *                 email: "jane.smith@example.com"
 *                 role: "COMPANY_USER"
 *                 companyId: 1
 *                 createdAt: "2024-12-24T10:30:00Z"
 *                 updatedAt: "2024-12-24T10:30:00Z"
 *               message: "User created successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               code: "ERROR"
 *               message: "Authentication required"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: 403
 *               code: "ERROR"
 *               message: "Access denied"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               code: "INVALID_REQUEST_BODY"
 *               message: "Required parameters in request body are either missing or invalid"
 *               errors: ["Email is required", "Invalid role"]
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             example:
 *               status: 409
 *               code: "CONFLICT"
 *               message: "User with given username or email already exists"
 */
router.post('/', authMiddleware, rbacMiddleware(['SUPER_ADMIN']), BodyValidationMiddleware(CreateUserDto), userController.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: Number of users per page
 *         example: 10
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 data:
 *                   - id: 1
 *                     username: "john.doe"
 *                     email: "john.doe@example.com"
 *                     role: "SUPER_ADMIN"
 *                     companyId: null
 *                     createdAt: "2024-12-24T09:00:00Z"
 *                     updatedAt: "2024-12-24T09:00:00Z"
 *                   - id: 2
 *                     username: "jane.smith"
 *                     email: "jane.smith@example.com"
 *                     role: "COMPANY_USER"
 *                     companyId: 1
 *                     createdAt: "2024-12-24T10:30:00Z"
 *                     updatedAt: "2024-12-24T10:30:00Z"
 *                 total: 2
 *               message: "Users fetched successfully"
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
router.get('/', authMiddleware, rbacMiddleware(['SUPER_ADMIN']), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 id: 2
 *                 username: "jane.smith"
 *                 email: "jane.smith@example.com"
 *                 role: "COMPANY_USER"
 *                 companyId: 1
 *                 createdAt: "2024-12-24T10:30:00Z"
 *                 updatedAt: "2024-12-24T10:30:00Z"
 *               message: "User fetched successfully"
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
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 */
router.get('/:id', authMiddleware, rbacMiddleware(['SUPER_ADMIN', 'COMPANY_USER']), UrlParamsValidationMiddleware(IdDto), userController.getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "updated.name"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *               role:
 *                 type: string
 *                 example: "COMPANY_USER"
 *                 description: "SUPER_ADMIN | COMPANY_USER | CUSTOMER"
 *               companyId:
 *                 type: integer
 *                 example: 1
 *           example:
 *             username: "updated.name"
 *             password: "newpassword123"
 *             role: "COMPANY_USER"
 *             companyId: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 id: 1
 *                 username: "updated.name"
 *                 email: "updated@example.com"
 *                 role: "COMPANY_USER"
 *                 companyId: 1
 *                 createdAt: "2024-12-24T10:30:00Z"
 *                 updatedAt: "2024-12-24T15:30:00Z"
 *               message: "User updated successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation failed"
 *               errors: ["Username must be at least 3 characters"]
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
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 */
router.put('/:id', authMiddleware, rbacMiddleware(['SUPER_ADMIN']), BodyValidationMiddleware(UpdateUserDto), userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: true
 *               message: "User deleted successfully"
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
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 */
router.delete('/:id', authMiddleware, rbacMiddleware(['SUPER_ADMIN']), UrlParamsValidationMiddleware(IdDto), userController.deleteUser);

export default router;