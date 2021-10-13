
import { Col, Row } from "react-bootstrap";
import React, {useState} from "react";
import ProfilePictureColumn from "./EditPatientProfileColumn";
import { getData } from "../../storage/LocalStorage/LocalAsyncStorage";
import PatientEditProfile from "./PatientEditProfile";
import UploadReport from "./UploadReport";
import { back_icon } from "../../constants/DoctorImages";


const PatientProfile = (props) => {
    const type = props.match.params.type;
    const [reloadSideColumn, setReloadSideColumn] = useState(false);

    const userInfo = JSON.parse(getData('userInfo'));
    return (
        <Col lg="10" sm="10" xs="10" >
            <Row>
                <Col lg="2">
                    <Row className='back-navigation'>
                        <div style={{backgroundColor: '', display:"flex", flexDirection: "row", justifyContent:"space-between"}}>
                            <div className="back-nav-container-dr">
                                <img src={back_icon} alt='back_icon-img' onClick={()=>props.history.goBack()}></img>
                                <span>Upload Report</span>
                            </div>
                        </div>
                    </Row>
                    <ProfilePictureColumn img={userInfo.dp}  doctorName={`${userInfo.first_name} ${userInfo.last_name}`} doctorId={'22'} doctorMobile={userInfo.mobile_number}
                                          setReloadSideColumn={setReloadSideColumn} reloadSideColumn={reloadSideColumn}/>
                </Col>
                <Col lg="9" id="second-page">
                    <UploadReport></UploadReport>
                </Col>
            </Row>
        </Col>

    );
};
export default PatientProfile;
