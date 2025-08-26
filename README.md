
# Heartland Community Network (HCN) Portal

This is the main repository for the Heartland Community Network (HCN) Portal, a comprehensive web application designed to streamline the applicant onboarding process, and manage employees and projects within the organization. The project is split into two main parts: a React-based frontend and a Node.js/Express backend.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [Public Routes](#public-routes)
  - [Admin Routes](#admin-routes)
  - [Employee Routes](#employee-routes)
- [Tech Stack](#tech-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Project Structure](#project-structure)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [API Endpoints](#api-endpoints)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)

## Project Overview

The HCN Portal is a multi-faceted platform serving three primary roles: **Admins**, **Employees**, and prospective applicants. It provides a seamless application process for newcomers and a robust set of tools for administrators to manage applications, employees, and projects. Employees are given access to a personalized dashboard to view their assignments and manage their profiles.

## Features

### Public Routes
- **Landing Page**: A welcoming page introducing the Heartland Community Network.
- **Application Form**: A detailed form for prospective employees to submit their applications.
- **Login**: Secure login for existing admins and employees.
- **Forgot/Reset Password**: Functionality for users to reset their passwords.

### Admin Routes
- **Admin Dashboard**: An overview of key metrics like pending applications, active employees, and ongoing projects.
- **Pending Applications Management**: View all submitted applications, review applicant profiles, and approve or reject them. Automated emails are sent upon status change.
- **Employee Management**: View a list of all current employees, filter them by project assignment status, and view their detailed profiles.
- **Project Management**: Create new projects, view existing ones, and manage project details including assigning managers and employees.

### Employee Routes
- **Employee Dashboard**: A personalized dashboard for employees.
- **Profile Management**: View and edit personal and professional information.
- **Project Viewing**: View assigned projects and their details.
- **Clockify Integration**: Direct links to Clockify for time tracking.
- **Help/Support Page**: A dedicated page for support and contact information.

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM for MongoDB and Node.js.
- **JSON Web Tokens (JWT)**: For secure user authentication.
- **Bcrypt.js**: For password hashing.
- **Nodemailer**: For sending emails (e.g., application status, password resets).
- **Dotenv**: For managing environment variables.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **React Router**: For declarative routing in the application.
- **Redux**: For state management.
- **Redux Thunk**: Middleware for handling asynchronous actions in Redux.
- **Axios**: For making HTTP requests to the backend API.
- **Yup**: For form validation.
- **React Hook Form**: For efficient and flexible form handling.

## Project Structure

### Backend Structure
```
backend/
├── config/         # Database configuration
├── controllers/    # Handles business logic
├── middlewares/    # Custom middleware (e.g., auth)
├── models/         # Mongoose schemas
├── routes/         # API route definitions
├── utils/          # Utility functions (e.g., mailer, JWT)
└── server.js       # Main server entry point
```

### Frontend Structure
```
hcn_portal_onboarding/
└── src/
    ├── api/              # Axios instance configuration
    ├── Components/       # Reusable React components
    ├── Images/           # Static image assets
    ├── store/            # Redux store, reducers, and actions
    │   ├── reducers/
    │   └── index.js
    ├── App.js            # Main application component with routing
    └── index.js          # Entry point of the React application
```

## API Endpoints

The backend exposes the following RESTful API endpoints:

- `POST /api/applications/submit-application`: Submits a new application.
- `GET /api/applications/dashboard-stats`: Retrieves statistics for the admin dashboard.
- `GET /api/applications`: Fetches all applications (Admin only).
- `PUT /api/applications/:id/status`: Updates the status of an application (Admin only).
- `POST /api/auth/login`: Authenticates a user and returns a JWT.
- `POST /api/auth/forgot-password`: Sends a password reset email.
- `POST /api/auth/reset-password/:token`: Resets a user's password.
- `GET /api/users`: Retrieves all users.
- `GET /api/users/:id`: Fetches a specific user's profile.
- `PUT /api/users/:id`: Updates a user's profile.
- `POST /api/projects`: Creates a new project (Admin only).
- `GET /api/projects`: Fetches all projects.
- `POST /api/projects/:id/employees`: Adds employees to a project.

## Setup and Installation

### Prerequisites
- Node.js and npm
- MongoDB instance (local or cloud-based)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the necessary environment variables (see below).
4. Start the server:
   ```bash
   npm run server
   ```
The backend will be running on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `hcn_portal_onboarding` directory:
   ```bash
   cd hcn_portal_onboarding
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
The frontend will be running on `http://localhost:3000`.

## Environment Variables

The backend requires the following environment variables to be set in a `.env` file:

- `DB_URL`: Your MongoDB connection string.
- `JWT_SECRET`: A secret key for signing JWTs.
- `CLIENT_URL`: The URL of the frontend application (e.g., `http://localhost:3000`).
- `EMAIL`: Your Gmail address for sending emails.
- `CLIENT_ID`: Google OAuth2 Client ID.
- `CLIENT_SECRET`: Google OAuth2 Client Secret.
- `REFRESH_TOKEN`: Google OAuth2 Refresh Token.
