# Frontend Migration Guide - Control Model Field Changes

## Overview
The backend Control model has been updated to support a hierarchical structure with Domain → Subdomain → Control. All field names have been changed to reflect this new structure.

---

## 🔴 BREAKING CHANGES - Field Name Mappings

### Control Model Fields (OLD → NEW)
```
controlId     → controlCode
displayName   → controlName
groupId       → subdomainCode
groupName     → subdomainName
```

### New Fields Added
```
domainCode    (NEW)
domainName    (NEW)
```

---

## 📋 API Changes

### 1. **Framework CSV Upload API**
**Endpoint:** `POST /framework/upload-csv`

**Request (Form-Data):**
```
file: CSV file
displayName: string
type: string (regulatory_assessment | internal_policy_procedure | international_standards)
```

**CSV Format (NEW):**
```csv
domainCode,domainName,subdomainCode,subdomainName,controlCode,controlName
3.1,Cyber Security Leadership and Governance,3.1.1,Cyber Security Governance,3.1.1-1,A cyber security committee should be established and be mandated by the board.
```

**Response:**
```json
{
  "framework": {
    "_id": "...",
    "displayId": "1",
    "displayName": "Framework Name",
    "type": "regulatory_assessment"
  },
  "domainsCount": 5,
  "subdomainsCount": 15,
  "controlsCount": 50,
  "message": "Framework and controls created successfully"
}
```

---

### 2. **Get Controls by Framework**
**Endpoint:** `GET /control/list/:frameworkId?search=&status=`

**Response (UPDATED):**
```json
[
  {
    "_id": "...",
    "controlCode": "3.1.1-1",
    "controlName": "A cyber security committee should be established",
    "domainCode": "3.1",
    "domainName": "Cyber Security Leadership and Governance",
    "subdomainCode": "3.1.1",
    "subdomainName": "Cyber Security Governance",
    "status": "active"
  }
]
```

**Frontend Changes Required:**
- Replace `controlId` with `controlCode`
- Replace `displayName` with `controlName`
- Replace `groupId` with `subdomainCode`
- Replace `groupName` with `subdomainName`
- Add support for `domainCode` and `domainName`

---

### 3. **Get Control Details with Assessments**
**Endpoint:** `GET /control/details/:controlCode` (CHANGED from `:controlId`)

**URL Parameter Change:**
- OLD: `/control/details/:controlId`
- NEW: `/control/details/:controlCode`

**Response (UPDATED):**
```json
{
  "_id": "...",
  "frameworkId": "...",
  "frameworkName": "Framework Name",
  "controlCode": "3.1.1-1",
  "controlName": "A cyber security committee should be established",
  "domainCode": "3.1",
  "domainName": "Cyber Security Leadership and Governance",
  "subdomainCode": "3.1.1",
  "subdomainName": "Cyber Security Governance",
  "description": "",
  "status": "active",
  "recentAssessments": [...]
}
```

---

### 4. **Create Control**
**Endpoint:** `POST /control/create`

**Request Body (UPDATED):**
```json
{
  "frameworkId": "mongoId",
  "controlCode": "3.1.1-1",
  "controlName": "Control description",
  "domainCode": "3.1",
  "domainName": "Domain name",
  "subdomainCode": "3.1.1",
  "subdomainName": "Subdomain name",
  "description": "Optional description"
}
```

**OLD Request Body (DEPRECATED):**
```json
{
  "frameworkId": "mongoId",
  "controlId": "...",
  "displayName": "...",
  "groupId": "...",
  "groupName": "...",
  "description": "..."
}
```

---

### 5. **Update Control**
**Endpoint:** `PATCH /control/update/:id`

**Request Body (UPDATED):**
```json
{
  "controlName": "Updated control name",
  "description": "Updated description",
  "status": "active" | "inactive"
}
```

**Allowed Fields Changed:**
- OLD: `displayName`, `description`, `status`
- NEW: `controlName`, `description`, `status`

