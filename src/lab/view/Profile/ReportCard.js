import { Grid } from "@material-ui/core";
import moment from "moment";
import { Row, Col, Button } from "react-bootstrap";

const ReportCard = (props) => {
  return (
    <>
    <Grid container item lg={4}  md={6} sm={6} xs={12} spacing={1}>
      <Col>
        <Row className="report-card-container">
          <Col className="padding-0">
            <Row>
              <span className="report-card-text-location">
                {props.report.title|| props.report.name}
              </span>
            </Row>
            <Row>
              <span className="report-card-text-title">
                {props.report.type}
              </span>
            </Row>
            <Row>
              <span className="report-card-text-date-and-time">
                {moment(props.report.updated_at || props.report?.created_at).format('lll')}
              </span>
            </Row>
          </Col>
          <Col className="padding-0">
            <Row>
              <a href='#' onClick={() => {
                props.history.push({
                  pathname: '/patient/reports/view',
                  state: { url: props.report.url }
                });
              }} className="report-card-button">View</a>
            </Row>
          </Col>
        </Row>
      </Col>
      </Grid>
    </>
  );
};
export default ReportCard;
