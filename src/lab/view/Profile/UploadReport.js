import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../commonComponent/Input";
import Select from "../../commonComponent/Select";
import {Col, Form, Image, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {pdf, upload} from "../../constants/PatientImages";
import moment from "moment";
import Dropzone from "react-dropzone";
import {API, get, post} from "../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import Constants from "../../constants";
import {getData} from "../../storage/LocalStorage/LocalAsyncStorage";
import {isEmpty} from "../../utils/Validators";
import {plus_icon} from "../../constants/DoctorImages";
import KeyValueSelector from "../../commonComponent/KeyValueSelector";

const UploadReport = (props) => {
  const [reportName, setReportName] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const {addToast} = useToasts();

  let reportOptions = ["MRI", "CT Scan ", "Blood Test"];

  useEffect( () => {
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

  const getDepartmentValue = value => {
    if(value){
      const selectedDepartment = departments.find(department => department.id === value)
      return selectedDepartment ? `${selectedDepartment.id}|${selectedDepartment.value}` : ''
    }else{
      return ''
    }
  }

  const setDepartmentValue = (value) => {
    const departmentInfo = value.split('|');
    setDepartment(departmentInfo[0]);
  }

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

  const renderUploadReportComponent = () => {
    const userType = JSON.parse(getData('USER_TYPE'));
    return (<>
      <div className="upload-report1">
        {/*<Row className="content">*/}
        <Row>
          <Col lg="6">
            <Input
                label="Report Name"
                type="text"
                placeholder="Consultation Report"
                value={reportName}
                onChange={setReportName}
            />
          </Col>
          <Col lg="6">
            <br/>
            <Form.Label>Report Date</Form.Label>
            <br/>
            <Form.Control type="datetime-local"
                          value={uploadDate}
                          onKeyDown={(e) => e.preventDefault()}
                          onChange={(e) => setUploadDate(e.target.value)}

            />
          </Col>
        </Row>
        {/*<Row className="content">*/}
        <Row>
          <Col lg="6">
            <Select
                label="Report Type"
                defaultValue="Select"
                id="report-type"
                options={reportOptions}
                handleSelect={setReportType}
            />
          </Col>
          <Col lg="6">
            {userType ===5 && <KeyValueSelector
                label="Department"
                id="department"
                value={getDepartmentValue(department)}
                defaultValue="Select department"
                options={departments}
                handleSelect={setDepartmentValue}
            />}
          </Col>
        </Row>

        <div className="upload-file">
          {files.map((fileName) => (
              <div className="uploaded" key={fileName.name}>
                <div>
                  <p className="file-name" key={fileName}>
                    {fileName.name}{" "}
                  </p>
                  <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                </div>
                <button className="view-button" onClick={() => setFiles([])}>
                  Delete
                </button>
              </div>
          ))}
          <Dropzone
              onDrop={(acceptedFiles) => {
                setError(false);
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                    )
                );
              }}
              accept="image/jpeg,.pdf"
              maxFiles={1}
              onDropRejected={(fileRejections, event) => {
                setError(true);
              }}
          >
            {({getRootProps, getInputProps}) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {files.length === 0 && (
                      <div className="upload-text">
                        <Image src={upload} alt="upload"/>
                        <p>Drag and Drop the files here</p>
                      </div>
                  )}
                </div>
            )}
          </Dropzone>
        </div>

        <div className="note">
          Please upload report in pdf or jpeg format
        </div>
        {error && (
            <div className="note" style={{color: "red", fontSize: "18px"}}>
              Please upload single report file
            </div>
        )}
      </div>
    </>)
  }

  return (
      <>
        <Row></Row>
        <Row>
          <Col lg="12">
            <div className="upload-report">
              {renderUploadReportComponent()}
              {files.length > 0 && <h4>Preview</h4>}
              <aside style={thumbsContainer}>{thumbs}</aside>
              <div className="add-more-report-button" onClick={() =>
                  null
              }>
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
