import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import AppointmentProfileColumn from "./AppointmentProfile";
import UploadReport from "./UploadReport";
import {back_icon} from "../../constants/DoctorImages";


const UploadReportContainer = (props) => {
    const [reloadSideColumn, setReloadSideColumn] = useState(false);
    const [patientData, setPatientData] = useState({});

    useEffect(() => {
        if (!props.location?.state?.reportInfo) {
            props.history.goBack();
            return;
        } else {
            setPatientData(props.location?.state?.reportInfo);
        }
    }, []);

    return (
        <Col lg="11" sm="11" xs="11">
            <Row>
                <Col lg="2">
                    <Row className='back-navigation'>
                        <div style={{
                            backgroundColor: '',
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <div className="back-nav-container-dr">
                                <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                                <span>Upload Report</span>
                            </div>
                        </div>
                    </Row>
                    <AppointmentProfileColumn img={patientData.dp}
                                          patientName={patientData.patientName} doctorId={'22'}
                                          patientMobile={patientData.mobile}
                                          setReloadSideColumn={setReloadSideColumn}
                                          reloadSideColumn={reloadSideColumn}
                                          doctorName={patientData.doctorName}
                                          appointmentTime={patientData.onTime}
                                          appointmentDate={patientData.onDate}

                    />
                </Col>
                <Col lg="10" id="second-page">
                    <UploadReport></UploadReport>
                </Col>
            </Row>
        </Col>

    );
};
export default UploadReportContainer;
