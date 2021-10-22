import moment from 'moment-timezone';
import {Col, Image, Row} from "react-bootstrap";
import {API, post} from '../../api/config/APIController';
import React, {forwardRef, useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../../store/searchStore';
import SearchInputWithIcon from '../../commonComponent/SearchInputWithIcon';
import PatientAppointmentCard from "./PatientAppointmentCard";
import Spinner from "../../commonComponent/Spinner";

const Homepage = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  const [currentDate, setCurrentDate] = useState(props.location?.state?.title === 'Search Appointments' ? moment().format('YYYY-MM-DD') : "");
  let [appointmentLoaderStatus, setAppointmentLoaderStatus] = useState(false);
  const [upcoming, setUpcoming] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  useEffect(() => {
    getUpcomingAppointments();
    getPreviousAppointments();
  }, [searchText]);

  useEffect(() => {
    getUpcomingAppointments();
    getPreviousAppointments();
  }, [currentDate]);

  const handleSelection = () => {
    setUpcoming(!upcoming);
    setPrevious(!previous);
  };

  function getUpcomingAppointments() {
    let params = {
      limit: 30,
      page: 1,
      sort_order: "asc",
      sort_key: "time.utc_time",
      search_text: searchText,
      date: currentDate,
      status: [
        "scheduled",
        "ongoing",
      ]
    };
    setAppointmentLoaderStatus(true)
    post(API.SEARCH_PATIENTS_API, params)
        .then(response => {
          if (response.status === 200) {
            setAppointmentLoaderStatus(false)
            setUpcomingAppointments(response.data.data);
          } else {
            addToast(response.data.message, {appearance: "error"});
            setAppointmentLoaderStatus(false)
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: "error"});
          setAppointmentLoaderStatus(false)
        });
  }

  function getPreviousAppointments() {
    let params = {
      limit: 30,
      page: 1,
      sort_order: "desc",
      sort_key: "time.utc_time",
      search_text: searchText,
      date: currentDate,
      status: [
        "pending",
        "cancelled",
        "rejected",
        "completed"
      ]
    }

    post(API.SEARCH_PATIENTS_API, params)
        .then(response => {
          if (response.status === 200 && response.data && response.data.data) {
            setPreviousAppointments(response.data.data)
          } else {
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: 'error'});
        });
  }

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSearchText(txt);
    }, 1000);
  }

  return (
      <div>
        <Row className='top-consultants-container'>
          <Col lg="1" sm="1" xs='1'/>
          <Col lg="10" sm="10" xs='10'>
            <div className='search-container' style={{display: "flex", justifyContent: 'space-between', marginTop: 34}}>
              <SearchInputWithIcon
                  col='12'
                  placeholder="Search patients"
                  defaultValue={searchText}
                  className='patient-homepage-search'
                  onChange={(e) => debounce(e)}
              >
              </SearchInputWithIcon>
            </div>

            <Row>
            </Row>
            <Row className="appointment-page-cards-row">
              {upcoming ? (
                  <>
                    {appointmentLoaderStatus &&
                    <div className="empty-list-container">
                      <Spinner showLoader={appointmentLoaderStatus} width={60} height={60}/>
                    </div>
                    }
                    {!appointmentLoaderStatus && upcomingAppointments.map((appoinment) => {
                      return (
                          <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                            <PatientAppointmentCard
                                key={appoinment._id}
                                id={appoinment._id}
                                image={appoinment?.patient?.user_id?.dp}
                                name={`${appoinment?.patient?.user_id?.first_name} ${appoinment?.patient?.user_id?.last_name}`}
                                dr_name={`Dr. ${appoinment?.doctor?.first_name} ${appoinment?.doctor?.last_name}`}
                                status={appoinment.status}
                                onTime={appoinment.time.slot}
                                onDate={moment.tz(appoinment.time.utc_time, "UTC").tz(moment.tz.guess()).format('DD-MM-YY')}
                            />
                          </Grid>
                      )
                    })}
                    {!appointmentLoaderStatus && !upcomingAppointments.length &&
                    <div className="empty-list-container_center">
                      {!searchText && <h4>Please type patient name to start searching! </h4>}
                      {!!searchText && <h4>No patient found</h4>}
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
                    {!appointmentLoaderStatus && previousAppointments.map((doctor) => {
                      return (
                          <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                            <PatientAppointmentCard
                                key={doctor._id}
                                id={doctor._id}
                                image={doctor.dp}
                                // name={`${doctor.first_name} ${doctor.last_name}`}
                                name={`${doctor.first_name}`}
                                purpose={doctor.reason}
                                status={doctor.status}
                                onTime={doctor.time.slot}
                                onDate={doctor.time.date}
                            />
                          </Grid>
                      )
                    })}
                    {!appointmentLoaderStatus && !previousAppointments.length &&
                    <div className="empty-list-container">
                      <h4>No patient found</h4>
                    </div>
                    }
                  </>
              )}
            </Row>
          </Col>
          <Col lg="1" sm="1" xs='1'/>
        </Row>
      </div>
  );
};

export default Homepage;
