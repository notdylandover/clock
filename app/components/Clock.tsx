"use client";

import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";

export default function Clock() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [time, setTime] = useState<Date | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(true);

    const fetchTime = async () => {
        setLoading(true);
        setError("");

        const primaryUrl = `https://worldtimeapi.org/api/timezone/${timezone}`;

        try {
            const response = await fetch(primaryUrl);

            if (!response.ok) {
                throw new Error("Primary API failed");
            }

            const data = await response.json();

            setLoading(false);
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

            setLoading(false);
            setTime(new Date(data.dateTime));

            return;
        } catch (fallbackErr) {
            console.error("Both APIs failed, using system time", fallbackErr);

            setLoading(false);
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

    const renderTime = () => {
        if (!time) return "";

        const hours24 = time.getHours();
        const hour12 = hours24 % 12 || 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        return (
            <>
                {hour12.toString().padStart(2, "0")}
                <span
                    className={
                        seconds % 2 === 0
                            ? "text-default-900"
                            : "text-default-100"
                    }
                >
                    :
                </span>
                {minutes.toString().padStart(2, "0")}
            </>
        );
    };

    const renderAmPm = () => {
        if (!time) return null;
        const hours24 = time.getHours();
        const isAM = hours24 < 12;
        return (
            <div className="flex flex-col items-center ml-8">
                <span
                    className={isAM ? "text-default-900" : "text-default-300"}
                >
                    AM
                </span>
                <span
                    className={!isAM ? "text-default-900" : "text-default-300"}
                >
                    PM
                </span>
            </div>
        );
    };

    return (
        <div className="flex grow items-center justify-center p-12 rounded-2xl border-2 border-default-100">
            {error && <p className="text-red-500 absolute top-2">{error}</p>}
            {isLoading && <Spinner color="default" variant="dots" />}
            <p className="SevenSegment text-5xl sm:text-6xl md:text-8xl">
                {renderTime()}
            </p>
            {renderAmPm()}
        </div>
    );
}
