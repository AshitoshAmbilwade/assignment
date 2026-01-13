# GigFlow – Mini Freelance Marketplace
-GigFlow is a mini freelance marketplace where clients can post jobs (gigs) and freelancers can bid on them.  
The platform focuses on secure authentication, clean data relationships, and atomic hiring logic.

# Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT with HttpOnly cookies
- Real-time: Socket.io

# Core Features
- User registration and login
- Post and browse open gigs
- Bid on gigs
- Client reviews bids
- Atomic hiring logic
- Real-time hire notifications

# Hiring Logic (MOST IMPORTANT SECTION)

## Atomic Hiring Logic

The hiring flow is implemented using MongoDB transactions to prevent race conditions.

Steps:
1. Validate that the requester owns the gig
2. Ensure the gig is still open
3. Assign the gig
4. Mark the selected bid as hired
5. Automatically reject all other bids

All operations run inside a single MongoDB transaction.  
If any step fails, the entire operation is rolled back.

# Real-Time Notifications
Socket.io is used to notify freelancers instantly when they are hired.  
Each user joins a socket room identified by their user ID.  
On successful hiring, a "hired" event is emitted to the freelancer’s room.

# API Endpoints
POST   /api/auth/register
POST   /api/auth/login
GET    /api/gigs
POST   /api/gigs
POST   /api/bids
GET    /api/bids/:gigId
PATCH  /api/bids/:bidId/hire

# Environment Setup
Create a .env file based on .env.example and add:
- MongoDB connection string
- JWT secret

# Demo
backend is deploy at render so you have to wait for 60 seconds because of free version
