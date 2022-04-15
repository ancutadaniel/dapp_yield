import React, { useState, useEffect } from 'react';

const Airdrop = () => {
  let interval;

  const [seconds, setSeconds] = useState(3600);
  const [time, setTime] = useState({
    h: 0,
    m: 0,
    s: 0,
  });

  const clock = (sec) => {
    // how many h => sec / 3600
    const hours = Math.floor(sec / (60 * 60));
    // how many min, we take the remainder form 1 h  and then divide by 60
    const remainderMinute = sec % (60 * 60);
    const minutes = Math.floor(remainderMinute / 60);
    // how many seconds, we take the remainder minutes and find modulus from that
    const secondsRem = Math.ceil(remainderMinute % 60);

    return {
      h: hours,
      m: minutes,
      s: secondsRem,
    };
  };

  const countDown = () => {
    let sec = seconds;
    interval = setInterval(() => {
      setSeconds((prevState) => prevState - 1);
      setTime(clock(sec));
      if (sec === 0) {
        clearInterval(interval);
      }
      sec--;
    }, 1000);
  };

  useEffect(() => {
    setTime(clock(seconds));
  }, []);

  return (
    <div>
      Airdrop
      <p>
        h: {time.h} m:{time.m} s:{time.s}
      </p>
      <button type='button' className='btn btn-info' onClick={countDown}>
        Start Airdrop
      </button>
    </div>
  );
};

export default React.memo(Airdrop);
