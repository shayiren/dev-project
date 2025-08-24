import { NextResponse } from "next/server"

// This is a mock user database. In a real application, you'd use a proper database.
const users = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "agent@example.com", password: "agent123", role: "agent" },
]

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // In a real application, you'd create a session or JWT here
    return NextResponse.json({ success: true, role: user.role })
  } else {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  }
}
