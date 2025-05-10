// server/src/models/Application.ts
import mongoose, { Document, Schema } from "mongoose";

// Define loan status types
export enum LoanStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Define loan types
export enum LoanType {
  PERSONAL = "personal",
  BUSINESS = "business",
  EDUCATION = "education",
  MORTGAGE = "mortgage",
  AUTO = "auto",
}

// Interface to define the Application document structure
export interface IApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  loanAmount: number;
  loanType: LoanType;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  creditScore: number;
  status: LoanStatus;
  documents?: string[];
  existingLoans?: {
    lender: string;
    amount: number;
    remainingBalance: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the mongoose schema
const ApplicationSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    loanAmount: {
      type: Number,
      required: [true, "Loan amount is required"],
      min: [100, "Loan amount must be at least 100"],
    },
    loanType: {
      type: String,
      enum: Object.values(LoanType),
      required: [true, "Loan type is required"],
    },
    loanPurpose: {
      type: String,
      required: [true, "Loan purpose is required"],
    },
    employmentStatus: {
      type: String,
      required: [true, "Employment status is required"],
    },
    monthlyIncome: {
      type: Number,
      required: [true, "Monthly income is required"],
      min: [0, "Monthly income cannot be negative"],
    },
    creditScore: {
      type: Number,
      required: [true, "Credit score is required"],
      min: [300, "Credit score must be at least 300"],
      max: [850, "Credit score cannot exceed 850"],
    },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.PENDING,
    },
    documents: {
      type: [String],
    },
    existingLoans: [
      {
        lender: String,
        amount: Number,
        remainingBalance: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Application model
export default mongoose.model<IApplication>("Application", ApplicationSchema);
