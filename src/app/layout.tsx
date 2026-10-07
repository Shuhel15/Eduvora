import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import NavBar from "@/components/ui/NavBar";
import FloatingBackground from "@/components/ui/FloatingBackground";
import Footer from "@/components/ui/Footer";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eduvora-nu.vercel.app"),

  title: {
    default: "Eduvora | AI Career Guidance for Students",
    template: "%s | Eduvora",
  },

  description:
    "Eduvora helps Class 10 and Class 12 students discover suitable streams, courses, careers, colleges and career paths using AI-powered guidance.",

  verification: {
    google: "6CVFv23yoo0HObZR8qEBQMtQBHwDecH-zUXYjwwjIA4",
  },
  keywords: [
    "Eduvora",
    "AI career guidance",
    "career guidance for students",
    "Class 10 career guidance",
    "Class 12 career guidance",
    "career options after 10th",
    "career options after 12th",
    "career guidance after 10th",
    "career guidance after 12th",
    "what to choose after 10th",
    "what to choose after 12th",
    "stream selection",
    "stream selection after 10th",
    "best stream after 10th",
    "Science stream",
    "Commerce stream",
    "Arts stream",
    "Humanities stream",
    "subject selection after 10th",
    "course selection after 12th",
    "course recommendation",
    "course comparison",
    "degree course guidance",
    "college selection guidance",
    "college guidance for students",
    "career aptitude assessment",
    "student career assessment",
    "AI career assessment",
    "personalized career recommendations",
    "career counselling",
    "career guidance India",
    "student career guidance",
    "career counselling for students",
    "online career counselling",
    "career planning for students",
    "best career options in India",
  ],

  authors: [{ name: "Shuhel Ahmed" }],
  creator: "Shuhel Ahmed",
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

  icons:{
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://eduvora-nu.vercel.app",
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
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
