import {Metadata} from "next";
import { Container } from "@/components/container";
import Homepage from "@/components/home/home";
export const metadata: Metadata ={
  title: "Eduvora",
  description:"Eduvora is an AI-powered career guidance platform that helps class 10th and 12th students to make decisions about which course or stream they should pursue.",
  robots:{
    index:true,
    follow:true
  }
}

export default function Home() {
  return (
    <Container>
      <main>
        <Homepage/>
      </main>
      </Container>
  );
}
