import {getData, storeData, removeData} from './LocalAsyncStorage';

export const setCustomerData = async (data) => {
    await storeData('@CUSTOMERDATA', JSON.stringify(data));
    return;
};

export const getCustomerData = async () => {
    const customerData = await getData('@CUSTOMERDATA');
    if (!!customerData) {
        return JSON.parse(customerData);
    } else {
        return customerData;
    }
};

export const removeCustomerData = async () => {
    await removeData('@CUSTOMERDATA');
};

export const setOfflineMessage = async (data) => {
    await storeData('@OFFLINE_MODE_MESSAGE', JSON.stringify(data));
    return;
};

export const getOfflineMessage = async () => {
    const loginData = await getData('@OFFLINE_MODE_MESSAGE');
    if (!!loginData) {
        return JSON.parse(loginData);
    } else {
        return loginData;
    }
};

//LAST_MAINTAINANCE_END_DATE
export const setSiteCoreStartDate = async (data) => {
    await storeData('@SITECORE_START_DATE', JSON.stringify(data));
    return;
};

export const getSiteCoreStartDate = async () => {
    const data = await getData('@SITECORE_START_DATE');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};

export const removeSiteCoreStartDate = async () => {
    await removeData('@SITECORE_START_DATE');
};

export const setLastMaintainEndDate = async (data) => {
    await storeData('@LAST_MAINTAINANCE_END_DATE', JSON.stringify(data));
    return;
};

export const getLastMaintainEndDate = async () => {
    const data = await getData('@LAST_MAINTAINANCE_END_DATE');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};

export const removeLastMaintainEndDate = async () => {
    await removeData('@LAST_MAINTAINANCE_END_DATE');
};

export const setLastMaintainanceMessage = async (data) => {
    await storeData('@LAST_MAINTAINANCE_MESSAGE', JSON.stringify(data));
    return;
};

export const getLastMaintainanceMessage = async () => {
    const data = await getData('@LAST_MAINTAINANCE_MESSAGE');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};

export const removeLastMaintainanceMessage = async () => {
    await removeData('@LAST_MAINTAINANCE_MESSAGE');
};

export const setFirstTimeInstall = async (data) => {
    await storeData('@FIRST_TIME_INSTALL', JSON.stringify(data));
    return;
};

export const getFirstTimeInstall = async () => {
    const data = await getData('@FIRST_TIME_INSTALL');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};

export const removeFirstTimeInstall = async () => {
    await removeData('@FIRST_TIME_INSTALL');
};

export const setMaintenanceMode = async (data) => {
    await storeData('@MAINTENANCE_MODE', JSON.stringify(data));
    return;
};

export const getMaintenanceMode = async () => {
    const data = await getData('@MAINTENANCE_MODE');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeMaintenanceMode = async () => {
    await removeData('@MAINTENANCE_MODE');
};

//'appEndPoint'
export const setAppEndPoint = async (data) => {
    await storeData('@APP_END_POINTS', JSON.stringify(data));
    return;
};

export const getAppEndPoint = async () => {
    const data = await getData('@APP_END_POINTS');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeAppEndPoint = async () => {
    await removeData('@APP_END_POINTS');
};

//JWT_TOKEN
export const setJwtToken = async (data) => {
    await storeData('@JWT_TOKEN', JSON.stringify(data));
    return;
};

export const getJwtToken = async () => {
    const data = await getData('@JWT_TOKEN');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeJwtToken = async () => {
    await removeData('@JWT_TOKEN');
};

//JSS_SESSION_KET
export const setJssSessionKey = async (data) => {
    await storeData('@JSS_SESSION_KET', JSON.stringify(data));
    return;
};

export const getJssSessionKey = async () => {
    const data = await getData('@JSS_SESSION_KET');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeJssSessionKey = async () => {
    await removeData('@JSS_SESSION_KET');
};

//FACILITY_SESSION_KET
export const setFacilitySessionKey = async (data) => {
    await storeData('@FACILITY_SESSION_KET', JSON.stringify(data));
    return;
};

export const getFacilitySessionKey = async () => {
    const data = await getData('@FACILITY_SESSION_KET');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeFacilitySessionKey = async () => {
    await removeData('@FACILITY_SESSION_KET');
};

//TIMEOUTMESSAGE

export const setTimeOutMessage = async (data) => {
    await storeData('@TIMEOUTMESSAGE', JSON.stringify(data));
    return;
};

export const getTimeOutMessage = async () => {
    const data = await getData('@TIMEOUTMESSAGE');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeTimeOutMessage = async () => {
    await removeData('@TIMEOUTMESSAGE');
};

//TIMEOUT

export const setTimeOut = async (data) => {
    await storeData('@TIMEOUT', JSON.stringify(data));
    return;
};

export const getTimeOut = async () => {
    const data = await getData('@TIMEOUT');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeTimeOut = async () => {
    await removeData('@TIMEOUT');
};

//ecardSessionDetails

//TIMEOUT
export const setEcardSessionDetails = async (data) => {
    await storeData('@ECARD_SESSION_DETAILS', JSON.stringify(data));
    return;
};

export const getEcardSessionDetails = async () => {
    const data = await getData('@ECARD_SESSION_DETAILS');
    if (!!data) {
        return JSON.parse(data);
    } else {
        return data;
    }
};
export const removeEcardSessionDetails = async () => {
    await removeData('@ECARD_SESSION_DETAILS');
};
