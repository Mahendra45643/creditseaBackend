# Loan Manager Application

A full-stack application for managing loan applications, with a TypeScript/Node.js backend and React frontend.

## Project Overview

This Loan Manager application connects an application form to a dashboard, focusing on backend development using TypeScript with Node.js. Users can submit loan applications, and the dashboard displays statistics based on the submitted data.

## Features

- **Loan Application Form**: Users can submit detailed loan applications with validation
- **Dashboard**: Real-time statistics and visualizations of loan data
- **Data Management**: Efficient storage and retrieval of application data
- **Responsive Design**: Works on both desktop and mobile devices

## Technology Stack

### Backend

- Node.js with TypeScript
- Express.js for API handling
- MongoDB for database
- Mongoose for data modeling
- Express Validator for validation

### Frontend

- React.js with TypeScript
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization
- CSS for styling

## Project Structure

The project follows a structured organization with separate directories for the backend (server) and frontend (client):

```
loan-manager/
├── client/                     # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API services
│   │   └── ...
│   └── ...
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   └── ...
│   └── ...
└── ...
```

## Installation & Setup

### Prerequisites

- Node.js (v14.x or later)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/loan-manager.git
   cd loan-manager
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Variables**

   - Create a `.env` file in the server directory based on `.env.example`
   - Set your MongoDB connection string and other configuration

4. **Seed the database (optional)**

   ```bash
   cd server
   npm run seed
   ```

5. **Run the application**

   ```bash
   # In the root directory
   npm run dev
   ```

   This will start both the backend server and frontend client concurrently.

## API Endpoints

### Applications

- `POST /api/applications` - Create a new loan application
- `GET /api/applications` - Get all applications (with optional filtering)
- `GET /api/applications/:id` - Get a specific application
- `PATCH /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Delete an application

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/loan-types` - Get loan type statistics
- `GET /api/dashboard/monthly` - Get monthly statistics

## Deployment

### Backend Deployment

1. Build the TypeScript code:

   ```bash
   cd server
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service

### Frontend Deployment

1. Build the React application:

   ```bash
   cd client
   npm run build
   ```

2. Deploy the `build` directory to your hosting service

## Video Demonstration

[Link to video demonstration]

## Live Project

[Link to live project]

## Future Enhancements

- User authentication and role-based access control
- File upload for loan documentation
- Email notifications for application status changes
- Advanced analytics and reporting
- Mobile application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Design inspiration from Figma Community](<https://www.figma.com/file/vSeMzFkJ6RKdtflUaQvi9T/LOAN-MANAGER-(Community)>)
