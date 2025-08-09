# Project: e-Beer (Agricultural Marketplace, NOT Alcohol)

## One-liner
A farm-to-city marketplace where **farmers list produce** and **buyers place bids**.  
The platform connects them directly, removing middlemen and ensuring fair prices.

## Domain glossary
- **Farmer**: A supply-side user who creates produce listings and accepts/rejects bids.
- **Buyer**: A demand-side user who browses listings and places bids.
- **Listing (Produce)**: A produce item with quantity, unit, location, harvest date, and minimum acceptable price.
- **Bid**: An offer from a buyer for a specific listing (price and quantity).
- **Order**: Created only after the farmer accepts a bid.
- **Payout**: A payment request from a farmer after fulfilling orders.
- **Warehouse**: Storage facility for produce logistics.

## Goals
- Build a Django backend that serves both the API and the React frontend from the same service.
- Implement the full produce → bid → order → payout workflow.
- Use role-based access control (farmer/buyer).
- Keep deployment simple: single Render service for API + frontend.
- Avoid CORS issues by serving both from one domain.

## Non-goals
- Alcohol/e-commerce for beer: **explicitly out of scope**.
- General retail catalog or unrelated store features.

## Current state
- Django project scaffolded.
- React + TypeScript + Vite frontend generated.
- API endpoints not yet implemented.
- Database schema defined (see API_SPEC.md).

## Style & conventions
- Django ORM models for schema.
- DRF ViewSets and Serializers for API.
- JWT auth via `djangorestframework-simplejwt`.
- Static file serving of React build via WhiteNoise.
- Clear separation of role permissions in `permissions.py`.
