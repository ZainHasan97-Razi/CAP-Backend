# Frameworks API

Frameworks are the compliance standards (e.g. SAMA CSF, ISO 27001, NCA) that assessments are run against. Each framework defines a **compliance metric** that determines how assessment scores are tracked.

→ Back to [README](../../README.md)

---

## Compliance Metric Types

Every framework must have a `complianceMetric` configured:

| Type | Description | Example |
|------|-------------|---------|
| `maturity_level` | 5-level maturity model (Initial → Optimizing) | SAMA, ISO 27001 |
| `percentage` | Percentage-based compliance (0% → 100%) | NCA |

---

## Endpoints

### Create Framework
**POST** `/api/framework/create`

```json
{
  "displayName": "SAMA CSF",
  "type": "regulatory_assessment",
  "complianceMetric": {
    "type": "maturity_level",
    "label": "Maturity Level",
    "values": [
      { "value": "1", "label": "Initial" },
      { "value": "2", "label": "Managed" },
      { "value": "3", "label": "Defined" },
      { "value": "4", "label": "Quantitatively Managed" },
      { "value": "5", "label": "Optimizing" }
    ],
    "defaultValue": "1"
  }
}
```

`type` must be one of: `regulatory_assessment` | `internal_policy_procedure` | `international_standards`

**Validation rules:**
- `complianceMetric` is required
- `defaultValue` must exist in the `values` array
- Each value object needs both `value` (string) and `label` (string)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "displayId": "1",
  "displayName": "SAMA CSF",
  "type": "regulatory_assessment",
  "status": "active",
  "complianceMetric": { ... },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Update Framework
**PATCH** `/api/framework/:id`

All fields are optional. If updating `complianceMetric`, all its sub-fields must be provided together (all-or-nothing).

```json
{
  "displayName": "Updated Name",
  "status": "active",
  "complianceMetric": {
    "type": "percentage",
    "label": "Compliance Percentage",
    "values": [
      { "value": "0", "label": "0%" },
      { "value": "25", "label": "25%" },
      { "value": "50", "label": "50%" },
      { "value": "75", "label": "75%" },
      { "value": "100", "label": "100%" }
    ],
    "defaultValue": "0"
  }
}
```

---

### List Active Frameworks
**GET** `/api/framework/list`

Optional query: `?type=regulatory_assessment`

Returns minimal framework info (id, displayId, displayName, type). To get full details including `complianceMetric`, use the GET by ID endpoint.

---

### Get Framework by ID
**GET** `/api/framework/:id`

Returns full framework document including `complianceMetric` configuration. Use this when you need the metric values to render the assessment metric selector.

---

### Upload Framework via CSV
**POST** `/api/framework/upload-csv`

Multipart form data. Creates the framework and bulk-inserts all controls from the CSV.

| Field | Type | Description |
|-------|------|-------------|
| `displayName` | string | Framework name |
| `type` | string | Framework type enum |
| `file` | file | CSV file |

Frameworks uploaded via CSV automatically get a default `maturity_level` metric (5-level: Initial → Optimizing).

**Response:**
```json
{
  "framework": { ... },
  "domainsCount": 5,
  "subdomainsCount": 12,
  "controlsCount": 48,
  "message": "Framework and controls created successfully"
}
```

#### CSV Format

**Required columns:**
```
domainCode, domainName, controlCode, controlName
```

**Optional columns:**
```
subdomainCode, subdomainName, property:<keyName>
```

Use `property:` prefix to add custom metadata to controls. Different frameworks can define completely different property keys.

**Example:**
```csv
domainCode,domainName,subdomainCode,subdomainName,controlCode,controlName,property:riskLevel
3.1,Cyber Security Leadership,3.1.1,Governance,3.1.1-1,Establish a cyber security committee,high
3.1,Cyber Security Leadership,,,3.1.2-1,Define security objectives,medium
AC,Access Control,,,AC-1,Access Control Policy,critical
```

**Notes:**
- Subdomains are optional — leave empty for frameworks without them
- Same `domainCode` used in multiple rows is treated as the same domain
- `controlCode` must be unique per framework
- No hierarchical consistency validation — backend accepts same domainCode with different domainNames

#### Dynamic Properties Examples

**SAMA framework:**
```csv
property:riskLevel, property:complianceType, property:auditFrequency
high, mandatory, quarterly
```

**ISO 27001:**
```csv
property:clause, property:controlType, property:assetType
```

**NIST:**
```csv
property:category, property:implementationTime, property:riskLevel
technical, 30 days, high
```

Controls without a value for a `property:` column get `properties: {}` (empty object).

---

## Error Responses

| Error | Cause |
|-------|-------|
| `defaultValue must exist in values array` | `defaultValue` not in `values` list |
| `complianceMetric is required` | Missing complianceMetric on create |
| `Framework compliance metric not configured` | Creating assessment against framework with no metric |

---

## Frontend Integration

### Framework creation form
- Dropdown for `type` (regulatory_assessment / internal_policy_procedure / international_standards)
- Dropdown for `complianceMetric.type` — only `maturity_level` and `percentage` are valid
- Dynamic list for adding value/label pairs
- Dropdown for `defaultValue` populated from the values list
- Validate that `defaultValue` is in the values array before submitting

### Fetching metric config for assessment forms
```typescript
// When an assessment is selected/created, fetch the framework to get metric config
const framework = await fetch(`/api/framework/${assessment.framework}`);
const { complianceMetric } = await framework.json();

// Render a dropdown for the auditor to set complianceMetricValue
<Select
  label={complianceMetric.label}
  options={complianceMetric.values.map(v => ({ value: v.value, label: v.label }))}
  value={assessment.complianceMetricValue}
  onChange={(val) => updateAssessment({ complianceMetricValue: val })}
/>
```

### Metric type examples

**Maturity Level (SAMA, ISO, etc.):**
```json
{
  "type": "maturity_level",
  "label": "Maturity Level",
  "values": [
    { "value": "1", "label": "Initial" },
    { "value": "2", "label": "Managed" },
    { "value": "3", "label": "Defined" },
    { "value": "4", "label": "Quantitatively Managed" },
    { "value": "5", "label": "Optimizing" }
  ],
  "defaultValue": "1"
}
```

**Percentage (NCA, etc.):**
```json
{
  "type": "percentage",
  "label": "Compliance Percentage",
  "values": [
    { "value": "0", "label": "0%" },
    { "value": "25", "label": "25%" },
    { "value": "50", "label": "50%" },
    { "value": "75", "label": "75%" },
    { "value": "100", "label": "100%" }
  ],
  "defaultValue": "0"
}
```
