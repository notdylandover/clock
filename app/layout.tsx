import "./globals.css";

import Providers from "./components/providers";
import ClientLayout from "./components/layout";
import { metadata } from "./metadata";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`antialiased ${inter.className}`}>
                <Providers>
                    <ClientLayout>{children}</ClientLayout>
                </Providers>
            </body>
        </html>
    );
}
