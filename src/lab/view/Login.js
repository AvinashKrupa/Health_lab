import React, {useContext, useState} from "react";
import {Button, Col, Container, Dropdown, DropdownButton, FormControl, Image, InputGroup, Row,} from "react-bootstrap";
import {doctor, frame, logo, plant, group} from '../constants/PatientImages';
import {H1, H3} from '../commonComponent/TextSize';
import {API, post} from '../api/config/APIController';
import {AuthContext} from '../context/AuthContextProvider';
import CustomButton from '../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';
import {storeData} from "../storage/LocalStorage/LocalAsyncStorage";
import Spinner from "../commonComponent/Spinner";

const Login = ({history}) => {
    let timer = null;
    const {addToast} = useToasts();
    const authContext = useContext(AuthContext);
    const [mobileNumber, setMobileNumber] = useState(authContext.phone ? authContext.phone : '');
    const [mobileNumberError, setMobileNumberError] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    const handleOnChange = (e) => {
        if (isNaN(Number(e.target.value))) {
            setMobileNumberError('Please enter a valid mobile number')
        } else {
            setMobileNumberError('')
        }
    }

    const onClick = () => {
        const numbers = Array.from(mobileNumber);
        const isNumber = (currentValue) => !isNaN(currentValue);

        if (!numbers.every(isNumber) || numbers.length < 10 || numbers.length > 10) {
            return;
        }

        let params = {
            mobile_number: mobileNumber,
            country_code: '+91',
            type: 1
        };

        authContext.setPhone(mobileNumber);
        setShowLoader(true);
        post(API.SENDOTP, params, true)
            .then(response => {
                if (response.status === 200) {
                    storeData('USER_TYPE', 1)
                    addToast(response.data.message, {appearance: 'success'});
                    history.push('/lab/otp');
                    setShowLoader(false);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                    setShowLoader(false);
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
                setShowLoader(false);
            });
    }

    function debounce() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            onClick();
        }, 1000);
    }


    return (
        <>
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
                                        <div><H3 text='Book any Doctor you want'></H3></div>
                                        <p>Search doctors based on Speciality, Location, Language</p>
                                    </Col>
                                </div>

                                <div className='description'>
                                    <Col lg='1'>
                                        <Image src={frame}></Image>
                                    </Col>
                                    <Col lg='11' className='login-icon-side-txt'>
                                        <div><H3 text='Book Virtual Appointment'></H3></div>
                                        <p>Book an online appointment with the consultant of your choice and consult
                                            them privately at your own place of choice</p>
                                    </Col>
                                </div>

                                <div className='description'>
                                    <Col lg='1'>
                                        <Image src={plant}></Image>
                                    </Col>
                                    <Col lg='11' className='login-icon-side-txt'>
                                        <div><H3 text='Book Virtual Appointments with AYUSH Doctors'></H3></div>
                                        <p> Book virtual Appointments with AYUSH doctors and get medicines delivered to
                                            your doorstep</p>
                                    </Col>
                                </div>

                            </Col>
                            <Col lg='1' md='8' sm='0'></Col>
                        </Row>
                        <Row className='doctor-image'>
                            <Col lg='1'></Col>
                            <Col  lg='8'> <Image src={group}></Image></Col>
                            <Col lg='2'></Col>
                        </Row>
                    </Col>
                    <Col className='form'>
                        <div>
                            <div className='logo'>
                                <Image style={{cursor: 'pointer'}} src={logo} onClick={() => history.push('/')}></Image>
                            </div>

                            <div className='right-nav'>
                                <H1 text={'Hello there !'}></H1>
                                <H3 text={'Welcome'}></H3>
                                <p> Sign in to continue with your mobile number </p>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    debounce();
                                }}>
                                    <InputGroup size="sm" style={{maxWidth: "350px"}}
                                                onChange={(e) => setMobileNumber(e.target.value)}>
                                        <DropdownButton variant="outline-secondary" title="+91">
                                            <Dropdown.Item>+91</Dropdown.Item>
                                        </DropdownButton>
                                        <FormControl value={mobileNumber} type="text" pattern="\d*" maxLength="10"
                                                     onChange={handleOnChange}/>
                                        <p style={{marginBottom: mobileNumberError ? '20px' : "60px"}}
                                           className="description-small">
                                            A 4 digit OTP will be sent through SMS to verify your mobile
                                            number
                                        </p>
                                        {!!mobileNumberError && <div style={{textAlign: "center"}}
                                                                     className="error-text">{mobileNumberError}</div>}
                                    </InputGroup>
                                    {showLoader && <CustomButton
                                        type="submit"
                                        className={'login-btn'}
                                        disabled
                                        onClick={debounce}
                                        importantStyle={{backgroundColor: "#e2e9e9"}}
                                        showLoader={showLoader}
                                    ></CustomButton>}

                                    {!showLoader && <CustomButton
                                        type="submit"
                                        className={'login-btn'}
                                        disabled={!(mobileNumber.length === 10 && !mobileNumberError)}
                                        onClick={debounce}
                                        text={'Continue'}
                                    ></CustomButton>}
                                </form>
                            </div>

                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;
