import { useEffect, useRef, useState } from "react";
import "./App.css";
import timerSound from "./assets/mixkit-arcade-race-game-countdown-1952.wav";
const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [date, setDate] = useState("");
  const TIMER_DEFAULT_VALUE = {
    days: "0",
    hours: "0",
    minutes: "0",
    seconds: "0",
  };

  const [storedTimerResult, setStoredTimerResult] =
    useState(TIMER_DEFAULT_VALUE);

  let diff = new Date(date).getTime() - Date.now();

  let intervalId = useRef(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("timerResult");
    if (storedResult) {
      const timerResult = JSON.parse(storedResult);
      setStoredTimerResult(timerResult);
      startTimer(timerResult.targetedDate);
    }
  }, []);

  function startTimer(targetedDate) {
    if ((!targetedDate && !date) || targetedDate < Date.now()) {
      return;
    }

    setIsTimerRunning(true);
    setIsFinished(false);

    intervalId.current = setInterval(() => {
      const difference = targetedDate - Date.now();

      if (difference < 0) {
        const sound = new Audio(timerSound);
        sound.play();
        clearInterval(intervalId.current);
        setIsTimerRunning(false);
        setIsFinished(true);
      } else {
        const DAYS = ~~(difference / (1000 * 60 * 60 * 24));
        const HOURS = ~~(
          (difference % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
        );
        const MINUTES = ~~((difference % (1000 * 60 * 60)) / (1000 * 60));
        const SECONDS = ~~((difference % (1000 * 60)) / 1000);

        const timerResult = {
          days: DAYS,
          hours: HOURS,
          minutes: MINUTES,
          seconds: SECONDS,
          targetedDate: targetedDate,
        };
        localStorage.setItem("timerResult", JSON.stringify(timerResult));
        setStoredTimerResult(timerResult);
      }
    }, 1000);
  }

  function cancelTimer() {
    localStorage.removeItem("timerResult");
    setStoredTimerResult(TIMER_DEFAULT_VALUE);
    clearInterval(intervalId.current);
    setIsTimerRunning(false);
  }

  return (
    <div className="container">
      <h1 className="heading">
        Countdown <span>Timer</span>
      </h1>
      {diff < 0 && !isFinished && (
        <div className="error">Timer Supports Future Time Only</div>
      )}
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {isTimerRunning ? (
        <button onClick={cancelTimer} className="control-btn">
          Cancel Timer
        </button>
      ) : (
        <button
          onClick={() => startTimer(Date.parse(date))}
          className="control-btn"
        >
          Start Timer
        </button>
      )}
      {!isFinished ? (
        <div className="counDown">
          <div>
            <h1>{storedTimerResult.days}</h1> Days
          </div>
          <div>
            <h1>{storedTimerResult.hours}</h1> <p>Hours</p>
          </div>
          <div>
            <h1>{storedTimerResult.minutes}</h1> <p>Minutes</p>
          </div>
          <div>
            <h1>{storedTimerResult.seconds}</h1> <p>Seconds</p>
          </div>
        </div>
      ) : (
        <div className="success">
          🎉 The countdown is over! What is next on your adventure? 🎉
        </div>
      )}
      {~~(diff / (1000 * 60 * 60 * 24)) > 100 && (
        <div className="success">Selected Time is more than 100 days.</div>
      )}
    </div>
  );
};

export default App;
