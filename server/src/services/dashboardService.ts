// server/src/services/dashboardService.ts
// import Application, { LoanStatus, LoanType } from "../models/Application";
import { AppError } from "../middlewares/error";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import Application, {
  IApplication,
  LoanStatus,
  LoanType,
} from "../models/Application";

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoanAmount: number;
  averageLoanAmount: number;
  approvalRate: number;
  loanTypeDistribution: Record<string, number>;
  monthlyApplications: {
    month: string;
    count: number;
  }[];
  recentApplications: any[];
  averageCreditScore: number;
  averageMonthlyIncome: number;
}

interface LoanTypeStats {
  _id: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
  averageCreditScore: number;
  approvalRate: number;
}

interface MonthlyStats {
  month: string;
  applications: number;
  approved: number;
  rejected: number;
  pending: number;
  totalAmount: number;
  approvalRate: number;
}

interface MetricStats {
  highest: { value: number; application: any };
  lowest: { value: number; application: any };
  average: number;
}

class DashboardService {
  // Get comprehensive dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total applications count
      const totalApplications = await Application.countDocuments();

      // Get status counts
      const [pendingApplications, approvedApplications, rejectedApplications] =
        await Promise.all([
          Application.countDocuments({ status: LoanStatus.PENDING }),
          Application.countDocuments({ status: LoanStatus.APPROVED }),
          Application.countDocuments({ status: LoanStatus.REJECTED }),
        ]);

