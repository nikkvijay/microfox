## Fillout REST API TypeScript SDK Summary

This document summarizes the Fillout REST API for generating a TypeScript SDK.  All endpoints require authentication using an API Key via the `Authorization` header.

**Base URL:** `https://api.fillout.com` (May vary for self-hosted instances or EU agent - check your Fillout dashboard).

**Authentication:** `Bearer <your-api-key>` in the `Authorization` header.  Replace `<your-api-key>` with your actual API key.  Access tokens from 3rd party integrations are also supported (see Fillout documentation for integration details).

**Rate Limits:** 5 requests per second per account/API key for all endpoints.

---

### 1. Get Forms

* **Description:** Retrieves a list of all your forms.
* **Endpoint:** `/v1/api/forms`
* **Method:** `GET`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Parameters:** None
* **Response Format:** JSON array of form objects
* **Response Data Structure:**
```typescript
interface Form {
  name: string;
  formId: string;
}

// Example Response:
[
  {
    "name": "My example form",
    "formId": "vso9PzRfHQus"
  },
  // ... more forms
]
```

---

### 2. Get Form Metadata

* **Description:** Retrieves metadata for a specific form, including questions, calculations, URL parameters, scheduling, payments, and quiz settings (if applicable).
* **Endpoint:** `/v1/api/forms/{formId}`
* **Method:** `GET`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Parameters:**
    * `formId` (URL parameter, string, required): The public ID of the form.
* **Response Format:** JSON object representing the form metadata.
* **Response Data Structure:**
```typescript
// See detailed type definitions below main summary
interface FormMetadata {
  // ... (see below)
}
```
* **Edge Cases:**  New field types are added regularly. The SDK should handle unknown question/calculation types gracefully, perhaps by logging a warning and omitting the unknown field.


---

### 3. Get All Submissions

* **Description:** Retrieves all submissions for a specific form.
* **Endpoint:** `/v1/api/forms/{formId}/submissions`
* **Method:** `GET`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Parameters:**
    * `formId` (URL parameter, string, required): The public ID of the form.
    * `limit` (query parameter, number, optional): Maximum number of submissions to retrieve (1-150, default 50).
    * `afterDate` (query parameter, string, optional): Filter submissions submitted after this date (YYYY-MM-DDTHH:mm:ss.sssZ).
    * `beforeDate` (query parameter, string, optional): Filter submissions submitted before this date (YYYY-MM-DDTHH:mm:ss.sssZ).
    * `offset` (query parameter, number, optional): Starting position for fetching submissions (default 0).
    * `status` (query parameter, string, optional):  `in_progress` to get unfinished submissions (requires Business plan). Default is finished submissions.
    * `includeEditLink` (query parameter, boolean, optional): Include an edit link for each submission.
    * `includePreview` (query parameter, boolean, optional): Include preview responses.
    * `sort` (query parameter, string, optional): Sort order (`asc` or `desc`, default `asc`).
    * `search` (query parameter, string, optional): Filter submissions containing this text.
* **Response Format:** JSON object containing an array of submissions and pagination information.
* **Response Data Structure:**
```typescript
// See detailed type definitions below main summary
interface SubmissionResponse {
  // ... (see below)
}
```
* **Edge Cases:** Handle unknown question/calculation types.  Ensure date parameters are correctly formatted.


---

### 4. Get Submission by ID

* **Description:** Retrieves a specific submission by its ID.
* **Endpoint:** `/v1/api/forms/{formId}/submissions/{submissionId}`
* **Method:** `GET`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Parameters:**
    * `formId` (URL parameter, string, required): The public ID of the form.
    * `submissionId` (URL parameter, string, required): The ID of the submission.
    * `includeEditLink` (query parameter, boolean, optional): Include an edit link for the submission.
* **Response Format:** JSON object containing the submission data.
* **Response Data Structure:**
```typescript
interface SingleSubmissionResponse {
  submission: Submission; // Submission type is the same as in Get All Submissions
}
```
* **Edge Cases:** Handle unknown question/calculation types.



---

### 5. Delete Submission by ID

* **Description:** Deletes a specific submission.
* **Endpoint:** `/v1/api/forms/{formId}/submissions/{submissionId}`
* **Method:** `DELETE`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Parameters:**
    * `formId` (URL parameter, string, required): The public ID of the form.
    * `submissionId` (URL parameter, string, required): The ID of the submission.
* **Response Format:** None (or a simple success/failure status code).



---

### 6. Create a Webhook

* **Description:** Creates a webhook to receive submission notifications.
* **Endpoint:** `/v1/api/webhook/create`
* **Method:** `POST`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Body:** JSON object
    * `formId` (string, required): The public ID of the form.
    * `url` (string, required): The webhook URL.
