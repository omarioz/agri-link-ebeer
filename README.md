# e-Beer Agricultural Marketplace

A farm-to-city marketplace where **farmers list produce** and **buyers place bids**. Built with Django REST API backend and React frontend.

## Architecture

- **Backend**: Django + Django REST Framework + PostgreSQL
- **Frontend**: React + TypeScript + Vite
- **Deployment**: Single Render service (Django serves React static files)
- **Authentication**: JWT tokens
- **Domain**: ebeer.shop

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (for production)

### Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Build for production (served by Django)
npm run build
```

### Run the App
```bash
npm install
npm run build
python manage.py migrate
python manage.py runserver
```

## Production Deployment

### Render.com Deployment
1. Connect your GitHub repository to Render
2. Configure as **Web Service** (not Static Site)
3. Build Command: `npm run build && python manage.py collectstatic --noinput`
4. Start Command: `gunicorn ebeer_api.wsgi:application --bind 0.0.0.0:$PORT`
5. Environment: Python 3.9+

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to False in production

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login with JWT
- `POST /api/auth/refresh/` - Refresh JWT token

### Profiles
- `GET /api/profile/` - Get current user profile
- `PATCH /api/profile/` - Update profile

### Produce
- `GET /api/produce/` - List active produce (public)
- `POST /api/produce/` - Create produce listing (farmer only)
- `GET /api/produce/{id}/` - Get produce details
- `PATCH /api/produce/{id}/` - Update produce (owner only)
- `DELETE /api/produce/{id}/` - Delete produce (owner only)
- `POST /api/produce/{id}/close/` - Close listing (owner only)

### Bids
- `POST /api/bids/` - Place bid (buyer only)
- `GET /api/bids/` - List user's bids
- `POST /api/bids/{id}/accept/` - Accept bid (farmer only)
- `POST /api/bids/{id}/reject/` - Reject bid (farmer only)

### Orders
- `GET /api/orders/` - List user's orders
- `PATCH /api/orders/{id}/status/` - Update order status (farmer only)

### Payouts
- `POST /api/payouts/request/` - Request payout (farmer only)
- `GET /api/payouts/` - List payouts

### Warehouses
- `GET /api/warehouses/` - List warehouses (read-only)

### Todos
- Full CRUD operations for user tasks

## Business Rules

- **Farmers** can create, update, and delete their produce listings
- **Buyers** can place bids on active produce
- **Bids** must meet minimum price requirements
- **Orders** are created when farmers accept bids
- **Produce** becomes inactive when a bid is accepted
- **Payouts** are calculated from delivered orders

## Testing

```bash
# Run all tests
python manage.py test

# Run specific test class
python manage.py test api.tests.CoreFlowTest

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## Database Schema

### Core Models
- **User**: Django auth user with role-based profiles
- **Produce**: Product listings with pricing and location
- **Bid**: Offers from buyers to farmers
- **Order**: Transactions created from accepted bids
- **Payout**: Payment requests from farmers
- **Warehouse**: Storage locations (read-only)

### Relationships
- Farmers own produce listings
- Buyers place bids on produce
- Orders link buyers to produce
- Payouts track farmer payments

## React Integration

The Django backend serves the React frontend as static files:

1. **Build Process**: `npm run build` creates `dist/` folder
2. **Static Serving**: Django serves `dist/` via WhiteNoise
3. **Routing**: All non-API routes serve `index.html` for React Router
4. **API Calls**: Frontend makes requests to `/api/*` endpoints

## Custom Domain Setup

1. **DNS Configuration**: Point ebeer.shop to Render's servers
2. **SSL Certificate**: Automatically provisioned by Render
3. **Environment**: Update CORS settings for production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

[Add your license here]
