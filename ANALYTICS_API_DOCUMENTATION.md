# Analytics API - Framework Progress Feature

## Summary
The `getAnalytics` API has been enhanced to include **framework-based analytics**. This allows the frontend to display progress tracking for each compliance framework (e.g., ISO 27001, SOC 2, NIST, etc.) separately.

## What's New
Added `frameworkAnalytics` array to the API response that provides detailed progress metrics for each framework.

---

## API Endpoint
**Endpoint:** `GET /api/analytics` (or your actual endpoint path)

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | number | No | Unix timestamp - Filter assessments starting from this date |
| `endDate` | number | No | Unix timestamp - Filter assessments due by this date |

### Example Request
```javascript
GET /api/analytics?startDate=1704067200&endDate=1735689600
```

---

## API Response Structure

### Complete Response Object
```typescript
{
  // Overall Assessment Metrics
  totalAssessments: number,
  completedAssessments: number,
  inProgressAssessments: number,
  openAssessments: number,
  overdueAssessments: number,
  
  // Control Compliance Metrics
  compliantControls: number,
  nonCompliantControls: number,
  
  // Priority Distribution
  priorityDistribution: {
    high: number,
    medium: number,
    low: number
  },
  
  // 🆕 NEW: Framework Analytics
  frameworkAnalytics: [
    {
      frameworkName: string,
      totalAssessments: number,
      completedAssessments: number,
      totalControls: number,
      completedControls: number,
      progressPercentage: number  // 0-100
    }
  ]
}
```

### Example Response
```json
{
  "totalAssessments": 25,
  "completedAssessments": 10,
  "inProgressAssessments": 12,
  "openAssessments": 3,
  "overdueAssessments": 5,
  "compliantControls": 150,
  "nonCompliantControls": 75,
  "priorityDistribution": {
    "high": 8,
    "medium": 12,
    "low": 5
  },
  "frameworkAnalytics": [
    {
      "frameworkName": "ISO 27001",
      "totalAssessments": 10,
      "completedAssessments": 4,
      "totalControls": 114,
      "completedControls": 80,
      "progressPercentage": 70
    },
    {
      "frameworkName": "SOC 2",
      "totalAssessments": 8,
      "completedAssessments": 3,
      "totalControls": 64,
      "completedControls": 45,
      "progressPercentage": 70
    },
    {
      "frameworkName": "NIST CSF",
      "totalAssessments": 7,
      "completedAssessments": 3,
      "totalControls": 98,
      "completedControls": 25,
      "progressPercentage": 26
    }
  ]
}
```

---

## Framework Analytics Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `frameworkName` | string | Name of the compliance framework (e.g., "ISO 27001", "SOC 2") |
| `totalAssessments` | number | Total number of assessments for this framework |
| `completedAssessments` | number | Number of fully completed assessments for this framework |
| `totalControls` | number | Total number of controls across all assessments in this framework |
| `completedControls` | number | Number of controls marked as "closed" |
| `progressPercentage` | number | Overall completion percentage (0-100) calculated as: `(completedControls / totalControls) * 100` |

---

## Frontend Implementation Guide

### 1. TypeScript Interface
```typescript
interface FrameworkAnalytics {
  frameworkName: string;
  totalAssessments: number;
  completedAssessments: number;
  totalControls: number;
  completedControls: number;
  progressPercentage: number;
}

interface AnalyticsResponse {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  openAssessments: number;
  overdueAssessments: number;
  compliantControls: number;
  nonCompliantControls: number;
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  frameworkAnalytics: FrameworkAnalytics[];
}
```

### 2. API Call Example (React/Axios)
```typescript
const fetchAnalytics = async (startDate?: number, endDate?: number) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toString());
  if (endDate) params.append('endDate', endDate.toString());
  
  const response = await axios.get<AnalyticsResponse>(
    `/api/analytics?${params.toString()}`
  );
  return response.data;
};
```

### 3. Display Framework Progress (React Example)
```tsx
const FrameworkProgressCard = ({ framework }: { framework: FrameworkAnalytics }) => {
  return (
    <div className="framework-card">
      <h3>{framework.frameworkName}</h3>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${framework.progressPercentage}%` }}
        />
      </div>
      
      <div className="stats">
        <span>{framework.progressPercentage}% Complete</span>
        <span>{framework.completedControls} / {framework.totalControls} Controls</span>
        <span>{framework.completedAssessments} / {framework.totalAssessments} Assessments</span>
      </div>
    </div>
  );
};

const FrameworkAnalyticsDashboard = ({ data }: { data: AnalyticsResponse }) => {
  return (
    <div className="frameworks-grid">
      {data.frameworkAnalytics.map((framework) => (
        <FrameworkProgressCard 
          key={framework.frameworkName} 
          framework={framework} 
        />
      ))}
    </div>
  );
};
```

### 4. Sorting & Filtering Examples
```typescript
// Sort by progress (lowest first - needs attention)
const sortedByProgress = [...frameworkAnalytics].sort(
  (a, b) => a.progressPercentage - b.progressPercentage
);

// Filter frameworks with low progress (< 50%)
const needsAttention = frameworkAnalytics.filter(
  fw => fw.progressPercentage < 50
);

// Find top performing framework
const topFramework = frameworkAnalytics.reduce((prev, current) => 
  current.progressPercentage > prev.progressPercentage ? current : prev
);
```

---

## UI/UX Recommendations

### 1. **Framework Progress Cards**
Display each framework as a card with:
- Framework name as header
- Progress bar (color-coded: red < 30%, yellow 30-70%, green > 70%)
- Percentage completion
- Controls completed vs total
- Assessments completed vs total

### 2. **Framework Comparison Chart**
Use a horizontal bar chart to compare progress across all frameworks at a glance.

### 3. **Priority Indicators**
Add visual indicators for frameworks that need attention:
- 🔴 Red: < 30% progress
- 🟡 Yellow: 30-70% progress
- 🟢 Green: > 70% progress

### 4. **Empty State**
Handle when `frameworkAnalytics` is empty:
```tsx
{data.frameworkAnalytics.length === 0 ? (
  <EmptyState message="No framework data available for the selected period" />
) : (
  <FrameworkList frameworks={data.frameworkAnalytics} />
)}
```

---

## Testing Checklist

- [ ] API returns `frameworkAnalytics` array
- [ ] Progress percentage calculates correctly (0-100)
- [ ] Empty array returned when no data exists
- [ ] Date filters work correctly with `startDate` and `endDate`
- [ ] Multiple frameworks display correctly
- [ ] Progress bars render with correct widths
- [ ] Sorting and filtering work as expected
- [ ] Responsive design on mobile devices

---

## Notes
- `frameworkAnalytics` will be an empty array `[]` if no assessments exist
- Progress percentage is rounded to nearest integer
- Frameworks with no name are excluded from the results
- All existing API fields remain unchanged - this is purely additive

---

## Questions?
Contact backend team for any clarifications or issues.
