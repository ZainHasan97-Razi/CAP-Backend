# Assessment Module - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Module Architecture](#module-architecture)
3. [Common Assessment vs Individual Assessment](#common-assessment-vs-individual-assessment)
4. [Complete User Flows](#complete-user-flows)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Frontend Integration](#frontend-integration)

---

## Overview

The Assessment Module manages compliance assessments for controls across different frameworks. It supports two types of assessments:

1. **Common Assessment**: A single assessment that covers the same control across multiple frameworks
2. **Individual Assessment**: A standalone assessment for a specific control in one framework

### Key Features
- Create assessments with evidence import from previous assessments
- Import evidence during or after assessment creation
- Track assessment status (open, in_progress, closed, discard)
- Manage comments with evidence types (implementation, design, architectural)
- Support for attachments and participants
- Recent assessment history for evidence reuse

---

## Module Architecture

```
Assessment Module
├── Common Assessment Flow
│   ├── Create common assessment (multiple controls)
│   ├── Auto-create individual assessments (all status "open")
│   └── Import evidence separately using import-evidence API
│
└── Individual Assessment Flow
    ├── Create single assessment (status "open")
    ├── Import evidence (using import-evidence API)
    ├── Add comments/evidence
    └── Update status
```

---

## Common Assessment vs Individual Assessment

### Common Assessment

**Purpose**: Assess the same control that exists across multiple frameworks simultaneously.

**Example Scenario**:
- Control "Access Control Policy" exists in:
  - ISO 27001 (Control A.5.1)
  - SOC 2 (CC6.1)
  - NIST CSF (PR.AC-1)
- Create ONE common assessment that covers all three

**Benefits**:
- Single evidence collection for multiple frameworks
- Consistent assessment across frameworks
- Time-saving for common controls

**Database Structure**:
```json
{
  "assesmentId": "uuid-123",  // Same UUID for all related assessments
  "name": "Q1 2024 Access Control Review",
  "control": "ObjectId-ISO-Control",
  "framework": "ObjectId-ISO",
  "status": "in_progress"
}
{
  "assesmentId": "uuid-123",  // Same UUID
  "name": "Q1 2024 Access Control Review",
  "control": "ObjectId-SOC2-Control",
  "framework": "ObjectId-SOC2",
  "status": "in_progress"
}
```

### Individual Assessment

**Purpose**: Assess a single control in one framework.

**Example Scenario**:
- Assess only ISO 27001 Control A.5.1
- No relation to other frameworks

**Benefits**:
- Framework-specific assessment
- Independent evidence collection
- Flexible scheduling

---

## Complete User Flows

### Flow 1: Create Common Assessment (New - No Evidence Import)

```
1. User selects "Create Common Assessment"
2. User selects a common control (shows which frameworks it belongs to)
3. User fills assessment details:
   - Name
   - Description
   - Departments
   - Participants
   - Start/Due dates
4. System creates multiple assessments (one per framework)
   - All share same assesmentId (UUID)
   - All start with status "open"
5. User adds evidence to any one assessment
6. System auto-copies evidence to all related assessments
```

**API Flow**:
```typescript
// Step 1: Get common controls
GET /api/common-control/list

// Step 2: Create assessments for all frameworks
POST /api/assesment/create
{
  "assesmentId": "uuid-123",
  "control": "iso-control-id",
  "framework": "iso-framework-id",
  // ... other fields
}

POST /api/assesment/create
{
  "assesmentId": "uuid-123",  // Same UUID
  "control": "soc2-control-id",
  "framework": "soc2-framework-id",
  // ... other fields
}
```

---

### Flow 2: Create Common Assessment (Then Import Evidence)

```
1. User selects "Create Common Assessment"
2. User selects a common control
3. User fills assessment details
4. System creates multiple assessments with status "open"
5. User opens any one assessment
6. User clicks "Import Evidence" button
7. System shows recent closed assessments
8. User selects source assessment
9. System imports evidence to that assessment
10. User can repeat import for other assessments in the group
```

**API Flow**:
```typescript
// Step 1: Create assessments for all frameworks
POST /api/assesment/create
{
  "assesmentId": "uuid-456",
  "control": "iso-control-id",
  // ... other fields
}
// Status: "open"

// Step 2: Import evidence separately
PATCH /api/assesment/:assessmentId/import-evidence
{
  "sourceAssessmentId": "recent-assessment-id"
}
// Status changes to "in_progress"
```

---

### Flow 3: Create Individual Assessment (New - No Evidence Import)

```
1. User selects "Create Assessment"
2. User selects framework
3. User selects control from that framework
4. User fills assessment details
5. System creates single assessment with status "open"
```

**API Flow**:
```typescript
POST /api/assesment/create
{
  "assesmentId": "uuid-789",
  "control": "control-id",
  "framework": "framework-id",
  "name": "Q1 Security Assessment",
  "description": "...",
  "departments": ["dept-id"],
  "participants": ["user@example.com"],
  "startDate": 1704067200,
  "dueDate": 1735689600
}
```

---

### Flow 4: Create Individual Assessment (Then Import Evidence)

```
1. User selects "Create Assessment"
2. User selects framework and control
3. User fills assessment details
4. System creates assessment with status "open"
5. User clicks "Import Evidence" button
6. System shows recent closed assessments for this control
7. User selects source assessment
8. System imports evidence
9. Status changes to "in_progress"
```

**API Flow**:
```typescript
// Step 1: Create assessment
POST /api/assesment/create
{
  "assesmentId": "uuid-101",
  "control": "control-id",
  "framework": "framework-id",
  // ... other fields
}
// Status: "open"

// Step 2: Import evidence separately
PATCH /api/assesment/:assessmentId/import-evidence
{
  "sourceAssessmentId": "recent-assessment-id"
}
// Status changes to "in_progress"
```

---

### Flow 5: Import Evidence After Assessment Creation

```
1. User opens an existing assessment (status: open or in_progress)
2. User clicks "Import Evidence"
3. System shows recent closed assessments for same control
4. User selects source assessment
5. System imports evidence:
   - If first import: Copies all comments
   - If re-import: Replaces previously imported comments, keeps manual ones
6. System updates status to "in_progress" if it was "open"
```

**API Flow**:
```typescript
// Step 1: Get recent assessments
GET /api/control/details/:controlCode

// Step 2: Import evidence
PATCH /api/assesment/:assessmentId/import-evidence
{
  "sourceAssessmentId": "source-assessment-id"
}

// Response
{
  "message": "Evidence imported successfully",
  "assessment": { /* updated assessment */ },
  "importedItems": {
    "comments": 5,
    "attachments": 3,
    "replacedComments": 2
  }
}
```

---

### Flow 6: Re-import Evidence (Replace Previous Import)

```
1. User has assessment with previously imported evidence
2. User clicks "Import Evidence" again
3. User selects different source assessment
4. System:
   - Deletes comments imported from previous source
   - Keeps manually added comments
   - Imports comments from new source
5. Updates commonAssessmentId reference
```

**Example**:
```
Before:
- Comment 1 (imported from Assessment A)
- Comment 2 (imported from Assessment A)
- Comment 3 (manually added by user)

After re-import from Assessment B:
- Comment 3 (manually added - KEPT)
- Comment 4 (imported from Assessment B)
- Comment 5 (imported from Assessment B)
```

---

## API Reference

### 1. Create Assessment

**Endpoint**: `POST /api/assesment/create`

**Request Body**:
```json
{
  "assesmentId": "uuid-string",
  "name": "Assessment Name",
  "description": "Description",
  "framework": "framework-object-id",
  "control": "control-object-id",
  "departments": ["dept-id-1", "dept-id-2"],
  "participants": ["user1@example.com", "user2@example.com"],
  "attachments": ["url1", "url2"],
  "startDate": 1704067200,
  "dueDate": 1735689600
}
```

**Response**:
```json
{
  "message": "Request success",
  "assesment": {
    "_id": "507f1f77bcf86cd799439015",
    "assesmentId": "uuid-string",
    "status": "open",
    "commonAssessmentId": null,
    // ... other fields
  }
}
```

**Notes**:
- All assessments are created with status "open"
- Use import-evidence API separately to import evidence
- Status will change to "in_progress" after importing evidence or adding comments

---

### 2. Import Evidence

**Endpoint**: `PATCH /api/assesment/:id/import-evidence`

**Request Body**:
```json
{
  "sourceAssessmentId": "507f1f77bcf86cd799439099"
}
```

**Response**:
```json
{
  "message": "Evidence imported successfully",
  "assessment": {
    "_id": "507f1f77bcf86cd799439015",
    "status": "in_progress",
    "commonAssessmentId": "507f1f77bcf86cd799439099",
    // ... other fields
  },
  "importedItems": {
    "comments": 5,
    "attachments": 3,
    "replacedComments": 2
  }
}
```

**Validation Rules**:

The import is allowed if ANY of these conditions are met:

1. **Same Control**: Both assessments have the same control ObjectId
   - Example: Both assess ISO 27001 Control A.5.1

2. **Same Assessment Group**: Both assessments share the same `assesmentId` (UUID)
   - Example: Part of the same common assessment
   - Target: ISO 27001 A.5.1 (assesmentId: `uuid-123`)
   - Source: SOC 2 CC6.1 (assesmentId: `uuid-123`)

3. **Same Common Control**: Both controls belong to the same common control group
   - Example: Import from any assessment of controls in the same common control
   - Target: ISO 27001 A.5.1
   - Source: SOC 2 CC6.1
   - Both are mapped in Common Control "Access Control Policy"

**Business Rules**:
- Only owner can import (createdBy must match)
- Target must be "open" or "in_progress" status
- Cannot import into "closed" or "discard" assessments
- Re-import replaces previously imported comments
- Manually added comments are preserved
- Status changes from "open" to "in_progress" after importItems": {
    "comments": 5,
    "attachments": 3,
    "replacedComments": 2
  }
}
```

**Business Rules**:
- Only owner can import
- Target must be "open" or "in_progress"
- Controls must match
- Replaces previously imported comments
- Keeps manually added comments

---

### 3. Get Assessment Details

**Endpoint**: `GET /api/assesment/:id`

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "assesmentId": "uuid-123",
  "name": "Q1 2024 Access Control Review",
  "description": "...",
  "status": "in_progress",
  "control": "507f1f77bcf86cd799439012",
  "controlId": "A.5.1",
  "controlName": "Access Control Policy",
  "framework": "507f1f77bcf86cd799439011",
  "frameworkName": "ISO 27001",
  "commonAssessmentId": "507f1f77bcf86cd799439099",
  "departments": [
    { "id": "dept-id", "name": "IT Department" }
  ],
  "participants": ["user@example.com"],
  "attachments": ["url1", "url2"],
  "startDate": 1704067200,
  "dueDate": 1735689600,
  "createdBy": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Update Assessment

**Endpoint**: `PUT /api/assesment/:id`

**Request Body**:
```json
{
  "attachments": ["url1", "url2", "url3"],
  "description": "Updated description",
  "status": "closed"
}
```

**Allowed Fields**:
- `attachments`
- `description`
- `status`

---

### 5. Get Assessment Dashboard/List

**Endpoint**: `GET /api/assesment/dashboard`

**Query Parameters**:
```
?status=in_progress
&frameworkType=ISO
&department=dept-id
&search=access
&dateFrom=1704067200
&dateTo=1735689600
&startDateFrom=1704067200
&startDateTo=1735689600
&dueDateFrom=1704067200
&dueDateTo=1735689600
&page=1
&limit=10
```

**Response**:
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "assesmentId": "uuid-123",
      "name": "Q1 2024 Access Control Review",
      "status": "in_progress",
      "controlId": "A.5.1",
      "controlName": "Access Control Policy",
      "frameworkName": "ISO 27001",
      // ... other fields
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

### 6. Get Control Details with Recent Assessments

**Endpoint**: `GET /api/control/details/:controlCode`

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "controlCode": "A.5.1",
  "controlName": "Access Control Policy",
  "frameworkId": "507f1f77bcf86cd799439011",
  "frameworkName": "ISO 27001",
  "recentAssessments": [
    {
      "_id": "507f1f77bcf86cd799439099",
      "name": "Q4 2023 Access Control Review",
      "description": "...",
      "status": "closed",
      "updatedAt": "2023-12-31T00:00:00.000Z",
      "attachments": ["url1", "url2"]
    }
  ]
}
```

