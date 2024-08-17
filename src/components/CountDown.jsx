import React, { useState, useEffect } from 'react';

const CountDown = ({startCountdown,isActive, setappOTP}) => {
  const [seconds, setSeconds] = useState(59);
  

  useEffect(() => {
    let timer;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    }
    if(seconds == 0) {
        setappOTP(()=>"");
    }

    // Cleanup the interval on component unmount or when the countdown stops
    return () => clearInterval(timer);
  }, [isActive, seconds]);

  return (
    <div>
      <p style={{textAlign:"right"}}>Resend OTP in {seconds} seconds</p>
    </div>
  );
};

export default CountDown;
