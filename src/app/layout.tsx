import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import NavBar from "@/components/ui/NavBar";
import FloatingBackground from "@/components/ui/FloatingBackground";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eduvora-efb20.web.app"),

  title: {
    default: "Eduvora | AI Career Guidance for Students",
    template: "%s | Eduvora",
  },

  description:
    "Eduvora helps Class 10 and Class 12 students discover suitable streams, courses, careers, colleges and career paths using AI-powered guidance.",

  keywords: [
    "Eduvora",
    "AI career guidance",
    "career guidance for students",
    "Class 10 career guidance",
    "Class 12 career guidance",
    "stream selection",
    "course recommendation",
    "career counselling",
    "career guidance India",
    "student career guidance",
  ],

  authors: [{ name: "Eduvora" }],
  creator: "Eduvora",
  publisher: "Eduvora",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://eduvora-efb20.web.app",
    siteName: "Eduvora",
    title: "Eduvora | AI Career Guidance for Students",
    description:
      "Discover suitable streams, courses and career paths with AI-powered career guidance for Class 10 and Class 12 students.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Eduvora | AI Career Guidance for Students",
    description:
      "AI-powered career guidance for Class 10 and Class 12 students.",
  },

  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <Providers>
          <div className="relative min-h-screen">
            <FloatingBackground />

            <div className="relative z-10">
              <NavBar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
