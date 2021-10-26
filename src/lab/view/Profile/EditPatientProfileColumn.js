import React, {useEffect, useState} from "react";
import {doctor} from "../../constants/DoctorImages";
import {Col, Container, Image, Row} from "react-bootstrap";
import {withRouter} from 'react-router-dom'
import {API, get} from "../../api/config/APIController";
import {storeData} from "../../storage/LocalStorage/LocalAsyncStorage";
import {useToasts} from "react-toast-notifications";

const EditProfilePictureColumn = (props) => {
    const {addToast} = useToasts();

    useEffect(() => {
        getUserProfile()
        setTimeout(() => props.setReloadSideColumn(false), 1000)
    }, [props.reloadSideColumn]);

    function getUserProfile() {
        get(API.GET_PROFILE)
            .then(response => {
                if (response.status === 200) {
                    let user = response.data.data.user;
                    let additionalInfo = response.data.data.additional_info;
                    if (user) {
                        storeData('userInfo', JSON.stringify(user));
                    }
                    if (additionalInfo) {
                        storeData('additional_info', JSON.stringify(additionalInfo));
                    }
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }
    return (
        <Container className="profile-left-Column">
            <Row>
                <Image src={props.img ? props.img : doctor} className="profile-picture-image"/>
            </Row>
            <Row className="profile-container">
                <Col lg="12">
                    <span className="doctor-name">{props.patientName}</span>
                </Col>
                <Col lg="12">
                    <span className="doctor-detail">+91 - {props.patientMobile} | HealthUno Id: </span>
                </Col>
                <Col>
                    <Row style={{cursor: 'pointer'}}>
                        <Col className="button-section">
                            <span className="doctor-detail">{`Doctor: ${props.doctorName}`}</span>
                            <span className="doctor-detail">{`Time: ${props.appointmentTime}`}</span>
                            <span className="doctor-detail">{`Date: ${props.appointmentDate}`}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
            </Row>
        </Container>
    );
};

export default withRouter(EditProfilePictureColumn);
