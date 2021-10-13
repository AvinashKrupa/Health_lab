import {getData, storeData} from "../storage/LocalStorage/LocalAsyncStorage";
import firebase, {FIREBASE_VAPID_KEY} from "./firebase";
import {getMessaging, getToken} from "firebase/messaging";

const messaging = getMessaging(firebase);
export const getPushToken = async () => {
    const pushToken = getData('PUSH_TOKEN');
    if (pushToken) {
        return pushToken
    } else {
        getToken(messaging, {vapidKey: FIREBASE_VAPID_KEY}).then((currentToken) => {
            if (currentToken) {
                storeData('PUSH_TOKEN', currentToken);
            } else {
                return '';
            }
        }).catch((err) => {
            return '';
        });
    }
}
