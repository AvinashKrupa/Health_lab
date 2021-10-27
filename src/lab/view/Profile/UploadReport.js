import {withRouter} from "react-router-dom/cjs/react-router-dom.min";
import {Col, Image, Row} from "react-bootstrap";
import React, {useEffect, useReducer, useState} from "react";
import {pdf} from "../../constants/PatientImages";
import {API, get, post} from "../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import Constants from "../../constants";
import {getData} from "../../storage/LocalStorage/LocalAsyncStorage";
import {isEmpty} from "../../utils/Validators";
import {plus_icon} from "../../constants/DoctorImages";

import UploadReportCard from "./Components/UploadReportCard";

export const ACTIONS = {
  SET_REPORT_NAME: "SET_REPORT_NAME",
  SET_REPORT_DATE: "SET_REPORT_DATE",
  SET_REPORT_TYPE: "SET_REPORT_TYPE",
  SET_DEPARTMENT: "SET_DEPARTMENT",
  SET_REPORT_FILE: "SET_REPORT_FILE",
  ADD_NEW_REPORT: "ADD_NEW_REPORT",
  DELETE_NEW_REPORT: "DELETE_NEW_REPORT",
  SET_REPORT_FILE_ERROR: "SET_REPORT_FILE_ERROR",
};


const UploadReport = (props) => {
  const [reportName, setReportName] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const {addToast} = useToasts();

  const reportObj = {
    reportItem: {
      reportName: "",
      uploadDate: "",
      reportType: "",
      department: "",
      file: [],
    },
    validationInfo: {
      reportNameError: "",
      uploadDateError: "",
      reportTypeError: "",
      departmentError: "",
      fileError: "",
    },
  };

  let initialState = [reportObj];
  const [reportList, dispatch] = useReducer(reducer, initialState);

  function reducer(reportList, action) {
    switch (action.type) {
      case ACTIONS.ADD_NEW_REPORT:
        return [...reportList, action.payload];
      case ACTIONS.DELETE_NEW_REPORT:
        const tempReportObj = JSON.parse(
            JSON.stringify(reportList)
        );
        if (action.payload.id > -1) {
          tempReportObj.splice(action.payload.id, 1);
        }
        return tempReportObj;
      case ACTIONS.SET_REPORT_NAME:
        reportList[action.payload.id].reportItem.reportName =
            action.payload.value;
        return [...reportList];
      case ACTIONS.SET_REPORT_FILE_ERROR:
        reportList[action.payload.id].validationInfo.fileError =
            action.payload.value;
        return [...reportList];
      case ACTIONS.SET_REPORT_DATE:
        reportList[action.payload.id].reportItem.uploadDate =
            action.payload.value;
        return [...reportList];
      case ACTIONS.SET_REPORT_TYPE:
        reportList[action.payload.id].reportItem.reportType =
            action.payload.value;
        return [...reportList];
      case ACTIONS.SET_DEPARTMENT:
        reportList[action.payload.id].reportItem.department =
            action.payload.value;
        return [...reportList];
      case ACTIONS.SET_REPORT_FILE:
        reportList[action.payload.id].reportItem.file =
            action.payload.file;
        return [...reportList];
      default:
        return reportList;
    }
  }

  let reportOptions = ["MRI", "CT Scan ", "Blood Test"];

  useEffect(() => {
    const accessToken = getData('ACCESS_TOKEN');
    if (!accessToken) {
      props.history.push(`/`);
      return;
    }
  }, []);
  useEffect(() => {
    getDepartment();
    return () => {
    };
  }, []);

  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  };

  const thumb = {
    display: "-webkit-inline-box",
    borderRadius: 2,
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 200,
    padding: 4,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const thumbs = files.map((file) => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          {console.log(file.type, file.name)}
          <img
              src={file.type === "application/pdf" ? pdf : file.preview}
              style={img}
              alt="upload-report"
          />
        </div>
      </div>
  ));

  const isValidData = () => {
    console.log("files", files);
    if (isEmpty(uploadDate)) {
      addToast("Please enter date", {appearance: "error"});
      return false;
    } else if (isEmpty(reportType)) {
      addToast("Please enter report type", {appearance: "error"});
      return false;
    } else if (isEmpty(reportName)) {
      addToast("Please enter report name", {appearance: "error"});
      return false;
    } else if (files.length === 0) {
      addToast("Please select the file", {appearance: "error"});
      return false;
    } else {
      return true;
    }
  };

  const uploadReport = () => {
    if (isValidData()) {
      let bodyFormData = new FormData();
      bodyFormData.append("file", files[0]);
      bodyFormData.append("type", reportType);
      bodyFormData.append("title", reportName);
      bodyFormData.append("date", `${uploadDate}:00.000+00:00`);

      uploadImageWithData(API.UPLOAD_REPORT, bodyFormData)
          .then((response) => {
            setReportName("");
            setReportType("");
            setUploadDate("");
            setFiles([]);
            console.log("File upload response: ", response);
          })
          .catch((error) => {
            console.log("File upload error: ", error);
          });
    }
  };

  const uploadImageWithData = (endPoint, formData) => {
    const token = getData("ACCESS_TOKEN");
    return new Promise(async (resolve, reject) => {
      axios({
        method: "post",
        url: Constants.BASE_URL + endPoint,
        data: formData,
        headers: {Authorization: "Bearer " + token},
      })
          .then((response) => {
            addToast(response.data.message, {appearance: "success"});
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
    });
  };

  function getDepartment() {
    get(API.GET_DEPARTMENTS)
        .then(response => {
          if (response.status === 200) {
            let data = response.data.data.map((info) => {
              return {value: info.title, id: info._id};
            });
            setDepartments(data);
          } else {
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: 'error'});
        });
  }

  return (
      <>
        <Row></Row>
        <Row>
          <Col lg="12">
            <div className="upload-report">
              {reportList.map((report, index) => {
                return (
                    <UploadReportCard
                        key={`report-${index}`}
                        index={index}
                        report={report}
                        dispatch={dispatch}
                        addToast={addToast}
                        reportOptions={reportOptions}
                        departmentsOptions={departments}
                    />
                );
              })}
              <div className="add-more-report-button" onClick={() => {
                dispatch({
                  type: ACTIONS.ADD_NEW_REPORT,
                  payload: reportObj,
                });
              }}
              >
                <div><Image src={plus_icon}/></div>
                <div className="add-more-report-text">Add more</div>
              </div>
              <div className="button-div">
                <button
                    className="upload-button "
                    type="button"
                    onClick={uploadReport}
                >
                  Upload
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </>
  );
};

export default withRouter(UploadReport);
