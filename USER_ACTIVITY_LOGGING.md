# User Activity Logging

Tracks every authenticated user's actions across the system. Super admins can query logs via a dashboard API and export them as CSV or JSON.

---

## Overview

A middleware (`userActivityMiddleware`) runs automatically on every protected route **after** authentication. It captures request details and writes an activity record to MongoDB asynchronously on `res.finish` — so it never blocks the response.

The frontend enriches each log entry by sending two optional headers:

| Header | Purpose | Example |
|---|---|---|
| `X-Page-Name` | The current page the user is on | `Assessment List` |
| `X-Action` | A human-readable action label | `Exported Report` |

Without these headers the log is still recorded — you just won't have page/action context.

---

## Configuration

Add to your `.env` file:

```env
# Number of days to retain activity logs (default: 60)
USER_ACTIVITY_TTL_DAYS=60
```

MongoDB TTL index handles automatic cleanup. To change retention, update this value and restart the server (TTL is applied at model load time).

---

## Data Captured Per Activity

| Field | Source | Description |
|---|---|---|
| `userId` | JWT token | User's MongoDB `_id` |
| `userName` | JWT token | User's display name |
| `email` | JWT token | User's email |
| `role` | JWT token | User's role |
| `department` | JWT token | User's department |
| `page` | `X-Page-Name` header | Page the user was on |
| `action` | `X-Action` header | Action performed |
| `apiUrl` | Request | Full URL including query string |
| `method` | Request | HTTP method (GET, POST, PATCH, DELETE) |
| `statusCode` | Response | HTTP status code |
| `ipAddress` | Request | Client IP — supports proxies via `X-Forwarded-For` |
| `device.browser` | User-Agent | Chrome, Firefox, Safari, Edge, IE |
| `device.os` | User-Agent | Windows, macOS, Android, iOS, Linux |
| `device.deviceType` | User-Agent | `desktop`, `mobile`, `tablet` |
| `device.userAgent` | User-Agent | Raw User-Agent string |
| `timestamp` | Server | Time of the request |

---

## API Reference

All endpoints require `Authorization: Bearer <token>` and the caller must have the `super_admin` system role.

Base path: `/api/activity`

---

### `GET /api/activity/list`

Returns a paginated list of activity logs for the dashboard.

**Query Parameters**

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | Filter by a specific user's `_id` |
| `startDate` | ISO date string | Start of date range (inclusive) |
| `endDate` | ISO date string | End of date range (inclusive, up to end of day) |
| `page` | string | Filter by page name (partial match, case-insensitive) |
| `action` | string | Filter by action label (partial match, case-insensitive) |
| `method` | string | Filter by HTTP method (`GET`, `POST`, `PATCH`, `DELETE`) |
| `statusCode` | number | Filter by HTTP status code (e.g. `200`, `400`, `500`) |
| `pageNum` | number | Page number (default: `1`) |
| `limit` | number | Records per page (default: `20`) |

**Example Request**
```
GET /api/activity/list?startDate=2025-01-01&endDate=2025-01-31&method=POST&pageNum=1&limit=20
Authorization: Bearer <token>
```

**Example Response**
```json
{
  "data": [
    {
      "_id": "...",
      "userId": "64abc...",
      "userName": "John Doe",
      "email": "john@example.com",
      "role": "Admin",
      "department": "IT",
      "page": "Assessment List",
      "action": "Created Assessment",
      "apiUrl": "/api/assesment/create",
      "method": "POST",
      "statusCode": 201,
      "ipAddress": "192.168.1.10",
      "device": {
        "browser": "Chrome",
        "os": "Windows",
        "deviceType": "desktop",
        "userAgent": "Mozilla/5.0 ..."
      },
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ],
  "total": 142,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

### `GET /api/activity/export`

Exports activity logs as CSV or JSON for download. Returns all matched records (no pagination).

**Query Parameters**

Accepts all the same filters as `/list` (except `pageNum` and `limit`), plus:

| Parameter | Type | Description |
|---|---|---|
| `format` | `csv` \| `json` | Export format (default: `json`) |

**CSV Download**
```
GET /api/activity/export?startDate=2025-01-01&endDate=2025-01-31&format=csv
Authorization: Bearer <token>
```
Response: file download `user-activity.csv`

**JSON Export**
```
GET /api/activity/export?userId=64abc...&format=json
Authorization: Bearer <token>
```
```json
{
  "data": [ ...activity records... ],
  "total": 56
}
```

---

## Frontend Integration Guide

### 1. Add Headers to Every API Request

Configure your Axios instance to send the tracking headers automatically on every request.

```js
// src/api/axios.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

