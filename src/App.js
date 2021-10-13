import 'firebase/messaging';
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import firebase, {FIREBASE_VAPID_KEY} from "./lab/notification/firebase";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PrivateRoute from './lab/hoc/PrivateRoute';
import LabLogin from './lab/view/Login';
import OTP from './lab/view/OTP';
import Homepage from "./lab/view/appointment/Homepage";
import PatientProfile from "./lab/view/Profile/PatientProfile";
import PDFViewer from "./../src/lab/commonComponent/PDFViewerScreen";
import NotFoundPage from './../src/lab/commonComponent/NotFoundPage'
import MainView from "./../src/lab/MainView";
import {storeData} from "./lab/storage/LocalStorage/LocalAsyncStorage";
import {useToasts} from "react-toast-notifications";


function App() {
  const {addToast} = useToasts();
  const messaging = getMessaging(firebase);
  getToken(messaging, {vapidKey: FIREBASE_VAPID_KEY}).then((currentToken) => {
    if (currentToken) {
      storeData('PUSH_TOKEN', currentToken);
    } else {
      addToast('No registration token available. Request permission to generate one.', {appearance: "error"});
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });

  onMessage(messaging, (payload) => {
    addToast(<p><b>{payload.notification.title}</b><br/>{payload.notification.body}</p>, {appearance: "info"});
  });
  return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LabLogin}/>
            <PrivateRoute exact path='/otp' component={OTP}/>
            <MainView>
              <Switch>
                <PrivateRoute exact path='/home' component={Homepage}/>
                <PrivateRoute exact path='/home/search' component={Homepage}/>
                <PrivateRoute exact path='/upload' component={PatientProfile}/>
                <PrivateRoute exact path='/upload/PDF' component={PDFViewer}/>
                <Route component={NotFoundPage} isNotFound={true}/>
              </Switch>
            </MainView>
          </Switch>
        </BrowserRouter>
      </div>
  );
}

export default App;
