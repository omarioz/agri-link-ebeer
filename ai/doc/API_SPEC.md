# API Specification for e-Beer

## Authentication
- **POST /api/auth/register**  
  Registers a new user with role (farmer or buyer).
- **POST /api/auth/login**  
  Returns JWT tokens for authentication.

## Profiles
- **GET /api/profile/** – Get current user profile.
- **PATCH /api/profile/** – Update profile info.

## Produce (Listings)
- **GET /api/produce/** – List active produce; supports search and filter.
- **POST /api/produce/** – Create new listing (farmer only).
- **GET /api/produce/{id}/** – Get listing details.
- **PATCH /api/produce/{id}/** – Edit own listing.
- **DELETE /api/produce/{id}/** – Remove own listing.
- **POST /api/produce/{id}/close/** – Mark as inactive.

## Bids
- **POST /api/bids/** – Place a bid (buyer only).
- **GET /api/produce/{id}/bids/** – View bids for own listing (farmer only).
- **POST /api/bids/{id}/accept/** – Accept bid; creates order and closes listing.
- **POST /api/bids/{id}/reject/** – Reject bid.

## Orders
- **GET /api/orders/** – List orders for current user (buyer sees purchases, farmer sees sales).
- **PATCH /api/orders/{id}/status/** – Farmer can update status (delivered/cancelled).

## Payouts
- **POST /api/payouts/request/** – Farmer requests payout.
- **GET /api/payouts/** – Farmer sees own payouts; admin sees all.

## Warehouses
- **GET /api/warehouses/** – List warehouses with capacity and load.

## Todos
- **GET /api/todos/** – List own tasks.
- **POST /api/todos/** – Add task.
- **PATCH /api/todos/{id}/** – Edit task.
- **DELETE /api/todos/{id}/** – Remove task.

---

## Database Schema Mapping

### profiles
- id (UUID, PK, FK to auth.User)
- name (text)

### users
- id (UUID, PK, FK to auth.User)
- name (text)
- email (text)
- role (farmer | buyer)

### produce
- id (UUID, PK)
- farmer_id (FK to auth.User)
- name (text)
- image_url (text)
- quantity (numeric)
- price_per_kg (numeric)
- min_price (numeric)
- location (text)
- harvest_date (date)
- is_active (bool)
- created_at (timestamp)

### bids
- id (UUID, PK)
- produce_id (FK to produce)
- buyer_id (FK to auth.User)
- bid_price (numeric)
- status (pending | accepted | rejected)
- timestamp (timestamp)

### orders
- id (UUID, PK)
- buyer_id (FK to auth.User)
- produce_id (FK to produce)
- status (pending | accepted | rejected | delivered | cancelled)
- delivery_route (text)
- created_at (timestamp)

### payouts
- id (UUID, PK)
- farmer_id (FK to auth.User)
- amount (numeric)
- status (pending | processing | paid | failed)
- requested_at (timestamp)

### warehouses
- id (UUID, PK)
- location (text)
- capacity_kg (numeric)
- current_load_kg (numeric)

### todos
- id (UUID, PK)
- task (text)
- user_id (FK to auth.User)
- inserted_at (timestamp)