let currentPageName = '';
let currentAction   = '';

export const setPageName = (name) => { currentPageName = name; };
export const setAction   = (label) => { currentAction = label; };

api.interceptors.request.use((config) => {
  if (currentPageName) config.headers['X-Page-Name'] = currentPageName;
  if (currentAction)   config.headers['X-Action']    = currentAction;

  // Action is one-shot — clear after attaching to the request
  currentAction = '';
  return config;
});

export default api;
```

---

### 2. Set Page Name on Route Change

Call `setPageName` whenever the route changes using a human-readable name.

```jsx
// React Router v6
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setPageName } from '../api/axios';

const PAGE_NAMES = {
  '/dashboard':          'Dashboard',
  '/assessments':        'Assessment List',
  '/assessments/create': 'Create Assessment',
  '/frameworks':         'Framework List',
  '/users':              'User Management',
  '/reports':            'Reports',
};

export function PageTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    setPageName(PAGE_NAMES[pathname] || pathname);
  }, [pathname]);

  return null;
}

// Mount once inside your Router:
// <Router>
//   <PageTracker />
//   <App />
// </Router>
```

---

### 3. Set Action for Specific Interactions

Set the action just before making an API call for meaningful user interactions. It's automatically cleared after each request.

```js
import api, { setAction } from '../api/axios';

const handleExport = async () => {
  setAction('Exported Report');
  await api.get('/reports/export');
};

const handleDelete = async (id) => {
  setAction('Deleted Assessment');
  await api.delete(`/assesment/${id}`);
};

const handleSubmit = async (data) => {
  setAction('Created Assessment');
  await api.post('/assesment/create', data);
};
```

---

### 4. Action Naming Convention

Use `<Verb> <Object>` format for consistency across the dashboard.

| Good ✅ | Avoid ❌ |
|---|---|
| `Created Assessment` | `create` |
| `Exported Report` | `btn_click` |
| `Updated Framework` | `PATCH /framework/123` |
| `Deleted User` | `delete_user_action` |
| `Viewed Control Details` | `page_load` |

Actions for passive GET requests are optional — `page` and `apiUrl` already provide enough context.

---

### 5. CSV Download

```js
const downloadActivityReport = async (filters = {}) => {
  const params = new URLSearchParams({ ...filters, format: 'csv' });

  const response = await api.get(`/activity/export?${params}`, {
    responseType: 'blob',
  });

  const url  = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href  = url;
  link.download = 'user-activity.csv';
  link.click();
  URL.revokeObjectURL(url);
};

// Usage
downloadActivityReport({
  startDate: '2025-01-01',
  endDate:   '2025-01-31',
  userId:    '64abc...',
});
```

---

## Frontend Checklist

- [ ] Axios instance configured with `X-Page-Name` and `X-Action` interceptor
- [ ] `PageTracker` component mounted inside `Router`
- [ ] All page routes mapped to human-readable names in `PAGE_NAMES`
- [ ] `setAction` called before meaningful POST / PATCH / DELETE requests
- [ ] Activity dashboard page restricted to `super_admin` role only
- [ ] Date range pickers send `startDate` / `endDate` as ISO strings
- [ ] Export button triggers CSV download via `responseType: 'blob'`

---

## File Structure

```
src/
├── models/
│   └── user-activity.model.ts       # Schema with configurable TTL
├── services/
│   └── user-activity.service.ts     # list, exportData, create
├── controllers/
│   └── user-activity.controller.ts  # listActivities, exportActivities
├── middleware/
│   └── user-activity.middleware.ts  # auto-capture on every authenticated request
└── routes/
    └── protected/
        └── user-activity.route.ts   # GET /activity/list, GET /activity/export
```

---

## Security Notes

- All activity endpoints require a valid JWT (`protect` middleware)
- Both `/list` and `/export` additionally require the `super_admin` system role
- Activity logs are never self-logged (middleware skips `/uploads` static paths)
- IP extraction respects `X-Forwarded-For` for deployments behind a proxy/load balancer (`trust proxy` is set in `src/index.ts`)
