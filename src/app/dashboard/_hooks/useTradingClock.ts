"use client";
import { useState, useEffect, useMemo } from "react";

interface TradingClockReturn {
  timeString: string;
  isRestricted: boolean;
  status: string;
  countdown: string;
}

export function useTradingClock(): TradingClockReturn {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Update waktu segera setelah mount
    setNow(new Date());
    
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    // Protokol Sesi Zionyx (WIB)
    const isRestricted = hours >= 3 && hours < 8;
    const isLondon = hours >= 14 && hours < 17;
    const isNYOverlap = hours >= 19 && hours < 23;

    // Logic Countdown Sesi Berikutnya
    let targetLabel = "RESTRICTED";
    let targetHour = 3;

    if (hours >= 3 && hours < 14) { targetLabel = "LONDON"; targetHour = 14; }
    else if (hours >= 14 && hours < 19) { targetLabel = "NY OVERLAP"; targetHour = 19; }
    else if (hours >= 19 && hours < 23) { targetLabel = "CLOSE"; targetHour = 23; }
    else if (hours >= 23 || hours < 3) { targetLabel = "RESTRICTED"; targetHour = 3; }

    let diffMs = new Date(now).setHours(targetHour, 0, 0, 0) - now.getTime();
    if (diffMs < 0) diffMs += 86400000;

    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);

    return {
      timeString: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isRestricted,
      status: isRestricted ? "RESTRICTED" : isNYOverlap ? "NY OVERLAP" : isLondon ? "LONDON OPEN" : "OFF-SESSION",
      countdown: `${h}h ${m}m ${s}s to ${targetLabel}`
    };
  }, [now]);
}
