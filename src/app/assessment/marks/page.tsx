import {auth} from "@/auth"
import { redirect } from "next/navigation"
export default async function marksPage() {
  const session = await auth()
  if(!session) redirect("/login")
  return (
    <div>
      
    </div>
  )
}