import type { Metadata } from "next"
import LogsClient from "./logs-client"

export const metadata: Metadata = {
  title: "System Logs",
  description: "View system activity logs and changes",
}

export default function LogsPage() {
  return <LogsClient />
}
