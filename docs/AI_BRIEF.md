# Project: e‑Beer (Agri marketplace, NOT alcohol)
## One‑liner
A farm-to-city marketplace where **farmers list produce** and **buyers place bids**. Django REST API already set up and tested.

## Domain glossary
- Farmer: supply-side user; creates produce listings; accepts/rejects bids.
- Buyer: demand-side user; browses listings; places bids; pays once accepted.
- Listing: a produce item with quantity, unit, location, harvest date, min-acceptable price.
- Bid: offer from a buyer to a listing (price, qty).
- Order: created only after the farmer accepts a bid.

## Goals (backend)
- Auth (farmer/buyer roles), CRUD for listings, bidding flow, accept/reject, order creation, payments integration placeholder, admin reporting.
## Non‑goals
- Alcohol/e‑commerce for beer: **explicitly out of scope**.
- General retail catalog, carts, coupons—**not** part of v1.

## Current state
- Django + DRF; base endpoints reachable (tested).
- Models rough draft: User (role), Listing, Bid, Order.

## Style & conventions
- Use Django REST Framework viewsets, serializers.
- Write docstrings; keep endpoints predictable: `/api/listings/`, `/api/bids/`, `/api/orders/`.