---

### 6. **Create Assessment**
**Endpoint:** `POST /assesment/create`

**Request Body (NO CHANGE - but response uses new fields):**
```json
{
  "assesmentId": "uuid",
  "name": "Assessment name",
  "description": "Description",
  "framework": "mongoId",
  "control": "mongoId",
  "departments": ["mongoId"],
  "participants": ["email@example.com"],
  "attachments": [],
  "priority": "high" | "medium" | "low",
  "startDate": 1234567890,
  "dueDate": 1234567890,
  "commonAssessmentId": "optional-mongoId"
}
```

**Response (UPDATED - internal mapping):**
The backend now maps control fields internally:
- `controlId` field in assessment now contains `control.controlCode`
- `controlName` field in assessment now contains `control.controlName`

---

### 7. **Assessment Dashboard List**
**Endpoint:** `GET /assesment/dashboard`

**Response Items (UPDATED):**
```json
{
  "data": [
    {
      "_id": "...",
      "assesmentId": "uuid",
      "name": "Assessment name",
      "frameworkName": "Framework name",
      "controlId": "3.1.1-1",
      "controlName": "Control description",
      "status": "open",
      "priority": "high",
      ...
    }
  ]
}
```

**Note:** The `controlId` field in assessments now contains the `controlCode` value (e.g., "3.1.1-1")

---

### 8. **Common Controls**
**Endpoint:** `GET /common-control/list`

**Response (UPDATED):**
```json
{
  "data": [
    {
      "_id": "...",
      "displayName": "Common Control Name",
      "description": "Description",
      "mappedControls": [
        {
          "frameworkId": {...},
          "frameworkName": "Framework Name",
          "controlId": "mongoId",
          "controlCode": "3.1.1-1",
          "controlName": "Control description"
        }
      ]
    }
  ]
}
```

**Frontend Changes Required:**
- Use `controlCode` instead of `controlId` for display
- Use `controlName` instead of `displayName` for control names

---

## 🔧 Frontend Code Changes Checklist

### 1. **Control List/Table Components**
```typescript
// OLD
<td>{control.controlId}</td>
<td>{control.displayName}</td>
<td>{control.groupId}</td>
<td>{control.groupName}</td>

// NEW
<td>{control.controlCode}</td>
<td>{control.controlName}</td>
<td>{control.domainCode} - {control.domainName}</td>
<td>{control.subdomainCode} - {control.subdomainName}</td>
```

### 2. **Control Detail Pages**
```typescript
// OLD
interface Control {
  controlId: string;
  displayName: string;
  groupId: string;
  groupName: string;
}

// NEW
interface Control {
  controlCode: string;
  controlName: string;
  domainCode: string;
  domainName: string;
  subdomainCode: string;
  subdomainName: string;
}
```

### 3. **API Route Changes**
```typescript
// OLD
navigate(`/control/details/${control.controlId}`)

// NEW
navigate(`/control/details/${control.controlCode}`)
```

### 4. **Form Validation**
```typescript
// OLD
const schema = {
  controlId: yup.string().required(),
  displayName: yup.string().required(),
  groupId: yup.string().required(),
  groupName: yup.string().required()
}

// NEW
const schema = {
  controlCode: yup.string().required(),
  controlName: yup.string().required(),
  domainCode: yup.string().required(),
  domainName: yup.string().required(),
  subdomainCode: yup.string().required(),
  subdomainName: yup.string().required()
}
```

### 5. **Search/Filter Logic**
```typescript
// OLD
const filtered = controls.filter(c => 
  c.controlId.includes(search) || 
  c.displayName.includes(search)
)

// NEW
const filtered = controls.filter(c => 
  c.controlCode.includes(search) || 
  c.controlName.includes(search) ||
  c.domainName.includes(search) ||
  c.subdomainName.includes(search)
)
```

### 6. **CSV Upload Template**
Update CSV template download to use new headers:
```csv
domainCode,domainName,subdomainCode,subdomainName,controlCode,controlName
```

