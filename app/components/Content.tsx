"use client";

import React, { useState, useEffect, useRef } from "react";
import { addToast } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/app/components/Navigation";
import Clock from "@/app/components/Clock";
import Stopwatch from "@/app/components/Stopwatch";

export default function Content() {
    const [selectedTab, setSelectedTab] = useState("clock");
    const [showNavigation, setShowNavigation] = useState(true);
    const [manualHide, setManualHide] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetTimer = (event?: Event) => {
            if (event && event.type === "keydown") {
                const keyEvent = event as KeyboardEvent;
                if (keyEvent.key === "Escape") {
                    setManualHide(false);
                    setShowNavigation(true);
                    if (timerRef.current) clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(() => {
                        setShowNavigation(false);
                    }, 10000);
                    return;
                }

                if (manualHide && keyEvent.key != "Escape") {
                    addToast({
                        hideIcon: true,
                        description: "Press 'Esc' to show the UI.",
                        timeout: 3000,
                    });
                }
            }

            if (manualHide) return;
            setShowNavigation(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setShowNavigation(false);
            }, 10000);
        };

        const events = ["keydown", "mousemove"];
        events.forEach((eventName) => {
            window.addEventListener(eventName, resetTimer);
        });

        resetTimer();

        return () => {
            events.forEach((eventName) => {
                window.removeEventListener(eventName, resetTimer);
            });
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [manualHide]);

    useEffect(() => {
        if (!showNavigation) {
            document.body.style.cursor = "none";
        } else {
            document.body.style.cursor = "default";
        }
        return () => {
            document.body.style.cursor = "default";
        };
    }, [showNavigation]);

    return (
        <div className="flex flex-col h-screen w-screen p-4">
            <AnimatePresence>
                {showNavigation && (
                    <motion.div
                        key="navigation"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Navigation
                            selected={selectedTab}
                            onSelect={(tab) => {
                                setManualHide(false);
                                setSelectedTab(tab);
                            }}
                            onHide={() => {
                                setManualHide(true);
                                setShowNavigation(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {selectedTab === "clock" && (
                        <motion.div
                            key="clock"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Clock />
                        </motion.div>
                    )}
                    {selectedTab === "stopwatch" && (
                        <motion.div
                            key="stopwatch"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Stopwatch />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
