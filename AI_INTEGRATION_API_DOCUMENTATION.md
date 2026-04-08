# AI Integration API Documentation

## Overview

This document covers the AI integration layer for the CAP Assessment platform. It is intended for **three audiences**:

- **Backend** — implementation reference
- **Frontend** — how to integrate the AI button and display results
- **AI Team** — how to fetch data and deliver results

---

## Who Uses What

| Audience | Routes | Auth Method |
|----------|--------|-------------|
| Frontend | `POST /api/assesment/:id/trigger-ai` | JWT (Bearer token) |
| Frontend | `GET /api/assesment/:id` | JWT (Bearer token) — to read `aiResult` |
| AI Team | `GET /api/ai/frameworks` | `x-api-key` header |
| AI Team | `GET /api/ai/frameworks/:frameworkId/controls` | `x-api-key` header |
| AI Team | `GET /api/ai/controls/:controlCode` | `x-api-key` header |
| AI Team | `POST /api/ai/webhook/result` | `x-webhook-secret` header |

---

## How the Full Flow Works

```
[Frontend]                        [Backend]                        [AI Machine]
    |                                 |                                  |
    |-- POST /assesment/:id/trigger-ai (JWT) -->                         |
    |                                 |-- POST AI_SERVICE_URL/analyze --> |
    |<-- 200 "AI analysis triggered" -|                                  |
    |                                 |             (processing...)      |
    |                                 |<-- POST /api/ai/webhook/result --|
    |                                 |    (saves result to assessment)  |
    |-- GET /assesment/:id (JWT) ----->|                                  |
    |<-- assessment with aiResult -----|                                  |
```

**Key point:** The trigger returns immediately. The frontend does not wait for the AI result — it polls the assessment endpoint until `aiResult` is no longer `null`.

---

## Frontend Integration Guide

### 1. The "Get AI Result" Button

Place this button on the assessment detail page. It should be visible when:
- The assessment exists (any status)
- Optionally: disable it while a result is already being fetched (use local loading state)

### 2. Trigger AI Analysis

**Method:** `POST`
**URL:** `/api/assesment/:id/trigger-ai`
**Auth:** `Authorization: Bearer <jwt_token>`
**Body:** none

**Response:**
```json
{ "message": "AI analysis triggered. Result will be delivered via webhook." }
```

**Error responses:**
```json
{ "error": "Assessment not found" }       // 404
{ "error": "Not authorized to access this route" }  // 401 (missing/invalid JWT)
{ "error": "AI service URL not configured" }  // 500
```

### 3. Polling for the Result

After triggering, poll `GET /api/assesment/:id` every few seconds until `aiResult` is not `null`.

```typescript
const pollForAiResult = async (assessmentId: string, token: string) => {
  const MAX_ATTEMPTS = 20;   // ~2 minutes total
  const INTERVAL_MS = 6000;  // every 6 seconds

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));

    const res = await fetch(`/api/assesment/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const assessment = await res.json();

    if (assessment.aiResult !== null) {
      return assessment.aiResult;
    }
  }

  throw new Error('AI result timed out. Please try again later.');
};
```

### 4. Complete Button Flow Example

```typescript
const handleGetAiResult = async () => {
  setAiLoading(true);
  setAiError(null);

  try {
    // Step 1: Trigger
    await fetch(`/api/assesment/${assessmentId}/trigger-ai`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    // Step 2: Poll until result arrives
    const result = await pollForAiResult(assessmentId, token);
    setAiResult(result);
  } catch (err) {
    setAiError('Failed to get AI result. Please try again.');
  } finally {
    setAiLoading(false);
  }
};
```

### 5. UI States to Handle

| State | What to show |
|-------|-------------|
| `aiResult === null`, not loading | "Get AI Result" button |
| `aiLoading === true` | Spinner + "Analyzing..." text, button disabled |
| `aiResult !== null` | Display the result, show "Refresh AI Result" button |
| `aiError !== null` | Error message + retry button |

### 6. Re-trigger After Evidence Upload

When the user uploads a new document or submits new evidence, call the trigger endpoint again after the upload completes. The new AI result will overwrite the previous one.

```typescript
const handleEvidenceUpload = async (file: File) => {
  await uploadEvidence(file);           // your existing upload logic
  await triggerAiAnalysis(assessmentId); // call trigger again
  await pollForAiResult(assessmentId);   // poll for fresh result
};
```

### 7. Where `aiResult` Lives

`aiResult` is a field on the assessment document returned by `GET /api/assesment/:id`. It is `null` by default and gets populated once the AI machine delivers its result via webhook.

```typescript
// Assessment object shape (relevant fields)
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Q1 2024 Access Control Review",
  "status": "in_progress",
  // ... other fields ...
  "aiResult": null          // before AI runs
  // or
  "aiResult": {             // after AI delivers result
    "summary": "...",
    "riskLevel": "medium",
    "score": 72,
    "recommendations": ["..."]
    // structure defined by AI team
  }
}
```

> **Note:** The exact structure of `aiResult` is defined by the AI team. Coordinate with them on what fields to expect so you can render it properly.

---

## AI Team Guide

### Authentication

All AI team routes use a static API key passed as a request header:
```
x-api-key: <AI_API_KEY>
```

The webhook uses a separate secret:
```
x-webhook-secret: <AI_WEBHOOK_SECRET>
```

Both values will be shared with you by the backend team.

---

### 1. List Frameworks

**Method:** `GET`
**URL:** `/api/ai/frameworks`

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

**Method:** `GET`
**URL:** `/api/ai/frameworks/:frameworkId/controls`

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

### 3. Get Control Details by Control Code

**Method:** `GET`
**URL:** `/api/ai/controls/:controlCode`

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

### 4. Receiving a Trigger (Inbound from Backend)

When a user requests AI analysis, the backend will call your service at:
```
POST <AI_SERVICE_URL>/analyze
```

**Payload the backend sends:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "assessment": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Q1 2024 Access Control Review",
    "frameworkName": "ISO 27001",
    "controlId": "A.5.1",
    "controlName": "Policies for information security",
    "status": "in_progress",
    "attachments": ["https://..."],
    "complianceMetricValue": "3"
  }
}
```

Process this asynchronously and deliver the result via the webhook below.

---

### 5. Webhook — Deliver AI Result

Once processing is complete, POST the result back to:

**Method:** `POST`
**URL:** `/api/ai/webhook/result`
**Header:** `x-webhook-secret: <AI_WEBHOOK_SECRET>`

**Request Body:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "result": {
    "summary": "The access control policy shows partial compliance...",
    "riskLevel": "medium",
    "score": 72,
    "recommendations": [
      "Update policy documentation",
      "Conduct staff training"
    ]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assessmentId` | string | Yes | The same `assessmentId` received in the trigger payload |
| `result` | object | Yes | Your analysis output — any JSON structure, stored as-is |

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
AI_SERVICE_URL=http://ai-service.internal/api
```

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` | Shared with AI team for read access to framework/control data |
| `AI_WEBHOOK_SECRET` | Shared with AI team for posting results back via webhook |
| `AI_SERVICE_URL` | URL of the AI service — backend calls `AI_SERVICE_URL/analyze` on trigger |
