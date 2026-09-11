"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  onExpire?: () => void;
  compact?: boolean;
}

export default function CountdownTimer({
  targetDate,
  onExpire,
  compact = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
        <span>✨</span> WAKTU RILIS TELAH TIBA
      </span>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40 font-bold">
        <span>⏳</span>
        {timeLeft.days > 0 && `${timeLeft.days}h `}
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-xl bg-occult-950/90 border border-red-900/50 text-center shadow-inner">
      <div className="flex flex-col bg-occult-900/90 p-1.5 rounded-lg border border-red-950">
        <span className="font-mono text-base font-bold text-red-400">
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span className="text-[8px] font-mono uppercase text-slate-500 tracking-wider">HARI</span>
      </div>
      <div className="flex flex-col bg-occult-900/90 p-1.5 rounded-lg border border-red-950">
        <span className="font-mono text-base font-bold text-red-400">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[8px] font-mono uppercase text-slate-500 tracking-wider">JAM</span>
      </div>
      <div className="flex flex-col bg-occult-900/90 p-1.5 rounded-lg border border-red-950">
        <span className="font-mono text-base font-bold text-red-400">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[8px] font-mono uppercase text-slate-500 tracking-wider">MNT</span>
      </div>
      <div className="flex flex-col bg-occult-900/90 p-1.5 rounded-lg border border-red-950">
        <span className="font-mono text-base font-bold text-red-400 animate-pulse">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[8px] font-mono uppercase text-slate-500 tracking-wider">DTK</span>
      </div>
    </div>
  );
}