**Use Case**: Show recent assessments when creating new assessment or importing evidence

---

### 7. Get Assessment Comments

**Endpoint**: `GET /api/assesment-comment/:assessmentId`

**Response**:
```json
[
  {
    "_id": "comment-id-1",
    "content": "This is a top-level comment",
    "author": "user-id",
    "authorName": "John Doe",
    "attachments": ["url1"],
    "evidenceType": "implementation",
    "importedFrom": "507f1f77bcf86cd799439099",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "replies": [
      {
        "_id": "reply-id-1",
        "content": "This is a reply",
        "author": "user-id-2",
        "authorName": "Jane Smith",
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
]
```

**Comment Fields**:
- `importedFrom`: null = manually added, ObjectId = imported from that assessment
- `evidenceType`: implementation | design | architectural
- `replies`: Nested comments (not copied during import)

---

### 8. Create Comment

**Endpoint**: `POST /api/assesment-comment`

**Request Body**:
```json
{
  "assessmentId": "assessment-id",
  "parentCommentId": null,
  "content": "Comment text",
  "attachments": ["url1"],
  "evidenceType": "implementation"
}
```

**Auto-Status Update**:
- If assessment status is "open" AND (attachments provided OR evidenceType provided)
- Then status changes to "in_progress"

---

### 9. Get Analytics

