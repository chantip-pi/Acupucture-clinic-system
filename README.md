# Clinic Management System

A comprehensive clinic management application built with Remix, featuring role-based authentication, staff management, patient records, and more.

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

---

## Authentication System

This application implements a client-side authentication system with role-based access control (RBAC). The authentication flow integrates with a backend API for credential verification.

### Login Flow

1. **User submits credentials** via the login form (`/routes/LogIn.tsx`)
   - Username and password are collected from the form
   - Form validation ensures both fields are provided

2. **Frontend login hook** (`useLogin`) processes the request:
   - Calls `loginUseCase.execute()` with username and password
   - The use case delegates to `StaffRepository.login()`
   - Repository calls `StaffDataSource.login()` which makes an API request

3. **Backend API verification**:
   - Endpoint: `GET /api/staff/login/:username/:password`
   - Backend queries the database to verify credentials
   - Returns staff object if credentials are valid, `null` otherwise

4. **Session creation**:
   - On successful login, `setUserSession()` stores user data in browser `sessionStorage`
   - Password is excluded from stored session data for security
   - User is redirected to `/home`

### Session Management

The application uses **browser sessionStorage** for client-side session management:

**Location**: `app/presentation/session/userSession.ts`

**Key Functions**:
- `setUserSession(staff: Staff)`: Stores user session data (excluding password)
- `getUserSession(): UserSession | null`: Retrieves current user session
- `clearUserSession()`: Removes session data (used on logout)
- `updateUserSession(partial)`: Updates specific session fields

**Session Data Structure**:
```typescript
type UserSession = {
  staffId: number;
  username: string;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  email: string;
  role: string; // "Manager", "Doctor","Staff"
  // password is excluded
}
```

**Storage Key**: `"userSession"` in `window.sessionStorage`

**Important Notes**:
- Session persists only for the browser tab session (cleared on tab close)
- Session is client-side only (no server-side cookies)
- Password is never stored in session data

### Role-Based Authentication

The application implements role-based access control with the following roles:

#### Roles
- **Manager**: Full access to all features including staff management
- **Doctor**: Limited access (view-only for staff management)
- **Staff**: Limited access (view-only for staff management)
- **Staff**: Limited access (view-only for staff management)

#### Access Control Implementation

**1. Route-Level Protection**

Protected routes check user session and role before rendering:

**Example**: `app/routes/_SNB.EditStaff.tsx`
```typescript
// Check if user is logged in
if (!isLoggedIn) {
  return <ErrorPage message="You don't have access to this page." />;
}

// Check if user is a manager
if (!isManager) {
  return <ErrorPage message="You don't have access to this page." />;
}
```

**Protected Routes**:
- `/editStaff` - Manager only
- `/addStaff` - Manager only
- `/staffDetail` - Manager only
- `/staffListView` - All authenticated users (with role-based UI restrictions)

**2. Feature-Level Protection**

Within accessible routes, certain features are hidden or disabled based on role:

**Example**: `app/routes/StaffListView.tsx`
- **All users**: Can view staff list
- **Managers only**: Can see "Add new Staff" button
- **Managers only**: Can see "Edit" column in staff table
- **Non-managers**: View-only access with no edit/add capabilities

**3. Direct Link Protection**

If a non-manager attempts to access a manager-only route via direct URL (e.g., `http://localhost:5173/editStaff`):
- Session is checked immediately
- If not a manager, an error page is displayed without sidebar
- Error page includes a "Go Back" button using browser history

### Authentication Flow Diagram

```
┌─────────────────┐
│  Login Form     │
│  (LogIn.tsx)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useLogin Hook  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ LoginUseCase    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ StaffRepository │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ StaffDataSource │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend API     │
│ /api/staff/     │
│ login/:u/:p      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌──────────┐
│Valid  │ │ Invalid  │
│       │ │          │
└───┬───┘ └────┬─────┘
    │          │
    ▼          ▼
┌─────────────────┐
│ setUserSession() │
│ (sessionStorage) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ /home           │
└─────────────────┘
```

### Backend Integration

**Backend API Base URL**: Configured in `app/infrastructure/datasource/StaffDataSource.ts`

**Login Endpoint**:
- **Method**: `GET`
- **Path**: `/api/staff/login/:username/:password`
- **Response**: Staff object (with password) or `null` if invalid

**Backend Routes** (from `clinic-backend`):
- `GET /api/staff/login/:username/:password` - Authenticate user
- `GET /api/staff` - List all staff
- `GET /api/staff/id/:staffId` - Get staff by ID
- `GET /api/staff/username/:username` - Get staff by username
- `POST /api/staff` - Create new staff (Manager only)
- `PUT /api/staff/:staffId` - Update staff (Manager only)
- `DELETE /api/staff/:staffId` - Delete staff (Manager only)

### Security Considerations

1. **Password Handling**:
   - Passwords are sent in URL parameters (GET request) - consider migrating to POST with body
   - Passwords are never stored in sessionStorage
   - Backend should hash passwords (not implemented in current version)

2. **Session Security**:
   - Session data is stored client-side only
   - Session persists only for browser tab lifetime
   - No server-side session validation (all checks are client-side)

3. **Access Control**:
   - Role checks are performed client-side
   - Direct URL access is protected by component-level checks
   - Backend should also validate roles for API endpoints

### Logout

Logout is handled by:
1. Calling `clearUserSession()` to remove session data
2. Redirecting to `/logIn` route

**Location**: `app/routes/_SNB.tsx` (SideNavBar component)

```typescript
const handleLogOut = () => {
  clearUserSession();
  navigate("/logIn");
};
```

### Testing Authentication

1. **Login as Manager**:
   - Access all routes including `/editStaff`, `/addStaff`
   - Can add/edit/delete staff members

2. **Login as Non-Manager** (Doctor/Staff/Staff):
   - Can view `/staffListView` but cannot add/edit
   - Direct access to `/editStaff` or `/addStaff` shows error page
   - Error page includes "Go Back" button

3. **No Session**:
   - Accessing protected routes shows error page without sidebar
   - Error page includes "Go Back" button

---

## Architecture

See `ARCHITECTURE.md` for detailed information about the application's architecture, including:
- Domain-driven design structure
- Use cases and repositories
- Data sources and dependency injection
