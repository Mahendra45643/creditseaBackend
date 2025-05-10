// server/src/controllers/applicationController.ts
import { Request, Response } from 'express';
import applicationService from '../services/applicationService';
import { LoanStatus } from '../models/Application';

// Create a new loan application
export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedApplication = await applicationService.createApplication(req.body);
    
    res.status(201).json({
      success: true,
      data: savedApplication
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create application',
      errors: error.errors || {}
    });
  }
};

// Get all applications with optional filtering
export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, loanType, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    
    const filters = {
      status: status as LoanStatus,
      loanType: loanType as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string
    };
    
    const result = await applicationService.getApplications(
      filters, 
      Number(page), 
      Number(limit)
    );
    
    res.status(200).json({
      success: true,
      count: result.applications.length,
      totalCount: result.pagination.totalCount,
      pagination: result.pagination,
      data: result.applications
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error retrieving applications'
    });
  }
};

// Get a single application by ID
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error retrieving application'
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    const updatedApplication = await applicationService.updateApplicationStatus(
      req.params.id,
      status
    );
    
    res.status(200).json({
      success: true,
      data: updatedApplication
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error updating application status'
    });
  }
};

// Delete an application
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    await applicationService.deleteApplication(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error deleting application'
    });
  }
};