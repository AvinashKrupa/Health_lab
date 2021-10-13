import { Row, Col, Image } from "react-bootstrap";
import Timer from "../../commonComponent/Timer";
import ModalDialog from '../../commonComponent/ModalDialog';
import CustomButton from '../../commonComponent/Button';
import { useState } from "react";
import { Card, CardContent, CardMedia } from "@material-ui/core";
import TextArea from '../../commonComponent/TextArea';
import { useToasts } from 'react-toast-notifications';
import {camera} from "../../constants/PatientImages";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import {convert24hto12h, getTimer} from "../../../utils/utilities";

const DoctorAppointmentsCard = (props) => {

  const [toggleModal, setToggleModal] = useState(false);
  const [enableMeetingButton, setEnableMeetingButton] = useState(false);
  const [reason, setReason] = useState('');
  const { addToast } = useToasts();
  const [id, setId] = useState(props?.appointment._id);

function onSubmit() {
  if(reason === '') {
    addToast('Please enter cancel reason', { appearance: 'error' });
  } else {
    setToggleModal(false);
    props.cancelAppointment(id, reason);
    setReason('');
  }

}

function handleEnableButton() {
    setEnableMeetingButton(true)
}


const timerEnable = getTimer(`${props?.appointment.time.date} ${props?.appointment.time.slot}`);
const buttonTitle = props.appointment.status === 'scheduled' ? 'Cancel': 'Prescription';
const isPrescriptionPresent = props.appointment?.prescription && props.appointment?.prescription[0]?.url;

  return (
    <>
        <Card className="upcoming-appointment-card-container">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
              <CardMedia className="upcoming-appointment-card-image" image={props?.appointment.dp}></CardMedia>
          </div>
          <div>
            <CardContent>
                <div className="doctor-card-doctor-name">{`Dr ${props?.appointment.first_name} ${props?.appointment.last_name}`}
                  <Image
                    className="card-image-video-camera"
                    src={camera}
                    alt="Video Camera"
                  />
                </div>
                <div className="doctor-card-doctor-details"> {`${props?.appointment.address.city}, ${props?.appointment.address.country} | ${props?.appointment.exp} Y Exp`}</div>
                <div>
                  <span className="doctor-card-fee-label">Fee:</span>
                  <span className="doctor-card-fee-value">Rs {props?.appointment.fee}</span>{" "}
                </div>
                <span >
                <span
                    className="doctor-card-specialization-text"
                    style={{  marginTop: "10px" }}
                  >
                    {
                      props?.appointment.specialities.map((s) => {
                          return(<span key={s} style={{ padding: '4px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)
                      })
                    }

                  </span>
                </span>
                <div style={{position: 'relative'}}>
                    <spam className="card-text-date-and-time">
                        {`${props?.appointment.time.date}, ${convert24hto12h(props?.appointment.time.slot)}`}
                        <span className="card-text-time">{ timerEnable && <Timer time={props?.appointment.time.utc_time} handleEnableButton={handleEnableButton}></Timer> }</span>
                    </spam>
                </div>
                <Row className="card-buttons-row">
                  <Col>
                 {["scheduled","ongoing"].includes(props.appointment.status) ?
                    <CustomButton
                      className="card-button-join"
                      disabled={!(enableMeetingButton || props.appointment.is_joining || props.appointment.status ==='ongoing')}
                      onClick={() =>
                        {
                          props.history.push({
                            pathname: `/patient/videoMeeting/${props?.appointment.doctor_id}`,
                            state: { appointment_id: props?.appointment._id }
                          });
                         }
                        }

                      text={'Join meeting'}
                      ></CustomButton>
                    :
                    <CustomButton
                      className="card-button-join"
                      onClick={() =>  props.history.push(`/patient/slotBooking/${props?.appointment.doctor_id}`)}
                      text={'Rebook'}
                      ></CustomButton>
                  }
                  </Col>
                  <Col>
                  { props.appointment.status === 'scheduled' && <span onClick={setToggleModal} className={`card-text-${buttonTitle}`}>{buttonTitle}</span>}
                  { props.appointment.status !== 'scheduled' && <button disabled={!isPrescriptionPresent} className={ !isPrescriptionPresent ? 'card-text-button-disabled':`card-text-${buttonTitle}`} onClick={() => props.history.push({
                          pathname: '/patient/reports/view',
                          state: { url: isPrescriptionPresent }
                      })
                  }> {buttonTitle}</button>  }
                  </Col>
              </Row>
            </CardContent>
          </div>
        </div>
      </Card>
      <ModalDialog btnText={'Confirm'} onSubmit={onSubmit} show={toggleModal} title={'Cancel Appointment'} closeDialog={() =>{
        setReason('');
        setToggleModal(!toggleModal)}
      }>
          <TextArea
                id={'reason'}
                label='Describe the reason'
                value={reason}
                onChange={setReason}
                rows={4}
                cols={35}
          ></TextArea>
      </ModalDialog>
    </>
  );
};
export default withRouter(DoctorAppointmentsCard);
