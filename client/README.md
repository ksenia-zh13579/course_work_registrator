# Регистратор - Client Application

A React-based client application for registering and viewing incidents with role-based access control.

## Project Structure

```
src/
├── api/
│   └── client.js           # Axios API client with interceptors
├── components/
│   ├── Header/             # Navigation header component
│   ├── Footer/             # Footer with author info
│   ├── Modal/              # Reusable form modal component
│   └── ProtectedRoute/     # Route protection for authenticated/admin users
├── context/
│   └── AuthContext.jsx     # Authentication context and hooks
├── pages/
│   ├── Main/               # Home/landing page
│   ├── SignIn/             # Login page
│   ├── Registration/       # User registration page
│   ├── Profile/            # User profile management
│   ├── Incidents/          # Incident listing and management
│   ├── Involvements/       # Participant involvement statuses
│   └── Participants/       # Admin-only participant management
├── styles/
│   └── global.scss         # Global styles and CSS variables
├── App.jsx                 # Main app component with routing
├── main.jsx                # React entry point
└── index.css               # Base CSS reset
```

## Features

### Authentication
- Sign in / Registration with username, name, patronymic, and password
- Auth context with automatic profile loading
- Protected routes for authenticated users and admins
- Token refresh interceptor

### Pages

#### Main (/)
- Welcome message with role-specific content
- Links to other pages
- Different content for Guest, User, and Admin roles

#### Sign In (/signin)
- Login form with username and password
- Redirects to main page on success
- Link to registration page

#### Registration (/register)
- User registration form
- Fields: login, first name, last name, patronymic, password
- Automatic redirect to sign in after registration

#### Profile (/profile) - Protected
- Display user information
- Edit profile modal with form validation
- Change password functionality
- Admin badge for admin users

#### Incidents (/incidents)
- List of incidents with tabs (pending/reviewed)
- Date range filtering
- Add new incident button (authenticated users)
- Edit/delete incidents (edit for users, delete for admins)
- Fields: type, date, description, status

#### Involvements (/involvements)
- List of incident participant statuses
- Search functionality
- Add new status (admin only)
- Edit/delete statuses (admin only)
- Statuses: Suspect, Witness, Victim, Culprit

#### Participants (/participants) - Admin Only
- List of incident participants
- Search by name
- Add participant
- Edit/delete participant info
- Fields: last name, first name, patronymic, address, convictions

### Components

#### Header
- Logo and navigation links
- Active page indicator
- User avatar with username
- Admin badge for admin users
- Logout button

#### Footer
- Copyright information
- Author details
- Contact email

#### Modal
- Reusable form container with header, body, and actions
- Close button (X)
- Submit and Cancel buttons
- Click-outside and Escape key to close

#### ProtectedRoute
- Prevents unauthorized access
- Redirects to sign in if not authenticated
- Redirects to home if not admin (when required)

#### AuthContext
- User state management
- Login/register/logout functions
- Profile update function
- Admin and authentication status indicators

### Styling

#### CSS Variables
- Colors: primary (#910407), primary-dark (#7B0204), link (#38097E)
- Backgrounds: header (#DDD2D2), page (#FFF5F5), footer (#EDC2CD)
- Fonts: 'LXGW WenKai TC', 'Jeju Gothic'

#### Design System
- BEM-style class naming
- SCSS modules for component-specific styles
- Global styles for reusable elements
- Responsive design with media queries
- Flexbox and CSS Grid layouts

### Key Styles Applied
- `.page-container` - Main content area
- `.btn` - Button styling
- `.form-input`, `.form-select`, `.form-label` - Form elements
- `.data-table`, `.table-row`, `.table-cell` - Table layout
- `.nav-btn`, `.user-avatar-wrapper` - Navigation elements
- `.modal`, `.form-header`, `.form-body`, `.form-actions` - Modal structure

## Setup & Running

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Endpoints

The client communicates with the backend API at `/api`:

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile
- `PATCH /auth/profile` - Update user profile
- `POST /auth/logout` - Logout user
- `GET /auth/incidents` - Get incidents with date filtering
- `POST /auth/incidents` - Create new incident
- `PATCH /auth/incidents/:id` - Update incident
- `DELETE /auth/incidents/:id` - Delete incident
- `GET /auth/participants` - Get all participants
- `POST /auth/participants` - Add participant
- `PATCH /auth/participants/:id` - Update participant
- `DELETE /auth/participants/:id` - Delete participant
- `GET /auth/involvements` - Get all involvements
- `POST /auth/involvements` - Add involvement
- `PATCH /auth/involvements/:id` - Update involvement
- `DELETE /auth/involvements/:id` - Delete involvement

## Technologies

- **React** 19.2 - UI library
- **React Router** 7.17 - Client-side routing
- **Axios** 1.16 - HTTP client
- **SCSS** 1.101 - Styling
- **Vite** 8.0 - Build tool
- **ESLint** - Code quality

## Authentication Flow

1. User starts at sign in page
2. Provides credentials and submits
3. Backend validates and returns tokens
4. AuthContext stores user data and tokens
5. Protected routes check authentication status
6. User can navigate to authorized pages
7. API requests include auth tokens via interceptors
8. On logout, tokens cleared and user redirected to sign in

## Responsive Design

All pages are responsive with breakpoints at 768px for tablets and mobile devices. The layout adapts:
- Header navigation wraps on smaller screens
- Table content may scroll horizontally
- Modal adjusts max-width for mobile
- Font sizes reduce on smaller viewports
- Padding and gaps adjust for compact display

## Error Handling

- Form validation on client side
- API errors displayed to users
- Failed authentication redirects to sign in
- 401 errors trigger token refresh
- Network errors show user-friendly messages

## Notes

- The application uses cookies for session management (withCredentials: true)
- Form data for all modals is validated before submission
- Table IDs can have edit/delete action links
- Search and filter operations are debounced in some cases
- Admin features hidden from non-admin users
