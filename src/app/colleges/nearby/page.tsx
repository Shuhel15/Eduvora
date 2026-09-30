import {Metadata} from "next";
import { auth } from "@/auth";
import NearbyCollegesPage from "@/components/colleges/nearbycollege";
import { Container } from "@/components/container";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Nearby Colleges",
  description: "Nearby Colleges page",
  robots: {
    index: false,
    follow: false,
  }
}
export default async function nearByColleges() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <Container>
      <NearbyCollegesPage />
    </Container>
  );
}
