import React, { Component } from "react";
import { Image, Button, Row, Col } from "react-bootstrap";
import Error404 from "../assets/404 Error.png";

const NotFoundPage = (props) => {
  return (
    <>
      <Row>
        <Col>
          <Image src={Error404} className="errorPage-image" />
        </Col>
        <Col>
          <div className="errorPage-h1">
            <span>Page Not Found</span>
          </div>
          <div className="errorPage-h2">
            <span>The page you are looking for cannot be found</span>
          </div>
          <div>
            <Button
              className="errorPage-button"
              onClick={() => props.history.replace("/")}
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default NotFoundPage;