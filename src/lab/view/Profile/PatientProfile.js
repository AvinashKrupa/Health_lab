
import { Col, Row } from "react-bootstrap";
import React, {useState} from "react";
import ProfilePictureColumn from "./EditPatientProfileColumn";
import { getData } from "../../storage/LocalStorage/LocalAsyncStorage";
import PatientEditProfile from "./PatientEditProfile";
import UploadReport from "./UploadReport";


const PatientProfile = (props) => {
    const type = props.match.params.type;
    const [reloadSideColumn, setReloadSideColumn] = useState(false);

    const userInfo = JSON.parse(getData('userInfo'));
    return (
        <Col lg="10" sm="10" xs="10" >
            <Row>
                <Col lg="2">
                    <ProfilePictureColumn img={userInfo.dp}  doctorName={`${userInfo.first_name} ${userInfo.last_name}`} doctorId={'22'} doctorMobile={userInfo.mobile_number}
                                          setReloadSideColumn={setReloadSideColumn} reloadSideColumn={reloadSideColumn}/>
                </Col>
                <Col lg="9" id="second-page">
                    {
                        type === 'editProfile' && (
                            <PatientEditProfile setReloadSideColumn={setReloadSideColumn}></PatientEditProfile>
                        )
                    }
                    {
                        type === 'uploadReport' && (
                            <UploadReport></UploadReport>
                        )
                    }
                </Col>
            </Row>
        </Col>

    );
};
export default PatientProfile;
