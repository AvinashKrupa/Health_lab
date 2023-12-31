import { Row, Col } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import Sidebar from "./Sidebar";



const MainView = (props) => {
  return (
    <>
      <Row>
        <Col lg="1" md='1' sm="1" xs="1">
            <Sidebar></Sidebar>
        </Col>
        {props.children}
      </Row>
    </>
  );
};

export default MainView;
