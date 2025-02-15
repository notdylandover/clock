"use client";

import React, { useEffect, useState } from "react";

export default function Clock() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [time, setTime] = useState<Date | null>(null);
    const [error, setError] = useState<string>("");

    const fetchTime = async () => {
        const primaryUrl = `https://worldtimeapi.org/api/timezone/${timezone}`;
        try {
            const response = await fetch(primaryUrl);

            if (!response.ok) {
                throw new Error("Primary API failed");
            }

            const data = await response.json();
            setTime(new Date(data.datetime));
            return;
        } catch (err) {
            console.error("Primary API failed, trying fallback...", err);
        }

        const fallbackUrl = `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`;
        try {
            const response = await fetch(fallbackUrl);

            if (!response.ok) {
                throw new Error("Fallback API failed");
            }

            const data = await response.json();
            setTime(new Date(data.dateTime));
            return;
        } catch (fallbackErr) {
            console.error("Both APIs failed, using system time", fallbackErr);
            setTime(new Date());
            setError("Using system time due to API failure");
        }
    };

    useEffect(() => {
        fetchTime();
    }, [timezone]);

    useEffect(() => {
        if (time) {
            const intervalId = setInterval(() => {
                setTime((prevTime) => new Date(prevTime!.getTime() + 1000));
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [time]);

    useEffect(() => {
        const syncInterval = setInterval(() => {
            fetchTime();
        }, 60000);
        return () => clearInterval(syncInterval);
    }, [timezone]);

    return (
        <div className="flex grow items-center justify-center">
            {error && <p className="text-red-500">{error}</p>}
            <p className="SevenSegment text-5xl sm:text-6xl md:text-8xl">
                {time ? time.toLocaleTimeString() : ""}
            </p>
        </div>
    );
}
