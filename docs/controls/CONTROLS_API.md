# Controls API

Controls are the individual compliance requirements within a framework, organized in a hierarchy: **Domain → Subdomain (optional) → Control**.

→ Back to [README](../../README.md)

---

## Data Model

```typescript
{
  _id: string;
  frameworkId: string;
  frameworkName: string;
  domainCode: string;       // e.g. "3.1"
  domainName: string;       // e.g. "Cyber Security Leadership"
  subdomainCode: string;    // e.g. "3.1.1" (null if framework has no subdomains)
  subdomainName: string;    // e.g. "Governance" (null if no subdomains)
  controlCode: string;      // e.g. "3.1.1-1" — unique per framework
  controlName: string;      // e.g. "Establish a cyber security committee"
  description: string;
  properties: Record<string, string>;  // framework-specific custom fields
  status: "active" | "inactive";
}
```

**Important:** The `controlCode` is the human-readable identifier. MongoDB `_id` is used only for API mutations (create/update). Use `controlCode` for display and URL parameters.

---

## Endpoints

### List Controls for a Framework
**GET** `/api/control/list/:frameworkId`

| Query Param | Type | Description |
|-------------|------|-------------|
| `search` | string | Case-insensitive search on controlCode, controlName, domainName, subdomainName |
| `status` | string | Filter by `active` or `inactive` |

**Response:**
```json
[
  {
    "_id": "...",
    "controlCode": "3.1.1-1",
    "controlName": "Establish a cyber security committee",
    "domainCode": "3.1",
    "domainName": "Cyber Security Leadership and Governance",
    "subdomainCode": "3.1.1",
    "subdomainName": "Cyber Security Governance",
    "status": "active",
    "properties": {
      "riskLevel": "high"
    }
  }
]
```

---

### Get Control Details
**GET** `/api/control/details/:controlCode`

Returns full control details plus recent closed assessments for the same control. Use this when showing the assessment creation form to allow evidence reuse.

```json
{
  "_id": "...",
  "frameworkId": "...",
  "frameworkName": "SAMA CSF",
  "controlCode": "3.1.1-1",
  "controlName": "Establish a cyber security committee",
  "domainCode": "3.1",
  "domainName": "Cyber Security Leadership and Governance",
  "subdomainCode": "3.1.1",
  "subdomainName": "Cyber Security Governance",
  "description": "",
  "status": "active",
  "properties": {},
  "recentAssessments": [
    {
      "_id": "507f1f77bcf86cd799439099",
      "name": "Q4 2023 SAMA Assessment",
      "status": "closed",
      "updatedAt": "2023-12-31T00:00:00.000Z",
      "attachments": ["https://..."]
    }
  ]
}
```

---

### Create Control
**POST** `/api/control/create`

```json
{
  "frameworkId": "507f1f77bcf86cd799439011",
  "controlCode": "3.1.1-1",
  "controlName": "Establish a cyber security committee",
  "domainCode": "3.1",
  "domainName": "Cyber Security Leadership and Governance",
  "subdomainCode": "3.1.1",
  "subdomainName": "Cyber Security Governance",
  "description": "Optional description",
  "properties": {
    "riskLevel": "high",
    "complianceType": "mandatory"
  }
}
```

`subdomainCode` and `subdomainName` are optional. `controlCode` must be unique per framework.

---

### Update Control
**PATCH** `/api/control/update/:id`

`:id` is the MongoDB `_id`. Only these fields can be updated — `controlCode` and domain/subdomain fields are immutable after creation.

```json
{
  "controlName": "Updated control name",
  "description": "Updated description",
  "status": "inactive",
  "properties": {
    "riskLevel": "critical"
  }
}
```

---

## Common Controls

Common controls allow a single assessment to cover the same logical control mapped across multiple frameworks.

**GET** `/api/common-control/list`

```json
{
  "data": [
    {
      "_id": "...",
      "displayName": "Access Control Policy",
      "description": "...",
      "mappedControls": [
        {
          "frameworkId": "...",
          "frameworkName": "ISO 27001",
          "controlId": "507f1f77bcf86cd799439011",
          "controlCode": "A.5.1",
          "controlName": "Policies for information security"
        },
        {
          "frameworkId": "...",
          "frameworkName": "SOC 2",
          "controlId": "507f1f77bcf86cd799439012",
          "controlCode": "CC6.1",
          "controlName": "Logical and Physical Access Controls"
        }
      ]
    }
  ]
}
```

**When using `mappedControls`:**
- Use `controlCode` for display in the UI
- Use `controlId` (MongoDB `_id`) when sending to assessment create API

---

## Field Reference — When to Use What

| Scenario | Use `_id` | Use `controlCode` |
|----------|-----------|-------------------|
| Display in UI tables/lists | ❌ | ✅ |
| URL parameter for control details | ❌ | ✅ |
| Assessment creation `control` field | ✅ | ❌ |
| Control update endpoint | ✅ | ❌ |
| Common control creation | ✅ | ❌ |
| Search/filter | ❌ | ✅ |

---

## Frontend Notes

- URL-encode `controlCode` when using it in route parameters (e.g. `encodeURIComponent("3.1.1-1")`), though most HTTP clients handle this automatically
- When creating an assessment, send the control's MongoDB `_id` — backend auto-populates `controlId` (= controlCode) and `controlName` on the assessment record
- `properties` is a freeform key-value map — each framework defines its own keys via the CSV `property:` columns
