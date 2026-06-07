# Dynamic Properties Examples

## Use Case 1: NIST Framework with Category & Implementation Time
```csv
domainCode,domainName,controlCode,controlName,property:category,property:implementationTime,property:riskLevel
AC,Access Control,AC-1,Access Control Policy,technical,30 days,high
AC,Access Control,AC-2,Account Management,technical,15 days,critical
IA,Identification,IA-1,ID Policy,administrative,45 days,medium
```

**Result:**
```json
{
  "controlCode": "AC-1",
  "properties": {
    "category": "technical",
    "implementationTime": "30 days",
    "riskLevel": "high"
  }
}
```

---

## Use Case 2: SAMA Framework with Risk & Compliance
```csv
domainCode,domainName,controlCode,controlName,property:riskLevel,property:complianceType,property:auditFrequency
CYB,Cybersecurity,SAMA-1.1,Security Policy,high,mandatory,quarterly
CYB,Cybersecurity,SAMA-1.2,Risk Assessment,critical,mandatory,monthly
GOV,Governance,SAMA-2.1,Board Oversight,medium,recommended,annually
```

**Result:**
```json
{
  "controlCode": "SAMA-1.1",
  "properties": {
    "riskLevel": "high",
    "complianceType": "mandatory",
    "auditFrequency": "quarterly"
  }
}
```

---

## Use Case 3: Mixed - Some with Properties, Some without
```csv
domainCode,domainName,controlCode,controlName,property:riskLevel
AC,Access Control,AC-1,Access Control Policy,high
AC,Access Control,AC-2,Account Management,
IA,Identification,IA-1,ID Policy,medium
```

**Result:**
- AC-1: `properties: { riskLevel: "high" }`
- AC-2: `properties: {}` (empty object)
- IA-1: `properties: { riskLevel: "medium" }`

---

## Use Case 4: Framework-Specific Metadata
Different frameworks can have completely different properties:

**ISO 27001:**
```csv
property:clause,property:controlType,property:assetType
```

**SOC 2:**
```csv
property:trustServiceCriteria,property:controlActivity,property:testingFrequency
```

**PCI DSS:**
```csv
property:requirement,property:testingProcedure,property:compensatingControl
```

---

## API Usage

### Create Control with Properties
```json
POST /api/control
{
  "frameworkId": "507f1f77bcf86cd799439011",
  "frameworkName": "NIST",
  "domainCode": "AC",
  "domainName": "Access Control",
  "controlCode": "AC-1",
  "controlName": "Access Control Policy",
  "properties": {
    "riskLevel": "high",
    "category": "technical",
    "customField": "customValue"
  }
}
```

### Update Properties
```json
PUT /api/control/:id
{
  "properties": {
    "riskLevel": "critical",
    "newField": "newValue"
  }
}
```

### Query Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "controlCode": "AC-1",
  "controlName": "Access Control Policy",
  "properties": {
    "riskLevel": "high",
    "category": "technical"
  }
}
```

---

## Benefits

✅ **Flexible** - Add any properties without schema changes
✅ **Framework-Specific** - Each framework can have unique metadata
✅ **Backward Compatible** - Existing controls work fine (empty properties object)
✅ **Easy CSV Management** - Just add `property:keyName` columns
✅ **Type-Safe** - MongoDB Map type ensures consistency
