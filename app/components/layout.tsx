import React from "react";

import "../globals.css";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            {children}
        </main>
    );
}