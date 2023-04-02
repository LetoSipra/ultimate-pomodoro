import { useEffect, useState } from "react";

function PomodoroClock() {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [ticking, setTicking] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(true);
  const [state, setState] = useState<string>("Session");
  const [totalpom, setTotalpom] = useState<number>(0);

  //Settings
  const [session, setSession] = useState<number>(25);
  const [shortRest, setShortRest] = useState<number>(5);
  const [longRest, setLongRest] = useState<number>(10);
  const [isLongRest, setIsLongRest] = useState<number>(0);

  const reset = (mode: string) => {
    if (mode === "Short Break") {
      setMinutes(shortRest);
    } else if (mode === "Long Break") {
      setMinutes(longRest);
    } else {
      setMinutes(session);
    }
    setState(mode);
    setSeconds(0);
    loop ? setTicking(true) : setTicking(false);
  };

  const display = () => {
    if (minutes < 10) {
      if (seconds < 10) {
        return (
          <>
            0{minutes}:0{seconds}
          </>
        );
      } else {
        return (
          <>
            0{minutes}:{seconds}
          </>
        );
      }
    } else if (seconds < 10) {
      return (
        <>
          {minutes}:0{seconds}
        </>
      );
    } else {
      return (
        <>
          {minutes}:{seconds}
        </>
      );
    }
  };

  //clock
  const ticksec = () => {
    if (ticking) {
      if (seconds === 0) {
        if (minutes === 0) {
          if (loop) {
            if (state === "Session") {
              setTotalpom(totalpom + 1);
            } else {
              reset("Session");
            }
          } else if (state === "Session") {
            setTotalpom(totalpom + 1);
            reset("Session");
          } else {
            reset(state);
          }
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      } else {
        setSeconds(seconds - 1);
      }
    }
  };

  //if loop true then loop
  useEffect(() => {
    if (loop) {
      if (ticking) {
        if (totalpom % isLongRest === 0) {
          reset("Long Break");
        } else {
          reset("Short Break");
        }
      }
    }
  }, [totalpom]);

  //ticking the clock
  useEffect(() => {
    if (ticking) {
      const setTime = setInterval(ticksec, 10);
      return () => clearInterval(setTime);
    }
  });

  return (
    <>
      <div className="md:w-[50vw]">
        {/* mode buttons */}
        <div className="flex justify-between font-serif font-semibold">
          <button
            className="headBtn"
            onClick={() => {
              reset("Session");
              setTicking(false);
            }}>
            Pomodoro
          </button>
          <button
            className="headBtn"
            onClick={() => {
              reset("Short Break");
              setTicking(false);
            }}>
            Short Break
          </button>
          <button
            className="headBtn"
            onClick={() => {
              reset("Long Break");
              setTicking(false);
            }}>
            Long Break
          </button>
        </div>
        {/* display */}
        <div className="flex flex-col text-center">
          <p className="text-5xl font-extrabold">{state}</p>
          <p className="font-mono text-9xl font-extrabold">{display()}</p>
        </div>
        {/* control buttons */}
        <div className="flex justify-center">
          <button
            className=""
            onClick={() => {
              setTicking(!ticking);
            }}>
            31
          </button>
          <button
            className=""
            onClick={() => {
              reset(state);
              setTicking(false);
            }}>
            62
          </button>
          <button className="" onClick={() => setLoop(!loop)}>
            Loop
          </button>
        </div>
      </div>
    </>
  );
}

export default PomodoroClock;
