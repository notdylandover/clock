"use client";

import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";

// Helper to get the cookie for clockFontColor.
const getClockFontColor = (): string => {
    const match = document.cookie.match("(?:^|; )clockFontColor=([^;]*)");
    return match ? decodeURIComponent(match[1]) : "white";
};

export default function Clock() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [time, setTime] = useState<Date | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [clockColor, setClockColor] = useState<string>(getClockFontColor());

    const colorMapping: Record<string, { base: string; alternate: string }> = {
        red: { base: "text-red-600", alternate: "text-red-950" },
        blue: { base: "text-blue-600", alternate: "text-blue-950" },
        green: { base: "text-green-600", alternate: "text-green-950" },
        white: { base: "text-default-900", alternate: "text-default-50" },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newColor = getClockFontColor();
            setClockColor(newColor);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchTime = async (sync: boolean = false) => {
        if (!sync) {
            setLoading(true);
            setError("");
        } else {
            setError("");
        }

        const primaryUrl = `https://worldtimeapi.org/api/timezone/${timezone}`;

        try {
            const response = await fetch(primaryUrl);

            if (!response.ok) {
                throw new Error("Primary API failed");
            }

            const data = await response.json();
            setTime(new Date(data.datetime));

            if (!sync) setLoading(false);

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

            if (!sync) setLoading(false);

            return;
        } catch (fallbackErr) {
            console.error("Both APIs failed, using system time", fallbackErr);

            setTime(new Date());

            if (!sync) {
                setLoading(false);
                setError("Using system time due to API failure");
            } else {
                setError("Using system time due to API failure");
            }
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
            fetchTime(true);
        }, 60000);
        return () => clearInterval(syncInterval);
    }, [timezone]);

    const renderTime = () => {
        if (!time) return "";

        const hours24 = time.getHours();
        const hour12 = hours24 % 12 || 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        const { base, alternate } =
            colorMapping[clockColor.toLowerCase()] || colorMapping.white;

        return (
            <>
                <span className={base}>
                    {hour12.toString().padStart(2, "0")}
                </span>
                <span className={seconds % 2 === 0 ? base : alternate}>:</span>
                <span className={base}>
                    {minutes.toString().padStart(2, "0")}
                </span>
            </>
        );
    };

    const renderAmPm = () => {
        if (!time) return null;
        const hours24 = time.getHours();
        const isAM = hours24 < 12;

        const { base, alternate } =
            colorMapping[clockColor.toLowerCase()] || colorMapping.white;

        return (
            <div className="flex flex-col items-center ml-8">
                <span className={isAM ? base : alternate}>AM</span>
                <span className={!isAM ? base : alternate}>PM</span>
            </div>
        );
    };

    return (
        <div className="flex flex-grow">
            <div className="flex flex-col items-center gap-8">
                {isLoading && <Spinner variant="dots" color="default" />}
                {!isLoading && (
                    <div className="flex flex-col items-center justify-center p-10 min-w-96 rounded-2xl border-2 border-default-50 gap-2">
                        <div className="flex items-center justify-center">
                            <p className="SevenSegment text-5xl sm:text-6xl md:text-8xl">
                                {renderTime()}
                            </p>
                            {renderAmPm()}
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
}
