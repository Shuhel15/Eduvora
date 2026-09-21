import {auth} from "@/auth"
import { redirect } from "next/navigation"
export default async function assesmentPage() {
  const session = await auth()
  if(!session) redirect("/login")
  return (
    <div>
      
    </div>
  )
}
