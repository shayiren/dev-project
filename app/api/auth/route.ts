import { NextResponse } from "next/server"

// This would typically be stored in a database
const users = [
  {
    id: "user1",
    email: "admin@example.com",
    password: "password", // In a real app, this would be hashed
    name: "Admin User",
    role: "admin",
  },
  {
    id: "user2",
    email: "agent@example.com",
    password: "password", // In a real app, this would be hashed
    name: "Agent User",
    role: "agent",
  },
  {
    id: "user3",
    email: "client@example.com",
    password: "password", // In a real app, this would be hashed
    name: "Client User",
    role: "client",
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check if this is a login request
    if (body.action === "login") {
      const { email, password } = body

      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      }

      const user = users.find((u) => u.email === email)

      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // In a real app, you would generate a JWT token here
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        user: userWithoutPassword,
        token: "fake-jwt-token",
      })
    }

    // Check if this is a register request
    if (body.action === "register") {
      const { email, password, name } = body

      if (!email || !password || !name) {
        return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
      }

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }

      // In a real app, you would hash the password and save to a database
      const newUser = {
        id: `user${Date.now()}`,
        email,
        password,
        name,
        role: "client", // Default role for new users
      }

      // In a real app, you would generate a JWT token here
      const { password: _, ...userWithoutPassword } = newUser

      return NextResponse.json(
        {
          user: userWithoutPassword,
          token: "fake-jwt-token",
        },
        { status: 201 },
      )
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