---

## 📊 Data Migration Notes

### Assessment Data
- Existing assessments store `controlId` field which now contains `controlCode` values
- No migration needed - field name stays same but contains new format data

### Common Controls
- `controlCode` field already exists in mappedControls
- Frontend should use `controlCode` for display instead of looking up `controlId`

---

## 🧪 Testing Checklist

- [ ] Control list page displays correctly with new fields
- [ ] Control detail page shows domain/subdomain information
- [ ] Control creation form has all new required fields
- [ ] Control update form uses `controlName` instead of `displayName`
- [ ] Framework CSV upload works with new format
- [ ] Assessment creation still works (uses control mongoId)
- [ ] Assessment list shows correct control codes
- [ ] Common control mapping displays correctly
- [ ] Search functionality works with new field names
- [ ] Control detail route uses `controlCode` parameter

---

## 🚨 Important Notes

1. **No Database Migration Required** - This is a schema change, existing data structure changes automatically
2. **Assessment controlId Field** - Still named `controlId` in database but now contains `controlCode` values
3. **Backward Compatibility** - Old CSV format is NOT supported, only new format works
4. **Unique Constraint** - `frameworkId + controlCode` must be unique per framework

---

## ❓ FAQ - Answers to Frontend Team Questions

### Q1: Control Identification in URLs/Routes
**Question:** Should controlCode be URL-encoded since it contains special characters like "3.1.1-1"? Or should we use MongoDB _id in URLs?

**Answer:** 
- ✅ **Use controlCode in the URL** - `/control/details/3.1.1-1`
- ✅ **URL encoding is handled automatically** by browsers and HTTP clients (axios, fetch)
- The backend route accepts `controlCode` as a string parameter and handles special characters
- Example: `axios.get(`/control/details/${encodeURIComponent(control.controlCode)}`)` (though most HTTP clients do this automatically)

**Why not MongoDB _id?**
- controlCode is more user-friendly and readable in URLs
- Backend service `findByControlCode()` is optimized for this lookup
- Keeps URLs consistent with the business domain

---

### Q2: Assessment Creation - Control Field
**Question:** Does assessment creation still use MongoDB _id for the control field, not controlCode?

**Answer:**
- ✅ **YES, continue to send MongoDB _id** in the `control` field
- The request body uses: `"control": "mongoObjectId"`
- Backend internally extracts `controlCode` and `controlName` from the Control document

**Example:**
```typescript
// When user selects a control from dropdown
const selectedControl = {
  _id: "507f1f77bcf86cd799439011",
  controlCode: "3.1.1-1",
  controlName: "Control description"
}

// Send only the _id in assessment creation
const payload = {
  control: selectedControl._id,  // ← MongoDB _id
  // ... other fields
}
```

**Why?**
- Maintains referential integrity with MongoDB ObjectId
- Backend automatically populates `controlId` (with controlCode value) and `controlName` in the assessment

---

### Q3: Control Update Endpoint
**Question:** PATCH /control/update/:id - is this using MongoDB _id or controlCode?

**Answer:**
- ✅ **Uses MongoDB _id** - `/control/update/507f1f77bcf86cd799439011`
- The `:id` parameter is the MongoDB ObjectId
- You can only update: `controlName`, `description`, `status`
- You CANNOT update: `controlCode`, `domainCode`, `subdomainCode` (these are immutable after creation)

**Example:**
```typescript
// Update control
axios.patch(`/control/update/${control._id}`, {
  controlName: "Updated name",
  description: "Updated description",
  status: "inactive"
})
```

---

### Q4: Existing Data Migration
**Question:** What happens to existing assessments' controlId field? Will there be a migration script?

**Answer:**
- ⚠️ **IMPORTANT: Existing assessments will have OLD data format**
- The `controlId` field in OLD assessments contains the old format (not the new controlCode format)
- **NO automatic migration script is provided**

