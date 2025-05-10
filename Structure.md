# Loan Manager Project Structure

```
loan-manager/
├── client/                     # Frontend React application
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ApplicationForm/
│   │   │   │   └── index.tsx
│   │   │   ├── Dashboard/
│   │   │   │   └── index.tsx
│   │   │   ├── Charts/
│   │   │   │   └── index.tsx
│   │   │   └── ...
│   │   ├── pages/              # Application pages
│   │   │   ├── Home.tsx
│   │   │   ├── Apply.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript interfaces and types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── applicationController.ts
│   │   │   └── dashboardController.ts
│   │   ├── models/             # Database models
│   │   │   └── Application.ts
│   │   ├── routes/             # API routes
│   │   │   ├── applicationRoutes.ts
│   │   │   └── dashboardRoutes.ts
│   │   ├── services/           # Business logic
│   │   │   ├── applicationService.ts
│   │   │   └── dashboardService.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── helpers.ts
│   │   ├── config/             # Configuration files
│   │   │   ├── db.ts
│   │   │   └── config.ts
│   │   ├── middlewares/        # Custom middlewares
│   │   │   └── validation.ts
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── docker-compose.yml          # Docker configuration (optional)
├── package.json                # Root package.json for scripts
└── README.md                   # Project documentation
```