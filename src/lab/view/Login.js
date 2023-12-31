import React, {useContext, useState} from "react";
import Input from "../commonComponent/Input";
import {Col, Container, Image, Row,} from "react-bootstrap";
import {login_art, logo} from '../constants/LabImages';
import {H1, H3} from '../commonComponent/TextSize';
import {API, post} from '../api/config/APIController';
import {AuthContext} from '../context/AuthContextProvider';
import CustomButton from '../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';
import {storeData} from "../storage/LocalStorage/LocalAsyncStorage";
import {getPushToken} from "../notification/utilities";

const Login = ({history}) => {
    let timer = null;
    const {addToast} = useToasts();
    const authContext = useContext(AuthContext);
    const [loginId, setLoginId] = useState(authContext.email ? authContext.email : '');
    const [password, setPassword] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    const onClick = async () => {
        const foundPushToken = await getPushToken();
        let params = {"email": loginId, "password": password, device_token: foundPushToken};
        authContext.setEmail(loginId);
        setShowLoader(true);
        post(API.LOGIN, params, true)
            .then(response => {
                if (response.status === 200) {
                    console.log('amit debug :', response.data);
                    storeData('USER_TYPE', Number(response?.data?.data?.user?.profile_types[0]) || 4)
                    addToast(response.data.message, {appearance: 'success'});
                    history.push('/home');
                    setShowLoader(false);
                    const session = response.data.data['session'];
                    if (session != null) {
                        storeData('ACCESS_TOKEN', session.access_token);
                        storeData('REFRESH_TOKEN', session.refresh_token);
                        history.push('/home');
                    } else {
                        history.push('/')
                    }
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
                                        <Input label="Email" type="text" placeholder="Enter your email id"
                                               value={loginId}
                                               onChange={setLoginId}/>
                                    </Col>
                                    <Col md className="fields-style">
                                        <Input label="Password" type="password" placeholder="Enter your password"
                                               value={password}
                                               onChange={setPassword}/>
                                    </Col>
                                    <div style={{marginTop: "30px"}}>
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
