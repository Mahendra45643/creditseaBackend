// server/src/utils/seeder.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Application, { LoanStatus, LoanType } from "../models/Application";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/loan-manager";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample loan applications data
const sampleApplications = [
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    address: "123 Main St, New York, NY 10001",
    loanAmount: 10000,
    loanType: LoanType.PERSONAL,
    loanPurpose: "Home renovation and repairs",
    employmentStatus: "Full-time",
    monthlyIncome: 5000,
    creditScore: 720,
    status: LoanStatus.APPROVED,
    createdAt: new Date("2023-01-15"),
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(234) 567-8901",
    address: "456 Elm St, Los Angeles, CA 90001",
    loanAmount: 25000,
    loanType: LoanType.BUSINESS,
    loanPurpose: "Starting a small cafe",
    employmentStatus: "Self-employed",
    monthlyIncome: 7500,
    creditScore: 680,
    status: LoanStatus.PENDING,
    createdAt: new Date("2023-02-10"),
  },
  {
    fullName: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "(345) 678-9012",
    address: "789 Oak St, Chicago, IL 60007",
    loanAmount: 5000,
    loanType: LoanType.PERSONAL,
    loanPurpose: "Medical expenses",
    employmentStatus: "Part-time",
    monthlyIncome: 3000,
    creditScore: 640,
    status: LoanStatus.REJECTED,
    createdAt: new Date("2023-02-20"),
  },
  {
    fullName: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "(456) 789-0123",
    address: "101 Pine St, Seattle, WA 98101",
    loanAmount: 150000,
    loanType: LoanType.MORTGAGE,
    loanPurpose: "Purchase of primary residence",
    employmentStatus: "Full-time",
    monthlyIncome: 8500,
    creditScore: 765,
    status: LoanStatus.APPROVED,
    createdAt: new Date("2023-03-05"),
  },
  {
    fullName: "David Brown",
    email: "david.b@example.com",
    phone: "(567) 890-1234",
    address: "202 Maple St, Austin, TX 78701",
    loanAmount: 15000,
    loanType: LoanType.EDUCATION,
    loanPurpose: "MBA program tuition",
    employmentStatus: "Full-time",
    monthlyIncome: 6200,
    creditScore: 700,
    status: LoanStatus.PENDING,
    createdAt: new Date("2023-03-15"),
  },
  {
    fullName: "Sarah Miller",
    email: "sarah.m@example.com",
    phone: "(678) 901-2345",
    address: "303 Cedar St, Boston, MA 02108",
    loanAmount: 12000,
    loanType: LoanType.AUTO,
    loanPurpose: "Purchase of a used car",
    employmentStatus: "Full-time",
    monthlyIncome: 5500,
    creditScore: 690,
    status: LoanStatus.APPROVED,
    createdAt: new Date("2023-04-02"),
  },
  {
    fullName: "Robert Taylor",
    email: "robert.t@example.com",
    phone: "(789) 012-3456",
    address: "404 Birch St, Denver, CO 80202",
    loanAmount: 8000,
    loanType: LoanType.PERSONAL,
    loanPurpose: "Debt consolidation",
    employmentStatus: "Full-time",
    monthlyIncome: 4800,
    creditScore: 650,
    status: LoanStatus.PENDING,
    createdAt: new Date("2023-04-18"),
  },
  {
    fullName: "Jennifer Anderson",
    email: "jennifer.a@example.com",
    phone: "(890) 123-4567",
    address: "505 Walnut St, Miami, FL 33101",
    loanAmount: 35000,
    loanType: LoanType.BUSINESS,
    loanPurpose: "Expansion of online store",
    employmentStatus: "Self-employed",
    monthlyIncome: 9000,
    creditScore: 730,
    status: LoanStatus.APPROVED,
    createdAt: new Date("2023-05-05"),
  },
  {
    fullName: "William Garcia",
    email: "william.g@example.com",
    phone: "(901) 234-5678",
    address: "606 Spruce St, Philadelphia, PA 19019",
    loanAmount: 6000,
    loanType: LoanType.EDUCATION,
    loanPurpose: "Programming bootcamp",
    employmentStatus: "Part-time",
    monthlyIncome: 2800,
    creditScore: 620,
    status: LoanStatus.REJECTED,
    createdAt: new Date("2023-05-20"),
  },
  {
    fullName: "Lisa Martinez",
    email: "lisa.m@example.com",
    phone: "(012) 345-6789",
    address: "707 Ash St, San Francisco, CA 94016",
    loanAmount: 18000,
    loanType: LoanType.AUTO,
    loanPurpose: "Purchase of a new car",
    employmentStatus: "Full-time",
    monthlyIncome: 6500,
    creditScore: 710,
    status: LoanStatus.PENDING,
    createdAt: new Date("2023-06-08"),
  },
];

// Seed database
const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    // Clear existing data
    await Application.deleteMany({});
    console.log("Existing application data cleared");

    // Insert sample data
    await Application.insertMany(sampleApplications);
    console.log("Sample applications seeded successfully");

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
