import { Router } from 'express';
import { ShipmentController } from '../controllers/shipmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import rbacMiddleware from '../middleware/rbacMiddleware';
import { BodyValidationMiddleware, UrlParamsValidationMiddleware } from '../middleware/validationMiddleware';
import { CreateShipmentDto, UpdateShipmentStatusDto, AddShipmentEventDto, IdDto } from '../dto/shipment.dto';

const router = Router();
const shipmentController = new ShipmentController();

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create a new shipment (created by authenticated user)
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingNumber
 *               - senderAddress
 *               - receiverAddress
 *               - weight
 *             properties:
 *               trackingNumber:
 *                 type: string
 *                 example: "SH123456789"
 *               senderAddress:
 *                 type: string
 *                 example: "123 Main St, New York, NY 10001"
 *               receiverAddress:
 *                 type: string
 *                 example: "456 Oak Ave, Los Angeles, CA 90210"
 *               weight:
 *                 type: number
 *                 format: float
 *                 example: 2.5
 *               description:
 *                 type: string
 *                 example: "Electronics package"
 *           example:
 *             trackingNumber: "SH123456789"
 *             senderAddress: "123 Main St, New York, NY 10001"
 *             receiverAddress: "456 Oak Ave, Los Angeles, CA 90210"
 *             weight: 2.5
 *             description: "Electronics package"
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             example:
 *               shipment:
 *                 id: 1
 *                 shipmentId: "SHP1616161616161"
 *                 trackingNumber: "SH123456789"
 *                 status: "PENDING"
 *                 createdById: 2
 *                 createdAt: "2024-12-24T11:00:00Z"
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
router.post('/', authMiddleware, rbacMiddleware(['COMPANY_USER']), BodyValidationMiddleware(CreateShipmentDto), shipmentController.createShipment);

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments with pagination
 *     tags: [Shipments]
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
 *         description: Number of shipments per page
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PICKED_UP, IN_TRANSIT, ARRIVED_AT_PORT, DELIVERED]
 *         description: Filter by shipment status
 *         example: "IN_TRANSIT"
 *     responses:
 *       200:
 *         description: List of shipments
 *         content:
 *           application/json:
 *             example:
 *               shipments:
 *                 - id: 1
 *                   shipmentId: "SHP1616161616161"
 *                   status: "IN_TRANSIT"
 *                   createdById: 2
 *                   createdAt: "2024-12-24T11:00:00Z"
 *                 - id: 2
 *                   shipmentId: "SHP1616161717171"
 *                   status: "DELIVERED"
 *                   createdById: 3
 *                   createdAt: "2024-12-24T10:00:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 2
 *                 totalPages: 1
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
router.get('/', authMiddleware, rbacMiddleware(['CUSTOMER', 'COMPANY_USER', 'SUPER_ADMIN']), shipmentController.getAllShipments);

/**
 * @swagger
 * /api/shipments/{id}/status:
 *   put:
 *     summary: Update shipment status
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID (`shipmentId`), e.g. "SHP161616161"
 *         example: "SHP161616161"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PICKED_UP, IN_TRANSIT, ARRIVED_AT_PORT, DELIVERED]
 *                 example: "DELIVERED"
 *           example:
 *             status: "DELIVERED"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Shipment status updated successfully"
 *               shipment:
 *                 id: 1
 *                 shipmentId: "SHP1616161616161"
 *                 status: "DELIVERED"
 *                 updatedAt: "2024-12-24T16:00:00Z"
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
 *         description: Shipment not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Shipment not found"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid status value"
 */
router.put('/:shipmentId/status', authMiddleware, rbacMiddleware(['COMPANY_USER']), UrlParamsValidationMiddleware(IdDto), BodyValidationMiddleware(UpdateShipmentStatusDto), shipmentController.updateShipmentStatus);

/**
 * @swagger
 * /api/shipments/{id}/event:
 *   post:
 *     summary: Add shipment tracking event
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID (`shipmentId`), e.g. "SHP161616161"
 *         example: "SHP161616161"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event]
 *             properties:
 *               event:
 *                 type: string
 *                 enum: [PICKED_UP, IN_TRANSIT, ARRIVED_AT_PORT, DELIVERED]
 *                 example: "PICKED_UP"
 *           example:
 *             event: "PICKED_UP"
 *     responses:
 *       201:
 *         description: Event added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Shipment event added successfully"
 *               event:
 *                 id: 1
 *                 event: "PICKED_UP"
 *                 timestamp: "2024-12-24T11:30:00Z"
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
 *         description: Shipment not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Shipment not found"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Event and location are required"
 */
router.post('/:shipmentId/event', authMiddleware, rbacMiddleware(['COMPANY_USER']), UrlParamsValidationMiddleware(IdDto), BodyValidationMiddleware(AddShipmentEventDto), shipmentController.addShipmentEvent);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get detailed shipment information with tracking history
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID (`shipmentId`), e.g. "SHP161616161"
 *         example: "SHP161616161"
 *     responses:
 *       200:
 *         description: Detailed shipment information
 *         content:
 *           application/json:
 *             example:
 *               shipment:
 *                 id: 1
 *                 trackingNumber: "SH123456789"
 *                 senderAddress: "123 Main St, New York, NY 10001"
 *                 receiverAddress: "456 Oak Ave, Los Angeles, CA 90210"
 *                 weight: 2.5
 *                 status: "IN_TRANSIT"
 *                 description: "Electronics package"
 *                 createdAt: "2024-12-24T11:00:00Z"
 *                 updatedAt: "2024-12-24T14:30:00Z"
 *               trackingHistory:
 *                 - id: 1
 *                   event: "Package picked up"
 *                   location: "New York Distribution Center"
 *                   description: "Package received from sender"
 *                   timestamp: "2024-12-24T11:30:00Z"
 *                 - id: 2
 *                   event: "In transit"
 *                   location: "Chicago Hub"
 *                   description: "Package loaded onto truck"
 *                   timestamp: "2024-12-24T13:15:00Z"
 *                 - id: 3
 *                   event: "Out for delivery"
 *                   location: "Los Angeles Distribution Center"
 *                   description: "Package ready for final delivery"
 *                   timestamp: "2024-12-24T14:30:00Z"
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
 *         description: Shipment not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Shipment not found"
 */
router.get('/:shipmentId', authMiddleware, rbacMiddleware(['CUSTOMER']), UrlParamsValidationMiddleware(IdDto), shipmentController.getShipmentDetails);

export default router;