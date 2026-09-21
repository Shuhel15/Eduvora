import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function dashboard() {
  const session = await auth()
  if(!session) redirect("/login")
  return (
    <div>
      <h1>
        Welcome to the Dashboard
      </h1>
    </div>
  )
}
