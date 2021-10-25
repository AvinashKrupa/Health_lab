import moment from 'moment-timezone';
import {Col, Row} from "react-bootstrap";
import {API, post} from '../../api/config/APIController';
import React, {useEffect, useState} from "react";
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
    let [appointmentLoaderStatus, setAppointmentLoaderStatus] = useState(false);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (searchText) {
            getUpcomingAppointments();
        }
    }, [searchText]);

    function getUpcomingAppointments() {
        let params = {
            limit: 50,
            page: 1,
            sort_order: "asc",
            sort_key: "time.utc_time",
            search_text: searchText,
        };
        setAppointmentLoaderStatus(true)
        post(API.SEARCH_PATIENTS_API, params)
            .then(response => {
                if (response.status === 200) {
                    setAppointmentLoaderStatus(false)
                    setAppointments(response.data.data.docs);
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
                    <div className='search-container'
                         style={{display: "flex", justifyContent: 'space-between', marginTop: 34}}>
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
                        {appointmentLoaderStatus &&
                        <div className="empty-list-container">
                            <Spinner showLoader={appointmentLoaderStatus} width={60} height={60}/>
                        </div>
                        }
                        {!!searchText && !appointmentLoaderStatus && appointments.map((appoinment) => {
                            return (
                                <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                                    <PatientAppointmentCard
                                        key={appoinment._id}
                                        id={appoinment._id}
                                        image={appoinment?.patient?.dp}
                                        name={`${appoinment?.patient?.first_name} ${appoinment?.patient?.last_name}`}
                                        dr_name={`Dr. ${appoinment?.doctor?.first_name} ${appoinment?.doctor?.last_name}`}
                                        status={appoinment.status}
                                        onTime={appoinment.time.slot}
                                        onDate={appoinment.time.date}
                                        appointmentId={appoinment._id}
                                        patientId={appoinment?.patient?._id}
                                        // onDate={moment.tz(appoinment.time.utc_time, "UTC").tz(moment.tz.guess()).format('DD-MM-YY')}
                                    />
                                </Grid>
                            )
                        })}
                        {!appointmentLoaderStatus &&
                        <div className="empty-list-container_center">
                            {!searchText && <h4>Please type patient name to start searching! </h4>}
                            {!!searchText && !appointments.length && <h4>No patient found</h4>}
                        </div>
                        }
                    </Row>
                </Col>
                <Col lg="1" sm="1" xs='1'/>
            </Row>
        </div>
    );
};

export default Homepage;
