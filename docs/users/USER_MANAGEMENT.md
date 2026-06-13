# User Management

→ Back to [README](../../README.md)

## Overview

Covers two frontend pages:
- **User List page** — view, search, and manage all users. Assign system roles.
- **Register User page** — create a new user account, select or create a department inline.

All endpoints require `Authorization: Bearer <token>` unless marked Public.

---

## Data Model

```typescript
{
  _id: string;
  userName: string;
  email: string;                  // stored lowercase, unique
  status: 'pending' | 'active' | 'inactive';
  emailIsVerified: boolean;
  role: string;                   // legacy field, defaults to 'guest' — not used for access control
  roleId: string | null;
  department: string;             // department display name (denormalised string)
  departmentId: string | null;    // ref: Department
  systemRoles: string[];          // drives all permissions — see Roles & Permissions doc
  createdAt: string;
  updatedAt: string;
  // password is NEVER returned in any response
}
```

---

## API Reference

### `POST /api/user/register`

> Caller must have one of: `super_admin`, `compliance_specialist`, or `compliance_manager` system role.
> Returns 403 for all other roles.

Creates a new user account.

**Request Body:**

| Field | Required | Validation | Description |
|---|---|---|---|
| `userName` | Yes | 3–50 characters | Display name |
| `email` | Yes | Valid email | Stored lowercase, must be unique |
| `password` | Yes | Min 8 chars + uppercase + lowercase + special character | Hashed before storing |
| `departmentId` | Yes | Valid MongoDB ObjectId | Must match an existing active department |
| `systemRoles` | No | Array of valid role keys | Defaults to `["control_owner"]` if omitted |
| `role` | No | String | Legacy field, defaults to `"guest"` — safe to omit |

Valid `systemRoles` values:
`compliance_specialist` `compliance_manager` `control_owner` `executive` `auditor` `super_admin`

**Example:**
```json
{
  "userName": "Jane Smith",
  "email": "jane@example.com",
  "password": "Pass@1234",
  "departmentId": "64abc123def456",
  "systemRoles": ["compliance_specialist"]
}
```

**Response:**
```json
{ "message": "User created", "userId": "64xyz..." }
```

**Error Responses:**
```json
{ "error": "You do not have permission to register new users" }  // 403
{ "error": "User already exists" }                               // 400
{ "error": "Invalid department ID" }                             // 400
```

---

### `GET /api/user/list`

Returns a paginated list of all users. Password is never included.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Case-insensitive match on `userName` and `email` |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max: 100) |

