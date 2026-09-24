import { Metadata } from "next"
import {auth} from "@/auth"
import { redirect } from "next/navigation"
import { Container } from "@/components/container"
import ResultContent from "@/components/assessment/result"

export const metadata: Metadata = {
  title: "Result",
  description: "Assessment Result",
  robots:{
    index:false,
    follow:false
  }
}
export default async function assesmentPage() {
  const session = await auth()
  if(!session) redirect("/login")
  return (
<Container>
  <main className="min-h-screen">
    <ResultContent/>
  </main>
</Container>
  )
}
