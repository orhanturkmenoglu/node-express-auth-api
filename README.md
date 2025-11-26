# Express Authentication API

A secure Node.js/Express authentication API with JWT token management, password hashing, and MongoDB integration.

## Features

- ✅ User registration (signup) with input validation
- ✅ User login (signin) with JWT token generation and HttpOnly cookie
- ✅ User logout (signout) clearing authentication cookie
- ✅ Password hashing with bcryptjs (12 salt rounds)
- ✅ Request validation with Joi
- ✅ MongoDB integration with Mongoose
- ✅ Email verification code flow (send & verify)
- ✅ Security headers with Helmet and CORS support
- ✅ Environment variable configuration
- ✅ JWT token expiration (8 hours)

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: bcryptjs
- Validation: Joi
- Email: Nodemailer (configured via middlewares/mail.config)
- Security: Helmet, CORS, HttpOnly cookies

## Project Structure

```
.
├── controllers/
│   └── auth.controller.js      # Authentication logic (signup, signin, signout, verification)
├── middlewares/
│   ├── validator.js            # Joi schemas (signupSchema, signinSchema, acceptCodeSchema)
│   └── mail.config.js          # Nodemailer transporter
├── models/
│   ├── user.model.js           # User schema
│   └── post.model.js           # Post schema (optional)
├── routers/
│   └── auth.router.js          # Authentication routes
├── utils/
│   └── hashing.js              # doHashing, comparePassword, hmacProcess
├── index.js                    # Application entry point
├── package.json
├── .env
└── .gitignore
```

## Installation

1. Clone repository
```bash
git clone <repository-url>
cd node-express-auth-api
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` in project root:
```env
PORT=5173
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
HMAC_VERIFICATION_CODE_SECRET=your-hmac-secret
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Default server URL: http://localhost:5173

## API Endpoints

Base path: /api/auth

1) POST /signup
- Body:
```json
{ "email": "user@example.com", "password": "SecurePass@123" }
```
- Success: 201 with created user (password not returned)
- Errors: 401 validation, 409 user exists

2) POST /signin
- Body:
```json
{ "email": "user@example.com", "password": "SecurePass@123" }
```
- Success: 200 with { success, message, token } and HttpOnly cookie "Authorization"
- Errors: 401 invalid credentials, 404 user not found

3) POST /signout
- Action: Clears "Authorization" cookie
- Success: 200 { success: true, message: "Signout successful!" }

4) POST /send-verification-code
- Body:
```json
{ "email": "user@example.com" }
```
- Action: Sends 6-digit code to user's email, stores HMAC(hashed) code and timestamp
- Success: 200 { success: true, message: "Verification code sent!" }

5) POST /verify-code
- Body:
```json
{ "email": "user@example.com", "providedCode": "123456" }
```
- Action: Validates code (HMAC compare) and verifies user (expires in 5 minutes)
- Success: 200 { success: true, message: "Your account has been verified!" }

## Data Models (summary)

User:
- email: String (unique, required)
- password: String (hashed)
- verified: Boolean (default false)
- verificationCode: String (hashed HMAC)
- verificationCodeValidation: Number (timestamp)
- forgotPasswordCode / forgotPasswordCodeValidation: optional for reset flows
- timestamps: createdAt, updatedAt

Post (optional):
- title, description, userId, timestamps

## Security & Best Practices

- Store JWT_SECRET and HMAC_SECRET in .env
- Passwords hashed using bcryptjs (12 rounds)
- Verification codes stored only as HMAC hashes
- JWT tokens expire in 8 hours; cookies set HttpOnly to mitigate XSS
- Configure CORS to allow credentials from your frontend origin
- Do not return password in API responses

## Error Handling

Common HTTP codes returned:
- 201 Created (signup)
- 200 OK (signin, signout, verification)
- 400 Bad Request (invalid input / expired code)
- 401 Unauthorized (invalid credentials / validation)
- 404 Not Found (user not found)
- 409 Conflict (user exists)
- 500 Internal Server Error

## Troubleshooting

- Token cookie not set: ensure frontend sends credentials: 'include' and server CORS allows credentials.
- "JWT_SECRET not found": add to .env and restart server.
- Email not delivered: verify EMAIL_USER/EMAIL_PASS and mail provider settings.

## Future Enhancements

- Refresh tokens & logout-all devices
- Password reset flow (secure codes + rate limiting)
- Role-based access control (RBAC)
- Rate limiting / brute-force protection
- Swagger/OpenAPI documentation
- Unit and integration tests
- Dockerfile and deployment scripts

## License

ISC

## Author

Orhan Türkmenoğlu
...existing code...
```// filepath: d:\FRONTEND 2025\node-express-auth-api\README.md
...existing code...
# Express Authentication API

A secure Node.js/Express authentication API with JWT token management, password hashing, and MongoDB integration.

## Features

- ✅ User registration (signup) with input validation
- ✅ User login (signin) with JWT token generation and HttpOnly cookie
- ✅ User logout (signout) clearing authentication cookie
- ✅ Password hashing with bcryptjs (12 salt rounds)
- ✅ Request validation with Joi
- ✅ MongoDB integration with Mongoose
- ✅ Email verification code flow (send & verify)
- ✅ Security headers with Helmet and CORS support
- ✅ Environment variable configuration
- ✅ JWT token expiration (8 hours)

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: bcryptjs
- Validation: Joi
- Email: Nodemailer (configured via middlewares/mail.config)
- Security: Helmet, CORS, HttpOnly cookies

## Project Structure

```
.
├── controllers/
│   └── auth.controller.js      # Authentication logic (signup, signin, signout, verification)
├── middlewares/
│   ├── validator.js            # Joi schemas (signupSchema, signinSchema, acceptCodeSchema)
│   └── mail.config.js          # Nodemailer transporter
├── models/
│   ├── user.model.js           # User schema
│   └── post.model.js           # Post schema (optional)
├── routers/
│   └── auth.router.js          # Authentication routes
├── utils/
│   └── hashing.js              # doHashing, comparePassword, hmacProcess
├── index.js                    # Application entry point
├── package.json
├── .env
└── .gitignore
```

## Installation

1. Clone repository
```bash
git clone <repository-url>
cd node-express-auth-api
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` in project root:
```env
PORT=5173
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
HMAC_VERIFICATION_CODE_SECRET=your-hmac-secret
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Default server URL: http://localhost:5173

## API Endpoints

Base path: /api/auth

1) POST /signup
- Body:
```json
{ "email": "user@example.com", "password": "SecurePass@123" }
```
- Success: 201 with created user (password not returned)
- Errors: 401 validation, 409 user exists

2) POST /signin
- Body:
```json
{ "email": "user@example.com", "password": "SecurePass@123" }
```
- Success: 200 with { success, message, token } and HttpOnly cookie "Authorization"
- Errors: 401 invalid credentials, 404 user not found

3) POST /signout
- Action: Clears "Authorization" cookie
- Success: 200 { success: true, message: "Signout successful!" }

4) POST /send-verification-code
- Body:
```json
{ "email": "user@example.com" }
```
- Action: Sends 6-digit code to user's email, stores HMAC(hashed) code and timestamp
- Success: 200 { success: true, message: "Verification code sent!" }

5) POST /verify-code
- Body:
```json
{ "email": "user@example.com", "providedCode": "123456" }
```
- Action: