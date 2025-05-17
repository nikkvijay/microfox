import { z } from 'zod';
import { QuestionType, CalculationType } from '../types';

const questionTypeSchema = z.enum([
  'Address', 'AudioRecording', 'Calcom', 'Calendly', 'Captcha',
  'Checkbox', 'Checkboxes', 'ColorPicker', 'CurrencyInput', 'DatePicker',
  'DateRange', 'DateTimePicker', 'Dropdown', 'EmailInput', 'FileUpload',
  'ImagePicker', 'LocationCoordinates', 'LongAnswer', 'Matrix', 'MultiSelect',
  'MultipleChoice', 'NumberInput', 'OpinionScale', 'Password', 'Payment',
  'PhoneNumber', 'Ranking', 'RecordPicker', 'ShortAnswer', 'Signature',
  'Slider', 'StarRating', 'Subform', 'SubmissionPicker', 'Switch', 'Table',
  'TimePicker', 'URLInput'
] as const);

const calculationTypeSchema = z.enum(['number', 'text', 'duration'] as const);

export const questionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: questionTypeSchema,
  value: z.any().optional(),
});

export const calculationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: calculationTypeSchema,
  value: z.union([z.string(), z.number()]).optional(),
});

export const urlParameterSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string().optional(),
});

export const schedulingValueSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  timezone: z.string(),
  eventStartTime: z.string(),
  eventEndTime: z.string(),
  eventId: z.string().optional(),
  eventUrl: z.string().url().optional(),
  rescheduleOrCancelUrl: z.string().url().optional(),
  userId: z.number().optional(),
  scheduledUserEmail: z.string().email().optional(),
  meetingNotes: z.string().optional(),
});

export const schedulingSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: schedulingValueSchema.optional(),
});

export const paymentValueSchema = z.object({
  stripeCustomerId: z.string().optional(),
  stripeCustomerUrl: z.string().url().optional(),
  stripePaymentUrl: z.string().url().optional(),
  totalAmount: z.number().optional(),
  currency: z.string().optional(),
  email: z.string().email().optional(),
  discountCode: z.string().optional(),
  status: z.string().optional(),
  paymentId: z.string(),
  stripeSubscriptionId: z.string().optional(),
});

export const paymentSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: paymentValueSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
});

export const quizSchema = z.object({
  enabled: z.boolean(),
  score: z.number().optional(),
  maxScore: z.number().optional(),
});

export const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.array(questionSchema),
  calculations: z.array(calculationSchema),
  urlParameters: z.array(urlParameterSchema),
  scheduling: z.array(schedulingSchema).optional(),
  payments: z.array(paymentSchema).optional(),
  quiz: quizSchema.optional(),
});

export const submissionSchema = z.object({
  questions: z.array(questionSchema),
  calculations: z.array(calculationSchema),
  urlParameters: z.array(urlParameterSchema),
  quiz: quizSchema.optional(),
  submissionId: z.string(),
  submissionTime: z.string(),
  scheduling: z.array(schedulingSchema).optional(),
  payments: z.array(paymentSchema).optional(),
  login: loginSchema.optional(),
  lastUpdatedAt: z.string().optional(),
});

export const submissionResponseSchema = z.object({
  responses: z.array(submissionSchema),
  totalResponses: z.number(),
  pageCount: z.number(),
});

export const singleSubmissionResponseSchema = z.object({
  submission: submissionSchema,
});

export const webhookCreateResponseSchema = z.object({
  id: z.number(),
});

export const createSubmissionsResponseSchema = z.object({
  submissions: z.array(submissionSchema),
});

export const formListSchema = z.array(z.object({
  name: z.string(),
  formId: z.string(),
}));
