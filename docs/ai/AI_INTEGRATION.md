# AI Integration API

→ Back to [README](../../README.md)

## Overview

This document is intended for the **AI team** — how to fetch assessment data and deliver results back to the platform. For evidence approval and the frontend evidence flow, see the [Assessment Module Guide](../assessments/ASSESSMENT_MODULE_GUIDE.md).

---

## AI Feature Toggle (super_admin)

The AI analysis feature can be enabled or disabled globally by a `super_admin`. When disabled, the backend will **not** trigger the LLM on comment creation. The webhook endpoint remains active regardless of this setting.

### Get current AI status

**Method:** `GET` | **URL:** `/api/settings` | **Auth:** Bearer token

**Response:**
```json
{ "aiEnabled": true }
```

### Toggle AI on/off

**Method:** `PATCH` | **URL:** `/api/settings/ai-toggle` | **Auth:** Bearer token — `super_admin` only

**Request Body:**
```json
{ "aiEnabled": false }
```

**Response:**
```json
{ "message": "AI feature disabled", "aiEnabled": false }
```

> Frontend should show this toggle in the admin settings panel, visible only to `super_admin`. Read the current state on page load via `GET /api/settings` and call `PATCH /api/settings/ai-toggle` on change.

---

## How the Trigger Works

When a participant posts a top-level comment with attachments, the backend **immediately** calls the AI service — no approval required. The call is fire-and-forget; the comment creation response returns to the frontend without waiting for AI.

```
Participant posts comment with attachment
        ↓
Backend saves comment → responds 200 to frontend
        ↓ (async, fire-and-forget — skipped if aiEnabled = false)
POST <LLM_URL>/evaluate  →  AI service processes
        ↓
POST /api/ai/webhook/result  →  backend saves aiResult on assessment
```

> `POST /api/assesment/:id/trigger-ai` still exists for manual re-triggering if needed.

---

## Authentication

All AI team routes use a static API key:
```
x-api-key: <AI_API_KEY>
```

The webhook uses a separate secret:
```
x-webhook-secret: <AI_WEBHOOK_SECRET>
```

Both values will be shared by the backend team.

---

## Endpoints

### 1. List Frameworks

**Method:** `GET` | **URL:** `/api/ai/frameworks`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "displayId": "1",
    "displayName": "ISO 27001",
    "type": "international_standards",
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
]
```

---

### 2. List Controls by Framework

**Method:** `GET` | **URL:** `/api/ai/frameworks/:frameworkId/controls`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "controlCode": "A.5.1",
    "controlName": "Policies for information security",
    "domainCode": "A.5",
    "domainName": "Information Security Policies",
    "subdomainCode": null,
    "subdomainName": null,
    "description": "...",
    "properties": {}
  }
]
```

---

### 3. Get Control Details

**Method:** `GET` | **URL:** `/api/ai/controls/:controlCode`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "frameworkId": "507f1f77bcf86cd799439011",
  "frameworkName": "ISO 27001",
  "controlCode": "A.5.1",
  "controlName": "Policies for information security",
  "domainCode": "A.5",
  "domainName": "Information Security Policies",
  "subdomainCode": null,
  "subdomainName": null,
  "description": "...",
  "properties": {},
  "status": "active"
}
```

---

### 4. Inbound Trigger Payload (from Backend)

When a participant posts a comment with attachments, the backend calls:
```
POST <LLM_URL>/evaluate
```

**Payload:**
```json
{
  "assessment_id": "507f1f77bcf86cd799439015",
  "evidence_type": "implementation",
  "comment": "This document outlines our access control policy...",
  "framework": "ISO 27001",
  "definition": "Policies for information security",
  "attachments": [
    "https://storage.example.com/evidence-file-1.pdf",
    "https://storage.example.com/evidence-file-2.pdf"
  ]
}
```

| Field | Description |
|-------|-------------|
| `assessment_id` | The assessment being evaluated |
| `evidence_type` | Type of evidence: `implementation`, `design`, or `architectural` |
| `comment` | The text content of the comment |
| `framework` | Name of the compliance framework (e.g. ISO 27001) |
| `definition` | The control name/definition being assessed |
| `attachments` | URLs of the uploaded evidence files |

Process asynchronously and deliver the result via the webhook below.

---

### 5. Webhook — Deliver AI Result

**Method:** `POST`
**URL:** `/api/ai/webhook/result`
**Header:** `x-webhook-secret: <AI_WEBHOOK_SECRET>`

**Request Body:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "result": {
    "request_id": "abc-123",
    "assessment_id": "507f1f77bcf86cd799439015",
    "grade": "B",
    "confidence": 0.87,
    "gaps": [
      "No signed approval found on the policy document",
      "Policy does not cover remote access scenarios"
    ],
    "recommendations": [
      "Obtain management sign-off on the policy",
      "Add a remote access section to the policy"
    ],
    "context_summary": "The submitted document is an access control policy dated 2024...",
    "file_results": [
      {
        "filename": "access-control-policy.pdf",
        "file_type": "pdf",
        "extracted_text": "...",
        "success": true,
        "error": null
      }
    ],
    "timestamp": "2026-05-05T11:26:14.245Z",
    "evaluation_count": 1,
    "arabic_output": {
      "grade": "ب",
      "gaps": ["لا يوجد توقيع إداري على الوثيقة"],
      "recommendations": ["الحصول على موافقة الإدارة"]
    }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assessmentId` | string | Yes | Same `assessment_id` from the trigger payload |
| `result` | object | Yes | Full AI response object, stored as-is on the assessment |

**Success Response:**
```json
{ "message": "AI result saved successfully" }
```

**Error Responses:**
```json
{ "error": "assessmentId and result are required" }  // 400
{ "error": "Assessment not found" }                  // 404
{ "error": "Invalid or missing webhook secret" }     // 401
```

---

## Environment Variables (Backend)

```env
AI_API_KEY=cap-ai-external-key-2024
AI_WEBHOOK_SECRET=cap-webhook-secret-2024
LLM_URL=http://llm-service.internal/api
```