**Endpoint**: `GET /api/assesment/analytics`

**Query Parameters**:
```
?startDate=1704067200
&endDate=1735689600
```

**Response**:
```json
{
  "completedAssessments": 10,
  "compliantControls": 150,
  "nonCompliantControls": 75,
  "frameworkAnalytics": [
    {
      "frameworkName": "ISO 27001",
      "totalAssessments": 10,
      "completedAssessments": 4,
      "totalControls": 114,
      "completedControls": 80,
      "progressPercentage": 70
    }
  ]
}
```

---

## Database Schema

### Assessment Model

```typescript
{
  assesmentId: String,              // UUID - groups related assessments
  name: String,
  description: String,
  frameworkType: String,            // regulatory_assessment | internal_policy_procedure | international_standards
  framework: ObjectId,              // ref: Framework
  frameworkName: String,
  control: ObjectId,                // ref: Control
  controlId: String,                // Control code
  controlName: String,
  departments: [{
    id: ObjectId,
    name: String
  }],
  participants: [String],           // Email addresses
  attachments: [String],            // URLs
  status: String,                   // open | in_progress | closed | discard
  commonAssessmentId: ObjectId,     // ref: Assesment - source of imported evidence
  startDate: Number,                // Unix timestamp
  dueDate: Number,                  // Unix timestamp
  createdBy: String,                // Username
  createdAt: Date,
  updatedAt: Date
}
```

