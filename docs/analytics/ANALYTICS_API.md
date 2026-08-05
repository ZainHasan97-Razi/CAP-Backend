# Analytics API

→ Back to [README](../../README.md)

## Overview
The Analytics API provides comprehensive insights into assessment compliance metrics, framework-specific distributions, and overall progress tracking. It supports metric-based analytics for both **maturity_level** and **percentage** type frameworks.

---

## Endpoints Summary

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/assesment/analytics` | Overall analytics with per-framework distribution |
| GET | `/api/assesment/framework-summaries` | Framework list with average score and distribution (for hover) |
| GET | `/api/assesment/framework-analytics/:frameworkId` | Single-framework graph data with optional domain filter |
| GET | `/api/assesment/by-metric` | Paginated assessment list for a specific metric value |

---

## 1. Analytics

**Method:** `GET`  
**URL:** `/api/assesment/analytics`  
**Authentication:** Required (Protected route)

---

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | number | No | Filter assessments by start date (Unix timestamp in seconds) |
| `endDate` | number | No | Filter assessments by due date (Unix timestamp in seconds) |

**Example:**
```
GET http://localhost:9000/api/assessments/analytics?startDate=1704067200&endDate=1735689599
```

---

## Response Structure

```typescript
{
  completedAssessments: number;
  frameworkAnalytics: Array<{
    frameworkId: string;
    frameworkName: string;
    totalApplicableControls: number;
    metricType: "maturity_level" | "percentage" | null;
    metricLabel: string | null;
    distribution: Array<{
      value: string;
      label: string;
      count: number;
    }>;
  }>;
}
```

---

## Response Fields Explanation

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `completedAssessments` | number | Total number of assessments where all controls are closed |
| `frameworkAnalytics` | array | Detailed analytics per framework |

### Framework Analytics Fields

| Field | Type | Description |
|-------|------|-------------|
| `frameworkId` | string | Framework MongoDB ObjectId |
| `frameworkName` | string | Name of the framework |
| `totalApplicableControls` | number | Total number of applicable controls |
| `metricType` | string \| null | Type of compliance metric: "maturity_level" or "percentage" |
| `metricLabel` | string \| null | Display label for the metric |
| `distribution` | array | Distribution of assessments across metric values |

### Distribution Object

| Field | Type | Description |
|-------|------|-------------|
| `value` | string | The metric value (e.g., "1", "2", "50", "100") |
| `label` | string | Display label for the value (e.g., "Initial", "50%") |
| `count` | number | Number of assessments with this metric value |

---

## Example Responses

### Example 1: Mixed Framework Types (Maturity Level + Percentage)

**Request:**
```http
GET http://localhost:9000/api/assessments/analytics
```

**Response:**
```json
{
  "completedAssessments": 5,
  "frameworkAnalytics": [
    {
      "frameworkId": "507f1f77bcf86cd799439011",
      "frameworkName": "SAMA CSF",
      "totalApplicableControls": 28,
      "metricType": "maturity_level",
      "metricLabel": "Maturity Level",
      "distribution": [
        { "value": "1", "label": "Initial", "count": 5 },
        { "value": "2", "label": "Managed", "count": 10 },
        { "value": "3", "label": "Defined", "count": 8 },
        { "value": "4", "label": "Quantitatively Managed", "count": 3 },
        { "value": "5", "label": "Optimizing", "count": 2 }
      ]
    },
    {
      "frameworkId": "507f1f77bcf86cd799439022",
      "frameworkName": "NCA Cybersecurity Controls",
      "totalApplicableControls": 15,
      "metricType": "percentage",
      "metricLabel": "Compliance Percentage",
      "distribution": [
        { "value": "0", "label": "0%", "count": 2 },
        { "value": "25", "label": "25%", "count": 3 },
        { "value": "50", "label": "50%", "count": 5 },
        { "value": "75", "label": "75%", "count": 3 },
        { "value": "100", "label": "100%", "count": 2 }
      ]
    }
  ]
}
```

---

### Example 2: With Date Filters

**Request:**
```http
GET http://localhost:9000/api/assessments/analytics?startDate=1704067200&endDate=1735689599
```

**Response:**
```json
{
  "completedAssessments": 3,
  "frameworkAnalytics": [
    {
      "frameworkId": "507f1f77bcf86cd799439033",
      "frameworkName": "ISO 27001",
      "totalApplicableControls": 12,
      "metricType": "maturity_level",
      "metricLabel": "Maturity Level",
      "distribution": [
        { "value": "1", "label": "Initial", "count": 2 },
        { "value": "2", "label": "Managed", "count": 4 },
        { "value": "3", "label": "Defined", "count": 3 },
        { "value": "4", "label": "Quantitatively Managed", "count": 2 },
        { "value": "5", "label": "Optimizing", "count": 1 }
      ]
    }
  ]
}
```

---

### Example 3: No Data

**Request:**
```http
GET http://localhost:9000/api/assessments/analytics?startDate=1893456000
```

**Response:**
```json
{
  "completedAssessments": 0,
  "frameworkAnalytics": []
}
```

---

## Metric Types Explained

### 1. Maturity Level Type

**Used by:** SAMA, ISO 27001, etc.

**Example Distribution:**
```json
{
  "metricType": "maturity_level",
  "metricLabel": "Maturity Level",
  "distribution": [
    { "value": "1", "label": "Initial", "count": 5 },
    { "value": "2", "label": "Managed", "count": 10 },
    { "value": "3", "label": "Defined", "count": 8 },
    { "value": "4", "label": "Quantitatively Managed", "count": 3 },
    { "value": "5", "label": "Optimizing", "count": 2 }
  ]
}
```

---

### 2. Percentage Type

**Used by:** NCA, Custom percentage-based frameworks

**Example Distribution:**
```json
{
  "metricType": "percentage",
  "metricLabel": "Compliance Percentage",
  "distribution": [
    { "value": "0", "label": "0%", "count": 2 },
    { "value": "25", "label": "25%", "count": 3 },
    { "value": "50", "label": "50%", "count": 5 },
    { "value": "75", "label": "75%", "count": 3 },
    { "value": "100", "label": "100%", "count": 2 }
  ]
}
```

---

## Use Cases

### 1. Dashboard Overview
Display high-level metrics:
- Total completed assessments
- Distribution per framework

### 2. Framework-Specific Charts

**For Maturity Level Frameworks:**
```javascript
const chartData = framework.distribution.map(d => ({
  label: d.label,
  value: d.count
}));
```

**For Percentage Frameworks:**
```javascript
const chartData = framework.distribution.map(d => ({
  label: d.label,
  value: d.count,
  percentage: (d.count / framework.totalApplicableControls) * 100
}));
```

---

## Frontend Implementation Examples

### Example 1: Display Framework Analytics

```typescript
interface FrameworkAnalytics {
  frameworkId: string;
  frameworkName: string;
  totalApplicableControls: number;
  metricType: "maturity_level" | "percentage" | null;
  metricLabel: string | null;
  distribution: Array<{
    value: string;
    label: string;
    count: number;
  }>;
}

