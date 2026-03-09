# Assessment List/Dashboard API Documentation

## API Endpoint
**Endpoint:** `GET /api/assesment/dashboard`

**Purpose:** Retrieve a paginated list of assessments with filtering, searching, and sorting capabilities for the dashboard/list page.

---

## Request Parameters

All parameters are optional query parameters:

### Filtering Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | string | No | Filter by assessment status | `open`, `in_progress`, `closed`, `discard` |
| `frameworkType` | string | No | Filter by framework type | `ISO`, `SOC2`, `NIST`, etc. |
| `department` | string | No | Filter by department ID | `507f1f77bcf86cd799439011` |
| `search` | string | No | Search across multiple fields (see below) | `ncca`, `security`, `ISO` |

### Date Range Filters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `dateFrom` | number | No | Filter by creation date (from) - Unix timestamp | `1704067200` |
| `dateTo` | number | No | Filter by creation date (to) - Unix timestamp | `1735689600` |
| `startDateFrom` | number | No | Filter by start date (from) - Unix timestamp | `1704067200` |
| `startDateTo` | number | No | Filter by start date (to) - Unix timestamp | `1735689600` |
| `dueDateFrom` | number | No | Filter by due date (from) - Unix timestamp | `1704067200` |
| `dueDateTo` | number | No | Filter by due date (to) - Unix timestamp | `1735689600` |

### Pagination Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number (starts from 1) |
| `limit` | number | No | `10` | Number of items per page |

---

## Search Functionality

The `search` parameter performs a **case-insensitive** search across the following fields:

1. **name** - Assessment name
2. **description** - Assessment description
3. **frameworkName** - Framework name (e.g., "ISO 27001")
4. **controlId** - Control code/ID (e.g., "A.5.1")
5. **controlName** - Control name (e.g., "Access Control Policy")

**Search Logic:** Uses MongoDB regex with case-insensitive matching (`$regex` with `$options: "i"`)

---

## Example Requests

### 1. Basic List (First Page)
```
GET /api/assesment/dashboard?page=1&limit=10
```

### 2. Filter by Status
```
GET /api/assesment/dashboard?status=open&page=1&limit=10
```

### 3. Search with Status Filter
```
GET /api/assesment/dashboard?search=ncca&status=open&page=1&limit=10
```

### 4. Filter by Framework Type
```
GET /api/assesment/dashboard?frameworkType=ISO&page=1&limit=20
```

### 5. Date Range Filter
```
GET /api/assesment/dashboard?dateFrom=1704067200&dateTo=1735689600&page=1&limit=10
```

### 6. Complex Filter (Multiple Criteria)
```
GET /api/assesment/dashboard?status=in_progress&search=security&dueDateFrom=1704067200&page=1&limit=15
```

### 7. Filter by Department
```
GET /api/assesment/dashboard?department=507f1f77bcf86cd799439011&page=1&limit=10
```

---

## Response Structure

### Success Response (200 OK)

