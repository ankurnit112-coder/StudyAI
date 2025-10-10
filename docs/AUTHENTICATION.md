# Authentication System Documentation

## Overview

The StudyAI authentication system provides secure user registration, login, and session management with advanced security features including rate limiting, account lockout protection, and comprehensive logging.

## Features

### ✅ Core Authentication
- **JWT-based authentication** with access and refresh tokens
- **Remember Me functionality** with different session durations
- **Secure password hashing** using bcrypt with salt rounds
- **Email and password validation** with strength checking
- **Form field memory** for improved user experience

### ✅ Security Features
- **Rate limiting** to prevent brute force attacks
- **Account lockout** after multiple failed attempts
- **IP-based monitoring** and suspicious activity detection
- **Device fingerprinting** for session tracking
- **Input sanitization** to prevent XSS attacks
- **Comprehensive security logging**

### ✅ Session Management
- **Dual storage strategy**: localStorage (remember me) vs sessionStorage
- **Automatic token refresh** with race condition prevention
- **Session invalidation** on logout
- **Multi-device session tracking**

## API Endpoints

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 604800,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "currentClass": 12,
    "schoolName": "Test School",
    "emailVerified": true
  }
}
```

### POST /api/auth/signup
Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "student",
  "currentClass": 12,
  "schoolName": "Test School"
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJ..."
}
```

### POST /api/auth/logout
Logout and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

## Client-Side Usage

### Basic Login
```typescript
import { useAuth } from '@/contexts/auth-context'

const { login } = useAuth()

try {
  await login({
    email: 'user@example.com',
    password: 'password',
    rememberMe: true
  })
  // Redirect to dashboard
} catch (error) {
  // Handle error
}
```

### Check Authentication Status
```typescript
const { isAuthenticated, user, isLoading } = useAuth()

if (isLoading) return <LoadingSpinner />
if (!isAuthenticated) return <LoginForm />
return <Dashboard user={user} />
```

### Protected Routes
```typescript
import { withAuth } from '@/contexts/auth-context'

const ProtectedPage = withAuth(() => {
  return <div>Protected content</div>
})
```

## Security Configuration

### Rate Limiting
- **Login attempts**: 5 per 15 minutes per IP
- **Signup attempts**: 3 per hour per IP
- **Account lockout**: 5 failed attempts locks account for 15 minutes

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in common password list

### Token Configuration
- **Access token**: 1 hour (normal) / 7 days (remember me)
- **Refresh token**: 7 days (normal) / 30 days (remember me)
- **Algorithm**: HS256
- **Automatic refresh**: When token expires within 5 minutes

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  current_class INTEGER,
  school_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  profile_picture VARCHAR(255),
  preferences JSONB DEFAULT '{}',
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  refresh_token VARCHAR(500) NOT NULL,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

## Error Handling

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (email already exists)
- `423` - Locked (account temporarily locked)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "detail": "Error message description"
}
```

## Security Best Practices

### Environment Variables
```bash
# Use strong, unique secrets
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-key

# Enable security features
ENABLE_RATE_LIMITING=true
ENABLE_SECURITY_LOGGING=true
```

### Production Checklist
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement proper CORS policies
- [ ] Use environment-specific JWT secrets
- [ ] Enable security headers
- [ ] Implement email verification
- [ ] Set up monitoring and alerting
- [ ] Use a real database (PostgreSQL/MongoDB)
- [ ] Implement Redis for rate limiting
- [ ] Set up proper logging infrastructure

## Monitoring and Analytics

### Security Events Logged
- Login attempts (success/failure)
- Signup attempts
- Rate limit violations
- Suspicious activity detection
- Account lockouts
- Token refresh events

### Metrics to Monitor
- Login success rate
- Failed login attempts per IP
- Account lockout frequency
- Token refresh rate
- API response times
- Error rates by endpoint

## Testing

### Test User Account
```
Email: test@example.com
Password: password
Role: student
Class: 12
```

### Running Tests
```bash
npm test                 # Unit tests
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Coverage report
```

## Troubleshooting

### Common Issues

1. **"Invalid or expired token"**
   - Check if JWT_SECRET is consistent
   - Verify token hasn't expired
   - Ensure proper token format

2. **"Too many attempts"**
   - Wait for rate limit window to reset
   - Check IP-based restrictions
   - Verify account isn't locked

3. **"Account temporarily locked"**
   - Wait 15 minutes for automatic unlock
   - Check login_attempts in database
   - Verify locked_until timestamp

### Debug Mode
Set `NODE_ENV=development` to enable detailed error messages and logging.

## Future Enhancements

- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social login options
- [ ] Advanced device management
- [ ] Audit log dashboard
- [ ] Real-time security monitoring