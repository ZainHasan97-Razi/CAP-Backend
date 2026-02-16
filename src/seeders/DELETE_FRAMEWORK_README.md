# Framework Cascade Delete Script

## Overview
This script permanently deletes a framework and ALL associated data from the system.

## What Gets Deleted

1. **Framework** - The framework document itself
2. **Controls** - All controls belonging to the framework
3. **Assessments** - All assessments using this framework
4. **Assessment Comments** - All comments on those assessments
5. **File Attachments** - All files uploaded to assessments (from storage)
6. **Common Control Mappings** - Removes framework from common control mappings

## Usage

### Command Line
```bash
npm run delete-framework "<Framework Name>"
```

### Examples
```bash
# Delete SAMA CSF framework
npm run delete-framework "SAMA CSF"

# Delete ISO 27001 framework
npm run delete-framework "ISO 27001"

# Delete NCA CC framework
npm run delete-framework "NCA CC"
```

## Safety Features

- ✅ Validates framework exists before deletion
- ✅ Shows what will be deleted
- ✅ 3-second countdown before execution
- ✅ Returns detailed deletion summary
- ✅ Lists available frameworks if not found

## Output Example

```
🗑️  Starting framework deletion: SAMA CSF

⚠️  WARNING: This will permanently delete:
   - Framework: SAMA CSF
   - All controls under this framework
   - All assessments using this framework
   - All assessment comments
   - All file attachments
   - Framework mappings in common controls

⏳ Proceeding with deletion in 3 seconds...

✅ Framework deleted successfully!

📊 Deletion Summary:
   Framework: SAMA Cyber Security Framework
   Controls deleted: 35
   Assessments deleted: 12
   Assessment comments deleted: 48
   Common control mappings removed: 5
   Files deleted: 23
```

## ⚠️ IMPORTANT WARNINGS

- **IRREVERSIBLE**: This operation cannot be undone
- **PRODUCTION**: Be extremely careful in production environments
- **BACKUP**: Always backup your database before running
- **DEPENDENCIES**: Deletes all dependent data (assessments, comments, files)

## Programmatic Usage

You can also use the service function directly:

```typescript
import frameworkService from './services/framewaork.service';

const summary = await frameworkService.deleteCascade(frameworkId);
console.log(summary);
```

## Troubleshooting

### Framework not found
If you get "Framework not found", the script will list all available frameworks.

### File deletion errors
File deletion errors are logged but don't stop the process. Check logs for details.

### Database connection issues
Ensure your `.env` file has correct `DATABASE_URL` configured.