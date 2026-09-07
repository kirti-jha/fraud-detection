import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AlertService } from '../services/alert.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse, AlertStatus } from '@fraudshield/shared-types';

const updateStatusSchema = z.object({
  status: z.enum(['OPEN', 'ASSIGNED', 'UNDER_REVIEW', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE', 'CLOSED']),
});

const addNoteSchema = z.object({
  note: z.string().min(1, 'Note content cannot be empty'),
});

export class AlertController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as AlertStatus;
      const severity = req.query.severity as string;
      const assignedToId = req.query.assignedToId as string;

      const result = await AlertService.listAlerts({
        status,
        severity,
        assignedToId,
        page,
        limit,
      });

      const response: ApiResponse = {
        success: true,
        data: result.alerts,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const alert = await AlertService.getAlertDetail(id);

      const response: ApiResponse = {
        success: true,
        data: alert,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = updateStatusSchema.parse(req.body);
      const analystId = req.user?.userId;

      const alert = await AlertService.updateAlertStatus(id, body.status, analystId);

      const response: ApiResponse = {
        success: true,
        message: `Alert status updated to ${body.status}`,
        data: alert,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async addNote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = addNoteSchema.parse(req.body);
      const analystId = req.user?.userId;

      if (!analystId) {
        return next(new Error('Analyst authentication required'));
      }

      const note = await AlertService.addNote(id, analystId, body.note);

      const response: ApiResponse = {
        success: true,
        message: 'Investigation note added',
        data: note,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
