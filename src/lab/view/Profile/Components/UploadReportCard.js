import Input from "../../../commonComponent/Input";
import {Col, Form, Image, Row} from "react-bootstrap";
import Select from "../../../commonComponent/Select";
import moment from "moment";
import Dropzone from "react-dropzone";
import {ACTIONS} from "../UploadReport";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import {getData} from "../../../storage/LocalStorage/LocalAsyncStorage";
import {pdf,upload} from "../../../constants/PatientImages";

const UploadReportCard = ({
                              index,
                              report,
                              dispatch,
                              reportOptions,
                              departmentsOptions,
                          }) => {
    const userType = JSON.parse(getData('USER_TYPE'));

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

    const thumbs = report.reportItem.file.map((file) => (
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

    function setReportName(value) {
        dispatch({
            type: ACTIONS.SET_REPORT_NAME, payload: {id: index, value: value}
        })
    }

    function setReportType(value) {
        dispatch({
            type: ACTIONS.SET_REPORT_TYPE, payload: {id: index, value: value}
        })
    }

    function setDepartmentValue(value) {
        const departmentInfo = value.split('|');
        dispatch({
            type: ACTIONS.SET_DEPARTMENT, payload: {id: index, value: departmentInfo[0]}
        })
    }

    function setUploadDate(value) {
        dispatch({
            type: ACTIONS.SET_REPORT_DATE, payload: {id: index, value: value}
        })
    }

    function setUploadFile(file) {
        dispatch({
            type: ACTIONS.SET_REPORT_FILE, payload: {id: index, file: file}
        })
    }

    function setUploadFileError(fileError) {
        dispatch({
            type: ACTIONS.SET_REPORT_FILE_ERROR, payload: {id: index, value: fileError}
        })
    }

    function deleteUploadFile() {
        dispatch({
            type: ACTIONS.SET_REPORT_FILE, payload: {id: index, file: []}
        })
    }

    const getDepartmentValue = value => {
        if (value) {
            const selectedDepartment = departmentsOptions.find(department => department.id === value)
            return selectedDepartment ? `${selectedDepartment.id}|${selectedDepartment.value}` : ''
        } else {
            return ''
        }
    }
    return (
        <div className="upload-card-container">
            <Row>
                <Col lg="6">
                    <Input
                        label="Report Name"
                        type="text"
                        placeholder="Consultation Report"
                        value={report.reportItem.reportName}
                        onChange={setReportName}
                    />
                </Col>
                <Col lg="6">
                    <br/>
                    <Form.Label>Report Date</Form.Label>
                    <br/>
                    <Form.Control type="datetime-local"
                                  value={report.reportItem.uploadDate}
                                  onKeyDown={(e) => e.preventDefault()}
                                  onChange={(e) => setUploadDate(e.target.value)}
                    />
                </Col>
            </Row>
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
                    {userType === 5 && <KeyValueSelector
                        label="Department"
                        id="department"
                        value={getDepartmentValue(report.reportItem.department)}
                        defaultValue="Select department"
                        options={departmentsOptions}
                        handleSelect={setDepartmentValue}
                    />}
                </Col>
            </Row>

            <div className="upload-file">
                {report.reportItem.file.map((fileName) => (
                    <div className="uploaded" key={fileName.name}>
                        <div>
                            <p className="file-name" key={fileName}>
                                {fileName.name}{" "}
                            </p>
                            <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                        </div>
                        <button className="view-button" onClick={() => deleteUploadFile()}>
                            Delete
                        </button>
                    </div>
                ))}
                <Dropzone
                    onDrop={(acceptedFiles) => {
                        setUploadFileError('')
                        setUploadFile(
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
                        setUploadFileError('Please upload single report file')
                    }}
                >
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {report.reportItem.file.length === 0 && (
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
            {report.validationInfo.fileError && (
                <div className="note" style={{color: "red", fontSize: "18px"}}>
                    {report.validationInfo.fileError}
                </div>
            )}
            {report.reportItem.file.length > 0 && <h4>Preview</h4>}
            <aside style={thumbsContainer}>{thumbs}</aside>
        </div>
    )
}
export default UploadReportCard;
