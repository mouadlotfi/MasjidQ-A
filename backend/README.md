# Masjid Q&A Forum - Backend

Backend API for the Masjid Q&A Forum application built with Node.js, Express, and SQLite.

## Features

- User authentication with sessions (Imam and Parent roles)
- Question and answer management
- Role-based permissions (Imams can mark answers as accepted)
- RESTful API endpoints
- SQLite database with sample data

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize and seed the database:
```bash
npm run seed
```

This will create the SQLite database (`forum.db`) and populate it with sample data.

## Running the Server

Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Sample Credentials

After seeding, you can use these credentials to test:

- **Imam**: `imam_abdullah` / `password123`
- **Parent**: `parent_fatima` / `password123`
- **Parent**: `parent_ahmed` / `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Questions
- `GET /api/questions` - Get all questions with answers
- `GET /api/questions/:id` - Get single question with answers
- `POST /api/questions` - Create new question (authenticated)

### Answers
- `POST /api/answers` - Create new answer (authenticated)
- `PUT /api/answers/:id/accept` - Mark answer as accepted (Imam only)

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `role` - User role (Imam or Parent)
- `created_at` - Timestamp

### Questions Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Question title
- `content` - Question content
- `created_at` - Timestamp

### Answers Table
- `id` - Primary key
- `question_id` - Foreign key to questions
- `user_id` - Foreign key to users
- `content` - Answer content
- `is_accepted` - Boolean (1 or 0)
- `created_at` - Timestamp

## Technologies Used

- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing
