"use client";

import React, { useState } from "react";
import {
    addToast,
    Button,
    Link,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Tab,
    Tabs,
    Tooltip,
    useDisclosure,
    ModalContent,
    Divider,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
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

    const fontColors = ["White", "Red", "Blue", "Green"];

    const {
        isOpen: isSettingsModalOpen,
        onOpen: onSettingsModalOpen,
        onOpenChange: onSettingsModalChange,
    } = useDisclosure();

    const [selectedFontColor, setSelectedFontColor] = useState<string>("");

    const onSave = () => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        document.cookie = `clockFontColor=${selectedFontColor}; path=/; expires=${expirationDate.toUTCString()}`;
        addToast({
            description: "Font color preference saved.",
            timeout: 3000,
            color: "success",
        });
        onSettingsModalChange();
    };

    return (
        <>
            <Navbar>
                <NavbarBrand>
                    <p>clock</p>
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
                                <Tab key={tab.value} title={tab.title} />
                            ))}
                        </Tabs>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end" className="gap-2">
                    <Tooltip
                        showArrow
                        content="Hide Navbar"
                        color="foreground"
                        closeDelay={0}
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => {
                                addToast({
                                    hideIcon: true,
                                    description:
                                        "Press 'ESC' to show the Navbar again.",
                                    timeout: 1500,
                                });
                                onHide();
                            }}
                        >
                            <Icon icon="mdi:hide" width="24" height="24" />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        showArrow
                        content="Settings"
                        color="foreground"
                        closeDelay={0}
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={onSettingsModalOpen}
                        >
                            <Icon
                                icon="material-symbols:settings-rounded"
                                width="24"
                                height="24"
                                className="transition-transform duration-1000 hover:rotate-180"
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        showArrow
                        content="GitHub"
                        color="foreground"
                        closeDelay={0}
                    >
                        <Button
                            isExternal
                            isIconOnly
                            as={Link}
                            href="https://github.com/notdylandover/clock"
                            variant="light"
                        >
                            <Icon
                                icon="simple-icons:github"
                                width="24"
                                height="24"
                            />
                        </Button>
                    </Tooltip>
                </NavbarContent>
            </Navbar>

            <Modal
                isOpen={isSettingsModalOpen}
                onClose={onSettingsModalChange}
                size="xs"
            >
                <ModalContent>
                    {(onSettingsModalClose) => (
                        <>
                            <ModalHeader>Settings</ModalHeader>
                            <Divider />
                            <ModalBody className="p-6">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="faded">
                                            {selectedFontColor ||
                                                "Select Color"}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Font Color"
                                        selectedKeys={selectedFontColor}
                                        selectionMode="single"
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(
                                                keys
                                            )[0] as string;
                                            setSelectedFontColor(
                                                selectedKey || ""
                                            );
                                        }}
                                    >
                                        {fontColors.map((color) => (
                                            <DropdownItem key={color}>
                                                {color}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </ModalBody>
                            <Divider />
                            <ModalFooter className="flex justify-end gap-2">
                                <Button
                                    variant="light"
                                    color="danger"
                                    onPress={onSettingsModalClose}
                                    startContent={
                                        <Icon
                                            icon="material-symbols:close-rounded"
                                            width={18}
                                        />
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onPress={onSave}
                                    color="success"
                                    startContent={
                                        <Icon
                                            icon="material-symbols:check-rounded"
                                            width={18}
                                        />
                                    }
                                >
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
