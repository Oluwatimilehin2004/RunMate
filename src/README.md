# FaaS — Fulfillment as a Service · Frontend MVP

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        ← Collapsible nav (icon-only when collapsed)
│   │   ├── TopBar.jsx         ← Header with clock, bell, status pill
│   │   └── PageHeader.jsx     ← Reusable page title + action slot
│   └── ui/
│       ├── index.jsx          ← StatusBadge, Button, Modal, Field, Spinner,
│       │                         EmptyState, ErrorBanner, all SVG icons
│       └── StatCard.jsx       ← Metric card for dashboard
│
├── hooks/
│   ├── useOrders.js           ← Fetches /orders, exposes mutations
│   └── useRiders.js           ← Fetches /riders
│
├── pages/
│   ├── DashboardPage.jsx      ← Stats + pipeline + recent orders table
│   ├── VendorPage.jsx         ← Create order modal + order list
│   ├── RunnerPage.jsx         ← Pick & pack flow with checklist
│   ├── DispatcherPage.jsx     ← Rider grid + assign modal
│   ├── DeliveryPage.jsx       ← USSD phone mockup + active deliveries
│   └── KanbanPage.jsx         ← 5-column board
│
├── services/
│   └── api.js                 ← All fetch calls — single source of truth
│
├── utils/
│   ├── constants.js           ← DB field names, status config, enums
│   └── helpers.js             ← parseItems(), timeAgo(), shortLocation()
│
├── App.jsx                    ← Routing between pages, shared state
├── main.jsx
└── index.css
```

## API ↔ DB field mapping

| Frontend key       | DB column        | Notes                                  |
|--------------------|------------------|----------------------------------------|
| `order.id`         | `id`             | Primary key                            |
| `order.customer_name` | `customer_name` |                                     |
| `order.items_json` | `items_json`     | JSON string: `[{name,qty}]`            |
| `order.location`   | `location`       |                                        |
| `order.payment_method` | `payment_method` |                                   |
| `order.status`     | `status`         | `NEW\|PICKING\|READY\|OUT_FOR_DELIVERY\|DELIVERED` |
| `order.delivery_code` | `delivery_code` | 4-digit string                      |
| `order.assigned_runner` | `assigned_runner` |                                 |
| `order.assigned_rider` | `assigned_rider` |                                   |
| `order.created_at` | `created_at`     | ISO 8601                               |
| `rider.id`         | `id`             |                                        |
| `rider.name`       | `name`           |                                        |
| `rider.type`       | `type`           | `Motorcycle\|Bicycle\|On Foot`         |
| `rider.assigned_orders` | `assigned_orders` | 0 = available                   |

## API endpoints used

```
GET    /orders
POST   /orders                        { customer_name, items_json, location, payment_method }
PATCH  /orders/:id/status             { status }
PATCH  /orders/:id/assign-rider       { assigned_rider }
POST   /orders/:id/validate-delivery  { delivery_code }
GET    /riders
```

## Setup

```bash
cp .env.example .env
# edit VITE_API_URL

npm install
npm run dev
```