```typescript
{
  data: Assessment[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

### Assessment Object Structure

```typescript
{
  _id: string,                          // MongoDB ObjectId
  assesmentId: string,                  // UUID grouping multiple controls
  name: string,                         // Assessment name
  description: string,                  // Assessment description
  frameworkType: string,                // Framework type enum
  framework: string,                    // Framework ObjectId
  frameworkName: string,                // Framework display name
  control: string,                      // Control ObjectId
  controlId: string,                    // Control code
  controlName: string,                  // Control name
  departments: [                        // Array of departments
    {
      id: string,                       // Department ObjectId
      name: string                      // Department name
    }
  ],
  participants: string[],               // Array of participant emails
  attachments: string[],                // Array of attachment URLs
  status: string,                       // "open" | "in_progress" | "closed" | "discard"
  startDate: number,                    // Unix timestamp (seconds)
  dueDate: number,                      // Unix timestamp (seconds)
  createdBy: string,                    // Creator username
  createdAt: string,                    // ISO date string
  updatedAt: string                     // ISO date string
}
```

### Example Response

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "assesmentId": "uuid-123-456-789",
      "name": "Q1 2024 Security Assessment",
      "description": "Quarterly security compliance review for NCCA standards",
      "frameworkType": "ISO",
      "framework": "507f1f77bcf86cd799439012",
      "frameworkName": "ISO 27001",
      "control": "507f1f77bcf86cd799439013",
      "controlId": "A.5.1",
      "controlName": "Access Control Policy",
      "departments": [
        {
          "id": "507f1f77bcf86cd799439014",
          "name": "IT Department"
        }
      ],
      "participants": ["john@example.com", "jane@example.com"],
      "attachments": ["https://example.com/file1.pdf"],
      "status": "in_progress",
      "startDate": 1704067200,
      "dueDate": 1735689600,
      "createdBy": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

## Status Values

| Status | Description |
|--------|-------------|
| `open` | Assessment is created but not started |
| `in_progress` | Assessment is currently being worked on |
| `closed` | Assessment is completed |
| `discard` | Assessment is discarded/cancelled |

---

## Sorting

**Default Sort:** Newest first (by `_id` descending)

The API automatically sorts results by creation date in descending order (newest assessments first).

---

## Frontend Implementation Guide

### TypeScript Interfaces

```typescript
interface Assessment {
  _id: string;
  assesmentId: string;
  name: string;
  description: string;
  frameworkType: string;
  framework: string;
  frameworkName: string;
  control: string;
  controlId: string;
  controlName: string;
  departments: Array<{
    id: string;
    name: string;
  }>;
  participants: string[];
  attachments: string[];
  status: 'open' | 'in_progress' | 'closed' | 'discard';
  startDate: number;
  dueDate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardResponse {
  data: Assessment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface DashboardFilters {
  status?: string;
  frameworkType?: string;
  department?: string;
  search?: string;
  dateFrom?: number;
  dateTo?: number;
  startDateFrom?: number;
  startDateTo?: number;
  dueDateFrom?: number;
  dueDateTo?: number;
  page?: number;
  limit?: number;
}
```

### API Call Example (React + Axios)

```typescript
import axios from 'axios';

const fetchAssessments = async (filters: DashboardFilters) => {
  const params = new URLSearchParams();
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await axios.get<DashboardResponse>(
    `/api/assesment/dashboard?${params.toString()}`
  );
  
  return response.data;
};

// Usage
const result = await fetchAssessments({
  status: 'open',
  search: 'ncca',
  page: 1,
  limit: 10
});
```

### React Component Example

```tsx
import { useState, useEffect } from 'react';

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState<DashboardFilters>({
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAssessments = async () => {
      setLoading(true);
      try {
        const result = await fetchAssessments(filters);
        setAssessments(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Failed to load assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [filters]);

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div>
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search assessments..." 
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {/* Status Filter */}
      <select onChange={(e) => handleStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>

      {/* Assessment List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {assessments.map(assessment => (
            <AssessmentCard key={assessment._id} assessment={assessment} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination 
        current={pagination.page}
        total={pagination.pages}
        onChange={handlePageChange}
      />
    </div>
  );
};
```

---

## Common Use Cases

### 1. Display All Open Assessments
```typescript
const filters = { status: 'open', page: 1, limit: 20 };
```

### 2. Search for Specific Assessment
```typescript
const filters = { search: 'ncca', page: 1, limit: 10 };
```

### 3. Items Due Soon
```typescript
const filters = { 
  dueDateFrom: Math.floor(Date.now() / 1000),
  dueDateTo: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // Next 7 days
  page: 1, 
  limit: 10 
};
```

### 4. Department-Specific Assessments
```typescript
const filters = { 
  department: 'departmentId123', 
  status: 'in_progress',
  page: 1, 
  limit: 10 
};
```

### 5. Framework-Specific Review
```typescript
const filters = { 
  frameworkType: 'ISO', 
  status: 'closed',
  page: 1, 
  limit: 10 
};
```

---

## Error Handling

### Common Errors

| Status Code | Description | Solution |
|-------------|-------------|----------|
| 400 | Bad Request - Invalid parameters | Check parameter types and values |
| 401 | Unauthorized - Missing/invalid token | Ensure user is authenticated |
| 500 | Internal Server Error | Contact backend team |

### Error Response Format
```json
{
  "error": "Error message description"
}
```

---

## Performance Tips

1. **Use pagination** - Don't request all records at once
2. **Debounce search** - Wait for user to stop typing before searching
3. **Cache results** - Store recent queries to reduce API calls
4. **Limit page size** - Use reasonable limits (10-50 items per page)

---

## Notes

- All dates are in **Unix timestamp format (seconds)**
- Search is **case-insensitive**
- Results are sorted by **creation date (newest first)**
- Empty filters return all assessments (paginated)
- Department filter uses department **ID**, not name

---

## Testing Checklist

- [ ] Pagination works correctly
- [ ] Search returns relevant results
- [ ] Status filter works
- [ ] Framework type filter works
- [ ] Department filter works
- [ ] Date range filters work
- [ ] Multiple filters work together
- [ ] Empty state handled properly
- [ ] Loading state displayed
- [ ] Error handling works

---

## Questions?
Contact backend team for any clarifications or issues.
