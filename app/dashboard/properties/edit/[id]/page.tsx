import EditPropertyPage from "./edit-property-page"

export default function Page({ params }: { params: { id: string } }) {
  return <EditPropertyPage id={params.id} />
}
