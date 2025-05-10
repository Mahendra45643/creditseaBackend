// server/src/services/applicationService.ts
import Application, { IApplication, LoanStatus } from "../models/Application";
import { AppError } from "../middlewares/error";

interface ApplicationFilters {
  status?: LoanStatus;
  loanType?: string;
  dateFrom?: string;
  dateTo?: string;
  creditScoreMin?: number;
  creditScoreMax?: number;
  loanAmountMin?: number;
  loanAmountMax?: number;
}

interface ApplicationCreateData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  loanAmount: number;
  loanType: string;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  creditScore: number;
}

class ApplicationService {
  // Create a new application
  async createApplication(data: ApplicationCreateData): Promise<IApplication> {
    try {
      // Check if email already exists
      const existingApplication = await Application.findOne({
        email: data.email,
      });
      if (existingApplication) {
        throw new AppError(
          "An application with this email already exists",
          400
        );
      }

      // Create new application
      const newApplication = new Application(data);

      // Automatically determine initial status based on credit score
      if (data.creditScore >= 700) {
        newApplication.status = LoanStatus.APPROVED;
      } else if (data.creditScore < 600) {
        newApplication.status = LoanStatus.REJECTED;
      } else {
        newApplication.status = LoanStatus.PENDING;
      }

      return await newApplication.save();
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw new AppError("Validation failed: " + error.message, 400);
      }
      throw error;
    }
  }

  // Get all applications with filters
  async getApplications(
    filters: ApplicationFilters,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const query: any = {};

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.loanType) {
        query.loanType = filters.loanType;
      }

      // Date range filtering
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.createdAt.$lte = new Date(filters.dateTo);
        }
      }

      // Credit score range filtering
      if (filters.creditScoreMin || filters.creditScoreMax) {
        query.creditScore = {};
        if (filters.creditScoreMin) {
          query.creditScore.$gte = filters.creditScoreMin;
        }
        if (filters.creditScoreMax) {
          query.creditScore.$lte = filters.creditScoreMax;
        }
      }

      // Loan amount range filtering
      if (filters.loanAmountMin || filters.loanAmountMax) {
        query.loanAmount = {};
        if (filters.loanAmountMin) {
          query.loanAmount.$gte = filters.loanAmountMin;
        }
        if (filters.loanAmountMax) {
          query.loanAmount.$lte = filters.loanAmountMax;
        }
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Execute query with pagination
      const applications = await Application.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v");

      // Get total count for pagination
      const totalCount = await Application.countDocuments(query);

      return {
        applications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit,
        },
      };
    } catch (error) {
      throw new AppError("Error retrieving applications", 500);
    }
  }

  // Get single application by ID
  async getApplicationById(id: string): Promise<IApplication> {
    try {
      const application = await Application.findById(id).select("-__v");

      if (!application) {
        throw new AppError("Application not found", 404);
      }

      return application;
    } catch (error: any) {
      if (error.name === "CastError") {
        throw new AppError("Invalid application ID format", 400);
      }
      throw error;
    }
  }

  // Update application status
  async updateApplicationStatus(
    id: string,
    status: LoanStatus
  ): Promise<IApplication> {
    try {
      const application = await Application.findById(id);

      if (!application) {
        throw new AppError("Application not found", 404);
      }

      // Validate status transition logic
      if (
        application.status === LoanStatus.APPROVED &&
        status === LoanStatus.PENDING
      ) {
        throw new AppError(
          "Cannot change status from approved to pending",
          400
        );
      }

      if (
        application.status === LoanStatus.REJECTED &&
        status === LoanStatus.APPROVED
      ) {
        throw new AppError(
          "Cannot directly approve a rejected application",
          400
        );
      }

      application.status = status;
      return await application.save();
    } catch (error: any) {
      if (error.name === "CastError") {
        throw new AppError("Invalid application ID format", 400);
      }
      throw error;
    }
  }

  // Update application details
  async updateApplication(
    id: string,
    updateData: Partial<ApplicationCreateData>
  ): Promise<IApplication> {
    try {
      const application = await Application.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select("-__v");

      if (!application) {
        throw new AppError("Application not found", 404);
      }

      return application;
    } catch (error: any) {
      if (error.name === "CastError") {
        throw new AppError("Invalid application ID format", 400);
      }
      if (error.name === "ValidationError") {
        throw new AppError("Validation failed: " + error.message, 400);
      }
      throw error;
    }
  }

  // Delete application
  async deleteApplication(id: string): Promise<void> {
    try {
      const application = await Application.findByIdAndDelete(id);

      if (!application) {
        throw new AppError("Application not found", 404);
      }
    } catch (error: any) {
      if (error.name === "CastError") {
        throw new AppError("Invalid application ID format", 400);
      }
      throw error;
    }
  }

  // Get applications by email
  async getApplicationsByEmail(email: string): Promise<IApplication[]> {
    try {
      return await Application.find({ email })
        .sort({ createdAt: -1 })
        .select("-__v");
    } catch (error) {
      throw new AppError("Error retrieving applications by email", 500);
    }
  }

  // Get recent applications
  async getRecentApplications(limit: number = 5): Promise<IApplication[]> {
    try {
      return await Application.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("fullName loanAmount loanType status createdAt");
    } catch (error) {
      throw new AppError("Error retrieving recent applications", 500);
    }
  }
}

export default new ApplicationService();
