import { useEffect, useState } from "react";

export default function Timer({ elapsed, totalSeconds }) {
  const [remaining, setRemaining] = useState(totalSeconds - elapsed);

  useEffect(() => {
    setRemaining(totalSeconds - elapsed);
  }, [elapsed, totalSeconds]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, (elapsed / totalSeconds) * 100)
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          height: 20,
          backgroundColor: "#ddd",
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            backgroundColor: "#4CAF50",
            transition: "width 1s linear",
          }}
        />
      </div>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
        Time Remaining: {formatTime(remaining)}
      </div>
    </div>
  );
}
