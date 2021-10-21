import {Col, Image, Row} from "react-bootstrap";
import {API, post} from '../../api/config/APIController';
import React, {forwardRef, useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../../store/searchStore';
import SearchInputWithIcon from '../../commonComponent/SearchInputWithIcon';
import PatientAppointmentCard from "./PatientAppointmentCard";
import DatePicker from "react-datepicker";
import moment from "moment";
import {back_icon, calendar_blue} from "../../constants/DoctorImages";
import Spinner from "../../commonComponent/Spinner";

const Homepage = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  const [currentDate, setCurrentDate] = useState(props.location?.state?.title === 'Search Appointments'? moment().format('YYYY-MM-DD') : "");
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
    post(API.DOCTOR_GET_APPOINTMENTS_API, params)
        .then(response => {
          if (response.status === 200) {
            setAppointmentLoaderStatus(false)
            setUpcomingAppointments(response.data.data.docs);
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
      page:1,
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

    post(API.DOCTOR_GET_APPOINTMENTS_API, params)
        .then(response => {
          if (response.status === 200 && response.data && response.data.data) {
            setPreviousAppointments(response.data.data.docs)
          } else {
            addToast(response.data.message, { appearance: 'error' });
          }
        })
        .catch(error => {
          addToast(error.response.data.message, { appearance: 'error' });
        });
  }

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSearchText(txt);
    }, 1000);
  }

  const CustomDateComponent = forwardRef(({ value, onClick }, ref) => (
      <>
        <div className="calender-date-upcoming" onClick={onClick} ref={ref} style={{display: 'flex', flexDirection:"row"}}>
          {moment(value).format("ddd, DD MMM YY")}<div style={{marginLeft:10}}><Image src={calendar_blue} /></div>
        </div>
      </>
  ));

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
            {/*<span*/}
            {/*    style={{marginLeft: "12px"}}*/}
            {/*    className={*/}
            {/*      upcoming*/}
            {/*          ? "appointment-page-text-selected"*/}
            {/*          : "appointment-page-text-unselected"*/}
            {/*    }*/}
            {/*    onClick={handleSelection}*/}
            {/*>*/}
            {/*  Upcoming*/}
            {/*</span>*/}
            {/*    <span*/}
            {/*        className={*/}
            {/*          previous*/}
            {/*              ? "appointment-page-text-selected appointment-page-text-margin-left-41"*/}
            {/*              : "appointment-page-text-unselected appointment-page-text-margin-left-41"*/}
            {/*        }*/}
            {/*        onClick={handleSelection}*/}
            {/*    >*/}
            {/*  Previous*/}
            {/*</span>*/}
              </Row>
              <Row className="appointment-page-cards-row">
                {upcoming ? (
                    <>
                      {appointmentLoaderStatus &&
                      <div className="empty-list-container">
                        <Spinner showLoader={appointmentLoaderStatus} width={60} height={60}/>
                      </div>
                      }
                      {!appointmentLoaderStatus && upcomingAppointments.map((doctor) => {
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
