"use client";

import React, { useEffect, useState } from "react";

export default function Clock() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [time, setTime] = useState<Date | null>(null);
    const [error, setError] = useState<string>("");

    const fetchTime = () => {
        const url = `https://worldtimeapi.org/api/timezone/${timezone}`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch time");
                }
                return response.json();
            })
            .then((data) => {
                setTime(new Date(data.datetime));
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to retrieve time");
            });
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
        <div>
            {error ? (
                <p>{error}</p>
            ) : (
                <p className="font-[Inter] text-7xl">
                    {time ? time.toLocaleTimeString() : ""}
                </p>
            )}
        </div>
    );
}