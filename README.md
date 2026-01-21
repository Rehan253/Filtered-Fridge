# The Filtered Fridge

Full-stack grocery platform with dietary preferences, admin management, and KPI dashboards.

## Tech Stack
- Backend: Flask, SQLAlchemy, Flask-JWT, Alembic, PostgreSQL
- Frontend: React (Vite), Zustand, Axios, Recharts

## Features
### Authentication & Roles
- JWT-based auth.
- Roles: `admin`, `customer`.
- Admin can activate/deactivate/suspend users.
- Inactive/suspended users cannot log in.

### User Profile & Preferences
- Profile data stored in database.
- Preferences (halal/vegetarian/vegan/kosher + allergies) stored per user in `user_preferences`.
- Preferences load per user and do not leak across accounts or browsers.

### Products & Categories
- Admin product CRUD.
- Category mapping for consistent filtering (Fruits, Vegetables, Dairy, Bakery, Meat, Seafood, Beverages, Snacks, Other).
- Products support: description, unit, price, original price, discount, stock, ingredients, dietary tags, rating, reviews.

### Orders & Invoices
- Checkout creates an invoice and invoice items.
- Delivery address and payment method stored on invoice.
- Order history shown in user profile.
- Cart stored per user (local storage namespaced by user id).

### Promotions
- Admin CRUD for promotions.
- Promotions include date range, categories, discount type/value, and promo codes.

### KPIs & Admin Dashboard
- Revenue metrics (total, period, growth, average order).
- Order metrics (total, period, growth, pending/completed when invoice status exists).
- Customer metrics (total, new this period, active).
- Product metrics (total, low stock, out of stock, inventory value).
- Promotion metrics (active count, promo usage if promo codes stored on invoices).
- Charts: revenue trend, orders by status, sales by category, customer growth.
- Top selling products.

## Project Structure
```
The-Filtered-Fridge/
├── backend/               Flask API
├── Frontend/              React app
└── README.md
```

## ER Diagram (Image)
![ER Diagram](ER%20Diagram.png)

## Use Case Diagram (Image)
![Use Case Diagram](Usecase%20diagram.png)

## Backend Setup
### 1) Create virtual env & install
```bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### 2) Configure environment
Create a `.env` in `backend/` or export env vars:
```
DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@localhost:5432/trinity_grocery
SUPER_ADMIN_EMAIL=admin@trinity.com
SUPER_ADMIN_PASSWORD=admin123
```

### 3) Run migrations
```bash
cd backend
flask db upgrade
```

### 4) Start backend
```bash
cd backend
python app.py
```

Backend runs on `http://127.0.0.1:5000`.

## Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://127.0.0.1:5173`.

## Required Node Version
Vite requires Node.js 20.19+ or 22.12+.

## Database & Migrations (Applied)
- add product dietary fields
- add user status
- add promotions
- add product admin fields
- add user preferences
- add invoice delivery fields
- add user state

## Core API Endpoints
### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/me`
- `PUT /auth/password`
- `GET /auth/preferences`
- `PUT /auth/preferences`

### Products
- `GET /products`
- `GET /products/<id>`
- `POST /products` (admin)
- `PUT /products/<id>` (admin)
- `DELETE /products/<id>` (admin)

### Invoices
- `POST /invoices/`
- `POST /invoices/<id>/items`
- `GET /invoices/<id>`
- `GET /invoices/me`

### Admin Users
- `GET /admin/users`
- `GET /admin/users/<id>`
- `PATCH /admin/users/<id>`

### Promotions
- `GET /admin/promotions`
- `POST /admin/promotions`
- `GET /admin/promotions/<id>`
- `PUT /admin/promotions/<id>`
- `DELETE /admin/promotions/<id>`

### KPIs
- `GET /kpis/revenue-metrics`
- `GET /kpis/order-customer-metrics`
- `GET /kpis/product-promotion-metrics`
- `GET /kpis/dashboard-charts`
- `GET /kpis/best-selling-products`

## Useful Scripts
From `backend/scripts/`:
- `seed_via_api.py`: ensures super admin on first-time setup.
- `update_product_prices.py`: fills `price` for products with 0 price.
- `seed_sample_orders.py`: creates sample users and orders for KPI testing.

### Update product prices
```bash
DATABASE_URL="postgresql+psycopg2://USER:PASSWORD@localhost:5432/trinity_grocery" \
python backend/scripts/update_product_prices.py
```

### Seed sample orders
```bash
python backend/scripts/seed_sample_orders.py
```

## Notes & Known Constraints
- Order status in KPIs shows only “Delivered” unless `Invoice.status` is added.
- Promotion usage/effectiveness requires `promo_code` on invoices (not present yet).
- Charts depend on real invoice data; if prices are zero, revenue KPIs will be zero.

## Default Admin
- Email: `admin@trinity.com`
- Password: `admin123`

## KPI Testing Quick Steps
1) Seed sample orders.
2) Update product prices if needed.
3) Refresh Admin Dashboard.

## License
Internal/educational project.

## Author
Rehan Shafique