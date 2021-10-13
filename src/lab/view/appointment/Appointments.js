import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
// import map_pin from "./Map Pin.svg";
import {API, post} from '../../../api/config/APIController';
import { useToasts } from "react-toast-notifications";
import SimilarDoctorsCard from '../doctorDetail/SimilarDoctorsCard'
import DoctorAppointmentsCard from "./DoctorAppointmentsCard";
import Grid from '@material-ui/core/Grid';
import Spinner from "../../../commonComponent/Spinner";

const Appointments = (props) => {
  useEffect(() => {
    getUpcomingAppointments();
    getPreviousAppointments();
    return () => {};
  }, []);

  const { addToast } = useToasts();
  const [upcoming, setUpcoming] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [appointmentLoaderStatus, setAppointmentLoaderStatus] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);


  const handleSelection = () => {
    setUpcoming(!upcoming);
    setPrevious(!previous);
  };

  function getUpcomingAppointments() {
    let params = {
      limit: 20,
      page:1,
      sort_order: "asc",
      sort_key: "time.utc_time",
      date: "" ,
      status: [
          "scheduled",
      ]
  }
    setAppointmentLoaderStatus(true);
    post(API.GETAPPOINTMENTS, params)
      .then(response => {
        if (response.status === 200 && response.data && response.data.data) {
          setAppointmentLoaderStatus(false);
          setUpcomingAppointments(response.data.data.docs)
        } else {
          setAppointmentLoaderStatus(false);
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        setAppointmentLoaderStatus(false);
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }

  function getPreviousAppointments() {
    let params = {
      limit: 20,
      page:1,
      sort_order: "desc",
      sort_key: "time.utc_time",
      date: "" ,
      status: [
        "pending",
        "cancelled",
        "rejected",
        "ongoing",
        "completed"
      ]
  }
    setAppointmentLoaderStatus(true);
    post(API.GETAPPOINTMENTS, params)
      .then(response => {
        if (response.status === 200 && response.data && response.data.data) {
          setPreviousAppointments(response.data.data.docs)
          setAppointmentLoaderStatus(false);
        } else {
          addToast(response.data.message, { appearance: 'error' });
          setAppointmentLoaderStatus(false);
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
        setAppointmentLoaderStatus(false);
      });
  }

  function cancelAppointment(id, reason) {
    let params = {
      appointment_id: id,
      cancel_reason: reason,
   }

    post(API.CANCELAPPOINTMENT, params)
      .then(response => {
        if (response.status === 200) {
          addToast(response.data.message, { appearance: 'success' });
          getUpcomingAppointments()
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }

  return (
    <>
      <Row>
        <Col lg='1' md='1' sm='1' xs='1'>

        </Col>
        <Col  lg='11' md='11' sm='11' xs='11'  className="screen-768 appointment-page-content-column">
          <Row>
            <span className="appointment-page-text-heading">Appointments</span>
          </Row>
          <Row>
            <span
              className={
                upcoming
                  ? "appointment-page-text-selected"
                  : "appointment-page-text-unselected"
              }
              onClick={handleSelection}
            >
              Upcoming
            </span>
            <span
              className={
                previous
                  ? "appointment-page-text-selected appointment-page-text-margin-left-41"
                  : "appointment-page-text-unselected appointment-page-text-margin-left-41"
              }
              onClick={handleSelection}
            >
              Previous
            </span>
          </Row>
          <Row className="appointment-page-cards-row">
            {upcoming ? (
                <>
                  {appointmentLoaderStatus &&
                  <div className="empty-list-container">
                    <Spinner showLoader={appointmentLoaderStatus} width={60} height={60}/>
                  </div>
                  }
                  {!appointmentLoaderStatus && upcomingAppointments.map((appointment) => {
                    return (
                        <Grid container item lg={4}  md={6} sm={8} xs={12} spacing={0.5} className="appointment-page-cards-upcoming">
                          <DoctorAppointmentsCard appointment={appointment} cancelAppointment={cancelAppointment} />
                        </Grid>
                    )
                  })}
                  {!appointmentLoaderStatus && !upcomingAppointments.length &&
                  <div className="empty-list-container">
                    <h4>No appointments found</h4>
                  </div>
                  }
                </>
            ) : (
                <>
                  {appointmentLoaderStatus &&
                  <div className="empty-list-container">
                    <Spinner showLoader={appointmentLoaderStatus} width={60} height={60}/>
                  </div>
                  }
                  {!appointmentLoaderStatus && previousAppointments.map((appointment) => {
                    return (
                        <Grid container item lg={4}  md={6} sm={6} xs={12} spacing={1} className="appointment-page-cards-previous">
                          <DoctorAppointmentsCard appointment={appointment} />
                        </Grid>
                    )
                  })}
                  {!appointmentLoaderStatus && !previousAppointments.length &&
                  <div className="empty-list-container">
                    <h4>No appointments found</h4>
                  </div>
                  }
                </>
            )}
          </Row>
        </Col>
        {/* <Col lg='1' sm='1' xs='1'>

        </Col> */}
      </Row>
    </>
  );
};
export default Appointments;