function FrameworkAnalyticsCard({ framework }: { framework: FrameworkAnalytics }) {
  return (
    <div className="analytics-card">
      <h3>{framework.frameworkName}</h3>
      <div className="stats">
        <div>Total Applicable Controls: {framework.totalApplicableControls}</div>
      </div>
      <div className="distribution">
        <h4>{framework.metricLabel} Distribution</h4>
        {framework.distribution.map(item => (
          <div key={item.value} className="distribution-item">
            <span>{item.label}</span>
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Maturity Level Chart

```typescript
function MaturityLevelChart({ framework }: { framework: FrameworkAnalytics }) {
  if (framework.metricType !== 'maturity_level') return null;
  
  const chartData = framework.distribution.map(d => ({
    name: d.label,
    value: d.count,
    isCompliant: d.value === framework.distribution[framework.distribution.length - 1].value
  }));
  
  return (
    <BarChart data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar 
        dataKey="value" 
        fill={(entry) => entry.isCompliant ? '#10b981' : '#3b82f6'}
      />
    </BarChart>
  );
}
```

### Example 3: Percentage Compliance Pie Chart

```typescript
function CompliancePieChart({ framework }: { framework: FrameworkAnalytics }) {
  if (framework.metricType !== 'percentage') return null;
  
  const chartData = framework.distribution
    .filter(d => d.count > 0)
    .map(d => ({
      name: d.label,
      value: d.count
    }));
  
  return (
    <PieChart>
      <Pie 
        data={chartData} 
        dataKey="value" 
        nameKey="name"
        label
      />
    </PieChart>
  );
}
```

---

## Calculation Logic

### Metric Distribution
Counts assessments based on their `complianceMetricValue`:
- Groups all assessments by framework
- Counts how many assessments have each metric value
- Includes all possible values from framework's `complianceMetric.values` (even if count = 0)

---

## Filtering Behavior

### Date Filters
- `startDate`: Filters assessments where `assessment.startDate >= startDate`
- `endDate`: Filters assessments where `assessment.dueDate <= endDate`
- Both filters can be used together for a date range

### Assessment Status
- **Only `closed` assessments are included** in all analytics and distribution calculations. Open, in-progress, and drafted assessments are excluded — there is no point showing metric distributions for assessments that haven't been completed yet.

---

## Error Responses

### 400 Bad Request - Invalid Parameters

```json
{
  "errors": [
    {
      "field": "startDate",
      "message": "Start date must be a valid timestamp"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

---

## Performance Considerations

1. **Large Datasets**: The API fetches all assessments matching the filters. For very large datasets, consider:
   - Using date filters to limit the scope
   - Implementing caching on the frontend
   - Adding pagination if needed

2. **Framework Lookup**: The API fetches framework details to get compliance metric configurations. This is optimized with a single query for all frameworks.

3. **Distribution Calculation**: Performed in-memory after fetching assessments. Efficient for typical dataset sizes.

---

## Testing Examples

### Test 1: Basic Analytics
```bash
curl -X GET http://localhost:9000/api/assessments/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: With Date Range
```bash
curl -X GET "http://localhost:9000/api/assessments/analytics?startDate=1704067200&endDate=1735689599" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 3: Year 2024 Only
```bash
# January 1, 2024 00:00:00 = 1704067200
# December 31, 2024 23:59:59 = 1735689599
curl -X GET "http://localhost:9000/api/assessments/analytics?startDate=1704067200&endDate=1735689599" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2. Framework Summaries

**Method:** `GET`  
**URL:** `/api/assesment/framework-summaries`  
**Authentication:** Required (Protected route)

Returns a list of all frameworks with their summary score and distribution. Use this to populate the framework cards on the dashboard. The `distribution` field is intended for hover tooltips.

The response shape differs by `metricType` — `percentage` frameworks use status-based completion, while `maturity_level` frameworks use metric value averages.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|--------------|
| `startDate` | number | No | Filter by assessment start date (Unix timestamp in seconds) |
| `endDate` | number | No | Filter by assessment due date (Unix timestamp in seconds) |

> Uses the same date filters as the analytics endpoint so both stay in sync with the page-level date filter.

### Response Structure

```typescript
// percentage frameworks
Array<{
  frameworkId: string;
  frameworkName: string;
  metricType: "percentage";
  metricLabel: string | null;
  totalApplicableControls: number;
  completionPercentage: number;
  distribution: Array<{
    status: "open" | "in_progress" | "closed";
    count: number;
  }>;
}>

// maturity_level frameworks
Array<{
  frameworkId: string;
  frameworkName: string;
  metricType: "maturity_level";
  metricLabel: string | null;
  totalApplicableControls: number;
  averageScore: number | null;
  dominantValue: string | null;
  distribution: Array<{
    value: string;
    label: string;
    count: number;
  }>;
}>
```

### Response Fields

#### Common Fields (all frameworks)

| Field | Type | Description |
|-------|------|-------------|
| `frameworkId` | string | Framework MongoDB ObjectId |
| `frameworkName` | string | Name of the framework |
| `metricType` | string \| null | `maturity_level` or `percentage` |
| `metricLabel` | string \| null | Display label for the metric |
| `totalApplicableControls` | number | Total number of applicable controls |

#### `percentage` type only

| Field | Type | Description |
|-------|------|-------------|
| `completionPercentage` | number | `(closed / total) * 100`, rounded to nearest integer |
| `distribution` | array | Status counts: `[{ status, count }]` for `open`, `in_progress`, `closed` |

#### `maturity_level` type only

| Field | Type | Description |
|-------|------|-------------|
| `averageScore` | number \| null | **`maturity_level` only.** Weighted average: `(ML1*nc1 + ML2*nc2 + ... + MLn*ncn) / (nc1+nc2+...+ncn)`. Excludes controls at value `"0"` (unassessed/default) and `null` from both numerator and denominator. `null` when all controls are at `"0"` or unassessed, or when values are non-numeric |
| `dominantValue` | string \| null | Label of the most common value when metric values are non-numeric. `null` when values are numeric |
| `distribution` | array | Count per metric value: `[{ value, label, count }]` (all possible values included, even if count = 0) |

### Calculation Logic

#### `percentage` — Status-based completion
```
completionPercentage = (closedCount / totalAssessments) * 100

Example: 28 closed, 9 in_progress, 8 open out of 45 total
  completionPercentage = round(28 / 45 * 100) = 62
```

#### `maturity_level` — Weighted average excluding zero

> **Applies only to frameworks where `complianceMetric.type === "maturity_level"`.**
> `percentage` type frameworks use status-based `completionPercentage` instead and never return `averageScore`.

```
averageScore = (ML1*nc1 + ML2*nc2 + ... + MLn*ncn) / (nc1 + nc2 + ... + ncn)

Where:
  MLx  = numeric maturity level value (e.g. 1, 2, 3, 4, 5)
  ncx  = number of controls at that level

Excludes: value "0" (default/unassessed) and null from both numerator and denominator.
Controls still at "0" are counted in the distribution bar chart but NOT in the average.

Example — 10 controls: 3 at L1, 4 at L3, 2 at L5, 1 at L0 (excluded)
  averageScore = (1*3 + 3*4 + 5*2) / (3 + 4 + 2)
               = (3 + 12 + 10) / 9
               = 25 / 9
               = 2.78

If ALL controls are at "0" or null → averageScore = null
```

Non-numeric example (values like `"implemented"`, `"not-implemented"`):
```
averageScore = null
dominantValue = label of the value with the highest count ("0" included in this fallback)
```

### Score Display Logic

```typescript
function getScoreDisplay(framework) {
  if (framework.metricType === 'percentage') {
    return `${framework.completionPercentage}%`;     // e.g. "62%"
  }
  // maturity_level
  if (framework.averageScore !== null) {
    const max = framework.distribution.length - 1;  // max level derived from values count
    return `${framework.averageScore} / ${max}`;    // e.g. "2.78 / 5"
  }
  return framework.dominantValue ?? 'N/A';           // e.g. "Partially Implemented"
}
```

### Example Request

```http
GET http://localhost:9000/api/assesment/framework-summaries?startDate=1704067200&endDate=1735689599
```

### Example Response

```json
[
  {
    "frameworkId": "507f1f77bcf86cd799439011",
    "frameworkName": "SAMA Cybersecurity Framework",
    "metricType": "maturity_level",
    "metricLabel": "Maturity Level",
    "totalApplicableControls": 5,
    "averageScore": 2.78,
    "dominantValue": null,
    "distribution": [
      { "value": "1", "label": "Initial", "count": 2 },
      { "value": "2", "label": "Managed", "count": 0 },
      { "value": "3", "label": "Defined", "count": 1 },
      { "value": "4", "label": "Quantitatively Managed", "count": 0 },
      { "value": "5", "label": "Optimizing", "count": 2 }
    ]
  },
  {
    "frameworkId": "507f1f77bcf86cd799439022",
    "frameworkName": "NCA Cybersecurity Controls",
    "metricType": "percentage",
    "metricLabel": "Compliance Percentage",
    "totalApplicableControls": 45,
    "completionPercentage": 62,
    "distribution": [
      { "status": "open", "count": 8 },
      { "status": "in_progress", "count": 9 },
      { "status": "closed", "count": 28 }
    ]
  }
]
```

### Frontend Usage

```typescript
function FrameworkCard({ framework }) {
  const scoreDisplay = framework.metricType === 'percentage'
    ? `${framework.completionPercentage}%`
    : framework.averageScore !== null
      ? `${framework.averageScore} / 5`
      : framework.dominantValue ?? 'N/A';

  const tooltipContent = framework.metricType === 'percentage'
    ? framework.distribution.map(d => `${d.status}: ${d.count}`)
    : framework.distribution.map(d => `${d.label}: ${d.count}`);

  return (
    <Tooltip content={tooltipContent.join(', ')}>
      <div className="framework-card">
        <h3>{framework.frameworkName}</h3>
        <p>{framework.metricLabel}: {scoreDisplay}</p>
      </div>
    </Tooltip>
  );
}
```

### Testing

```bash
# Basic
curl -X GET http://localhost:9000/api/assesment/framework-summaries \
  -H "Authorization: Bearer YOUR_TOKEN"

# With date range
curl -X GET "http://localhost:9000/api/assesment/framework-summaries?startDate=1704067200&endDate=1735689599" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3. Framework Analytics (Per-Graph Domain Filter)

**Method:** `GET`  
**URL:** `/api/assesment/framework-analytics/:frameworkId`  
**Authentication:** Required (Protected route)

Returns distribution data for a **single framework**, with an optional `domainCode` filter. Use this when the user selects a domain filter on a specific graph — call this endpoint for that graph only, leaving other graphs untouched.

### When to use this vs `/framework-summaries`

| Scenario | Endpoint |
|----------|----------|
| Initial page load — render all framework graphs | `GET /framework-summaries` |
| User picks a domain filter on one specific graph | `GET /framework-analytics/:frameworkId?domainCode=3.1` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|--------------|
| `domainCode` | string | No | Filter assessments to controls under this domain (e.g. `3.1`) |
| `startDate` | number | No | Filter by assessment start date (Unix timestamp in seconds) |
| `endDate` | number | No | Filter by assessment due date (Unix timestamp in seconds) |

### Response Structure

```typescript
{
  frameworkId: string;
  frameworkName: string;
  metricType: "maturity_level" | "percentage" | null;
  metricLabel: string | null;
  totalApplicableControls: number;
  distribution: Array<{
    value: string;
    label: string;
    count: number;
  }>;
  appliedDomainCode: string | null;
  availableDomains: Array<{
    domainCode: string;
    domainName: string;
  }>;
}
```

### Example Requests

```http
// No filter — full framework data (same as framework-summaries for this framework)
GET /api/assesment/framework-analytics/507f1f77bcf86cd799439011

// Filtered by domain
GET /api/assesment/framework-analytics/507f1f77bcf86cd799439011?domainCode=3.1

// With date range
GET /api/assesment/framework-analytics/507f1f77bcf86cd799439011?domainCode=3.1&startDate=1704067200&endDate=1735689599
```

### Example Response

```json
{
  "frameworkId": "507f1f77bcf86cd799439011",
  "frameworkName": "SAMA Cybersecurity Framework",
  "metricType": "maturity_level",
  "metricLabel": "Maturity Level",
  "totalApplicableControls": 12,
  "distribution": [
    { "value": "1", "label": "Initial", "count": 3 },
    { "value": "2", "label": "Managed", "count": 4 },
    { "value": "3", "label": "Defined", "count": 2 },
    { "value": "4", "label": "Quantitatively Managed", "count": 1 },
    { "value": "5", "label": "Optimizing", "count": 2 }
  ],
  "appliedDomainCode": "3.1",
  "availableDomains": [
    { "domainCode": "3.1", "domainName": "Cyber Security Leadership and Governance" },
    { "domainCode": "3.2", "domainName": "Cyber Security Risk Management" },
    { "domainCode": "3.3", "domainName": "Cyber Security Operations" }
  ]
}
```

### Frontend Implementation

**Flow:**
```
Page load:
  GET /framework-summaries  →  render all framework graphs

User selects domain "3.1" on SAMA graph:
  GET /framework-analytics/:samaId?domainCode=3.1  →  update only SAMA graph

User selects domain "2.0" on NCA graph:
  GET /framework-analytics/:ncaId?domainCode=2.0   →  update only NCA graph

User clears domain filter on SAMA graph:
  GET /framework-analytics/:samaId  →  back to full data for that graph
```

**Domain dropdown:** The `availableDomains` array in the response is always the full list of domains for that framework (unaffected by the filter). Use it to populate the domain filter dropdown on each graph.

**Important:** When a `domainCode` filter is active on a graph, pass the same `domainCode` to `/api/assesment/by-metric` when the user clicks a bar to open the popup list — so the popup shows only assessments from that domain.

```
User clicks bar on SAMA graph (domainCode=3.1 active):
  GET /api/assesment/by-metric?frameworkId=<id>&metricValue=3&domainCode=3.1
                                                               ↑ same domain filter
```

```typescript
const [graphData, setGraphData] = useState(initialSummaryData); // from /framework-summaries
const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

const handleDomainChange = async (domainCode: string | null) => {
  setSelectedDomain(domainCode);
  const url = domainCode
    ? `/api/assesment/framework-analytics/${frameworkId}?domainCode=${domainCode}`
    : `/api/assesment/framework-analytics/${frameworkId}`;
  const result = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  setGraphData(await result.json());
};
```

---

## 4. Get Assessments by Metric Value

### Overview
This endpoint returns a paginated list of assessments for a specific framework and metric value. Use this when users click on a distribution stat in the analytics dashboard to see the detailed list of assessments.

**Method:** `GET`  
**URL:** `/api/assessments/by-metric`  
**Authentication:** Required (Protected route)

---

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metricValue` | string | Yes | The metric value to filter by (e.g., "3", "75", "100") |
| `frameworkId` | string | Conditional | MongoDB ObjectId of the framework (required if frameworkName not provided) |
| `frameworkName` | string | Conditional | Name of the framework (required if frameworkId not provided) |
| `domainCode` | string | No | Filter results to controls under this domain (e.g. `3.1`) |
| `startDate` | number | No | Filter by assessment start date (Unix timestamp in seconds) |
| `endDate` | number | No | Filter by assessment due date (Unix timestamp in seconds) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Note:** Either `frameworkId` OR `frameworkName` must be provided.

---

### Example Requests

#### Example 1: Get SAMA Assessments at Maturity Level 3
```http
GET /api/assesment/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=3
```

#### Example 2: Get NCA Assessments at 75% Compliance
```http
GET /api/assesment/by-metric?frameworkName=NCA%20Cybersecurity%20Controls&metricValue=75
```

#### Example 3: Filtered by Domain Code
```http
GET /api/assesment/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=3&domainCode=3.1
```

#### Example 4: With Pagination and Date Filters
```http
GET /api/assesment/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=5&startDate=1704067200&endDate=1735689599&page=1&limit=20
```

---

### Response Structure

```typescript
{
  data: Array<{
    _id: string;
    assesmentId: string;
    name: string;
    description: string;
    frameworkName: string;
    framework: string;
    controlId: string;         // control code e.g. "3.1.1-1"
    controlName: string;
    domainCode: string | null;
    domainName: string | null;
    subdomainCode: string | null;
    subdomainName: string | null;
    status: "open" | "in_progress" | "closed" | "discard";
    complianceMetricValue: string;
    auditorNotes: string | null;
    startDate: number;
    dueDate: number;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  metricInfo: {
    frameworkName: string;
    frameworkId: string;
    metricType: "maturity_level" | "percentage";
    metricLabel: string;
    metricValue: string;
    metricValueLabel: string;
  } | null;
}
```

---

### Response Example

**Request:**
```http
GET http://localhost:9000/api/assessments/by-metric?frameworkName=SAMA%20CSF&metricValue=3&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "assesmentId": "ASM-2024-001",
      "name": "Q1 2024 SAMA Assessment",
      "description": "Quarterly compliance assessment for information security governance",
      "frameworkName": "SAMA CSF",
      "framework": "507f1f77bcf86cd799439011",
      "controlId": "3.1.1-1",
      "controlName": "Information Security Governance",
      "domainCode": "3.1",
      "domainName": "Cyber Security Leadership and Governance",
      "subdomainCode": "3.1.1",
      "subdomainName": "Cyber Security Governance",
      "status": "in_progress",
      "complianceMetricValue": "3",
      "auditorNotes": null,
      "startDate": 1705305600,
      "dueDate": 1707984000,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-02-10T14:20:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "assesmentId": "ASM-2024-002",
      "name": "Q1 2024 SAMA Risk Management",
      "description": "Risk management framework assessment",
      "frameworkName": "SAMA CSF",
      "framework": "507f1f77bcf86cd799439011",
      "controlId": "3.1.2-1",
      "controlName": "Risk Management Framework",
      "domainCode": "3.1",
      "domainName": "Cyber Security Leadership and Governance",
      "subdomainCode": "3.1.2",
      "subdomainName": "Risk Management",
      "status": "closed",
      "complianceMetricValue": "3",
      "auditorNotes": "Controls verified against policy documentation.",
      "startDate": 1705392000,
      "dueDate": 1708070400,
      "createdAt": "2024-01-16T10:30:00.000Z",
      "updatedAt": "2024-02-15T16:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  },
  "metricInfo": {
    "frameworkName": "SAMA CSF",
    "frameworkId": "507f1f77bcf86cd799439011",
    "metricType": "maturity_level",
    "metricLabel": "Maturity Level",
    "metricValue": "3",
    "metricValueLabel": "Defined"
  }
}
```

---

### Response Fields

#### Data Array Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | Assessment MongoDB ObjectId |
| `assesmentId` | string | Assessment identifier (can be same for grouped assessments) |
| `name` | string | Assessment name |
| `description` | string | Assessment description |
| `frameworkName` | string | Name of the framework |
| `framework` | string | Framework MongoDB ObjectId |
| `controlId` | string | Control code (e.g. "3.1.1-1") |
| `controlName` | string | Control name |
| `domainCode` | string \| null | Domain code from the control (e.g. "3.1") |
| `domainName` | string \| null | Domain name from the control |
| `subdomainCode` | string \| null | Subdomain code (null if framework has no subdomains) |
| `subdomainName` | string \| null | Subdomain name (null if framework has no subdomains) |
| `status` | string | Assessment status: `open` \| `in_progress` \| `closed` \| `discard` |
| `complianceMetricValue` | string | Current metric value for this assessment |
| `auditorNotes` | string \| null | Free-text notes added by the auditor (null if not set) |
| `startDate` | number | Assessment start date (Unix timestamp) |
| `dueDate` | number | Assessment due date (Unix timestamp) |
| `createdAt` | string | ISO 8601 timestamp |
| `updatedAt` | string | ISO 8601 timestamp |

#### Metric Info Fields

| Field | Type | Description |
|-------|------|-------------|
| `frameworkName` | string | Name of the framework |
| `frameworkId` | string | Framework MongoDB ObjectId |
| `metricType` | string | Type of metric (maturity_level or percentage) |
| `metricLabel` | string | Display label for the metric |
| `metricValue` | string | The filtered metric value |
| `metricValueLabel` | string | Display label for the metric value |

---

### Use Cases

#### 1. Modal/Drawer on Distribution Click

**Scenario:** User clicks on "Level 3 - Defined (8 assessments)" in SAMA analytics chart

```typescript
function handleDistributionClick(frameworkId: string, metricValue: string) {
  // Fetch assessments for this metric value
  const response = await fetch(
    `/api/assessments/by-metric?frameworkId=${frameworkId}&metricValue=${metricValue}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  const data = await response.json();
  
  // Show modal with assessment list
  showModal({
    title: `${data.metricInfo.metricValueLabel} Assessments`,
    subtitle: `${data.metricInfo.frameworkName} - ${data.metricInfo.metricLabel}`,
    assessments: data.data,
    pagination: data.pagination
  });
}
```

#### 2. Detailed Assessment List Component

```typescript
interface AssessmentListModalProps {
  frameworkId: string;
  metricValue: string;
  onClose: () => void;
}

function AssessmentListModal({ frameworkId, metricValue, onClose }: AssessmentListModalProps) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchAssessments(frameworkId, metricValue, page);
  }, [frameworkId, metricValue, page]);
  
  const fetchAssessments = async (fwId: string, value: string, p: number) => {
    const response = await fetch(
      `/api/assessments/by-metric?frameworkId=${fwId}&metricValue=${value}&page=${p}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const result = await response.json();
    setData(result);
  };
  
  if (!data) return <Loading />;
  
  return (
    <Modal onClose={onClose}>
      <ModalHeader>
        <h2>{data.metricInfo.metricValueLabel} Assessments</h2>
        <p>{data.metricInfo.frameworkName} - {data.metricInfo.metricLabel}</p>
      </ModalHeader>
      
      <ModalBody>
        <AssessmentTable assessments={data.data} />
      </ModalBody>
      
      <ModalFooter>
        <Pagination 
          current={data.pagination.page}
          total={data.pagination.pages}
          onChange={setPage}
        />
      </ModalFooter>
    </Modal>
  );
}
```

#### 3. Clickable Distribution Chart

```typescript
function DistributionChart({ framework }: { framework: FrameworkAnalytics }) {
  const handleBarClick = (metricValue: string) => {
    // Open modal with assessments for this metric value
    openAssessmentModal(framework.frameworkId, metricValue);
  };
  
  return (
    <BarChart data={framework.distribution}>
      <Bar 
        dataKey="count" 
        onClick={(data) => handleBarClick(data.value)}
        style={{ cursor: 'pointer' }}
      />
    </BarChart>
  );
}
```

---

### Error Responses

#### 400 Bad Request - Missing Required Parameters

```json
{
  "errors": [
    {
      "message": "Either frameworkId or frameworkName is required"
    }
  ]
}
```

#### 400 Bad Request - Invalid Metric Value

```json
{
  "errors": [
    {
      "field": "metricValue",
      "message": "Metric value is required"
    }
  ]
}
```

#### 400 Bad Request - Invalid Framework ID

```json
{
  "errors": [
    {
      "field": "frameworkId",
      "message": "Framework ID must be a valid MongoDB ObjectId"
    }
  ]
}
```

#### 500 Internal Server Error

```json
{
  "error": "Either frameworkId or frameworkName is required"
}
```

---

### Testing Examples

#### Test 1: By Framework ID
```bash
curl -X GET "http://localhost:9000/api/assessments/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 2: By Framework Name
```bash
curl -X GET "http://localhost:9000/api/assessments/by-metric?frameworkName=SAMA%20CSF&metricValue=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 3: With Pagination
```bash
curl -X GET "http://localhost:9000/api/assessments/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=3&page=2&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 4: With Date Filters
```bash
curl -X GET "http://localhost:9000/api/assessments/by-metric?frameworkName=NCA%20Cybersecurity%20Controls&metricValue=100&startDate=1704067200&endDate=1735689599" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER VIEWS ANALYTICS DASHBOARD                          │
│    GET /api/assessments/analytics                           │
│                                                             │
│    Response shows:                                          │
│    - SAMA CSF: Level 3 (8 assessments)                     │
│    - NCA: 75% (3 assessments)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. USER CLICKS ON "LEVEL 3 (8 ASSESSMENTS)"                │
│    Trigger: onClick handler                                 │
│    Data: frameworkId, metricValue="3"                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. FRONTEND CALLS BY-METRIC ENDPOINT                        │
│    GET /api/assessments/by-metric                           │
│    ?frameworkId=507f1f77bcf86cd799439011&metricValue=3      │
│                                                             │
│    Response: List of 8 assessments at Level 3              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SHOW MODAL/DRAWER WITH ASSESSMENT LIST                  │
│    Title: "Defined (Level 3) Assessments"                   │
│    Subtitle: "SAMA CSF - Maturity Level"                    │
│    Table: 8 assessments with details                        │
│    Pagination: 1 page (8 items)                            │
└─────────────────────────────────────────────────────────────┘
```

---

### Performance Notes

1. **Indexed Query**: Queries use `complianceMetricValue` and `framework` fields which should be indexed for performance
2. **Pagination**: Default limit of 10 items prevents large response payloads
3. **Selective Fields**: Only essential fields are returned to minimize data transfer
4. **Framework Lookup**: Single query to get framework details for metricInfo

---

### Best Practices

1. **Use Framework ID when available**: More efficient than framework name lookup
2. **Implement pagination**: Don't fetch all assessments at once
3. **Cache framework details**: Store metricInfo to avoid repeated lookups
4. **Handle empty results**: Show appropriate message when no assessments found
5. **Add loading states**: Show spinner while fetching data
6. **Error handling**: Display user-friendly error messages

---

## Summary

### Key Features:
- ✅ Overall assessment completion metrics
- ✅ Per-framework analytics with distribution
- ✅ Metric-specific distribution (maturity_level & percentage)
- ✅ Total applicable controls per framework
- ✅ Date range filtering
- ✅ Only `closed` assessments included in all distribution calculations
- ✅ Framework list with average score and hover distribution
- ✅ Per-graph domain filtering via `/framework-analytics/:frameworkId`
- ✅ Available domains list returned for dropdown population
- ✅ Drill-down to assessment list by metric value

### Metric Types Supported:
- ✅ `maturity_level`: 5-level maturity model
- ✅ `percentage`: Percentage-based compliance
- ❌ `binary`: Removed
- ❌ `custom`: Removed

### Use This API For:
- Dashboard overview widgets
- Framework cards with average score display
- Hover tooltips showing distribution breakdown
- Framework-specific compliance charts
- Progress tracking and reporting
- Compliance rate calculations
- Maturity level distribution analysis
- Percentage compliance visualization
- Detailed assessment lists per metric value
- Interactive distribution charts with drill-down
