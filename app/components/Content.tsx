"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/app/components/Navigation";
import Clock from "@/app/components/Clock";
import Stopwatch from "@/app/components/Stopwatch";

export default function Content() {
    const [selectedTab, setSelectedTab] = useState("clock");
    const [showNavigation, setShowNavigation] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetTimer = () => {
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
    }, []);

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
                            onSelect={setSelectedTab}
                            onHide={() => setShowNavigation(false)}
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
