# Framework Control CSV Upload Guide

## Overview
Upload CSV files to bulk create controls for a framework. Subdomain fields are **optional** since not all frameworks have subdomains. You can also add **dynamic properties** using the `property:keyName` column format.

## CSV Format

### Required Columns
- `domainCode` - Domain identifier (e.g., "AC", "IA")
- `domainName` - Domain display name (e.g., "Access Control")
- `controlCode` - Control identifier (e.g., "AC-1", "IA-5")
- `controlName` - Control display name

### Optional Columns
- `subdomainCode` - Subdomain identifier (leave empty if not applicable)
- `subdomainName` - Subdomain display name (leave empty if not applicable)
- `property:keyName` - Dynamic properties (e.g., `property:priority`, `property:category`)

### Dynamic Properties
You can add any number of custom properties by prefixing column names with `property:`:
- `property:priority` → Adds `priority` key to properties object
- `property:category` → Adds `category` key to properties object
- `property:riskLevel` → Adds `riskLevel` key to properties object
- `property:anyCustomKey` → Adds `anyCustomKey` to properties object

## Example CSV

```csv
domainCode,domainName,subdomainCode,subdomainName,controlCode,controlName,property:priority,property:category
AC,Access Control,AC.1,User Access,AC-1,Access Control Policy,high,technical
IA,Identification,,,IA-1,ID Policy,medium,administrative
```

**Result in Database:**
```json
{
  "domainCode": "AC",
  "controlCode": "AC-1",
  "controlName": "Access Control Policy",
  "properties": {
    "priority": "high",
    "category": "technical"
  }
}
```

## API Endpoint

**POST** `/api/framework/upload-csv`

**Form Data:**
- `displayName` - Framework name
- `type` - Framework type (e.g., "compliance", "security")
- `file` - CSV file

**Response:**
```json
{
  "framework": { ... },
  "domainsCount": 2,
  "subdomainsCount": 1,
  "controlsCount": 2,
  "message": "Framework and controls created successfully"
}
```

## Notes
- Frameworks without subdomains: Leave subdomain columns empty
- Frameworks with subdomains: Fill in subdomain columns as needed
- Mixed approach: Some controls can have subdomains, others can leave them empty