### Assessment Comment Model

```typescript
{
  assessmentId: ObjectId,           // ref: Assesment
  parentCommentId: ObjectId,        // ref: AssesmentComment (null for top-level)
  content: String,
  author: String,                   // User ID
  authorName: String,
  attachments: [String],            // URLs
  evidenceType: String,             // implementation | design | architectural
  importedFrom: ObjectId,           // ref: Assesment (null = manually added)
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Integration

### Common Assessment Creation Flow

```tsx
const CreateCommonAssessment = () => {
  const [commonControl, setCommonControl] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [selectedRecent, setSelectedRecent] = useState(null);

  // Step 1: Load common controls
  useEffect(() => {
    const loadCommonControls = async () => {
      const controls = await api.get('/common-control/list');
      setCommonControls(controls.data);
    };
    loadCommonControls();
  }, []);

  // Step 2: Load recent assessments when control selected
  useEffect(() => {
    if (commonControl) {
      const loadRecent = async () => {
        // Get recent for first mapped control
        const controlCode = commonControl.mappedControls[0].controlCode;
        const details = await api.get(`/control/details/${controlCode}`);
        setRecentAssessments(details.recentAssessments);
      };
      loadRecent();
    }
  }, [commonControl]);

  // Step 3: Create assessments for all frameworks
  const handleSubmit = async (formData) => {
    const assessmentId = uuidv4();
    
    for (const mappedControl of commonControl.mappedControls) {
      await api.post('/assesment/create', {
        assesmentId: assessmentId,
        control: mappedControl.controlId,
        framework: mappedControl.frameworkId,
        commonAssessmentId: selectedRecent?._id,
        ...formData
      });
    }
    
    toast.success('Common assessment created for all frameworks!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Common control selector */}
      {/* Recent assessment selector (optional) */}
      {/* Form fields */}
    </form>
  );
};
```

### Import Evidence Flow

```tsx
const ImportEvidenceButton = ({ assessment }) => {
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadRecent = async () => {
    const details = await api.get(`/control/details/${assessment.controlId}`);
    setRecentAssessments(details.recentAssessments.filter(a => a._id !== assessment._id));
    setShowModal(true);
  };

  const handleImport = async (sourceId) => {
    const result = await api.patch(
      `/assesment/${assessment._id}/import-evidence`,
      { sourceAssessmentId: sourceId }
    );
    
    toast.success(
      `Imported ${result.importedItems.comments} comments, ` +
      `${result.importedItems.replacedComments} replaced`
    );
    
    setShowModal(false);
    onRefresh();
  };

  return (
    <>
      <button onClick={loadRecent}>Import Evidence</button>
      {showModal && (
        <ImportModal
          assessments={recentAssessments}
          onImport={handleImport}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
```

---

## Key Concepts Summary

### 1. Assessment Grouping
- `assesmentId` (UUID) groups related assessments
- Common assessments share same UUID
- Individual assessments have unique UUID

### 2. Evidence Import Tracking
- `commonAssessmentId`: Which assessment evidence was imported from
- `importedFrom` (in comments): Which assessment this comment came from
- Enables smart re-import (replace only imported, keep manual)

### 3. Evidence Import Validation

The system allows importing evidence between assessments if ANY of these conditions are true:

**Condition 1: Same Control ObjectId**
```
Target Control: 507f1f77bcf86cd799439011
Source Control: 507f1f77bcf86cd799439011
Result: ✅ Allowed
```

**Condition 2: Same Assessment Group (assesmentId)**
```
Target: assesmentId = "uuid-123", control = ISO-A.5.1
Source: assesmentId = "uuid-123", control = SOC2-CC6.1
Result: ✅ Allowed (common assessment)
```

**Condition 3: Same Common Control**
```
Common Control "Access Control" contains:
  - ISO 27001 A.5.1
  - SOC 2 CC6.1
  - NIST CSF PR.AC-1

Target: ISO 27001 A.5.1
Source: SOC 2 CC6.1
Result: ✅ Allowed (both in same common control)
```

**Invalid Example**:
```
Target: ISO 27001 A.5.1 (assesmentId: "uuid-123")
Source: ISO 27001 A.6.1 (assesmentId: "uuid-456")
Result: ❌ Not allowed (different controls, different groups, no common control)
```

### 4. Status Management
- `open`: Created, no evidence yet
- `in_progress`: Has evidence or imported evidence
- `closed`: Assessment completed
- `discard`: Assessment cancelled

### 5. Evidence Types
- `implementation`: How control is implemented
- `design`: Design documentation
- `architectural`: Architecture diagrams/docs

### 6. Comment Tracking
- `importedFrom = null`: Manually added by user (preserved on re-import)
- `importedFrom = ObjectId`: Imported from that assessment (replaced on re-import)

---

## Best Practices

1. **Always show recent assessments** when creating new assessment
2. **Indicate imported vs manual comments** in UI
3. **Warn before re-import** that previous imports will be replaced
4. **Group common assessments** in dashboard by assesmentId
5. **Show evidence count** before importing
6. **Allow preview** of evidence before import
7. **Track audit trail** of imports for compliance

---

## Questions?
Contact backend team for implementation support.
