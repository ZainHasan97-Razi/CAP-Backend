# Assessment Module Guide

This document explains the module architecture, assessment types, and all user flows end-to-end.

→ Back to [README](../../README.md)  
→ For endpoint reference see [Assessments API](ASSESSMENTS_API.md)

---

## Assessment Types

### Individual Assessment
A standalone assessment for one specific control in one framework.

### Common Assessment
A single logical assessment that covers the same control mapped across multiple frameworks simultaneously. All the related records share the same `assesmentId` UUID.

**Example:** Control "Access Control Policy" exists in ISO 27001 (A.5.1), SOC 2 (CC6.1), and NIST CSF (PR.AC-1). One common assessment creates three records — one per framework — all under the same UUID.

**Benefits:** Single evidence collection effort covers all three frameworks.

---

## Architecture

```
Assessment Module
├── Common Assessment
│   ├── Creates N records (one per framework), all sharing assesmentId UUID
│   └── Import evidence once → copies to all related records
│
└── Individual Assessment
    ├── Creates 1 record
    └── Import evidence separately
```

---

## User Flows

### Flow 1 — New Individual Assessment (No Evidence Reuse)

```
1. User selects framework + control
2. Fills assessment details (name, dates, departments, participants)
3. POST /api/assesment/create → status: "open"
4. User adds evidence via comments
5. Status auto-updates to "in_progress"
```

---

### Flow 2 — New Individual Assessment (Reuse Previous Evidence)

```
1. User selects framework + control
2. GET /api/control/details/:controlCode → shows recentAssessments
3. User picks a previous closed assessment to import from
4. POST /api/assesment/create → status: "open"
5. PATCH /api/assesment/:id/import-evidence → status: "in_progress", comments copied
```

---

### Flow 3 — New Common Assessment

```
1. User selects a common control (GET /api/common-control/list)
2. System shows which frameworks the control is mapped to
3. User fills assessment details
4. POST /api/assesment/create once per mapped framework (same assesmentId UUID)
5. All records start with status: "open"
6. User adds evidence to any one → evidence auto-copies to all in the group
```

**API flow:**
```typescript
const assessmentId = uuidv4();

for (const mappedControl of commonControl.mappedControls) {
  await api.post('/assesment/create', {
    assesmentId: assessmentId,          // same UUID for all
    control: mappedControl.controlId,   // MongoDB _id
    framework: mappedControl.frameworkId,
    ...formData
  });
}
```

---

### Flow 4 — Import Evidence into Existing Assessment

```
1. User opens an existing assessment (open or in_progress)
2. Clicks "Import Evidence"
3. System shows recent closed assessments for same control
4. User picks source assessment
5. PATCH /api/assesment/:id/import-evidence

Result:
- First import: all comments from source are copied
- Re-import: previously imported comments are replaced, manually added ones are kept
- Status: open → in_progress
```

**What gets copied on import:**
- ✅ Comment content
- ✅ Comment attachments (evidence files)
- ✅ Evidence type (implementation/design/architectural)
- ❌ Replies (only top-level comments)
- ❌ Original timestamps (new timestamps created)
- ❌ Approval status (resets to pending)

---

## Evidence & Approval Flow

```
Participant adds comment with attachment
        ↓
approvalStatus = "pending"
AI analysis triggered automatically
        ↓
Auditor reviews evidence
        ↓
    approved?
   ↙         ↘
  YES          NO
  ↓             ↓
Green badge   Red badge
AI re-runs    Auditor replies with reason
              Participant adds new top-level comment
              (new comment starts as "pending")
```

---

## Comment Tracking

| `importedFrom` field | Meaning |
|----------------------|---------|
| `null` | Manually added by user — preserved on re-import |
| `ObjectId` | Imported from that assessment — replaced on re-import |

---

## Status Transitions

```
open
  → in_progress  (when evidence added or evidence imported)
  → discard      (manually cancelled)

in_progress
  → closed       (manually closed when assessment is complete)
  → discard      (manually cancelled)
```

---

## Database Schema

### Assessment
```typescript
{
  assesmentId: string;              // UUID — groups related assessments
  name: string;
  description: string;
  frameworkType: string;
  framework: ObjectId;              // ref: Framework
  frameworkName: string;
  control: ObjectId;                // ref: Control
  controlId: string;                // = control.controlCode
  controlName: string;
  departments: [{ id: ObjectId; name: string }];
  participants: string[];           // email addresses
  attachments: string[];            // URLs
  status: string;                   // open | in_progress | closed | discard
  complianceMetricValue: string;    // auto-set from framework defaultValue
  commonAssessmentId: ObjectId;     // which assessment evidence was imported from
  aiResult: object;                 // AI analysis result (null until AI delivers)
  startDate: number;                // Unix timestamp
  dueDate: number;                  // Unix timestamp
  createdBy: string;
}
```

### Assessment Comment
```typescript
{
  assessmentId: ObjectId;           // ref: Assesment
  parentCommentId: ObjectId;        // null = top-level comment
  content: string;
  author: string;
  authorName: string;
  attachments: string[];
  evidenceType: string;             // implementation | design | architectural
  approvalStatus: string;           // pending | approved | rejected | null
  importedFrom: ObjectId;           // null = manual, ObjectId = imported
  isEdited: boolean;
}
```

`approvalStatus` is `null` for replies and comments without attachments. It's only set to `pending`/`approved`/`rejected` for top-level comments that have attachments.
