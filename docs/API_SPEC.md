# API Specification - e-Beer Agricultural Marketplace

## Models Schema

### Profile
- id: UUID PK (OneToOne to auth.User, primary_key=True)
- name: CharField

### AppUser
- id: UUID PK (OneToOne to auth.User, primary_key=True)
- name: CharField
- email: EmailField (unique=False; use auth.User.email for canonical)
- role: CharField(choices=[('farmer','Farmer'),('buyer','Buyer')])

### Produce
- id: UUID PK
- farmer: FK(auth.User, related_name='produce_listings', on_delete=CASCADE)
- name: CharField
- image_url: URLField(blank=True)
- quantity: DecimalField(max_digits=12, decimal_places=2)
- price_per_kg: DecimalField(max_digits=12, decimal_places=2)
- min_price: DecimalField(max_digits=12, decimal_places=2)
- location: CharField
- harvest_date: DateField(null=True, blank=True)
- is_active: BooleanField(default=True)
- created_at: DateTimeField(auto_now_add=True)

### Bid
- id: UUID PK
- produce: FK(Produce, on_delete=CASCADE, related_name='bids')
- buyer: FK(auth.User, on_delete=CASCADE, related_name='bids')
- bid_price: DecimalField(max_digits=12, decimal_places=2)
- status: CharField(choices=[('pending','pending'),('accepted','accepted'),('rejected','rejected')], default='pending')
- timestamp: DateTimeField(auto_now_add=True)

### Order
- id: UUID PK
- buyer: FK(auth.User, related_name='orders')
- produce: FK(Produce, related_name='orders')
- status: CharField(choices=['pending','accepted','rejected','delivered','cancelled'], default='pending')
- delivery_route: TextField(blank=True)
- created_at: DateTimeField(auto_now_add=True)

### Payout
- id: UUID PK
- farmer: FK(auth.User, related_name='payouts')
- amount: DecimalField(max_digits=12, decimal_places=2)
- status: CharField(choices=['pending','processing','paid','failed'], default='pending')
- requested_at: DateTimeField(auto_now_add=True)

### Warehouse
- id: UUID PK
- location: CharField
- capacity_kg: DecimalField(max_digits=12, decimal_places=2)
- current_load_kg: DecimalField(max_digits=12, decimal_places=2, default=0)

### Todo
- id: UUID PK
- task: TextField
- user: FK(auth.User, related_name='todos')
- inserted_at: DateTimeField(auto_now_add=True)

## API Endpoints

### Auth
- POST /api/auth/register (username, email, password, role)
- POST /api/auth/login (JWT via simplejwt)

### Profiles
- GET /api/profile/ (current user's AppUser + Profile)
- PATCH /api/profile/

### Produce
- GET /api/produce/?q=&location=&ordering=price_per_kg,-created_at
- POST /api/produce/ (farmer)
- GET /api/produce/{id}/
- PATCH /api/produce/{id}/ (owner)
- DELETE /api/produce/{id}/ (owner)
- POST /api/produce/{id}/close/ (owner)

### Bids
- POST /api/bids/ {produce, bid_price} (buyer)
- GET /api/produce/{id}/bids/ (farmer-owner only)
- POST /api/bids/{id}/accept/
- POST /api/bids/{id}/reject/

### Orders
- GET /api/orders/
- PATCH /api/orders/{id}/status/ {status}

### Payouts
- POST /api/payouts/request/
- GET /api/payouts/ (farmer sees own; admin sees all)

### Warehouses
- GET /api/warehouses/

### Todos
- Standard CRUD, scoped to request.user

## Business Rules
- Only farmers can CREATE/PATCH/DELETE their produce
- Public can GET list/detail of active produce (is_active=True, quantity>0)
- Buyers can POST bids; reject with 400 if bid_price < produce.min_price or produce.is_active=False
- Only the produce's farmer can GET bids for that produce
- POST /api/bids/{id}/accept: only produce owner; set bid.status='accepted', create Order, set produce.is_active=False, reject other pending bids
- POST /api/bids/{id}/reject: only produce owner; set bid.status='rejected'
- GET /api/orders: buyer sees their orders; farmer sees orders for produce they own
- PATCH /api/orders/{id}/status/: farmer can mark delivered/cancelled only for their produce orders
- POST /api/payouts/request: farmer only; compute amount from accepted/delivered orders
- Warehouses: read-only GET list