* **Response Format:** JSON object containing the webhook ID.
* **Response Data Structure:**
```typescript
interface WebhookCreateResponse {
  id: number;
}
```



---

### 7. Remove a Webhook

* **Description:** Removes a webhook.
* **Endpoint:** `/v1/api/webhook/delete`
* **Method:** `POST`  (This should probably be `DELETE` - consider this when building the SDK)
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Body:** JSON object
    * `webhookId` (number, required): The ID of the webhook to remove.
* **Response Format:** None (or a simple success/failure status code).


---


### 8. Create Submissions

* **Description:** Creates new submissions for a form.  Maximum 10 submissions per request.
* **Endpoint:** `/v1/api/forms/{formId}/submissions`
* **Method:** `POST`
* **Request Headers:** `Authorization: Bearer <your-api-key>`
* **Request Parameters:**
    * `formId` (URL parameter, string, required): The public ID of the form.
* **Request Body:**  JSON object containing an array of submissions.
* **Request Data Structure:**  (See below for detailed types)
* **Response Format:** JSON object containing an array of the created submissions.
* **Response Data Structure:**
```typescript
interface CreateSubmissionsResponse {
  submissions: Submission[]; // Same Submission type as in Get All Submissions
}
```
* **Edge Cases:**  Handle the 10 submission limit per request in the SDK.  Ensure date formats are correct.



---

## Detailed Type Definitions (TypeScript)


```typescript
// Question Types (expand as needed - see documentation for full list)
type QuestionType = 
  | 'Address' | 'AudioRecording' | 'Calcom' | 'Calendly' | 'Captcha'
  | 'Checkbox' | 'Checkboxes' | 'ColorPicker' | 'CurrencyInput' | 'DatePicker' 
  | 'DateRange' | 'DateTimePicker' | 'Dropdown' | 'EmailInput' | 'FileUpload' 
  | 'ImagePicker' | 'LocationCoordinates' | 'LongAnswer' | 'Matrix' | 'MultiSelect' 
  | 'MultipleChoice' | 'NumberInput' | 'OpinionScale' | 'Password' | 'Payment' 
  | 'PhoneNumber' | 'Ranking' | 'RecordPicker' | 'ShortAnswer' | 'Signature' 
  | 'Slider' | 'StarRating' | 'Subform' | 'SubmissionPicker' | 'Switch' | 'Table' 
  | 'TimePicker' | 'URLInput';


type CalculationType = 'number' | 'text' | 'duration';

interface Question {
  id: string;
  name: string;
  type: QuestionType;
  value?: any; //  Value can be various types depending on the question type.
}

interface Calculation {
  id: string;
  name: string;
  type: CalculationType;
  value?: string | number;
}

interface URLParameter {
  id: string;
  name: string;
  value?: string;
}

interface SchedulingValue {
  fullName: string;
  email: string;
  timezone: string;
  eventStartTime: string;
  eventEndTime: string;
  eventId?: string;
  eventUrl?: string;
  rescheduleOrCancelUrl?: string;
  userId?: number; // For Create Submissions
  scheduledUserEmail?: string; // For Create Submissions
  meetingNotes?: string; // For Create Submissions
}

interface Scheduling {
    id: string;
    name: string;
    value?: SchedulingValue;
}

interface PaymentValue {
  stripeCustomerId?: string;
  stripeCustomerUrl?: string;
  stripePaymentUrl?: string;
  totalAmount?: number;
  currency?: string;
  email?: string;
  discountCode?: string;
  status?: string;
  paymentId: string;
  stripeSubscriptionId?: string;
}

interface Payment {
    id: string;
    name: string;
    value?: PaymentValue;
}

interface Login {
    email: string;
}

interface Quiz {
  enabled: boolean;
  score?: number; // For submissions
  maxScore?: number; // For submissions
}

interface FormMetadata {
  id: string;
  name: string;
  questions: Question[];
  calculations: Calculation[];
  urlParameters: URLParameter[];
  scheduling?: Scheduling[];
  payments?: Payment[];
  quiz?: Quiz;
}


interface Submission {
  questions: Question[];
  calculations: Calculation[];
  urlParameters: URLParameter[];
  quiz?: Quiz;
  submissionId: string;
  submissionTime: string;
  scheduling?: Scheduling[];
  payments?: Payment[];
  login?: Login;
  lastUpdatedAt?: string; // For Create Submissions
}


interface SubmissionResponse {
  responses: Submission[];
  totalResponses: number;
  pageCount: number;
}

// ... add other types as needed (e.g., for webhook responses, error handling, etc.)

```



This detailed summary provides the necessary information to build a robust and type-safe TypeScript SDK for the Fillout REST API.  Remember to handle potential edge cases like unknown question types and rate limiting to ensure a reliable integration.