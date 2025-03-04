"use client";

import React from "react";
import {
    addToast,
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Tab,
    Tabs,
    Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface NavigationProps {
    selected: string;
    onSelect: (tab: string) => void;
    onHide: () => void;
}

export default function Navigation({
    selected,
    onSelect,
    onHide,
}: NavigationProps) {
    const tabItems = [
        { title: "Clock", value: "clock" },
        { title: "Stopwatch", value: "stopwatch" },
    ];

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">clock</p>
            </NavbarBrand>
            <NavbarContent justify="center">
                <NavbarItem>
                    <Tabs
                        aria-label="Options"
                        variant="underlined"
                        selectedKey={selected}
                        onSelectionChange={(key: React.Key) =>
                            onSelect(key as string)
                        }
                    >
                        {tabItems.map((tab) => (
                            <Tab key={tab.value} title={tab.title}></Tab>
                        ))}
                    </Tabs>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <Tooltip showArrow content="Hide UI" color="foreground">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => {
                            addToast({
                                hideIcon: true,
                                description:
                                    "Press 'ESC' to show the UI again.",
                                timeout: 3000,
                            });
                            onHide();
                        }}
                    >
                        <Icon icon="mdi:hide" width="24" height="24" />
                    </Button>
                </Tooltip>
            </NavbarContent>
        </Navbar>
    );
}
