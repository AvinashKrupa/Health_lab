import { initializeApp } from "firebase/app";

export const FIREBASE_VAPID_KEY ='BIIHJL4Qsyyu3RLn4x6DiKR8A1IxKjw_qNL4rVerpW6fwP-k72XPhaFiV_Gpps0X1ZsWzeCKthXec4xCckDW4RY'

const firebaseConfig = {
    apiKey: "AIzaSyC13l6rYFIL_bhA4hRrnspnN10GyJ3nsTQ",
    authDomain: "healthuno-df503.firebaseapp.com",
    projectId: "healthuno-df503",
    storageBucket: "healthuno-df503.appspot.com",
    messagingSenderId: "591978792926",
    appId: "1:591978792926:web:1370ed45774e70f2107f4f",
    measurementId: "G-XQB6WT9DBL"
};

const firebase = initializeApp(firebaseConfig);
export default firebase;
