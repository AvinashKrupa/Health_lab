import React, {useContext, useState} from "react";
import Input from "../commonComponent/Input";
import {Button, Col, Container, Dropdown, DropdownButton, FormControl, Image, InputGroup, Row,} from "react-bootstrap";
import {doctor, frame, logo, plant, group, login_art,logo_big1} from '../constants/PatientImages';
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
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

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

        // let params = {
        //     mobile_number: mobileNumber,
        //     country_code: '+91',
        //     type: 1
        // };
        let params = {"email":"admin@healthuno.com","password":"Admin@1234"};

        authContext.setEmail(mobileNumber);
        // authContext.setAuth(true);
        // authContext.setType('0');
        setShowLoader(true);
        post(API.SENDOTP, params, true)
            .then(response => {
                if (response.status === 200) {
                    storeData('USER_TYPE', 2)
                    addToast(response.data.message, {appearance: 'success'});
                    history.push('/otp');
                    // history.push('/home');
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
                            <Col lg='10' md='10' sm='12'>
                                <div className='logo'>
                                    <Image src={logo} onClick={() => history.push('/')}></Image>
                                </div>
                                <div className='logo_1'>
                                    <Image src={login_art} onClick={() => history.push('/')}></Image>
                                </div>
                            </Col>
                            <Col lg='1' md='8' sm='0'></Col>
                        </Row>
                    </Col>
                    <Col className='form'>
                        <div>
                            {/*<div className='logo'>*/}
                            {/*    <Image style={{cursor: 'pointer'}} src={logo} onClick={() => history.push('/')}></Image>*/}
                            {/*</div>*/}
                            <div className='right-nav'>
                                <H1 text={'Hello there !'}></H1>
                                <H3 text={'Welcome'}></H3>
                                <p> Sign in to continue</p>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    debounce();
                                }}>
                                    <Col md className="fields-style">
                                        <Input label="Email" type="text" placeholder="Enter your email id" value={loginId}
                                               onChange={setLoginId}/>
                                    </Col>
                                    <Col md className="fields-style">
                                        <Input label="Password" type="password" placeholder="Enter your password" value={password}
                                               onChange={setPassword}/>
                                    </Col>
                                    {!!mobileNumberError && <div style={{textAlign: "center"}}
                                                                 className="error-text">{mobileNumberError}</div>}
                                    <div style={{marginTop:"30px"}}>
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
                                    </div>
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
