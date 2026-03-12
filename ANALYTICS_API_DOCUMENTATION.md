# Analytics API Documentation

## Overview
The Analytics API provides comprehensive insights into assessment compliance metrics, framework-specific distributions, and overall progress tracking. It supports metric-based analytics for both **maturity_level** and **percentage** type frameworks.

---

## Endpoint

**Method:** `GET`  
**URL:** `/api/assessments/analytics`  
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
  compliantControls: number;
  nonCompliantControls: number;
  frameworkAnalytics: Array<{
    frameworkName: string;
    totalAssessments: number;
    completedAssessments: number;
    totalControls: number;
    completedControls: number;
    progressPercentage: number;
    metricType: "maturity_level" | "percentage" | null;
    metricLabel: string | null;
    distribution: Array<{
      value: string;
      label: string;
      count: number;
    }>;
    compliantCount: number;
  }>;
}
```

---

## Response Fields Explanation

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `completedAssessments` | number | Total number of assessments where all controls are closed |
| `compliantControls` | number | Number of closed controls in non-completed assessments |
| `nonCompliantControls` | number | Number of in-progress controls in non-completed assessments |
| `frameworkAnalytics` | array | Detailed analytics per framework |

### Framework Analytics Fields

| Field | Type | Description |
|-------|------|-------------|
| `frameworkName` | string | Name of the framework |
| `totalAssessments` | number | Total assessments for this framework |
| `completedAssessments` | number | Assessments with all controls closed |
| `totalControls` | number | Total controls across all assessments |
| `completedControls` | number | Total closed controls |
| `progressPercentage` | number | Overall progress (completedControls / totalControls * 100) |
| `metricType` | string \| null | Type of compliance metric: "maturity_level" or "percentage" |
| `metricLabel` | string \| null | Display label for the metric (e.g., "Maturity Level", "Compliance Percentage") |
| `distribution` | array | Distribution of assessments across metric values |
| `compliantCount` | number | Count of assessments at the highest metric level (compliant) |

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
  "compliantControls": 45,
  "nonCompliantControls": 12,
  "frameworkAnalytics": [
    {
      "frameworkName": "SAMA CSF",
      "totalAssessments": 28,
      "completedAssessments": 3,
      "totalControls": 150,
      "completedControls": 120,
      "progressPercentage": 80,
      "metricType": "maturity_level",
      "metricLabel": "Maturity Level",
      "distribution": [
        { "value": "1", "label": "Initial", "count": 5 },
        { "value": "2", "label": "Managed", "count": 10 },
        { "value": "3", "label": "Defined", "count": 8 },
        { "value": "4", "label": "Quantitatively Managed", "count": 3 },
        { "value": "5", "label": "Optimizing", "count": 2 }
      ],
      "compliantCount": 2
    },
    {
      "frameworkName": "NCA Cybersecurity Controls",
      "totalAssessments": 15,
      "completedAssessments": 2,
      "totalControls": 80,
      "completedControls": 65,
      "progressPercentage": 81,
      "metricType": "percentage",
      "metricLabel": "Compliance Percentage",
      "distribution": [
        { "value": "0", "label": "0%", "count": 2 },
        { "value": "25", "label": "25%", "count": 3 },
        { "value": "50", "label": "50%", "count": 5 },
        { "value": "75", "label": "75%", "count": 3 },
        { "value": "100", "label": "100%", "count": 2 }
      ],
      "compliantCount": 2
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
  "compliantControls": 25,
  "nonCompliantControls": 8,
  "frameworkAnalytics": [
    {
      "frameworkName": "ISO 27001",
      "totalAssessments": 12,
      "completedAssessments": 3,
      "totalControls": 60,
      "completedControls": 48,
      "progressPercentage": 80,
      "metricType": "maturity_level",
      "metricLabel": "Maturity Level",
      "distribution": [
        { "value": "1", "label": "Initial", "count": 2 },
        { "value": "2", "label": "Managed", "count": 4 },
        { "value": "3", "label": "Defined", "count": 3 },
        { "value": "4", "label": "Quantitatively Managed", "count": 2 },
        { "value": "5", "label": "Optimizing", "count": 1 }
      ],
      "compliantCount": 1
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
  "compliantControls": 0,
  "nonCompliantControls": 0,
  "frameworkAnalytics": []
}
```

---

## Metric Types Explained

### 1. Maturity Level Type

**Used by:** SAMA, ISO 27001, etc.

**Characteristics:**
- Typically 5 levels (1-5)
- Highest level (e.g., "5 - Optimizing") = Compliant
- Distribution shows how many assessments are at each maturity level

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
  ],
  "compliantCount": 2
}
```

**Interpretation:**
- 2 assessments reached the highest maturity level (Optimizing) → Compliant
- 26 assessments are still progressing through lower levels

---

### 2. Percentage Type

**Used by:** NCA, Custom percentage-based frameworks

**Characteristics:**
- Values represent compliance percentage (0%, 25%, 50%, 75%, 100%)
- Highest percentage (e.g., "100%") = Fully Compliant
- Distribution shows how many assessments are at each percentage level

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
  ],
  "compliantCount": 2
}
```

**Interpretation:**
- 2 assessments reached 100% compliance → Fully Compliant
- 13 assessments are at various stages of compliance (0-75%)

---

## Use Cases

### 1. Dashboard Overview
Display high-level metrics:
- Total completed assessments
- Compliant vs non-compliant controls
- Overall progress

### 2. Framework-Specific Charts

**For Maturity Level Frameworks:**
```javascript
// Bar chart showing maturity distribution
const chartData = framework.distribution.map(d => ({
  label: d.label,
  value: d.count
}));

// Highlight compliant count
const compliantLabel = framework.distribution[framework.distribution.length - 1].label;
const compliantCount = framework.compliantCount;
```

