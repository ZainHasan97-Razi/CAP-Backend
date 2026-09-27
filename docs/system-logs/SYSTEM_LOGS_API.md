# System Logs API

## Overview

System logs are daily rotating plain-text files stored on the server. Each file covers one calendar day and is automatically deleted after the configured retention period (default: 10 days). Only `super_admin` users can access these endpoints.

All log entries are JSON lines capturing every HTTP request/response across the system — method, URL, status code, duration, user, IP, and request body (for non-GET requests).

**Base URL:** `http://localhost:9000`  
**Auth:** All endpoints require `Authorization: Bearer <token>` — `super_admin` role only.

---

## Endpoints

### 1. List Log Files

Returns all available log files sorted newest first.

```
GET /api/system-logs/list
```

**Headers**
| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

**Response `200`**
```json
{
  "data": [
    {
      "filename": "2025-07-15.log",
      "date": "2025-07-15",
      "sizeKb": 142,
      "sizeBytes": 145612
    },
    {
      "filename": "2025-07-14.log",
      "date": "2025-07-14",
      "sizeKb": 98,
      "sizeBytes": 100352
    }
  ],
  "total": 2
}
```

**Error Responses**
| Status | Reason |
|--------|--------|
| 401 | Missing or invalid token |
| 403 | User is not `super_admin` |

---

### 2. Download Log File

Downloads a specific log file as a `.log` text file. The browser will prompt a file download.

```
GET /api/system-logs/download/:filename
```

**Path Parameters**
| Param | Format | Example |
|-------|--------|---------|
| filename | `YYYY-MM-DD.log` | `2025-07-15.log` |

**Headers**
| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

**Response `200`**  
Returns the raw log file as a downloadable attachment.

```
Content-Type: text/plain
Content-Disposition: attachment; filename="2025-07-15.log"
```

**Error Responses**
| Status | Reason |
|--------|--------|
| 400 | Filename does not match `YYYY-MM-DD.log` pattern |
| 401 | Missing or invalid token |
| 403 | User is not `super_admin` |
| 404 | Log file not found for that date |

---

## Log Entry Format

Each line in a log file is a JSON object:

```json
{
  "level": "info",
  "message": "HTTP",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "duration": "45ms",
  "userId": "john.doe",
  "ip": "192.168.1.1",
  "body": { "userName": "john.doe" },
  "timestamp": "2025-07-15 14:32:01"
}
```

**Log Levels**
| Level | When |
|-------|------|
| `info` | Status code 1xx–3xx |
| `warn` | Status code 4xx (client errors) |
| `error` | Status code 5xx (server errors) |

**Fields**
| Field | Description |
|-------|-------------|
| `level` | `info` / `warn` / `error` |
| `message` | Always `"HTTP"` |
| `method` | HTTP method (`GET`, `POST`, etc.) |
| `url` | Full request URL including query string |
| `statusCode` | HTTP response status code |
| `duration` | Time taken to process the request |
| `userId` | `userName` of the authenticated user, `null` for public routes |
| `ip` | Client IP address |
| `body` | Request body — only present on `POST`, `PATCH`, `PUT` requests |
| `query` | Query params — only present when non-empty |
| `timestamp` | `YYYY-MM-DD HH:mm:ss` in server local time |

---

## Frontend Implementation Guide

### Page: System Logs

**Access:** Super admin only. Hide this page/menu item for all other roles.

---

### Step 1 — List available log files

On page load, call `GET /api/system-logs/list` and render a table:

| Column | Source field | Notes |
|--------|-------------|-------|
| Date | `date` | Display as readable date e.g. `July 15, 2025` |
| File | `filename` | Show as monospace text |
| Size | `sizeKb` | Display as `142 KB` |
| Action | — | Download button per row |

Sort is already newest-first from the API — no client-side sorting needed.

---

### Step 2 — Download a log file

When the user clicks Download on a row, trigger a file download using the filename from the list response:

```js
const downloadLog = async (filename) => {
  const response = await fetch(`/api/system-logs/download/${filename}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const blob = await response.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
```

> Do not open the URL directly in a new tab — the auth header cannot be sent that way and the request will return 401.

---

### Empty State

If `total === 0`, show a message: _"No log files available yet. Logs will appear here once the server receives requests."_

---

### UI Notes

- No pagination needed — max 10 files will ever be listed (retention = 10 days)
- No search/filter needed — files are already sorted and limited
- Show file size to help the admin gauge download size before clicking
- Today's log file will grow throughout the day — its size reflects activity so far
