import React, {useState} from 'react';
import Countdown from 'react-countdown';

const MeetingTimer = ({date, handleEnableButton}) => {
    const [showTimerCountdown, setShowTimerCountdown] = useState(true);
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
          setShowTimerCountdown(false)
        handleEnableButton()
        return null;
      } else {
        return (showTimerCountdown && <div className="meeting-timer-container">{`Meeting starts in ${hours}:${minutes}:${seconds}`}</div>);
      }
    };

    return (
      <>
        <Countdown
           date={date}
           renderer={renderer}
        />
      </>
    );
  };

export default MeetingTimer;
