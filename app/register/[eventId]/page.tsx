import RegisterClient from "./register-client"

export default function RegisterPage({ params }: { params: { eventId: string } }) {
  return <RegisterClient eventId={params.eventId} />
}
