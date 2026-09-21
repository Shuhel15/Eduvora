import {auth} from "@/auth"
import { redirect } from "next/navigation"
export default async function comparePage() {
  const session = await auth()
  if(!session) redirect("/login")
  return (
    <div>
      
    </div>
  )
}