import {withRouter} from "react-router-dom/cjs/react-router-dom.min";
import {Col, Image, Row} from "react-bootstrap";
import React, {useEffect, useReducer, useState} from "react";
import {API, get, post} from "../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import Constants from "../../constants";
import {getData} from "../../storage/LocalStorage/LocalAsyncStorage";
import {isEmpty} from "../../utils/Validators";
import {plus_icon} from "../../constants/DoctorImages";

import UploadReportCard from "./Components/UploadReportCard";
import CustomButton from "../../commonComponent/Button";

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
  const [patientData, setPatientData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const {addToast} = useToasts();
  const userType = JSON.parse(getData('USER_TYPE'));
  useEffect(() => {
    if (!props.location?.state?.reportInfo) {
      props.history.goBack();
      return;
    } else {
      setPatientData(props.location?.state?.reportInfo);
    }
  }, []);
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

  const isValidData = () => {
    for (let i = 0; i < reportList.length; i++) {
    if (isEmpty(reportList[i].reportItem.reportName)) {
        addToast("Please enter report name", {appearance: "error"});
        return false;
      }else if (isEmpty(reportList[i].reportItem.uploadDate)) {
        addToast("Please enter report date", {appearance: "error"});
        return false;
      } else if (isEmpty(reportList[i].reportItem.reportType) || reportList[i].reportItem.reportType === "Select") {
        addToast("Please enter report type", {appearance: "error"});
        return false;
      }  else if (isEmpty(reportList[i].reportItem.department) && userType === 5) {
        addToast("Please select the department", {appearance: "error"});
        return false;
      } else if (reportList[i].reportItem.file.length === 0) {
        addToast("Please select the file", {appearance: "error"});
        return false;
      }
    if(i === reportList.length-1){
        return true
      }
    }
  };

  const uploadReport = () => {
    if (isValidData()) {
      let bodyFormData = new FormData();
      if(userType === 5){
        for (let i = 0; i < reportList.length; i++) {
          bodyFormData.append("appointment", patientData.appointmentId);
          bodyFormData.append("patient", patientData.patientId);
          bodyFormData.append("file", reportList[i].reportItem.file[0]);
          bodyFormData.append("type", reportList[i].reportItem.reportType);
          bodyFormData.append("title", reportList[i].reportItem.reportName);
          bodyFormData.append("department", reportList[i].reportItem.department);
          bodyFormData.append("date", `${reportList[i].reportItem.uploadDate}:00.000+00:00`);
        }
      }else {
        for (let i = 0; i < reportList.length; i++) {
          bodyFormData.append("appointment", patientData.appointmentId);
          bodyFormData.append("patient", patientData.patientId);
          bodyFormData.append("file", reportList[i].reportItem.file[0]);
          bodyFormData.append("type", reportList[i].reportItem.reportType);
          bodyFormData.append("title", reportList[i].reportItem.reportName);
          bodyFormData.append("date", `${reportList[i].reportItem.uploadDate}:00.000+00:00`);
        }
      }
      setShowLoader(true);
      uploadImageWithData(API.UPLOAD_REPORT, bodyFormData)
          .then((response) => {
            if (response.status === 200) {
              setShowLoader(false);
              console.log("Reports uploaded successfully: ", response);
              props.history.push(`/home`);
              addToast(response.data.message, { appearance: "success" });
            } else {
              setShowLoader(false);
              addToast(response.data.message, { appearance: "error" });
            }
          })
          .catch((error) => {
            setShowLoader(false);
            console.log("Reports failed to upload with error: ", error);
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
                {showLoader && <CustomButton
                    type="submit"
                    disabled
                    onClick={uploadReport}
                    importantStyle={{backgroundColor: "#e2e9e9"}}
                    showLoader={showLoader}
                    className={'upload-button'}
                ></CustomButton>}
                {!showLoader && <CustomButton
                    type="submit"
                    onClick={uploadReport}
                    text={'Upload'}
                    className={'upload-button'}
                ></CustomButton>}
              </div>
            </div>
          </Col>
        </Row>
      </>
  );
};

export default withRouter(UploadReport);
