import type { Metadata } from "next"
import PriceManagementClient from "./price-management-client"

export const metadata: Metadata = {
  title: "Price Management",
  description: "Manage property prices in bulk",
}

export default function PriceManagementPage() {
  return <PriceManagementClient />
}
