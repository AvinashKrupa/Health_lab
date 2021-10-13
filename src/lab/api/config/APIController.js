import instance from './Interceptor';
import qs from 'qs';

export const API = {
  SENDOTP: 'auth/sendOtp',
  VERIFYOTP: 'auth/verifyOtp',
  REGISTERPATIENT: 'auth/registerPatient',
  GETCOUNTRY: 'country',
  GETCITY: 'city',
  GETSTATE: 'state',
  GETHOMECONTENT: 'patient/homeContent',
  GETTOPCONSULTANT: 'patient/getTopConsultants',
  GETLANGUAGE: 'languages',
  FILEUPLOAD: 'fileUpload',
  GETDEPARTMENTS: 'departments',
  GETSPECIALITIES: 'specialities',
  GETQUALIFICATIONS: 'qualifications',
  GETSLOTS: 'slot/getSlots',
  GETDOCTORDETAILS: 'doctor/getDoctorDetails',
  GETAVAILABLESLOT: 'slot/getAvailableSlots',
  BOOKAPPOINTMENT: 'patient/bookAppointment',
  CONFIRMPAYENT: 'transaction/confirmPayment',
  GETAPPOINTMENTS: 'patient/getAppointments',
  CANCELAPPOINTMENT: 'patient/cancelAppointment',
  GETMESSAGES: 'chat/getMessages',
  UPLOADREPORT: 'patient/uploadReport',
  GETREPORTS: 'patient/getReports',
  GET_PRESCRIPTIONS: 'patient/getPrescriptions',
  /**
   * Doctor related APIS
   */
  REGISTER_DOCTOR: 'auth/registerDoctor',
  GET_DOCTOR_DETAILS: 'doctor/getDoctorDetails',
  DOCTOR_HOME_CONTENT_API: 'doctor/homeContent',
  DOCTOR_GET_APPOINTMENTS_API: 'doctor/getAppointments',
  APPOINTMENT_DETAIL_API: 'appointment/getDetails',
  REMOVE_ADDITIONAL_DOCTOR: 'appointment/removeAdditionalDoctor',
  ADD_ADDITIONAL_DOCTOR: 'appointment/addDoctor',
  GET_PROFILE: 'user/profile',
  UPDATE_PROFILE: 'user/updateProfile',
  GET_MEDICINE: 'medicines?',
  GET_MEDICINE_TYPE: 'medicine/getMedicineTypes?status=active',
  SAVE_PRESCRIPTION_AS_TEMPLATE: 'prescription/saveAsTemplate',
  SUBMIT_PRESCRIPTION: 'prescription/submitPrescription',
  GET_SAVED_TEMPLATE: 'prescription/getSavedTemplate',
  GET_REPORTS_FOR_DOCTOR: 'patient/getReports',
  GET_PRESCRIPTIONS_FOR_DOCTOR: 'patient/getPrescriptions',
  DELETE_SAVED_TEMPLATES: 'prescription/deleteSavedTemplate',
  GET_AVAILABLE_SLOT: 'slot/getAvailableSlots',
  UPDATE_SCHEDULE_BY_DAY: 'user/updateProfile',
  UPDATE_SCHEDULE_BY_DATE: 'doctor/updateSchedule',

  /**
   * COMMON APIS
   */
  JOIN_APPOINTMENT: 'appointment/joinAppointment',
  END_APPOINTMENT: 'appointment/endAppointment',
  CAN_JOIN_APPOINTMENT: 'appointment/canJoinAppointment',
};

export function post(endPoint, params, isStringfy = true) {
  return instance.post(
      endPoint,
      isStringfy ? JSON.stringify(params) : qs.stringify(params),
  );
}

export function get(endPoint) {
  return instance.get(endPoint);
}

export function deleteCall(endPoint) {
  return instance.delete(endPoint);
}

export function putCall(endPoint, params) {
  return instance.put(endPoint, params);
}
