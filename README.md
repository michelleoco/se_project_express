# WTWR (What to Wear?): Back End

_A robust REST API powering weather-smart wardrobe recommendations._

---

## Table of Contents

- [Live Project](#live-project)
- [Introduction](#introduction)
- [Project Goals](#project-goals)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [What Was Done](#what-was-done)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Development Scripts](#development-scripts)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Example API Responses](#example-api-responses)
- [Future Improvements](#future-improvements)
- [Conclusion](#conclusion)

---

## Live Project

**API Base URL:** [https://api.wtwr.moonangel.com](https://api.wtwr.moonangel.com)  
**Frontend Application:** [https://www.wtwr.moonangel.com/](https://www.wtwr.moonangel.com/)  
**Front-End Repository:** [https://github.com/michelleoco/se_project_react](https://github.com/michelleoco/se_project_react)

---

## Introduction

**What To Wear (WTWR)** is a full-stack web application that provides weather-based clothing recommendations.

This repository contains the **Express.js REST API backend** that powers the application, managing user authentication, clothing item data, and providing secure endpoints for the React frontend to consume.

---

## Project Goals

- Build a secure and scalable REST API to support the WTWR application
- Implement robust user authentication and authorization system
- Enable authenticated users to manage their personal clothing collections
- Provide secure CRUD operations for clothing items with proper validation
- Ensure comprehensive error handling and logging
- Follow security best practices and modern API design patterns

---

## Features

- **User Authentication & Authorization**
  - User registration with secure password hashing
  - JWT-based authentication system
  - Protected routes requiring authentication
  - User profile management
- **Clothing Item Management**
  - Create, read, update, and delete clothing items
  - Image URL validation and storage
  - Weather category classification (hot, warm, cold)
  - User ownership validation for item operations
- **Social Features**
  - Like/unlike clothing items
  - Track item popularity through likes
- **Security & Validation**
  - Input validation using Celebrate/Joi
  - Password hashing with bcryptjs
  - CORS configuration for cross-origin requests
  - Centralized error handling
- **Logging & Monitoring**
  - Request/response logging with Winston
  - Error logging for debugging
  - Structured logging format

---

## Tech Stack

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js 5.1.0
- **Database:** MongoDB with Mongoose 8.13.2
- **Authentication:** JSON Web Tokens (JWT) 9.0.2
- **Password Security:** bcryptjs 3.0.2
- **Validation:** Celebrate 15.0.3 (Joi-based)
- **Logging:** Winston 3.17.0 + Express-Winston 4.2.0
- **CORS:** cors 2.8.5
- **Environment Management:** dotenv 16.5.0
- **Code Quality:** ESLint 8.57.1 with Airbnb config
- **Development Tools:** Nodemon 3.1.9, Prettier 2.8.8

---

## What Was Done

The backend was developed following RESTful API principles and modern Node.js best practices.

Key development phases included:

1. **API Architecture & Design**

   - Designed RESTful endpoints following REST conventions
   - Implemented proper HTTP status codes and response formats
   - Created modular route structure for scalability
   - Established consistent error handling patterns

2. **Database Design & Integration**

   - Set up MongoDB connection with Mongoose ODM
   - Designed user and clothing item schemas
   - Implemented data validation at the database level
   - Created efficient queries and indexes

3. **Authentication & Security**

   - Implemented JWT-based authentication system
   - Secure password hashing using bcryptjs
   - Protected routes with authentication middleware
   - Input validation and sanitization
   - CORS configuration for secure cross-origin requests

4. **Validation & Error Handling**

   - Request validation using Celebrate/Joi middleware
   - Custom error classes for different error types
   - Centralized error handler for consistent responses
   - Comprehensive error logging

5. **Logging & Monitoring**

   - Request/response logging with Winston
   - Structured error logging for debugging
   - Development and production logging configurations

6. **Code Quality & Standards**
   - ESLint configuration with Airbnb style guide
   - Prettier for consistent code formatting
   - Modular code organization
   - Environment-based configuration

---

## API Endpoints

### Authentication

- `POST /signup` - User registration
- `POST /signin` - User login

### Users

- `GET /users/me` - Get current user profile (protected)
- `PATCH /users/me` - Update user profile (protected)

### Clothing Items

- `GET /items` - Get all clothing items (public)
- `POST /items` - Create new clothing item (protected)
- `DELETE /items/:id` - Delete clothing item (protected, owner only)
- `PUT /items/:id/likes` - Like clothing item (protected)
- `DELETE /items/:id/likes` - Unlike clothing item (protected)

---

## Installation & Setup

**Requirements:**

- Node.js ≥ 18
- MongoDB ≥ 5.0
- npm ≥ 9.0

**Installation:**

```bash
git clone https://github.com/michelleoco/se_project_express.git
cd se_project_express
npm install
```

**Environment Setup:**

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
```

**Database Setup:**

Ensure MongoDB is running locally or provide a connection string to your MongoDB instance.

---

## Development Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run ESLint for code quality
npm run lint
```

---

## Security Features

- **Password Security:** Passwords are hashed using bcryptjs before storage
- **JWT Authentication:** Secure token-based authentication system
- **Input Validation:** All requests validated using Celebrate/Joi
- **CORS Protection:** Configured for secure cross-origin requests
- **Error Handling:** Sensitive information never exposed in error responses
- **Route Protection:** Authentication middleware protects sensitive endpoints
- **Data Validation:** Schema-level validation with Mongoose

---

## Example API Responses

### GET /items (Retrieve Clothing Items)

```json
[
  {
    "_id": "6803201a49e18a82017e1f90",
    "name": "Light Jacket",
    "weather": "cold",
    "imageUrl": "https://example.com/images/light-jacket.png",
    "likes": ["640b25f8e12a4f1b9a7c33c1", "640b25f8e12a4f1b9a7c33c2"],
    "owner": "640b25f8e12a4f1b9a7c3300",
    "createdAt": "2025-08-01T12:00:00.000Z"
  },
  {
    "_id": "6803201a49e18a82017e1f91",
    "name": "Summer T-Shirt",
    "weather": "hot",
    "imageUrl": "https://example.com/images/summer-tshirt.png",
    "likes": [],
    "owner": "640b25f8e12a4f1b9a7c3301",
    "createdAt": "2025-08-05T09:30:00.000Z"
  }
]
```

### POST /items (Create Item)

**Request Body:**

```json
{
  "name": "Raincoat",
  "weather": "cold",
  "imageUrl": "https://example.com/images/raincoat.png"
}
```

**Response:**

```json
{
  "_id": "6803201a49e18a82017e1f92",
  "name": "Raincoat",
  "weather": "cold",
  "imageUrl": "https://example.com/images/raincoat.png",
  "likes": [],
  "owner": "640b25f8e12a4f1b9a7c3302",
  "createdAt": "2025-08-07T15:45:00.000Z"
}
```

### Error Response Format

```json
{
  "message": "Validation failed",
  "statusCode": 400
}
```

---

## Future Improvements

- **Performance Optimizations**
  - Implement Redis caching for frequently accessed data
  - Add database query optimization and indexing
  - Implement API rate limiting for better resource management
- **Enhanced Features**
  - Add image upload functionality with cloud storage
  - Implement clothing item categories and advanced filtering
  - Add weather API integration for location-based recommendations
- **Security Enhancements**
  - Implement refresh token rotation
  - Add API versioning for backward compatibility
  - Enhanced input sanitization and validation
- **Monitoring & Analytics**
  - Add comprehensive API analytics and monitoring
  - Implement health check endpoints
  - Add performance metrics tracking
- **Scalability**
  - Implement horizontal scaling strategies
  - Add database connection pooling
  - Optimize for microservices architecture

---

## Conclusion

The WTWR backend provides a robust, secure, and scalable foundation for the weather-based wardrobe application:

- **Secure Authentication:** JWT-based system with proper password hashing
- **RESTful API Design:** Clean, consistent endpoints following REST principles
- **Comprehensive Validation:** Input validation and error handling at all levels
- **Modern Architecture:** Modular design with separation of concerns
- **Production Ready:** Logging, error handling, and security best practices

The API successfully handles user management, clothing item operations, and social features while maintaining high security standards and providing a reliable foundation for the React frontend application.
