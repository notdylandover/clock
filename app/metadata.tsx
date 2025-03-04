import type { Metadata } from "next";

const defaultTitle = "Clock";
const defaultDescription = "It's just a clock.";
const defaultUrl = "https://clock.dylandover.dev";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: {
        default: defaultTitle,
        template: defaultTitle,
    },
    description: defaultDescription,
    openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: defaultUrl,
        siteName: defaultTitle,
        locale: "en_US",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
    },
};
