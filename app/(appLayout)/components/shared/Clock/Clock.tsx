"use client";
import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

type Props = {
  location: string;
};

const Clock = ({ location }: Props) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = formatInTimeZone(now, location, "HH:mm:ss");
      setTime(formattedTime);
    };

    // Update time immediately
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [location]);

  return <div>{time}</div>;
};

export default Clock;
