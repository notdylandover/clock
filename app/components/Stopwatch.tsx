"use client";

import { Button } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";

export default function Stopwatch() {
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = window.setInterval(() => {
                setElapsed((prev) => prev + 10);
            }, 10);
        } else if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, [running]);

    const handleStart = () => {
        if (!running) {
            setRunning(true);
        }
    };

    const handleStop = () => {
        if (running) {
            setRunning(false);
        }
    };

    const handleReset = () => {
        setRunning(false);
        setElapsed(0);
    };

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const ms = Math.floor((elapsed % 1000) / 10);

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;

    return (
        <div className="flex flex-col items-center space-y-4">
            <p className="SevenSegment text-5xl sm:text-6xl md:text-8xl">
                {formattedTime}
            </p>
            <div className="space-x-2">
                <Button
                    radius="full"
                    variant="ghost"
                    color={running ? "default" : "success"}
                    isDisabled={running}
                    onPress={handleStart}
                >
                    Start
                </Button>
                <Button
                    radius="full"
                    variant="ghost"
                    color={!running ? "default" : "danger"}
                    isDisabled={!running}
                    onPress={handleStop}
                >
                    Stop
                </Button>
                <Button
                    radius="full"
                    variant="ghost"
                    color={elapsed === 0 ? "default" : "warning"}
                    isDisabled={elapsed === 0}
                    onPress={handleReset}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}
