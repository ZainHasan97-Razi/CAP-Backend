# Create Assessment API Documentation

## Overview
API endpoint to create a new assessment with optional evidence copying from a recent/previous assessment.

---

## API Endpoint
**POST** `/api/assesment`

**Authentication:** Required (Bearer Token)

---

## Request Body

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `assesmentId` | string | UUID to group multiple controls under one assessment | `"uuid-123-456-789"` |
| `name` | string | Assessment name | `"Q1 2024 Security Assessment"` |
| `description` | string | Assessment description | `"Quarterly security review"` |
| `framework` | string | Framework ObjectId | `"507f1f77bcf86cd799439011"` |
| `control` | string | Control ObjectId | `"507f1f77bcf86cd799439012"` |
| `departments` | string[] | Array of department ObjectIds | `["507f...", "608f..."]` |
| `startDate` | number | Start date (Unix timestamp in seconds) | `1704067200` |
| `dueDate` | number | Due date (Unix timestamp in seconds) | `1735689600` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `commonAssessmentId` | string | Recent assessment ObjectId to copy evidence from | `"507f1f77bcf86cd799439013"` |
| `participants` | string[] | Array of participant email addresses | `["user@example.com"]` |
| `attachments` | string[] | Array of attachment URLs | `["https://s3.../file.pdf"]` |

---

## Two Creation Modes

### Mode 1: Create New Assessment (Default)
When `commonAssessmentId` is **NOT** provided:
- Assessment is created with status **"open"**
- No evidence/comments are copied
- User starts from scratch

### Mode 2: Create from Recent Assessment
When `commonAssessmentId` **IS** provided:
- Assessment is created with status **"in_progress"**
- Evidence/comments are copied from the recent assessment
- User continues with existing evidence

---

## Feature: Copy Evidence from Recent Assessment

### Purpose
Allows users to reuse evidence from a previous/recent assessment when creating a new one, saving time and maintaining consistency.

### How It Works

1. **Frontend Flow:**
   - User selects a control to assess
   - System shows recent closed assessments for that control
   - User can optionally select one to copy evidence from
   - If selected, `commonAssessmentId` is sent in the request

2. **Backend Flow:**
   - Creates new assessment
   - If `commonAssessmentId` provided:
     - Sets status to "in_progress"
     - Copies all top-level comments from recent assessment
     - Preserves comment content and attachments
     - Updates author to current user

3. **What Gets Copied:**
   - ✅ Comment content
   - ✅ Comment attachments (evidence files)
   - ✅ Evidence type (implementation/design/architectural)
   - ❌ Comment replies (only top-level comments)
   - ❌ Comment timestamps (new timestamps created)

---

## Request Examples

### Example 1: Create New Assessment (No Evidence Copy)

```json
POST /api/assesment
{
  "assesmentId": "uuid-123-456-789",
  "name": "Q1 2024 Access Control Review",
  "description": "Review of access control policies and procedures",
  "framework": "507f1f77bcf86cd799439011",
  "control": "507f1f77bcf86cd799439012",
  "departments": ["507f1f77bcf86cd799439014"],
  "participants": ["john@example.com", "jane@example.com"],
  "attachments": [],
  "startDate": 1704067200,
  "dueDate": 1735689600
}
```

**Result:**
- Status: `"open"`
- No comments/evidence
- Email sent to participants

---

### Example 2: Create from Recent Assessment (Copy Evidence)

```json
POST /api/assesment
{
  "assesmentId": "uuid-123-456-789",
  "name": "Q1 2024 Access Control Review",
  "description": "Review of access control policies and procedures",
  "framework": "507f1f77bcf86cd799439011",
  "control": "507f1f77bcf86cd799439012",
  "commonAssessmentId": "507f1f77bcf86cd799439099",
  "departments": ["507f1f77bcf86cd799439014"],
  "participants": ["john@example.com"],
  "startDate": 1704067200,
  "dueDate": 1735689600
}
```

**Result:**
- Status: `"in_progress"`
- Comments/evidence copied from assessment `507f1f77bcf86cd799439099`
- Email sent to participants

---

## Response Structure

### Success Response (200 OK)

