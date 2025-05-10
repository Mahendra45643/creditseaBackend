// server/src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import dashboardService from '../services/dashboardService';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dashboardService.getDashboardStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving dashboard statistics'
    });
  }
};

// Get loan type statistics
export const getLoanTypeStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dashboardService.getLoanTypeStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving loan type statistics'
    });
  }
};

// Get monthly statistics
export const getMonthlyStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { months = 6 } = req.query;
    const stats = await dashboardService.getMonthlyStats(Number(months));
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving monthly statistics'
    });
  }
};

// Get approval trends
export const getApprovalTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    
    const trends = await dashboardService.getApprovalTrends(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    
    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving approval trends'
    });
  }
};

// Get top metrics
export const getTopMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await dashboardService.getTopMetrics();
    
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving top metrics'
    });
  }
};