**Example:**
```
GET /api/user/list?search=jane&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "_id": "64abc...",
      "userName": "Jane Smith",
      "email": "jane@example.com",
      "status": "active",
      "department": "Risk & Compliance",
      "departmentId": "64def...",
      "systemRoles": ["compliance_specialist"],
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

---

### `GET /api/user/:id`

Returns a single user by MongoDB `_id`.

**Response:**
```json
{
  "message": "Request success",
  "user": {
    "_id": "64abc...",
    "userName": "Jane Smith",
    "email": "jane@example.com",
    "status": "active",
    "department": "Risk & Compliance",
    "departmentId": "64def...",
    "systemRoles": ["compliance_specialist"],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error:**
```json
{ "error": "User not found" }  // 400
```

---

### `GET /api/user/by-departments`

Returns active users belonging to one or more departments. Used on the Control Assignment page to populate the participants multi-select after a department is chosen.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `departmentIds` | string | Yes | Comma-separated department `_id`s |

**Example:**
```
GET /api/user/by-departments?departmentIds=64abc...,64def...
```

**Response:**
```json
[
  {
    "_id": "64xyz...",
    "userName": "Jane Smith",
    "email": "jane@example.com",
    "department": "Risk & Compliance",
    "departmentId": "64abc..."
  }
]
```

---

### `PATCH /api/user/:id/system-roles`

> `super_admin` only.

Replaces the `systemRoles` array for a user. This is a **full replace** — whatever array you send becomes the new value. Do not send partial/incremental updates.

**Request Body:**
```json
{ "systemRoles": ["compliance_specialist", "auditor"] }
```

**Response:**
```json
{
  "message": "System roles updated",
  "user": { ...full user object without password... }
}
```

**Error Responses:**
```json
{ "error": "Only super admins can update system roles" }  // 403
{ "error": "User not found" }                             // 404
```

---

### `PATCH /api/user/:id/password`

> `super_admin` only.

Updates the password for any user. The new password is hashed before storing. The target user's session is **not invalidated** — they can continue using their existing token until it expires or they log out.

**Request Body:**
```json
{ "password": "NewPass@1234" }
```

| Field | Required | Validation |
|---|---|---|
| `password` | Yes | Min 6 characters |

**Response:**
```json
{ "message": "Password updated successfully" }
```

**Error Responses:**
```json
{ "error": "Only super admins can update user passwords" }  // 403
{ "error": "User not found" }                               // 404
{ "error": "Password must be at least 6 characters" }       // 400
```

---

### `POST /api/user/logout`

Clears the session. The JWT is not blocklisted — the server-side `sessionId` is nulled, so the existing token will fail on the next protected request.

**Response:**
```json
{ "message": "Logged out successfully" }
```

---

## Department API Reference

### `GET /api/department/list` *(Public — no auth required)*

Returns all active departments. Call this on form mount to populate the department dropdown.

**Response:**
```json
[
  { "_id": "64abc...", "displayName": "IT Security" },
  { "_id": "64def...", "displayName": "Risk & Compliance" }
]
```

---

### `POST /api/department/create`

> Caller must have `super_admin` or `executive` system role.

**Request Body:**
```json
{ "displayName": "Risk & Compliance" }
```

**Response:**
```json
{
  "_id": "64abc...",
  "displayName": "Risk & Compliance",
  "status": "active",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Error Responses:**
```json
{ "error": "Only super admins and executives can create departments" }  // 403
{ "error": "Invalid Department name" }                                  // 400
```

---

### `PATCH /api/department/update`

Updates an existing department. Both fields optional.

**Request Body:**
```json
{
  "displayName": "Updated Name",
  "status": "inactive"
}
```

`status` must be `"active"` or `"inactive"`.

---

## Frontend Page Guide

### Page 1 — User List

**Route:** `/users`
**Access:** Only show this page to users with `view_user` permission.

```ts
const canViewUsers = effectivePermissions.includes('view_user');
```

**What to show:**
- Search input — triggers `GET /api/user/list?search=...` with debounce
- Table columns: Name | Email | Department | System Roles | Status | Actions
- Pagination controls at the bottom

**Actions per row:**
- **View** — navigate to user detail or open a side drawer using `GET /api/user/:id`
- **Edit Roles** — only show for `super_admin`, opens the role assignment modal

**Add User button:**
- Only show for users who can register: `super_admin`, `compliance_specialist`, `compliance_manager`

```ts
const canRegisterUsers = user.systemRoles.some(r =>
  ['super_admin', 'compliance_specialist', 'compliance_manager'].includes(r)
);
```

**Pagination:**

```ts
const fetchUsers = async (search = '', page = 1, limit = 10) => {
  const params = new URLSearchParams({
    ...(search && { search }),
    page:  String(page),
    limit: String(limit),
  });
  const res = await api.get(`/user/list?${params}`);
  return res.data;
  // { data, pagination: { page, limit, total, pages } }
};

// Changing items per page — always reset to page 1
const handleLimitChange = (newLimit: number) => {
  setLimit(newLimit);
  setPage(1);
  fetchUsers(search, 1, newLimit);
};
```

---

### Page 2 — Register User

**Route:** `/users/register` or modal opened from the User List page
**Access:** Guard the entire page/modal — only `super_admin`, `compliance_specialist`, `compliance_manager`

**On mount:** fetch departments list

```ts
useEffect(() => {
  api.get('/department/list').then(res => setDepartments(res.data));
}, []);
```

**Form fields:**

| Field | UI Control | Validation | Notes |
|---|---|---|---|
| `userName` | Text input | 3–50 chars | |
| `email` | Email input | Valid email format | |
| `password` | Password input + strength indicator | Min 8, uppercase, lowercase, special char | |
| `departmentId` | Dropdown | Required | See department dropdown section below |
| `systemRoles` | Multi-select checkboxes | At least one recommended | Defaults to `control_owner` if left empty |

**Password strength indicator** should check and display in real time:
- Min 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one special character (`!@#$%^&*(),.?":{}|<>`)

**On submit:**
```ts
const handleRegister = async (formData) => {
  await api.post('/user/register', {
    userName:     formData.userName,
    email:        formData.email,
    password:     formData.password,
    departmentId: formData.departmentId,
    systemRoles:  formData.systemRoles.length ? formData.systemRoles : ['control_owner'],
  });
};
```

---

### Department Dropdown — "Add New Department" Flow

The department field on the Register User form has an inline create option. Show it only to users who can create departments:

```ts
const canCreateDepartment = user.systemRoles.some(r =>
  ['super_admin', 'executive'].includes(r)
);
```

**Dropdown structure:**
```
┌─────────────────────────────┐
│  IT Security                │
│  Risk & Compliance          │
│  Finance                    │
│  ─────────────────────────  │
│  + Add New Department       │  ← only shown to super_admin / executive
└─────────────────────────────┘
```

**When user clicks "+ Add New Department":**

1. Open a small modal with one input: **Department Name**
2. Validate: name must not be empty
3. On confirm → `POST /api/department/create`
4. On success:
   - Append the returned department to the local dropdown list
   - Auto-select it as the current value
   - Close the modal
   - User continues filling the rest of the form — no page reload or full refetch

```ts
const handleCreateDepartment = async (displayName: string) => {
  if (!displayName.trim()) return;

  const res  = await api.post('/department/create', { displayName: displayName.trim() });
  const dept = res.data; // { _id, displayName, status, createdAt, updatedAt }

  setDepartments(prev => [...prev, dept]); // append to list
  setSelectedDepartmentId(dept._id);       // auto-select
  setShowDepartmentModal(false);
};
```

**Error handling in the modal:**
```ts
// Show inline error, do not close the modal
{ "error": "Only super admins and executives can create departments" } // 403 — shouldn't happen if UI guard is correct
{ "error": "Invalid Department name" }                                 // 400 — show under the input field
```

> Users without `super_admin` or `executive` role see the dropdown as a plain list with no add option.

---

### Role Assignment Modal (User List page)

Triggered by the "Edit Roles" action on a user row. Only `super_admin` sees this button.

**On open:** pre-populate checkboxes with the user's current `systemRoles`

**UI:** Show all 6 system roles as checkboxes with labels and descriptions:

| Role Key | Label | Description |
|---|---|---|
| `compliance_specialist` | Compliance Specialist | Creates assessments, assigns controls and findings |
| `compliance_manager` | Compliance Manager | Validates and approves assessments |
| `control_owner` | Control Owner | Raises evidence, provides action plans |
| `executive` | Executive | Views dashboard and reports only |
| `auditor` | Auditor | Compliance Specialist + validates closure assessments |
| `super_admin` | Super Admin | System administration only — users, roles, departments, frameworks, controls and platform settings. **Cannot create or modify assessments or evidence.** |

**On save:** send the full checked array — this is a replace, not an append:

```ts
const handleSaveRoles = async (userId: string, selectedRoles: string[]) => {
  await api.patch(`/user/${userId}/system-roles`, {
    systemRoles: selectedRoles,
  });
  // refresh user row in the list
};
```

> Important: if the user unchecks all roles and saves, they will have `[]` — no access to anything. Always ensure at least one role is selected before enabling the save button.

---

### Update Password Modal (User List page)

Triggered by a **"Reset Password"** button on a user row. Only `super_admin` sees this button.

**UI:** Small modal with a single password input and a confirm button.

```
┌──────────────────────────────────────┐
│  Reset Password for Jane Smith     │
│                                    │
│  New Password  [ ______________ ]  │
│                                    │
│  [ Cancel ]       [ Save ]         │
└──────────────────────────────────────┘
```

**On save:**

```ts
const handleUpdatePassword = async (userId: string, newPassword: string) => {
  await api.patch(`/user/${userId}/password`, { password: newPassword });
  // show success toast, close modal
};
```

**Validation:** Minimum 6 characters (enforce client-side before submitting).

---

## Frontend Checklist

**User List page**
- [ ] Page only accessible to users with `view_user` permission
- [ ] Search debounced — calls `GET /api/user/list?search=...`
- [ ] Changing items-per-page resets to page 1
- [ ] "Add User" button hidden from roles without register permission
- [ ] "Edit Roles" button only visible to `super_admin`

**Register User form**
- [ ] Entire page/modal guarded — only `super_admin`, `compliance_specialist`, `compliance_manager`
- [ ] Departments loaded from `GET /api/department/list` on mount
- [ ] Password field shows real-time strength feedback
- [ ] `systemRoles` defaults to `["control_owner"]` if nothing selected
- [ ] On success — show confirmation and navigate back to user list or clear the form

**Department "Add New Department" modal**
- [ ] "+ Add New Department" option only rendered for `super_admin` and `executive`
- [ ] Modal has a single "Department Name" input with empty-string validation
- [ ] On save → `POST /api/department/create`
- [ ] On success → append to dropdown list and auto-select, no refetch
- [ ] On error → show error inline in the modal, keep modal open

**Role assignment modal**
- [ ] Only `super_admin` can open it
- [ ] Pre-populated with user's current `systemRoles`
- [ ] Sends full array on save (full replace, not diff)
- [ ] Save button disabled if zero roles selected

**Reset password modal**
- [ ] Only `super_admin` can open it
- [ ] Single password input, min 6 characters enforced client-side
- [ ] On success — show success toast and close modal
