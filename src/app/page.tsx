import { Metadata } from "next";
import { Container } from "@/components/container";
import Homepage from "@/components/home/home";

const siteUrl = "https://eduvora-nu.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Eduvora",
      url: siteUrl,
      description:
        "Eduvora is an AI-powered career guidance platform for Class 10 and Class 12 students.",
      areaServed: "India",
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#web-application`,
      name: "Eduvora AI Career Guidance",
      url: siteUrl,
      description:
        "Discover suitable streams, courses, careers, and colleges with AI-powered guidance.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      inLanguage: "en-IN",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Eduvora",
  description:
    "Eduvora is an AI-powered career guidance platform that helps Class 10 and Class 12 students make decisions about which course or stream they should pursue.",
  robots: {
    index:true,
    follow: true,
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
};

export default function Home() {
  return (
    <Container>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Homepage />
      </main>
    </Container>
  );
}
