# Express Authentication API

A secure Node.js/Express authentication API with JWT token management, password hashing, and MongoDB integration.

## Features

- ✅ User registration (signup) with email validation
- ✅ User login (signin) with JWT token generation
- ✅ Password hashing with bcryptjs
- ✅ Request validation with Joi
- ✅ MongoDB integration with Mongoose
- ✅ Security headers with Helmet
- ✅ CORS support
- ✅ Cookie-based authentication
- ✅ Environment variable configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS

## Project Structure

```
.
├── controllers/
│   └── auth.controller.js      # Authentication logic
├── middlewares/
│   └── validator.js            # Request validation schemas
├── models/
│   ├── user.model.js           # User schema
│   └── post.model.js           # Post schema
├── routers/
│   └── auth.router.js          # Authentication routes
├── utils/
│   └── hashing.js              # Password hashing utilities
├── index.js                    # Application entry point
├── package.json
├── .env
└── .gitignore
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-express-auth-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5173
   MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=<your-jwt-secret-key>
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5173`

## API Endpoints

### Authentication Routes

#### Sign Up
- **POST** `/api/auth/signup`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass@123"
  }
  ```
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (@$!%*?&)

#### Sign In
- **POST** `/api/auth/signin`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass@123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Signin successful!",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```

## Database Models

### User Model
- `email`: String (unique, required, minimum 5 characters)
- `password`: String (required, minimum 6 characters, hashed)
- `verified`: Boolean (default: false)
- `verificaionCode`: String
- `verificaionCodeValidation`: Number
- `forgotPasswordCode`: String
- `forgotPasswordCodeValidation`: Number
- `timestamps`: Automatically added (createdAt, updatedAt)

### Post Model
- `title`: String (required, trimmed)
- `description`: String (required, trimmed)
- `userId`: ObjectId reference to User (required)
- `timestamps`: Automatically added (createdAt, updatedAt)

## Security Features

- 🔒 Password hashing with bcryptjs (salt rounds: 12)
- 🔐 JWT token expiration (8 hours)
- 🛡️ Helmet security headers
- ✔️ Request validation with Joi
- 🍪 HttpOnly cookies for token storage
- 📧 Email validation (.com, .net only)

## Error Handling

The API returns appropriate HTTP status codes:
- `201`: Created (successful signup)
- `400/401`: Invalid request or validation error
- `404`: User not found
- `409`: User already exists
- `500`: Internal server error

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5173) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |

## Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Role-based access control (RBAC)
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] API documentation with Swagger

## License

ISC

## Author

Orhan Türkmenoğlu