import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Container, Image, Row,} from "react-bootstrap";
import {doctor, frame, group, phone, plant} from '../constants/PatientImages'
import {H3} from '../commonComponent/TextSize'
import OtpInput from "react-otp-input";
import {API, post} from '../api/config/APIController';
import {AuthContext} from '../context/AuthContextProvider';
import {storeData} from "../storage/LocalStorage/LocalAsyncStorage";
import CustomButton from '../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import useUserStore from '../store/userStore';
import {getPushToken} from "../notification/utilities";
import Spinner from "../commonComponent/Spinner";

const timeOut = 60;
const OTP = ({history}) => {
  const {addToast} = useToasts();
  const authContext = useContext(AuthContext);
  const [otp, setOTP] = useState('');
  const [mobileNumber, setMobileNumber] = useState(authContext.phone);
  const maskedMobileNo = Array.from(authContext.phone);
  const handleChange = otp => setOTP(otp);
  const [restart, setReStart] = useState(false);
  const [timer, setTimer] = useState(timeOut);
  const setUserInfo = useUserStore((state) => state.setUserInfo)
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!mobileNumber) {
      history.push(`/`);
      return;
    }
  }, []);
  const verifyOTP = async (e) => {
    e.preventDefault();
    const foundPushToken = await getPushToken();
    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
      otp: otp,
      device_type: 'web',
      device_token: foundPushToken,
      type: 2,
    };
    setShowLoader(true);
    post(API.VERIFYOTP, params)
        .then(response => {
          if (response.status === 200) {
            setShowLoader(false);
            addToast(response.data.message, {appearance: 'success'});

            const temp = response.data.data['tempAccessToken'];

            if (temp != null) {
              storeData('TEMP_TOKEN', temp);
            }
            const user = response.data.data['user'];
            const additional_info = response.data.data['additional_info'];

            if (user) {
              storeData('userInfo', JSON.stringify(user));
              setUserInfo(user)
            }
            if (additional_info) {
              storeData('additional_info', JSON.stringify(additional_info));
            }

            const session = response.data.data['session'];

            if (session != null) {
              storeData('ACCESS_TOKEN', session.access_token);
              storeData('REFRESH_TOKEN', session.refresh_token);
              history.push('/home');
            } else {
              history.push('/')
            }
          } else {
            setShowLoader(false);
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          setShowLoader(false);
          addToast(error.response.data.message, {appearance: 'error'});
        });
  }

  const reSendOTP = () => {
    setOTP('')
    let params = {
      mobile_number: authContext.phone,
      country_code: '+91',
      type: 2,
    };
    post(API.SENDOTP, params, true)
        .then(response => {
          if (response.status === 200) {
            authContext.setAuth(true);
            authContext.setType('0');
            setTimer(timeOut);
            setReStart(!restart);
            addToast(response.data.message, {appearance: 'success'});
          } else {
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: 'error'});
        });
  }

  useEffect(() => {
    setMobileNumber(authContext.phone);
    return () => {
    };
  }, []);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      let timers = timeOut;
      const id = setInterval(() => {
        timers = timers - 1;
        if (timers <= 0) {
          clearInterval(id);
        }
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }, [delay, restart]);
  }

  useInterval(() => {
    setTimer(timer - 1);
  }, 1000);

  return (
      <Container fluid>
        <Row className='login-container LoginPageDoctor'>
          <Col className='left-nav'>
            <Row>
              <Col lg='10' md='10' sm='12' className="text-container">

                <div className='description'>
                  <Col lg='1'>
                    <Image src={doctor}></Image>
                  </Col>
                  <Col lg='11' className='login-icon-side-txt'>
                    <div><H3 text='Manage your clinic'></H3></div>
                    <p>Track and manage all your appointments and modify them with our user-friendly
                      UI</p>
                  </Col>
                </div>

                <div className='description'>
                  <Col lg='1'>
                    <Image src={frame}></Image>
                  </Col>
                  <Col lg='11' className='login-icon-side-txt'>
                    <div><H3 text='Medical Records Management'></H3></div>
                    <p> Use our proprietary software to store and manage all patient records digitally
                      secured and stored in a secure cloud database with access control</p>
                  </Col>
                </div>

                <div className='description'>
                  <Col lg='1'>
                    <Image src={plant}></Image>
                  </Col>
                  <Col lg='11' className='login-icon-side-txt'>
                    <div><H3 text='Mentoring/Peer Review consultation'></H3></div>
                    <p> Ask another panel physician to join your current/upcoming consultation and
                      provide additional advice as required</p>
                  </Col>
                </div>
              </Col>
              <Col lg='1' md='8' sm='0'></Col>
            </Row>
            <Row className='doctor-image'>
              <Col lg='1'></Col>
              <Col lg='8'> <Image src={group}></Image></Col>
              <Col lg='2'></Col>
            </Row>
          </Col>
          <Col className='otp-main-container'>
            <div className="otp-back-navigation">
              <Link to='/doctor'><i class="fas fa-chevron-left"></i><span>Back</span></Link>
            </div>
            <Row className="phone-image">
              <Col lg='3' md='3' sm='2' xs='1'></Col>
              <Col lg='8' md='8' sm='9' xs='10'>
                <div>
                  <Image src={phone} alt="Image"></Image>
                </div>
              </Col>
              <Col lg='1' md='1' sm='1' xs='1'></Col>
            </Row>
            <Row className='number-input'>
              <Col lg='3' md='3' sm='2' xs='1'></Col>
              <Col lg='8' md='8' sm='9' xs='10'>
                <div>
                  <Row className='verify-otp'>
                    <span>Verify OTP</span>
                    <div className='edit-number'>
                      <p> We have sent OTP on your mobile
                        number {maskedMobileNo[0]}{maskedMobileNo[1]}******{maskedMobileNo[8]}{maskedMobileNo[9]}</p> {
                      <Link to='/doctor/'><i class="fas fa-pen"></i></Link>}
                    </div>
                  </Row>
                  <form onSubmit={verifyOTP}>
                    <div className='otp-container'>
                      <br/>
                      <OtpInput
                          className="OTP"
                          numInputs="4"
                          separator={<span> </span>}
                          value={otp}
                          onChange={handleChange}
                      />
                      <br/>
                    </div>
                    <br/>
                    <div className="div-center">
                      {showLoader && <CustomButton
                          type="submit"
                          className={'login-btn'}
                          disabled
                          onClick={verifyOTP}
                          importantStyle={{backgroundColor: "#e2e9e9"}}
                          showLoader={showLoader}
                      ></CustomButton>}
                      {!showLoader && <CustomButton
                          type="submit"
                          className={'login-btn'}
                          disabled={otp.length !== 4}
                          onClick={verifyOTP}
                          text={'Verify OTP'}
                      ></CustomButton>}
                      <br/>
                      <div className="resend-otp">
                        {timer === 0 ? (
                            <a href='#' onClick={reSendOTP}>Resend OTP</a>
                        ) : (
                            <span>{`Didn't get OTP? Resend in ${timer} seconds`}</span>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
              <Col lg='' md='1' sm='1' xs='1'></Col>
            </Row>
          </Col>
        </Row>
      </Container>
  );
};

export default OTP;
