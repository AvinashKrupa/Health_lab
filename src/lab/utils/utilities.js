export function getTimer(timeString) {
    const dateOneObj = new Date(timeString);
    const dateTwoObj = new Date();
    const milliseconds = dateTwoObj - dateOneObj;
    const hours = parseFloat(milliseconds / 36e5).toFixed(3);

    if(Math.sign(hours) < 0) {
        return hours >= -1
    }  else if(Math.sign(hours) < 0) {
        return false;
    }
}

export function convert24hto12h(timeString, ampmRequired = true) {
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = H < 12 ? " AM" : " PM";
    return( h + timeString.substr(2, 3) + (ampmRequired ? ampm : ''));
}