**For Percentage Frameworks:**
```javascript
// Pie chart showing compliance distribution
const chartData = framework.distribution.map(d => ({
  label: d.label,
  value: d.count,
  percentage: (d.count / framework.totalAssessments) * 100
}));
```

### 3. Progress Tracking
```javascript
// Calculate overall compliance rate
const complianceRate = (framework.completedControls / framework.totalControls) * 100;

// Show progress bar
<ProgressBar value={framework.progressPercentage} />
```

### 4. Compliance Reporting
```javascript
// Generate compliance report
const report = {
  framework: framework.frameworkName,
  totalAssessments: framework.totalAssessments,
  compliantAssessments: framework.compliantCount,
  complianceRate: (framework.compliantCount / framework.totalAssessments) * 100,
  metricType: framework.metricType
};
```

---

## Frontend Implementation Examples

### Example 1: Display Framework Analytics

```typescript
interface FrameworkAnalytics {
  frameworkName: string;
  totalAssessments: number;
  completedAssessments: number;
  totalControls: number;
  completedControls: number;
  progressPercentage: number;
  metricType: "maturity_level" | "percentage" | null;
  metricLabel: string | null;
  distribution: Array<{
    value: string;
    label: string;
    count: number;
  }>;
  compliantCount: number;
}

function FrameworkAnalyticsCard({ framework }: { framework: FrameworkAnalytics }) {
  return (
    <div className="analytics-card">
      <h3>{framework.frameworkName}</h3>
      
      <div className="stats">
        <div>Total Assessments: {framework.totalAssessments}</div>
        <div>Progress: {framework.progressPercentage}%</div>
        <div>Compliant: {framework.compliantCount}</div>
      </div>
      
      <div className="distribution">
        <h4>{framework.metricLabel} Distribution</h4>
        {framework.distribution.map(item => (
          <div key={item.value} className="distribution-item">
            <span>{item.label}</span>
            <span>{item.count} assessments</span>
            <ProgressBar 
              value={(item.count / framework.totalAssessments) * 100} 
            />
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

### 1. Completed Assessments
An assessment is considered "completed" when **all** its controls have status = "closed".

```
Assessment Group (assesmentId):
  - Control 1: closed
  - Control 2: closed
  - Control 3: closed
→ Assessment is COMPLETED
```

### 2. Compliant/Non-Compliant Controls
Only counted for **non-completed** assessments:
- **Compliant Controls**: Controls with status = "closed"
- **Non-Compliant Controls**: Controls with status = "in_progress"

### 3. Progress Percentage
```
progressPercentage = (completedControls / totalControls) * 100
```

### 4. Metric Distribution
Counts assessments based on their `complianceMetricValue`:
- Groups all assessments by framework
- Counts how many assessments have each metric value
- Includes all possible values from framework's `complianceMetric.values` (even if count = 0)

### 5. Compliant Count
Number of assessments at the **highest metric value**:
- For maturity_level: Last value in values array (e.g., "5")
- For percentage: Last value in values array (e.g., "100")

---

## Filtering Behavior

### Date Filters
- `startDate`: Filters assessments where `assessment.startDate >= startDate`
- `endDate`: Filters assessments where `assessment.dueDate <= endDate`
- Both filters can be used together for a date range

### Assessment Status
- **All statuses included**: open, in_progress, closed, discard
- No status filtering applied by default

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

## Get Assessments by Metric Value (NEW)

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
| `startDate` | number | No | Filter by assessment start date (Unix timestamp in seconds) |
| `endDate` | number | No | Filter by assessment due date (Unix timestamp in seconds) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Note:** Either `frameworkId` OR `frameworkName` must be provided.

---

### Example Requests

#### Example 1: Get SAMA Assessments at Maturity Level 3
```http
GET http://localhost:9000/api/assessments/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=3
```

#### Example 2: Get NCA Assessments at 75% Compliance
```http
GET http://localhost:9000/api/assessments/by-metric?frameworkName=NCA%20Cybersecurity%20Controls&metricValue=75
```

#### Example 3: With Pagination and Date Filters
```http
GET http://localhost:9000/api/assessments/by-metric?frameworkId=507f1f77bcf86cd799439011&metricValue=5&startDate=1704067200&endDate=1735689599&page=1&limit=20
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
    controlId: string;
    controlName: string;
    status: "open" | "in_progress" | "closed" | "discard";
    complianceMetricValue: string;
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
      "controlId": "SAMA-1.1",
      "controlName": "Information Security Governance",
      "status": "in_progress",
      "complianceMetricValue": "3",
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
      "controlId": "SAMA-2.1",
      "controlName": "Risk Management Framework",
      "status": "closed",
      "complianceMetricValue": "3",
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
| `controlId` | string | Control code/identifier |
| `controlName` | string | Control name |
| `status` | string | Assessment status (open, in_progress, closed, discard) |
| `complianceMetricValue` | string | Current metric value for this assessment |
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
- ✅ Per-framework analytics with progress tracking
- ✅ Metric-specific distribution (maturity_level & percentage)
- ✅ Compliant count based on highest metric value
- ✅ Date range filtering
- ✅ All assessment statuses included
- ✅ **NEW: Drill-down to assessment list by metric value**

### Metric Types Supported:
- ✅ `maturity_level`: 5-level maturity model
- ✅ `percentage`: Percentage-based compliance
- ❌ `binary`: Removed
- ❌ `custom`: Removed

### Use This API For:
- Dashboard overview widgets
- Framework-specific compliance charts
- Progress tracking and reporting
- Compliance rate calculations
- Maturity level distribution analysis
- Percentage compliance visualization
- **Detailed assessment lists per metric value**
- **Interactive distribution charts with drill-down**
