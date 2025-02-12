/* eslint-disable react/no-unescaped-entities */

import "./globals.css";

import Providers from "./components/providers";
import ClientLayout from "./components/layout";

import { metadata } from "./metadata";
import { viewport } from "./metadata";

export { metadata };
export { viewport };

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>
            </head>
            <body className="antialiased">
                <Providers>
                    <ClientLayout>{children}</ClientLayout>
                </Providers>
            </body>
        </html>
    );
}