import React from "react";
import {doctor} from "../../constants/DoctorImages";
import {Col, Container, Image, Row} from "react-bootstrap";
import {withRouter} from 'react-router-dom'

const EditProfilePictureColumn = (props) => {
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
