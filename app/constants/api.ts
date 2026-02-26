// Environment-based API configuration
const USE_LOCALHOST = import.meta.env.USE_LOCALHOST === "true";

const PROD_API_URL = import.meta.env.PROD_API_URL;
const LOCAL_API_URL = import.meta.env.LOCAL_API_URL;

// Validate that environment variables are set
if (!PROD_API_URL || !LOCAL_API_URL) {
  throw new Error('Missing required environment variables: PROD_API_URL and/or LOCAL_API_URL');
}

export const API_BASE_URL = USE_LOCALHOST ? LOCAL_API_URL : PROD_API_URL;


// Specific endpoint URLs
export const PATIENT_ENDPOINT = `${API_BASE_URL}/patients`;
export const STAFF_ENDPOINT = `${API_BASE_URL}/staff`;
export const ACUPOINT_ENDPOINT = `${API_BASE_URL}/acupoints`;
export const ACUPOINT_LOCATION_ENDPOINT = `${API_BASE_URL}/acupointLocations`;
export const ACUPUNCTURE_ENDPOINT = `${API_BASE_URL}/acupunctures`;
export const ILLNESS_ENDPOINT = `${API_BASE_URL}/illnesses`;
export const MERIDIAN_ENDPOINT = `${API_BASE_URL}/meridians`;
export const APPOINTMENT_ENDPOINT = `${API_BASE_URL}/appointments`;
export const MEDICAL_RECORD_ENDPOINT = `${API_BASE_URL}/medicalRecords`;
export const MEDICAL_RECORD_ACUPUNCTURE_ENDPOINT = `${API_BASE_URL}/medicalRecordAcupunctures`;
export const MEDICAL_RECORD_ILLNESS_ENDPOINT = `${API_BASE_URL}/medicalRecordIllnesses`;
export const ILLNESS_ACUPUNCTURE_ENDPOINT = `${API_BASE_URL}/illnessAcupunctures`;
export const GEMINI_ENDPOINT = `${API_BASE_URL}/suggest`;
export const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

