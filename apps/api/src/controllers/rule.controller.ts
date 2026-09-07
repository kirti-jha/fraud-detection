import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RuleService } from '../services/rule.service';
import { ApiResponse } from '@fraudshield/shared-types';

const createRuleSchema = z.object({
  code: z.string().min(2).toUpperCase(),
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.enum(['AMOUNT', 'VELOCITY', 'DEVICE', 'LOCATION', 'BEHAVIOR']),
  weight: z.number().int().min(1).max(100),
  parameters: z.record(z.any()).optional(),
});

const updateRuleSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  weight: z.number().int().min(1).max(100).optional(),
  parameters: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

export class RuleController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await RuleService.listRules();
      const response: ApiResponse = {
        success: true,
        data: rules,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rule = await RuleService.getRuleById(id);
      const response: ApiResponse = {
        success: true,
        data: rule,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createRuleSchema.parse(req.body);
      const rule = await RuleService.createRule(body);
      const response: ApiResponse = {
        success: true,
        message: 'Risk rule created successfully',
        data: rule,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = updateRuleSchema.parse(req.body);
      const rule = await RuleService.updateRule(id, body);
      const response: ApiResponse = {
        success: true,
        message: 'Risk rule updated successfully',
        data: rule,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
