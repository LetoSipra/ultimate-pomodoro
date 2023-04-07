import { useEffect, useState } from "react";
import {
  HiArrowPath,
  HiArrowPathRoundedSquare,
  HiOutlinePlay,
} from "react-icons/hi2";

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
      <div className="mx-2 my-2 h-[calc(47vh_-_12px)] rounded-xl border-2 border-solid border-white/10 bg-white/5 py-1 outline outline-white/10 lg:my-10 lg:h-[calc(94vh_-_80px)] lg:w-[50%]">
        {/* mode buttons */}
        <div className="mx-1 my-5 flex justify-between font-semibold sm:mx-10">
          <button
            className="rounded-lg border border-white/10 bg-white/20 px-1 py-2 text-xl font-bold text-white shadow-sm shadow-white/25 outline outline-white/10 transition duration-300 hover:bg-white/30"
            onClick={() => {
              reset("Session");
              setTicking(false);
            }}>
            Pomodoro
          </button>
          <button
            className="rounded-lg border border-white/10 bg-white/20 px-1 py-2 text-xl font-bold text-white shadow-sm shadow-white/25 outline outline-white/10 transition duration-300 hover:bg-white/30"
            onClick={() => {
              reset("Short Break");
              setTicking(false);
            }}>
            Short Break
          </button>
          <button
            className="rounded-lg border border-white/10 bg-white/20 px-1 py-2 text-xl font-bold text-white shadow-sm shadow-white/25 outline outline-white/10 transition duration-300 hover:bg-white/30"
            onClick={() => {
              reset("Long Break");
              setTicking(false);
            }}>
            Long Break
          </button>
        </div>
        {/* display */}
        <div className="flex flex-col text-center">
          <p className="my-1 text-5xl font-bold">{state}</p>
          <p className="font-mono text-[100px] sm:text-[125px] lg:text-[150px] xl:text-[200px] 2xl:text-[225px]">
            {display()}
          </p>
        </div>
        {/* control buttons */}
        <div className="my-3 flex justify-center space-x-5">
          <HiOutlinePlay
            className="h-10 w-10 cursor-pointer rounded-md transition duration-300 hover:bg-white/25 sm:h-12 sm:w-12"
            onClick={() => {
              setTicking(!ticking);
            }}
          />
          <HiArrowPath
            className="h-10 w-10 cursor-pointer rounded-md transition duration-300 hover:bg-white/25 sm:h-12 sm:w-12"
            onClick={() => {
              reset(state);
              setTicking(false);
            }}
          />
          <HiArrowPathRoundedSquare
            className={`h-10 w-10 cursor-pointer rounded-md shadow transition duration-300 hover:bg-white/25 sm:h-12 sm:w-12 ${
              loop ? "shadow-[green]" : "shadow-[red]"
            }`}
            onClick={() => setLoop(!loop)}
          />
        </div>
      </div>
    </>
  );
}

export default PomodoroClock;
