# Express Authentication API

A secure Node.js/Express authentication API with JWT token management, password hashing, and MongoDB integration.

## Features

- ✅ User registration (signup) with email validation
- ✅ User login (signin) with JWT token generation
- ✅ User logout (signout) with cookie clearing
- ✅ Password hashing with bcryptjs (12 salt rounds)
- ✅ Request validation with Joi
- ✅ MongoDB integration with Mongoose
- ✅ Security headers with Helmet
- ✅ CORS support
- ✅ HttpOnly cookie-based authentication
- ✅ Environment variable configuration
- ✅ JWT token expiration (8 hours)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, HttpOnly Cookies

## Project Structure

```
.
├── controllers/
│   └── auth.controller.js      # Authentication logic (signup, signin, signout)
├── middlewares/
│   └── validator.js            # Request validation schemas (signupSchema, signinSchema)
├── models/
│   ├── user.model.js           # User schema with email & password
│   └── post.model.js           # Post schema (optional)
├── routers/
│   └── auth.router.js          # Authentication routes
├── utils/
│   └── hashing.js              # Password hashing utilities (doHashing, verifyPassword)
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
   JWT_SECRET=your-super-secret-jwt-key-here
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

#### 1. Sign Up
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
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one digit (0-9)
  - At least one special character (@$!%*?&)
- **Success Response** (201):
  ```json
  {
    "message": "User created successfully!",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "verified": false,
      "createdAt": "2025-11-26T10:30:00.000Z",
      "updatedAt": "2025-11-26T10:30:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401`: Validation error
  - `409`: User already exists

#### 2. Sign In
- **POST** `/api/auth/signin`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass@123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Signin successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Token Payload**:
  - `userId`: User's MongoDB ID
  - `email`: User's email
  - `verified`: Verification status
  - `expiresIn`: 8 hours
- **Cookies Set**:
  - `Authorization`: Bearer token (HttpOnly, expires in 24 hours)
- **Error Responses**:
  - `401`: Invalid credentials or validation error
  - `404`: User not found

#### 3. Sign Out
- **POST** `/api/auth/signout`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Signout successful!"
  }
  ```
- **Action**: Clears the `Authorization` cookie

## Database Models

### User Model
| Field | Type | Constraints |
|-------|------|-------------|
| `email` | String | Unique, required, min 5 chars, .com/.net only |
| `password` | String | Required, min 6 chars, hashed with bcryptjs |
| `verified` | Boolean | Default: false |
| `verificaionCode` | String | For email verification |
| `verificaionCodeValidation` | Number | Expiration timestamp |
| `forgotPasswordCode` | String | For password reset |
| `forgotPasswordCodeValidation` | Number | Expiration timestamp |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### Post Model
| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | Required, trimmed |
| `description` | String | Required, trimmed |
| `userId` | ObjectId | Reference to User, required |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

## Security Features

- 🔒 **Password Hashing**: bcryptjs with 12 salt rounds
- 🔐 **JWT Tokens**: 8-hour expiration time
- 🛡️ **Security Headers**: Helmet.js protection
- ✔️ **Input Validation**: Joi schema validation
- 🍪 **HttpOnly Cookies**: Secure token storage (prevents XSS)
- 📧 **Email Validation**: .com and .net domains only
- 🚫 **Password Filtering**: Password never returned in responses

## Error Handling

The API returns appropriate HTTP status codes:
| Status | Meaning |
|--------|---------|
| `201` | User created successfully |
| `200` | Request successful (signin, signout) |
| `400` | Bad request (validation error) |
| `401` | Unauthorized (invalid credentials or validation) |
| `404` | User not found |
| `409` | Conflict (user already exists) |
| `500` | Internal server error |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5173` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-123` |

## Key Implementation Details

### Controllers (`auth.controller.js`)

- **signup**: Creates new user with hashed password
- **signin**: Authenticates user and issues JWT token with cookie
- **signout**: Clears authentication cookie

### Utils (`hashing.js`)

- `doHashing()`: Hashes password with bcryptjs
- `verifyPassword()`: Compares input password with hashed password

### Validators (`validator.js`)

- `signupSchema`: Validates email and password format
- `signinSchema`: Validates email and password for login

## Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Refresh token implementation
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting & request throttling
- [ ] Two-factor authentication (2FA)
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration tests
- [ ] Docker support

## Common Issues & Solutions

### Token not being set in cookies
- Ensure `httpOnly: true` is set
- Check CORS configuration allows credentials
- Verify frontend sends `credentials: 'include'` in fetch

### "JWT_SECRET not found"
- Add `JWT_SECRET` to your `.env` file
- Restart the development server

### MongoDB connection error
- Verify `MONGODB_URL` in `.env` file
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database user has correct permissions

## License

ISC

## Author

Orhan Türkmenoğlu


┌─────────────────────────────────────┐
│   START: Signup Request Received    │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Extract email &    │
        │ password from req  │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Validate schema    │
        └────────┬───────────┘
                 │
         ┌───────┴────────┐
         │                │
        NO               YES (error)
         │                │
         │                ▼
         │        ┌──────────────────┐
         │        │ Return 401 error │
         │        │ with message     │
         │        └──────────────────┘
         │
         ▼
    ┌────────────────────────┐
    │ Check if user exists   │
    │ in database            │
    └────────┬───────────────┘
             │
         ┌───┴────┐
         │        │
       YES       NO
         │        │
         │        ▼
         │   ┌────────────────┐
         │   │ Hash password  │
         │   │ (bcrypt, 12)   │
         │   └────────┬───────┘
         │            │
         │            ▼
         │   ┌────────────────────┐
         │   │ Create new user    │
         │   │ document           │
         │   └────────┬───────────┘
         │            │
         │            ▼
         │   ┌────────────────────┐
         │   │ Save to database   │
         │   └────────┬───────────┘
         │            │
         │            ▼
         │   ┌────────────────────┐
         │   │ Remove password    │
         │   │ from response      │
         │   └────────┬───────────┘
         │            │
         │            ▼
         │   ┌────────────────────┐
         │   │ Return 201 with    │
         │   │ success message    │
         │   └────────────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Return 409 error │
    │ User exists      │
    └──────────────────┘

Error Handling:
    ┌──────────────────────────┐
    │ CATCH: Any error thrown  │
    │ during process           │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Log error to console     │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Return 500 error with    │
    │ generic message          │
    └──────────────────────────┘

********************************
┌─────────────────────────────────────┐
│   START: Signin Request Received    │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Extract email &    │
        │ password from req  │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Validate schema    │
        └────────┬───────────┘
                 │
         ┌───────┴────────┐
         │                │
        NO               YES (error)
         │                │
         │                ▼
         │        ┌──────────────────┐
         │        │ Return 401 error │
         │        │ Invalid input    │
         │        └──────────────────┘
         │
         ▼
    ┌────────────────────────────┐
    │ Find user by email         │
    │ (include password field)   │
    └────────┬───────────────────┘
             │
         ┌───┴────┐
         │        │
       YES       NO
         │        │
         │        ▼
         │   ┌──────────────────┐
         │   │ Return 404 error │
         │   │ User not found   │
         │   └──────────────────┘
         │
         ▼
    ┌────────────────────────────┐
    │ Verify password against    │
    │ hashed password (bcrypt)   │
    └────────┬───────────────────┘
             │
         ┌───┴────┐
         │        │
       YES       NO
         │        │
         │        ▼
         │   ┌──────────────────┐
         │   │ Return 401 error │
         │   │ Invalid password │
         │   └──────────────────┘
         │
         ▼
    ┌────────────────────────┐
    │ Create JWT token with: │
    │ - userId               │
    │ - email                │
    │ - verified status      │
    │ - Expires in 8 hours   │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Set Authorization      │
    │ cookie (httpOnly)      │
    │ Expires: 24 hours      │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Return 200 success     │
    │ with token in body     │
    │ and cookie header      │
    └────────────────────────┘

Error Handling:
    ┌──────────────────────────┐
    │ CATCH: Any error thrown  │
    │ during process           │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Log error to console     │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Return 500 error with    │
    │ generic message          │
    └──────────────────────────┘