      // Get financial aggregations
      const financialStats = await Application.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$loanAmount" },
            averageAmount: { $avg: "$loanAmount" },
            averageCreditScore: { $avg: "$creditScore" },
            averageMonthlyIncome: { $avg: "$monthlyIncome" },
          },
        },
      ]);

      const totalLoanAmount =
        financialStats.length > 0 ? financialStats[0].totalAmount : 0;
      const averageLoanAmount =
        financialStats.length > 0 ? financialStats[0].averageAmount : 0;
      const averageCreditScore =
        financialStats.length > 0 ? financialStats[0].averageCreditScore : 0;
      const averageMonthlyIncome =
        financialStats.length > 0 ? financialStats[0].averageMonthlyIncome : 0;

      // Calculate approval rate
      const approvalRate =
        totalApplications > 0
          ? (approvedApplications / totalApplications) * 100
          : 0;

      // Get loan type distribution
      const loanTypeDistributionData = await Application.aggregate([
        {
          $group: {
            _id: "$loanType",
            count: { $sum: 1 },
          },
        },
      ]);

      const loanTypeDistribution: Record<string, number> = {};
      loanTypeDistributionData.forEach((item) => {
        loanTypeDistribution[item._id] = item.count;
      });

      // Get monthly applications for the last 6 months
      const monthlyApplications = await this.getMonthlyApplicationCount(6);

      // Get recent applications
      const recentApplications = await Application.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName loanAmount loanType status createdAt");

      return {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalLoanAmount,
        averageLoanAmount,
        approvalRate,
        loanTypeDistribution,
        monthlyApplications,
        recentApplications,
        averageCreditScore,
        averageMonthlyIncome,
      };
    } catch (error) {
      throw new AppError("Error retrieving dashboard statistics", 500);
    }
  }

  // Get loan type statistics
  async getLoanTypeStats(): Promise<LoanTypeStats[]> {
    try {
      const loanTypeStats = await Application.aggregate([
        {
          $group: {
            _id: "$loanType",
            count: { $sum: 1 },
            totalAmount: { $sum: "$loanAmount" },
            averageAmount: { $avg: "$loanAmount" },
            averageCreditScore: { $avg: "$creditScore" },
            approved: {
              $sum: {
                $cond: [{ $eq: ["$status", LoanStatus.APPROVED] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            totalAmount: 1,
            averageAmount: 1,
            averageCreditScore: 1,
            approvalRate: {
              $multiply: [{ $divide: ["$approved", "$count"] }, 100],
            },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      return loanTypeStats;
    } catch (error) {
      throw new AppError("Error retrieving loan type statistics", 500);
    }
  }

  // Get monthly statistics for a specific time period
  async getMonthlyStats(months: number = 6): Promise<MonthlyStats[]> {
    try {
      const startDate = subMonths(new Date(), months);

      const monthlyStats = await Application.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            applications: { $sum: 1 },
            approved: {
              $sum: {
                $cond: [{ $eq: ["$status", LoanStatus.APPROVED] }, 1, 0],
              },
            },
            rejected: {
              $sum: {
                $cond: [{ $eq: ["$status", LoanStatus.REJECTED] }, 1, 0],
              },
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$status", LoanStatus.PENDING] }, 1, 0],
              },
            },
            totalAmount: { $sum: "$loanAmount" },
          },
        },
        {
          $project: {
            _id: 1,
            applications: 1,
            approved: 1,
            rejected: 1,
            pending: 1,
            totalAmount: 1,
            approvalRate: {
              $multiply: [{ $divide: ["$approved", "$applications"] }, 100],
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      // Format the monthly stats
      return monthlyStats.map((item) => {
        const date = new Date(item._id.year, item._id.month - 1, 1);
        return {
          month: date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          applications: item.applications,
          approved: item.approved,
          rejected: item.rejected,
          pending: item.pending,
          totalAmount: item.totalAmount,
          approvalRate: item.approvalRate,
        };
      });
    } catch (error) {
      throw new AppError("Error retrieving monthly statistics", 500);
    }
  }

  // Get approval trends
  async getApprovalTrends(startDate?: Date, endDate?: Date) {
    try {
      const matchQuery: any = {};

      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = startDate;
        if (endDate) matchQuery.createdAt.$lte = endDate;
      }

      const approvalTrends = await Application.aggregate([
        {
          $match: matchQuery,
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            statuses: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      return approvalTrends.map((item) => {
        const date = new Date(item._id.year, item._id.month - 1, 1);
        const statusCounts: any = {};

        item.statuses.forEach((status: any) => {
          statusCounts[status.status] = status.count;
        });

        return {
          month: date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          ...statusCounts,
        };
      });
    } catch (error) {
      throw new AppError("Error retrieving approval trends", 500);
    }
  }

  // Get top metrics
  async getTopMetrics() {
    try {
      const [loanAmountStats, creditScoreStats, incomeStats] =
        await Promise.all([
          this.getMetricStats("loanAmount"),
          this.getMetricStats("creditScore"),
          this.getMetricStats("monthlyIncome"),
        ]);

      return {
        loanAmount: loanAmountStats,
        creditScore: creditScoreStats,
        monthlyIncome: incomeStats,
      };
    } catch (error) {
      throw new AppError("Error retrieving top metrics", 500);
    }
  }

  // Helper function to get metric statistics
  private async getMetricStats(
    field: "loanAmount" | "creditScore" | "monthlyIncome"
  ): Promise<MetricStats> {
    const [highest, lowest, average] = await Promise.all([
      Application.findOne()
        .sort({ [field]: -1 })
        .select(`fullName ${field} loanType`)
        .lean(),
      Application.findOne()
        .sort({ [field]: 1 })
        .select(`fullName ${field} loanType`)
        .lean(),
      Application.aggregate([
        {
          $group: {
            _id: null,
            average: { $avg: `$${field}` },
          },
        },
      ]),
    ]);

    return {
      highest: {
        value: highest ? highest[field] : 0,
        application: highest,
      },
      lowest: {
        value: lowest ? lowest[field] : 0,
        application: lowest,
      },
      average: average.length > 0 ? average[0].average : 0,
    };
  }

  // Helper function to get monthly application count
  private async getMonthlyApplicationCount(months: number) {
    const startDate = subMonths(new Date(), months);

    const monthlyData = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return monthlyData.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      return {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        count: item.count,
      };
    });
  }
}

export default new DashboardService();