**Impact:**
- Old assessments: `controlId` might be in old format
- New assessments: `controlId` will contain new `controlCode` format (e.g., "3.1.1-1")

**Recommendation for Frontend:**
```typescript
// Handle both old and new formats gracefully
const displayControlId = assessment.controlId || "N/A";

// Or add a fallback in your display logic
<td>{assessment.controlId || assessment.controlCode || "Legacy Data"}</td>
```

**Backend Team Note:** If you need a migration script to update existing assessments, please request it separately. Current implementation does NOT migrate old data.

---

### Q5: Common Controls - controlId vs controlCode
**Question:** Should we use controlCode for display but send controlId (MongoDB _id) when creating/updating?

**Answer:**
- ✅ **For Display:** Use `controlCode` and `controlName`
- ✅ **For API Requests:** Use `controlId` (MongoDB _id)

**Common Control Response Structure:**
```json
{
  "mappedControls": [
    {
      "frameworkId": "mongoId",
      "frameworkName": "Framework Name",
      "controlId": "507f1f77bcf86cd799439011",  // ← MongoDB _id (for API)
      "controlCode": "3.1.1-1",                 // ← Display in UI
      "controlName": "Control description"       // ← Display in UI
    }
  ]
}
```

**Frontend Implementation:**
```typescript
// Display in table
<td>{mappedControl.controlCode}</td>
<td>{mappedControl.controlName}</td>

// When creating/updating common control
const payload = {
  displayName: "Common Control",
  description: "Description",
  mappedControls: selectedControls.map(c => ({
    frameworkId: c.frameworkId,
    frameworkName: c.frameworkName,
    controlId: c._id,  // ← Send MongoDB _id
    controlCode: c.controlCode,
    controlName: c.controlName
  }))
}
```

---

### Q6: CSV Upload Validation
**Question:** Is there validation for hierarchical structure consistency? What happens with inconsistencies?

**Answer:**
- ❌ **NO hierarchical validation** - Backend does NOT validate that same domainCode has same domainName
- ✅ **Only validates:** Required fields are present and not empty
- ⚠️ **Inconsistencies are allowed** - You can have same domainCode with different domainNames

**What Backend Validates:**
```csv
✅ All 6 columns present: domainCode, domainName, subdomainCode, subdomainName, controlCode, controlName
✅ No empty values in any required field
✅ Unique controlCode per framework (frameworkId + controlCode must be unique)
❌ Does NOT validate: domainCode consistency
❌ Does NOT validate: subdomainCode belongs to domainCode
```

**Example - This is ALLOWED (but inconsistent):**
```csv
domainCode,domainName,subdomainCode,subdomainName,controlCode,controlName
3.1,Cyber Security,3.1.1,Governance,3.1.1-1,Control 1
3.1,Security Leadership,3.1.2,Risk,3.1.2-1,Control 2
```
↑ Same domainCode (3.1) but different domainNames - Backend will accept this

**Validation Errors:**
```json
// If validation fails, you get:
{
  "error": "CSV validation errors: Row 2: controlCode is required, Row 3: domainName is required"
}
```

**Recommendation:**
- Add frontend validation before upload to ensure consistency
- Show preview of domains/subdomains before submitting
- Warn users about duplicate domainCodes with different names

---

## 📋 Quick Reference - When to Use What

| Scenario | Use MongoDB _id | Use controlCode |
|----------|----------------|------------------|
| Display in UI | ❌ | ✅ |
| URL parameters for control details | ❌ | ✅ |
| Assessment creation (control field) | ✅ | ❌ |
| Control update endpoint | ✅ | ❌ |
| Common control creation | ✅ | ❌ |
| Search/filter controls | ❌ | ✅ |
| Show in tables/lists | ❌ | ✅ |

---

## 📞 Support

If you encounter issues during migration:
1. Check that all field name mappings are updated
2. Verify API endpoints use correct parameter names
3. Ensure TypeScript interfaces are updated
4. Test CSV upload with new format first
