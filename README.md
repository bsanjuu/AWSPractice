# Order Processing & Analytics Platform

A full-stack order management and analytics platform built with Angular 17 frontend and Node.js/Express backend.

## 🏗️ Project Structure

```
AWSPractice/
├── backend/
│   └── order-platform-backend/    # Node.js/Express API server
│       ├── src/
│       │   ├── analytics/         # Analytics routes and logic
│       │   ├── auth/              # Authentication routes
│       │   ├── orders/            # Order management routes
│       │   ├── payments/          # Payment processing routes
│       │   └── app.js             # Main application entry point
│       └── config/                # Environment configuration
├── frontend/
│   └── order-platform/            # Angular 17 application
│       └── src/
│           └── app/
│               ├── components/    # Reusable UI components
│               ├── pages/         # Page components
│               ├── services/      # Angular services
│               ├── guards/        # Route guards
│               └── interceptors/  # HTTP interceptors
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/order-platform-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

The backend server will start on `http://localhost:3000` (default port).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/order-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The Angular app will open automatically at `http://localhost:4200`.

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check endpoint |
| `/api/auth/*` | Authentication routes |
| `/api/orders/*` | Order management routes |
| `/api/payments/*` | Payment processing routes |
| `/api/analytics/*` | Analytics and reporting routes |

## 🧪 Running Tests

### Frontend Tests
```bash
cd frontend/order-platform
npm test
```

## 🛠️ Built With

### Backend
- **Express.js** - Web framework for Node.js
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **UUID** - Unique identifier generation
- **Axios** - HTTP client

### Frontend
- **Angular 17** - Frontend framework
- **RxJS** - Reactive programming library
- **Chart.js / ng2-charts** - Data visualization
- **Font Awesome** - Icon library

## 📝 License

This project is for practice and learning purposes.