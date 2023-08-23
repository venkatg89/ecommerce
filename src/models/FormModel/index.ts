export interface FormFieldsErrorMessages {
  [formFieldId: string]: string;
}

export interface FormErrors {
  [formId: string]: FormFieldsErrorMessages;
}

export interface ErrorMessage {
  formFieldId: string;
  error: string;
}
