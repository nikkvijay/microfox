export type QuestionType =
  | 'Address' | 'AudioRecording' | 'Calcom' | 'Calendly' | 'Captcha'
  | 'Checkbox' | 'Checkboxes' | 'ColorPicker' | 'CurrencyInput' | 'DatePicker'
  | 'DateRange' | 'DateTimePicker' | 'Dropdown' | 'EmailInput' | 'FileUpload'
  | 'ImagePicker' | 'LocationCoordinates' | 'LongAnswer' | 'Matrix' | 'MultiSelect'
  | 'MultipleChoice' | 'NumberInput' | 'OpinionScale' | 'Password' | 'Payment'
  | 'PhoneNumber' | 'Ranking' | 'RecordPicker' | 'ShortAnswer' | 'Signature'
  | 'Slider' | 'StarRating' | 'Subform' | 'SubmissionPicker' | 'Switch' | 'Table'
  | 'TimePicker' | 'URLInput';

export type CalculationType = 'number' | 'text' | 'duration';

export interface Question {
  id: string;
  name: string;
  type: QuestionType;
  value?: any;
}

export interface Calculation {
  id: string;
  name: string;
  type: CalculationType;
  value?: string | number;
}

export interface URLParameter {
  id: string;
  name: string;
  value?: string;
}

export interface SchedulingValue {
  fullName: string;
  email: string;
  timezone: string;
  eventStartTime: string;
  eventEndTime: string;
  eventId?: string;
  eventUrl?: string;
  rescheduleOrCancelUrl?: string;
  userId?: number;
  scheduledUserEmail?: string;
  meetingNotes?: string;
}

export interface Scheduling {
  id: string;
  name: string;
  value?: SchedulingValue;
}

export interface PaymentValue {
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

export interface Payment {
  id: string;
  name: string;
  value?: PaymentValue;
}

export interface Login {
  email: string;
}

export interface Quiz {
  enabled: boolean;
  score?: number;
  maxScore?: number;
}

export interface FormMetadata {
  id: string;
  name: string;
  questions: Question[];
  calculations: Calculation[];
  urlParameters: URLParameter[];
  scheduling?: Scheduling[];
  payments?: Payment[];
  quiz?: Quiz;
}

export interface Submission {
  questions: Question[];
  calculations: Calculation[];
  urlParameters: URLParameter[];
  quiz?: Quiz;
  submissionId: string;
  submissionTime: string;
  scheduling?: Scheduling[];
  payments?: Payment[];
  login?: Login;
  lastUpdatedAt?: string;
}

export interface SubmissionResponse {
  responses: Submission[];
  totalResponses: number;
  pageCount: number;
}

export interface SingleSubmissionResponse {
  submission: Submission;
}

export interface WebhookCreateResponse {
  id: number;
}

export interface CreateSubmissionsResponse {
  submissions: Submission[];
}

export interface Form {
  name: string;
  formId: string;
}

export interface FilloutSDKOptions {
  apiKey?: string;
}
