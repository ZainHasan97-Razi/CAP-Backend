# Assessment Participants API Guide

## Overview
This guide explains how to implement participant selection for assessments in the frontend.

## API Endpoints

### 1. Get Users by Departments
**Endpoint:** `GET /api/user/by-departments`

**Query Parameters:**
- `departmentIds` (required): Comma-separated list of department IDs

**Example Request:**
```
GET /api/user/by-departments?departmentIds=507f1f77bcf86cd799439011,507f1f77bcf86cd799439012
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userName": "John Doe",
    "email": "john@example.com",
    "department": "IT Department",
    "departmentId": "507f1f77bcf86cd799439011"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "userName": "Jane Smith",
    "email": "jane@example.com",
    "department": "Finance Department",
    "departmentId": "507f1f77bcf86cd799439012"
  }
]
```

**Notes:**
- Only returns active users
- Returns users belonging to any of the specified departments

---

## Frontend Implementation Flow

### Step 1: Department Selection
When user selects departments in the assessment creation form, store the selected department IDs.

### Step 2: Fetch Participants
Once departments are selected, call the API to get available users:

```javascript
const fetchParticipants = async (departmentIds) => {
  const ids = departmentIds.join(',');
  const response = await fetch(`/api/user/by-departments?departmentIds=${ids}`);
  const users = await response.json();
  return users;
};
```

### Step 3: Display Multi-Select
Show the returned users in a multi-select dropdown where users can select participant emails.

### Step 4: Submit Assessment
When creating the assessment, include the selected participant emails in the request:

```json
{
  "assesmentId": "uuid-here",
  "name": "Q1 Security Assessment",
  "description": "Quarterly security compliance check",
  "framework": "507f1f77bcf86cd799439011",
  "control": "507f1f77bcf86cd799439012",
  "departments": ["507f1f77bcf86cd799439013"],
  "participants": ["john@example.com", "jane@example.com"],
  "priority": "high",
  "startDate": 1704067200,
  "dueDate": 1706745600
}
```

---

## Email Notifications

When an assessment is created with participants:
- Each participant will automatically receive an email notification
- Email includes: assessment name, description, control name, priority, and due date
- Email sending happens asynchronously and won't block the assessment creation

---

## UI/UX Recommendations

1. **Department Selection First**: Require department selection before showing participant selection
2. **Dynamic Loading**: Load participants dynamically when departments change
3. **Multi-Select Component**: Use a searchable multi-select dropdown for participant emails
4. **Visual Feedback**: Show loading state while fetching participants
5. **Validation**: Ensure at least one participant is selected if required by business rules
6. **Email Preview**: Display selected participant emails as chips/tags for easy review

---

## Example React Implementation

```jsx
const [selectedDepartments, setSelectedDepartments] = useState([]);
const [availableParticipants, setAvailableParticipants] = useState([]);
const [selectedParticipants, setSelectedParticipants] = useState([]);

useEffect(() => {
  if (selectedDepartments.length > 0) {
    fetchParticipants(selectedDepartments).then(setAvailableParticipants);
  } else {
    setAvailableParticipants([]);
    setSelectedParticipants([]);
  }
}, [selectedDepartments]);

return (
  <>
    <DepartmentMultiSelect 
      value={selectedDepartments}
      onChange={setSelectedDepartments}
    />
    
    {availableParticipants.length > 0 && (
      <ParticipantMultiSelect
        options={availableParticipants}
        value={selectedParticipants}
        onChange={setSelectedParticipants}
        getOptionLabel={(user) => `${user.userName} (${user.email})`}
        getOptionValue={(user) => user.email}
      />
    )}
  </>
);
```
