import { useEffect, useState } from "react";

export default function Countdown({
  seconds = 120,
  onComplete,
  isActive,
  onTick,
  prefix = "Resend available in ",
}) {
  const [timeLeft, setTimeLeft] = useState(isActive ? seconds : 0);

  // When isActive becomes true, reset timer
  useEffect(() => {
    if (isActive) {
      setTimeLeft(seconds);
    } else {
      setTimeLeft(0); // reset when disabled
    }
  }, [isActive, seconds]);

  // Interval logic
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]); // 👈 include timeLeft so it counts down

  // Call onComplete when time runs out
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      onComplete?.();
    }
  }, [timeLeft, isActive, onComplete]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return timeLeft > 0 ? (
    <span>
      {prefix}
      {formatTime(timeLeft)}
    </span>
  ) : null;
}
