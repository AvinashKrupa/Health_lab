import Input from "../../commonComponent/Input";
import TextArea from "../../commonComponent/TextArea";
import {Col, Form, Row} from "react-bootstrap";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {API, get, post} from '../../api/config/APIController';
import {useToasts} from "react-toast-notifications";
import CustomButton from "../../commonComponent/Button";
import KeyValueSelector from "../../commonComponent/KeyValueSelector";
import { isEmpty } from "../../utils/Validators";
import Spinner from "../../commonComponent/Spinner";
import {storeData} from "../../storage/LocalStorage/LocalAsyncStorage";
import Radio from "../../commonComponent/Radio";
import Selector from "../../commonComponent/Select";

const PatientEditProfile = (props) => {
    // Get state and language from server
    const [showLoader, setShowLoader] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [country, setCountry] = useState('');
    const [appointmentStats, setAppointmentStats] = useState({});
    const [stateName, setStateName] = useState('');
    let [loader, setLoader] = useState(false);
    const dosages = ["First", "Second"];
    const vaccineNames = ["Covishield", "Covaxin", "Sputnik", "J&J", "Pfizer", "Others"];
    const [isDiabetic, setIsDiabetic] = useState('');
    const [diabetics, setDiabetics] = useState([{id: 'yes', value: 'Yes', checked: false},
        {id: 'no', value: 'No', checked: false}]);
    const [diabeticValue, setDiabeticValue] = useState('');
    const [hypertensiveValue, setHypertensiveValue] = useState('');
    const [hypertensives, setHypertensives] = useState([{id: 'yes', value: 'Yes', checked: false},
        {id: 'no', value: 'No', checked: false}]);
    const [isHypertensive, setIsHypertensive] = useState('');
    const [surgerys, setSurgerys] = useState([{id: 'yes', value: 'Yes', checked: false},
        {id: 'no', value: 'No', checked: false}]);
    const [isSurgery, setIsSurgery] = useState('');
    const [surgeryValue, setSurgeryValue] = useState('');
    const [allergieValue, seAllergieValue] = useState('')
    const [allergies, setAllergies] = useState([{id: 'yes', value: 'Yes', checked: false},
        {id: 'no', value: 'No', checked: false}]);
    const [isAllergie, setIsAllergie] = useState('');
    const [covids, setCovids] = useState([{id: 'yes', value: 'Yes', checked: false},
        {id: 'no', value: 'No', checked: false}]);
    const [isCovid, setIsCovid] = useState('');
    const [otherMedical, setOtherMedical] = useState('');
    const [vaccinated, setVaccinated] = useState([{id: 'yes', value: 'Yes', checked: false},
        {id: 'no', value: 'No', checked: false}]);
    const [isVaccinated, setIsVaccinated] = useState('');
    const [vaccineDate, setVaccineDate] = useState('');
    const [dose, setDose] = useState('');
    const [vaccineName, setVaccineName] = useState('');
    const [covidDetails, handleCovidDetails] = useState('');

    useEffect(() => {
        getUserProfile();
        return () => {
        };
    }, []);

    useEffect(() => {
        getUserProfile()
        setTimeout(()=>props.setReloadSideColumn(false),1000)
    }, [props.reloadSideColumn]);

    const [dataState, setDataState] = useState([]);
    const [dataCity, setDataCity] = useState([]);
    const {addToast} = useToasts();

    const handleDiabetic = (id) => {
        setIsDiabetic(id === 'yes');
        const newDiabetic = diabetics.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        setDiabetics(newDiabetic);
    }

    const handleHypertensive = (id) => {
        setIsHypertensive(id === 'yes')
        const newHypertensives = hypertensives.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        setHypertensives(newHypertensives);
    }

    const handleSurgerys = (id) => {
        setIsSurgery(id === 'yes')

        const newSurgerys = hypertensives.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        setSurgerys(newSurgerys);
    }

    const handleAllergies = (id) => {
        setIsAllergie(id === 'yes')

        const newAllergies = allergies.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        setAllergies(newAllergies);
    }

    const handleCovids = (id) => {
        setIsCovid(id === 'yes')

        const newCovids = covids.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        setCovids(newCovids);
    }

    const handleVaccinated = (id) => {
        setIsVaccinated(id === 'yes')

        const newVaccinatedList = vaccinated.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        setVaccinated(newVaccinatedList);
    }


    function getUserProfile() {
        get(API.GET_PROFILE)
            .then(response => {
                if (response.data.status === 200) {
                    let user = response.data.data.user;
                    let additionalInfo = response.data.data.additional_info;
                    if(additionalInfo) {
                        storeData('additional_info', JSON.stringify(additionalInfo));
                    }
                    //diabetic
                    if(additionalInfo.med_cond[0].selected){
                        setDiabetics(
                            [{id: 'yes', value: 'Yes', checked: true},
                                {id: 'no', value: 'No', checked: false}]
                        )
                        setDiabeticValue((moment(additionalInfo.med_cond[0].diag_at).format('YYYY-MM-DD')))
                        setIsDiabetic(true)
                    }else {
                        setDiabetics(
                            [{id: 'yes', value: 'Yes', checked: false},
                                {id: 'no', value: 'No', checked: true}]
                        )
                    }
                    //hypertensive
                    if(additionalInfo.med_cond[1].selected){
                        setHypertensives(
                            [{id: 'yes', value: 'Yes', checked: true},
                                {id: 'no', value: 'No', checked: false}]
                        )
                        setIsHypertensive(true)
                        setHypertensiveValue(moment(additionalInfo.med_cond[1].diag_at).format('YYYY-MM-DD'))
                    }else {
                        setHypertensives(
                            [{id: 'yes', value: 'Yes', checked: false},
                                {id: 'no', value: 'No', checked: true}]
                        )
                    }
                    //diagnosed_with_covid
                    if(additionalInfo.med_cond[2].selected){
                        setCovids(
                            [{id: 'yes', value: 'Yes', checked: true},
                                {id: 'no', value: 'No', checked: false}]
                        )
                        handleCovidDetails(additionalInfo.med_cond[2].desc)
                        setIsCovid(true)
                    }else {
                        setCovids(
                            [{id: 'yes', value: 'Yes', checked: false},
                                {id: 'no', value: 'No', checked: true}]
                        )
                    }

                    //past_surgeries
                    if(additionalInfo.med_cond[3].selected){
                        setSurgerys(
                            [{id: 'yes', value: 'Yes', checked: true},
                                {id: 'no', value: 'No', checked: false}]
                        )
                        setSurgeryValue(additionalInfo.med_cond[3].desc)
                        setIsSurgery(true)
                    }else {
                        setSurgerys(
                            [{id: 'yes', value: 'Yes', checked: false},
                                {id: 'no', value: 'No', checked: true}]
                        )
                    }

                    //allergy_to_meds
                    if(additionalInfo.med_cond[4].selected){
                        setAllergies(
                            [{id: 'yes', value: 'Yes', checked: true},
                                {id: 'no', value: 'No', checked: false}]
                        )
                        seAllergieValue(additionalInfo.med_cond[4].desc)
                        setIsAllergie(true)
                    }else {
                        setAllergies(
                            [{id: 'yes', value: 'Yes', checked: false},
                                {id: 'no', value: 'No', checked: true}]
                        )
                    }

                    //covid_vaccinated
                    if(additionalInfo.med_cond[5].selected){
                        setVaccinated(
                            [{id: 'yes', value: 'Yes', checked: true},
                                {id: 'no', value: 'No', checked: false}]
                        )
                        setIsVaccinated(true)
                        setVaccineDate(moment(additionalInfo.med_cond[5].diag_at).format('YYYY-MM-DD'))
                        setDose(additionalInfo.med_cond[5].meta[0].desc)
                        setVaccineName(additionalInfo.med_cond[5].meta[1].desc)
                    }else {
                        setVaccinated(
                            [{id: 'yes', value: 'Yes', checked: false},
                                {id: 'no', value: 'No', checked: true}]
                        )
                    }
                    setOtherMedical(additionalInfo.other_med_cond)

                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setEmail(user.email);
                    setGender(user.gender);
                    setMobile(user.mobile_number);
                    setBirthDate(user.dob);
                    setAddressLine1(additionalInfo.address.line1);
                    setAddressLine2(additionalInfo.address.line2);
                    setState(additionalInfo.address.state);
                    setCity(additionalInfo.address.city);
                    setCountry(additionalInfo.address.country);
                    setAppointmentStats(additionalInfo.appointment_stats);
                    getState(additionalInfo.address.state);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                console.log('error: ', error);
                // addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    // Edit Profile
    function updateUserProfile() {
        let params = {
            first_name: firstName,
            last_name: lastName,
            address: {
                line1: addressLine1,
                line2: addressLine2,
                state: state,
                city: city,
                country: 'India'
            },
            med_cond: [
                {
                    name: 'diabetic',
                    selected: isDiabetic,
                    diag_at: isDiabetic ? diabeticValue : '',
                    desc: '',
                },
                {
                    name: 'hypertensive',
                    selected: isHypertensive,
                    diag_at: isHypertensive ? hypertensiveValue : '',
                    desc: '',
                },
                {
                    name: 'diagnosed_with_covid',
                    selected: isCovid,
                    diag_at: '',
                    desc: isCovid ? covidDetails : '',
                },
                {
                    name: 'past_surgeries',
                    selected: isSurgery,
                    diag_at: '',
                    desc: isSurgery ? surgeryValue : '',
                },
                {
                    name: 'allergy_to_meds?',
                    selected: isAllergie,
                    diag_at: '',
                    desc: isAllergie ? allergieValue : '',
                },
                {
                    name: 'covid_vaccinated',
                    selected: isVaccinated,
                    diag_at: isVaccinated ? vaccineDate : '',
                    desc: '',
                    meta: isVaccinated ? [
                        {
                            name: 'dose_type',
                            selected: true,
                            diag_at: '',
                            desc: dose,
                        },
                        {
                            name: 'vaccine_name',
                            selected: true,
                            diag_at: '',
                            desc: vaccineName,
                        }
                    ] : []
                },
            ],
            other_med_cond: otherMedical,
        };
        setShowLoader(true);
        post(API.UPDATE_PROFILE, params, true)
            .then(response => {
                if (response.status === 200) {
                    setShowLoader(false);
                    addToast(response.data.message, {appearance: 'success'});
                } else {
                    setShowLoader(false);
                    addToast(response.data.message, {appearance: 'error'});
                }
                props.setReloadSideColumn(true)
            })
            .catch(error => {
                setShowLoader(false);
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    const setIdAndState = (value) => {
        const stateInfo = value.split('|');
        getCity(stateInfo[0]);
        setState(stateInfo[1]);
        console.log('(stateInfo[1]: ', stateInfo[1]);
        stateInfo[1] === 'Select state' && setCity('Select city')
    }

    const setCityValue = (value, id) => {
        const cityInfo = value.split('|');
        setCity(cityInfo[1])
    }

    const getStateValue = value => {
        if(value){
          const selectedState = dataState.find(state => state.value === value)
          return selectedState ? `${selectedState.id}|${selectedState.value}` : ''
        }else{
          return ''
        }
      }

      const getCityValue = value => {
        if(value){
          const selectedCity = dataCity.find(city => city.value === value)
          return selectedCity ? `${selectedCity.id}|${selectedCity.value}` : ''
        }else{
          return ''
        }
      }

    // Get city from server
    function getCity(id, cityId) {
        setLoader(true)
        post(API.GETCITY, {countryId: 101, stateId: parseInt(id)})
            .then(response => {
                if (response.status === 200) {
                    let data = response.data.data.map((info) => {
                        return {value: info.name, id: info.id};
                    });
                    setLoader(false)
                    setDataCity(data);
                    setCity('Select city')
                } else {
                    setLoader(false)
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                setLoader(false)
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }


    // Get state from server
    function getState(stateId) {
        post(API.GETSTATE, {countryId: 101})
            .then(response => {
                if (response.status === 200) {
                    let data = response.data.data.map((info) => {
                        if(info.name.toString() === stateId) {
                            setStateName(info.name)
                        }
                        return {value: info.name, id: info.id};
                    });
                    setDataState(data);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    function validation() {
        if (isEmpty(firstName)) {
          addToast('Please enter first name', { appearance: 'error' });
          return false;
        } else if (isEmpty(lastName)) {
          addToast('Please enter last name', { appearance: 'error' });
          return false;
        } else if (isEmpty(addressLine1)) {
          addToast('Please enter address line 1', { appearance: 'error' });
          return false;
        } else if (isEmpty(state) || state === 'Select state') {
          addToast('Please select state', { appearance: 'error' });
          return false;
        } else if (isEmpty(city) || city === 'Select city') {
          addToast('Please select city', { appearance: 'error' });
          return false;
        }  else {
          return true;
        }
      }

    return (
        <div className="edit-patient-container">
            <Row  className="g-2">
                <Row>
                    {/* <h2 className="sub-title"></h2> */}
                </Row>
                <Col className="registration-page-1-column" md>
                    <Input label="First Name" type="text" placeholder="eg John" value={firstName}
                            onChange={setFirstName}/>
                </Col>
                <Col className="registration-page-1-column" md>
                    <Input label="Last Name" type="text" placeholder="eg Doe" value={lastName}
                            onChange={setLastName}/>
                </Col>
            </Row>
            <Row className="g-2">
                <Col md>
                    <Input label="Mobile Number" type="number" readonly="true" value={mobile} onChange={setMobile}/>
                </Col>
                <Col>
                    <Input label="Email" type="email" readonly="true" value={email} onChange={setEmail}/>
                </Col>
            </Row>
            <Row className="g-2">
                <Col md>
                    <Input label="Date of Birth" type="date" readonly="true" onChange={setBirthDate}
                            value={birthDate}/>
                </Col>
                <Col>
                    <Input
                        readonly="true"
                        label="Gender"
                        value={gender}
                        id="gender"
                    />
                </Col>
            </Row>

            <Row>
                <Col md>
                    <Input
                        type="text"
                        placeholder="Enter address"
                        id="addressLine1"
                        label="Address Line 1"
                        value={addressLine1}
                        onChange={setAddressLine1}
                    />
                </Col>
                <Col md>
                    <Input
                        type="text"
                        placeholder="Enter address (optional)"
                        id="addressLine2"
                        label="Address Line 2"
                        value={addressLine2}
                        onChange={setAddressLine2}
                    />
                </Col>
            </Row>
            <Row className="g-2">
                <Col md>
                    <Input
                        disabled={true}
                        value={country}
                        type="text"
                        placeholder="India"
                        id="country"
                        label="Country"
                        readOnly={true}
                    />
                </Col>
                <Col md>
                    <Row className="g-2">
                        <Col md>
                            <KeyValueSelector
                                defaultValue={stateName}
                                value={getStateValue(state)}
                                label="State"
                                id="state"
                                options={dataState}
                                handleSelect={setIdAndState}
                            />
                        </Col>
                        <Col md style={{position: "relative"}}>
                        { loader &&
                            <div style={{position: "absolute", zIndex: 6, top: '60px', left: '60px'}}>
                                <Spinner showLoader={loader} width={40} height={40}/>
                            </div>
                         }
                            <KeyValueSelector
                                defaultValue={city}
                                 value={getCityValue(city)}
                                 label="City"
                                 id="city"
                                 options={dataCity}
                                 handleSelect={setCityValue}
                            />
                        </Col>
                    </Row>
                </Col>
                <Row className="g-2">
                    <Col md>
                        <Row>
                            <Radio
                                label="Are you Diabetic?"
                                id="radioDiabetes"
                                options={diabetics}
                                handleSelect={handleDiabetic}
                            />
                        </Row>
                        <Row>
                            {isDiabetic &&
                            <Col>
                                <br/>
                                <br/> <Form.Control type="date"
                                                    value={diabeticValue}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    max={moment(new Date()).format('YYYY-MM-DD')}
                                                    onChange={(e) => setDiabeticValue(e.target.value)}/>
                            </Col>
                            }

                        </Row>
                    </Col>
                    <Col md>
                        <Row>
                            <Radio
                                label="Are you Hypertensive?"
                                id="radioHypertensive"
                                options={hypertensives}
                                handleSelect={handleHypertensive}
                            />
                        </Row>
                        <Row>
                            {isHypertensive &&
                            <Col>
                                <br/>
                                <br/> <Form.Control type="date"
                                                    value={hypertensiveValue}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    max={moment(new Date()).format('YYYY-MM-DD')}
                                                    onChange={(e) => setHypertensiveValue(e.target.value)}/>
                            </Col>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row className="g-2">
                    <Col md>
                        <Row>
                            <Radio
                                label="Any past surgery?"
                                id="radioSurgery"
                                options={surgerys}
                                handleSelect={handleSurgerys}
                            />
                        </Row>
                        {isSurgery &&
                        <Row>
                            <TextArea
                                id={'surgery'}
                                value={surgeryValue}
                                placeholder="Please mention in brief"
                                onChange={setSurgeryValue}
                                rows={4}
                                cols={35}
                            ></TextArea>
                        </Row>
                        }
                    </Col>
                    <Col md>
                        <Row>
                            <Radio
                                label="Any allergies to medications?"
                                id="radioAllergies"
                                options={allergies}
                                handleSelect={handleAllergies}
                            />
                        </Row>
                        <Row>
                            {isAllergie &&
                            <TextArea
                                id={'textareaSurgery'}
                                value={allergieValue}
                                placeholder="Please mention in brief"
                                onChange={seAllergieValue}
                                rows={4}
                                cols={35}
                            ></TextArea>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row className="g-2">
                    <Col md>
                        <Row>
                            <Radio
                                label="Have you been diagnosed with Covid?"
                                id="diagCovid"
                                options={covids}
                                handleSelect={handleCovids}
                            />
                        </Row>
                        <Row>
                            {isCovid &&
                            <Col md>
                                <Input
                                    type="text"
                                    placeholder="Enter additional details"
                                    label="Provide additional details of Covid illness"
                                    value={covidDetails}
                                    onChange={handleCovidDetails}
                                />
                            </Col>
                            }
                        </Row>
                    </Col>
                    <Col md>
                        <Row>
                            <Radio
                                label="Have you been vaccinated against Covid?"
                                id="vaccinated"
                                options={vaccinated}
                                handleSelect={handleVaccinated}
                            />
                        </Row>
                        <Row>
                            {isVaccinated &&
                            <Col md style={{paddingTop: '32px'}}>
                                <br/> <Form.Control type="date"
                                                    value={vaccineDate}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    max={moment(new Date()).format('YYYY-MM-DD')}
                                                    onChange={(e) => setVaccineDate(e.target.value)}/>
                                <Selector
                                    defaultValue="Choose dose type"
                                    id="dose"
                                    options={dosages}
                                    handleSelect={setDose}
                                    value={dose}
                                />
                                <Selector
                                    defaultValue="Choose vaccine name"
                                    id="v-name"
                                    options={vaccineNames}
                                    handleSelect={setVaccineName}
                                    value={vaccineName}
                                />
                            </Col>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row className="g-2">
                    <Col md>
                        <TextArea
                            label="Other medical conditions"
                            id={'other-condition'}
                            value={otherMedical}
                            placeholder="Add conditions"
                            onChange={setOtherMedical}
                            rows={1}
                            cols={20}
                        ></TextArea>
                    </Col>
                    <Col md></Col>
                </Row>

            </Row>
            <Col className='form-btn' style={{margin: 'inherit',
                 textAlign: 'center'}}>
                {showLoader && <CustomButton
                    className='multistepform-button edit-profile-update-button'
                    disabled
                    onClick={() => {
                        if(validation()) {
                            updateUserProfile();
                        }
                    }}
                    importantStyle={{backgroundColor: "#e2e9e9"}}
                    showLoader={showLoader}
                ></CustomButton>}
                {!showLoader && <CustomButton
                    className='multistepform-button edit-profile-update-button'
                    onClick={() => {
                        if(validation()) {
                            updateUserProfile();
                        }
                    }}
                    text={'Update'}
                ></CustomButton>}
            </Col>

        </div>
    );
};
export default PatientEditProfile;
