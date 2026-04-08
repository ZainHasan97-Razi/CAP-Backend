# AI Integration API Documentation

## Overview

This document covers the AI integration layer for the CAP Assessment platform. It includes:
1. External read APIs for the AI team to fetch framework/control data
2. An internal trigger API to kick off AI analysis for an assessment
3. A webhook API for the AI system to deliver results back

All AI routes are under `/api/ai` and are **public routes** (no JWT required), but protected by their own key-based authentication.

---

## Authentication

### External API Key (AI team read access + trigger)
All routes except the webhook require the header:
```
x-api-key: <AI_API_KEY>
```
The value is set in the server `.env` as `AI_API_KEY`.

### Webhook Secret (AI team result delivery)
The webhook route requires:
```
x-webhook-secret: <AI_WEBHOOK_SECRET>
```
The value is set in the server `.env` as `AI_WEBHOOK_SECRET`.

---

## Endpoints Summary

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/ai/frameworks` | API Key | List all active frameworks |
| GET | `/api/ai/frameworks/:frameworkId/controls` | API Key | List controls for a framework |
| GET | `/api/ai/controls/:controlCode` | API Key | Get control details by control code |
| POST | `/api/ai/assessments/:assessmentId/trigger` | API Key | Trigger AI analysis for an assessment |
| POST | `/api/ai/webhook/result` | Webhook Secret | Receive and save AI result |

---

## 1. List Frameworks

**Method:** `GET`
**URL:** `/api/ai/frameworks`
**Auth:** `x-api-key`

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

## 2. List Controls by Framework

**Method:** `GET`
**URL:** `/api/ai/frameworks/:frameworkId/controls`
**Auth:** `x-api-key`

**Path Parameter:**

| Parameter | Description |
|-----------|-------------|
| `frameworkId` | MongoDB ObjectId of the framework |

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

## 3. Get Control Details by Control Code

**Method:** `GET`
**URL:** `/api/ai/controls/:controlCode`
**Auth:** `x-api-key`

**Path Parameter:**

| Parameter | Description |
|-----------|-------------|
| `controlCode` | The control code string (e.g. `A.5.1`) |

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

**Error (404):**
```json
{ "error": "Control not found" }
```

---

## 4. Trigger AI Analysis

**Method:** `POST`
**URL:** `/api/ai/assessments/:assessmentId/trigger`
**Auth:** `x-api-key`

This is called from the frontend (via backend) when the user clicks the "Get AI Result" button. The server fires a request to the AI service and **immediately returns** without waiting for the result. The AI system processes asynchronously and delivers the result via the webhook.

**Path Parameter:**

| Parameter | Description |
|-----------|-------------|
| `assessmentId` | MongoDB ObjectId of the assessment |

**What the server sends to the AI service (`AI_SERVICE_URL/analyze`):**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "assessment": { /* full assessment document */ }
}
```

**Response (immediate):**
```json
{
  "message": "AI analysis triggered. Result will be delivered via webhook."
}
```

**Error (404):**
```json
{ "error": "Assessment not found" }
```

### When is this triggered?
- When the user clicks the "Get AI Result" button on an assessment
- When a user uploads/submits a new document or evidence (call this endpoint again to get a fresh AI result)

---

## 5. Webhook — Receive AI Result

**Method:** `POST`
**URL:** `/api/ai/webhook/result`
**Auth:** `x-webhook-secret`

This endpoint is exposed to the AI team. Once the AI machine finishes processing, it calls this webhook with the result. The result is saved as JSON into the `aiResult` field of the assessment document.

**Request Body:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "result": {
    "summary": "...",
    "riskLevel": "medium",
    "recommendations": ["..."],
    "score": 72,
    "details": {}
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assessmentId` | string | Yes | MongoDB ObjectId of the assessment to update |
| `result` | object/any | Yes | AI-generated result — stored as-is in `aiResult` field |

**Response:**
```json
{
  "message": "AI result saved successfully"
}
```

**Error (400):**
```json
{ "error": "assessmentId and result are required" }
```

**Error (404):**
```json
{ "error": "Assessment not found" }
```

---

## Assessment Schema — `aiResult` Field

The `aiResult` field has been added to the Assessment collection:

```typescript
aiResult: { type: Mixed, default: null }
```

- Default value is `null` (no AI result yet)
- Overwritten every time the webhook delivers a new result
- The structure of the JSON is flexible — whatever the AI team sends is stored as-is

---

## Environment Variables

Add these to your `.env` file:

```env
AI_API_KEY=cap-ai-external-key-2024
AI_WEBHOOK_SECRET=cap-webhook-secret-2024
AI_SERVICE_URL=http://ai-service.internal/api
```

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` | Shared key given to the AI team for read + trigger access |
| `AI_WEBHOOK_SECRET` | Secret the AI team must include when posting results back |
| `AI_SERVICE_URL` | Base URL of the AI service that receives trigger requests |

---

## Full Flow

```
1. User opens an assessment in the frontend
2. User clicks "Get AI Result" button
   → Frontend calls: POST /api/ai/assessments/:assessmentId/trigger  (x-api-key)
   → Server fires request to AI_SERVICE_URL/analyze (fire-and-forget)
   → Server responds immediately: "AI analysis triggered"

3. AI machine processes the assessment (may take time)

4. AI machine sends result back:
   → POST /api/ai/webhook/result  (x-webhook-secret)
   → Server saves result into assessment.aiResult

5. Frontend polls or refreshes to show the AI result from the assessment document

--- Re-trigger on new evidence ---

6. User uploads a new document/evidence to the assessment
7. After upload completes, frontend calls trigger endpoint again (step 2)
8. AI machine re-processes and delivers fresh result via webhook (steps 3-4)
   → Previous aiResult is overwritten with the new result
```

---

## Notes for AI Team

- Use `GET /api/ai/frameworks` to discover available frameworks
- Use `GET /api/ai/frameworks/:frameworkId/controls` to get all controls for a framework
- Use `GET /api/ai/controls/:controlCode` to get full details of a specific control
- When sending results via webhook, the `result` field can be any JSON structure — it is stored as-is
- Always include `x-webhook-secret` header when posting to the webhook endpoint
- The `assessmentId` in the webhook body must match the one sent in the trigger payload
