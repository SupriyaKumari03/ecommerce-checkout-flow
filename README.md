# e-SalesOne - E-commerce Checkout Flow

A modern e-commerce application built with React, featuring a responsive design and seamless shopping experience. The application showcases Adidas products with a focus on user experience and modern design principles.

## Features

- **Landing Page**: 
  - Featured products showcase
  - Responsive product cards with hover effects
  - Quick add to cart functionality
  - "View All" navigation to catalog

- **Product Catalog**:
  - Grid layout of all products
  - Product cards with images, titles, and prices
  - Color and size variant selection
  - Responsive design for all screen sizes

- **Shopping Cart**:
  - Real-time cart updates
  - Quantity adjustment
  - Cart total calculation
  - Persistent cart data using Context API

- **Checkout Process**:
  - Multi-step form
  - Shipping information collection
  - Order summary
  - Email confirmation using Nodemailer
  - Transaction simulation with different outcomes

- **Contact Page**:
  - Contact form with validation
  - Google Maps integration
  - Business hours display
  - Direct email functionality

- **User Authentication**:
  - **JWT-based Authentication**: Secure token-based authentication system
  - **User Sessions**: Persistent login sessions using localStorage
  - **Protected Routes**: Secure routes requiring authentication

- **Sign Up**:
  - Modern, responsive sign-up form with:
    - First Name and Last Name fields
    - Email validation
    - Password strength requirements
    - Password confirmation
    - Real-time form validation
    - Error handling and feedback
    - Redirect to previous page after successful registration

- **Sign In**:
  - User-friendly sign-in interface featuring:
    - Email and password authentication
    - Form validation
    - Error messaging
    - "Remember me" functionality
    - Redirect to intended destination
    - Quick link to sign up for new users

- **User Profile**:
  - Access to user information:
    - Personal details
    - Order history
    - Shipping addresses
    - Account settings

- **Navigation & UI**:
  - Intuitive header navigation with:
    - User account icon (direct sign-in access)
    - Shopping cart with item count
    - User menu for authenticated users
    - Search functionality
    - Responsive design

## Tech Stack

### Frontend
- React.js (Create React App)
- React Router v7 for navigation
- Context API for state management
- CSS3 with responsive design
- Font Awesome icons
- Google Maps API for location display
- Axios for HTTP requests

### Backend
- Node.js with Express
- Nodemailer for email notifications
- Handlebars for email templates
- CORS for cross-origin resource sharing

## Prerequisites

Before running this project, make sure you have:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A Google Maps API key
- Mailtrap account for email testing

## Environment Variables

Create a `.env` file in the backend directory with:
```
PORT=5000
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open http://localhost:3000 in your browser

## Project Structure

```
ecommerce-checkout-flow/
├── frontend/
│   ├── public/
│   │   └── images/
│   │       └── products/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── styles/
│       └── App.js
└── backend/
    ├── routes/
    ├── services/
    ├── templates/
    └── server.js
```

## Key Components

- **CartContext**: Manages shopping cart state across the application
- **Header**: Navigation and cart display
- **SearchOverlay**: Product search functionality
- **GoogleMap**: Location display on contact page
- **CartNotification**: Real-time cart update notifications

## Styling

The application uses custom CSS with:
- Responsive design principles
- Flexbox and Grid layouts
- Custom animations and transitions
- Mobile-first approach

## Email Templates

Located in `backend/templates/`, using Handlebars for:
- Order confirmations
- Contact form submissions
- Shipping updates

## Testing

Run tests with:
```bash
cd frontend
npm test
```

The application includes tests for:
- Component rendering
- User interactions
- Shopping cart functionality

## Transaction Simulation

The checkout process includes a transaction simulation feature. The outcome of a transaction is determined by the last digit of the card number:

| Last Digit | Transaction Outcome |
|------------|-------------------|
| 0 - 3 | APPROVED - Transaction will be successful |
| 4 - 6 | DECLINED - Transaction will be declined |
| 7 - 9 | ERROR - A gateway error will occur |

Testing Instructions:
1. Use any 16-digit card number
2. The last digit determines the outcome (e.g., 4111 1111 1111 1112 will be APPROVED)
3. Use any future date for expiry
4. Use any 3 digits for CVV
5. Use any valid postal code

Note: This is a simulation feature for testing UI responses. No actual payment processing occurs.

## Known Limitations

- Payment processing is not implemented
- Product data is currently hardcoded
- Limited to Adidas products
- Test email functionality using Mailtrap

## Future Improvements

- Add user authentication
- Implement real payment processing
- Connect to a product database
- Add product search functionality
- Implement user reviews and ratings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 

## Technical Implementation

### Backend Authentication (Node.js/Express)
```javascript
// Authentication Middleware
const auth = require('./middleware/auth');
app.use('/api/protected', auth); // Protect routes

// User Routes
POST /api/auth/signup - Create new user account
POST /api/auth/signin - Authenticate user
GET /api/auth/me - Get user profile (protected)
```

### Frontend Authentication (React)
```javascript
// AuthContext provides authentication state management
const { isAuthenticated, user, signin, signout } = useAuth();

// Protected Route Component
<PrivateRoute path="/checkout" element={<CheckoutPage />} />
```

### Database Schema (MongoDB)
```javascript
// User Model
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  shippingAddresses: Array,
  orderHistory: Array,
  createdAt: Date
}
```

## Security Features
- Password hashing using bcrypt
- JWT token encryption
- Protected API endpoints
- Form validation and sanitization
- CORS protection
- Environment variable configuration
- Secure HTTP headers

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/SupriyaKumari03/ecommerce-checkout-flow.git
```

2. Install dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# backend/.env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Run the application
```bash
# Run backend (from backend directory)
npm start

# Run frontend (from frontend directory)
npm start
```

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment mode (development/production)

### Frontend
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_JWT_STORAGE_KEY`: localStorage key for JWT token

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register new user
- `POST /api/auth/signin`: Authenticate user
- `GET /api/auth/me`: Get user profile
- `POST /api/auth/signout`: Sign out user

### Protected Routes
- `GET /api/profile`: User profile data
- `PUT /api/profile`: Update profile
- `GET /api/orders`: Order history
- `POST /api/checkout`: Process checkout (requires authentication) 