import SideNav, {NavIcon, NavItem, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {clearSession, getData} from "./storage/LocalStorage/LocalAsyncStorage";
import { withRouter } from 'react-router-dom'

const sidebar = ['home', 'appointments', 'profile', 'reports']

const Sidebar = (props) => {
    const userType = JSON.parse(getData('USER_TYPE'));
    const newRoutes = props.location.pathname.split("/") || [];
    let defaultSelection = "home"
    for (let i = 0; i <newRoutes.length ; i++) {
        const found = sidebar.includes(newRoutes[i])
        if(found){
            defaultSelection = newRoutes[i];
        }
    }
    return (
        <div className="sidebarMenu">
            <SideNav onSelect={(selected) => {
                const userType = JSON.parse(getData('USER_TYPE'));
                let routeName = '/patient/';

                if (userType === 2) {
                    routeName = '/doctor/';
                    // if(sidebar.includes('reports')) {
                    //     return;
                    // }
                }

                if( selected === 'profile') {
                    selected = 'profile/editProfile';
                    props.history.push(`${routeName}${selected}`);
                }

                if( selected === 'signOut') {
                    clearSession();
                    props.history.push(`${routeName}`);
                }

                sidebar.includes(selected) && props.history.push(`${routeName}${selected}`);
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
                            <i className="fa fa-fw fa-home" style={{fontSize: '1.65em'}}/>
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="appointments">
                        <NavIcon>
                            <i className="fa fa-fw fa-calendar" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Appointments
                        </NavText>
                    </NavItem>

                    {userType === 1 && <NavItem eventKey="reports">
                        <NavIcon>
                            <i className="fa fa-fw fa-briefcase" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Reports
                        </NavText>
                    </NavItem>}

                    <NavItem eventKey="profile">
                        <NavIcon>
                            <i className="fa fa-fw fa-user" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Profile
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
