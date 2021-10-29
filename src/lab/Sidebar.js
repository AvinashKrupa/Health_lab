import SideNav, {NavIcon, NavItem, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {clearSession} from "./storage/LocalStorage/LocalAsyncStorage";
import {withRouter} from 'react-router-dom'
import {upload_icon} from "../../src/lab/constants/LabImages";
import React from "react";
import {useToasts} from 'react-toast-notifications';
import {API, post} from './api/config/APIController';


const sidebar = ['home', 'appointments', 'profile', 'reports']

const Sidebar = (props) => {
    const {addToast} = useToasts();
    const newRoutes = props.location.pathname.split("/") || [];
    let defaultSelection = "home"
    for (let i = 0; i < newRoutes.length; i++) {
        const found = sidebar.includes(newRoutes[i])
        if (found) {
            defaultSelection = newRoutes[i];
        }
    }
    const handleLogout = () => {
        post(API.LOGOUT)
            .then(response => {
                if (response.status === 200) {
                    addToast(response.data.message, {appearance: 'success'});
                    clearSession();
                    props.history.push(`/`);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    return (
        <div className="sidebarMenu">
            <SideNav onSelect={(selected) => {
                if (selected === 'profile') {
                    selected = 'profile/editProfile';
                    props.history.push(`${selected}`);
                }
                if (selected === 'signOut') {
                    handleLogout();
                }
                if (selected === undefined) {
                    props.history.push(`/home`);
                }
                sidebar.includes(selected) && props.history.push(`${selected}`);
            }}>
                <SideNav.Toggle/>
                <SideNav.Nav defaultSelected={defaultSelection}>
                    <NavItem className="setLogo">
                        <NavIcon>
                            <img alt='logo' src={process.env.PUBLIC_URL + '/assets/logo.png'}></img>
                        </NavIcon>
                        <NavText className="setLogotext">
                            HealthUno
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="home">
                        <NavIcon>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <img alt='upload' src={upload_icon} style={{width: "28px", height: "44px",}}></img>
                            </div>
                        </NavIcon>
                        <NavText>
                            Upload
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="signOut">
                        <NavIcon>
                            <i className="fa fa-fw fas fa-sign-out-alt" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Sign Out
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        </div>
    );
};

export default withRouter(Sidebar);