```json
{
  "message": "Request success",
  "assesment": {
    "_id": "507f1f77bcf86cd799439015",
    "assesmentId": "uuid-123-456-789",
    "name": "Q1 2024 Access Control Review",
    "description": "Review of access control policies and procedures",
    "frameworkType": "ISO",
    "framework": "507f1f77bcf86cd799439011",
    "frameworkName": "ISO 27001",
    "control": "507f1f77bcf86cd799439012",
    "controlId": "A.5.1",
    "controlName": "Access Control Policy",
    "departments": [
      {
        "id": "507f1f77bcf86cd799439014",
        "name": "IT Department"
      }
    ],
    "participants": ["john@example.com"],
    "attachments": [],
    "status": "in_progress",
    "startDate": 1704067200,
    "dueDate": 1735689600,
    "createdBy": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Error Responses

### 400 Bad Request - Invalid Framework
```json
{
  "error": "Invalid framework id"
}
```

### 400 Bad Request - Invalid Control
```json
{
  "error": "Invalid control id"
}
```

### 400 Bad Request - Invalid Department
```json
{
  "error": "Invalid department id(s)"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

---

## Frontend Implementation Guide

### TypeScript Interface

```typescript
interface CreateAssessmentRequest {
  assesmentId: string;
  name: string;
  description: string;
  framework: string;
  control: string;
  commonAssessmentId?: string;  // Optional - for copying evidence
  departments: string[];
  participants?: string[];
  attachments?: string[];
  startDate: number;
  dueDate: number;
}

interface CreateAssessmentResponse {
  message: string;
  assesment: {
    _id: string;
    assesmentId: string;
    name: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed' | 'discard';
    // ... other fields
  };
}
```

### API Call Example

```typescript
const createAssessment = async (data: CreateAssessmentRequest) => {
  const response = await axios.post<CreateAssessmentResponse>(
    '/api/assesment',
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};
```

### React Component Example

```tsx
const CreateAssessmentForm = () => {
  const [formData, setFormData] = useState<CreateAssessmentRequest>({
    assesmentId: uuidv4(),
    name: '',
    description: '',
    framework: '',
    control: '',
    departments: [],
    startDate: Math.floor(Date.now() / 1000),
    dueDate: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
  });
  
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [selectedRecent, setSelectedRecent] = useState<string | null>(null);

  // Load recent assessments when control is selected
  useEffect(() => {
    if (formData.control) {
      loadRecentAssessments(formData.control);
    }
  }, [formData.control]);

  const loadRecentAssessments = async (controlId: string) => {
    const recent = await fetchRecentAssessments(controlId);
    setRecentAssessments(recent);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        ...(selectedRecent && { commonAssessmentId: selectedRecent })
      };
      
      const result = await createAssessment(payload);
      
      if (result.assesment.status === 'in_progress') {
        toast.success('Assessment created with copied evidence!');
      } else {
        toast.success('Assessment created successfully!');
      }
      
      navigate(`/assessment/${result.assesment._id}`);
    } catch (error) {
      toast.error('Failed to create assessment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {/* Recent Assessments Section */}
      {recentAssessments.length > 0 && (
        <div className="recent-assessments">
          <h3>Copy Evidence from Recent Assessment?</h3>
          <select 
            value={selectedRecent || ''} 
            onChange={(e) => setSelectedRecent(e.target.value || null)}
          >
            <option value="">Start from scratch</option>
            {recentAssessments.map(assessment => (
              <option key={assessment._id} value={assessment._id}>
                {assessment.name} - {new Date(assessment.updatedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
          {selectedRecent && (
            <p className="info">
              ℹ️ Evidence and comments will be copied. Assessment will start as "In Progress".
            </p>
          )}
        </div>
      )}
      
      <button type="submit">Create Assessment</button>
    </form>
  );
};
```

---

## Backend Validation

The API validates:
1. ✅ Framework exists in database
2. ✅ Control exists in database
3. ✅ All departments exist in database
4. ✅ User is authenticated
5. ⚠️ `commonAssessmentId` is NOT validated (fails silently if invalid)

---

## Side Effects

### Email Notifications
If `participants` are provided, email notifications are sent to all participants with:
- Assessment name
- Description
- Control name
- Due date

**Note:** Email sending happens asynchronously and does not block the response.

### Evidence Copying
If `commonAssessmentId` is provided:
- Comments are copied asynchronously
- Errors are logged but do not fail the assessment creation
- Only top-level comments are copied (no replies)

---

## Status Behavior Summary

| Scenario | Initial Status | Evidence Copied |
|----------|---------------|-----------------|
| No `commonAssessmentId` | `"open"` | No |
| With `commonAssessmentId` | `"in_progress"` | Yes |
| User adds evidence later | Auto-updates to `"in_progress"` | N/A |

---

## Best Practices

### For Frontend

1. **Show Recent Assessments:**
   - Display recent closed assessments for the selected control
   - Allow user to preview evidence before copying
   - Make it optional (don't force selection)

2. **User Guidance:**
   - Explain that copying evidence will start assessment as "In Progress"
   - Show preview of what will be copied
   - Indicate time saved by reusing evidence

3. **Error Handling:**
   - Handle validation errors gracefully
   - Show specific error messages for each field
   - Allow retry without losing form data

4. **Loading States:**
   - Show loading while creating assessment
   - Show loading while fetching recent assessments
   - Disable submit button during creation

### For Backend

1. **Evidence Copy Errors:**
   - Logged but don't fail assessment creation
   - Assessment is still created successfully
   - User can manually add evidence if copy fails

2. **Email Errors:**
   - Logged but don't fail assessment creation
   - Assessment is still created successfully
   - Consider retry mechanism for failed emails

---

## Testing Checklist

- [ ] Create assessment without `commonAssessmentId` → status is "open"
- [ ] Create assessment with `commonAssessmentId` → status is "in_progress"
- [ ] Evidence is copied when `commonAssessmentId` provided
- [ ] Invalid framework ID returns 400 error
- [ ] Invalid control ID returns 400 error
- [ ] Invalid department ID returns 400 error
- [ ] Participants receive email notifications
- [ ] Assessment created even if email fails
- [ ] Assessment created even if evidence copy fails
- [ ] Unauthorized request returns 401 error

---

## Questions?
Contact backend team for any clarifications or issues.
