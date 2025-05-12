"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeGenerator } from "@/components/qr-code-generator"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define the registration schema
const registrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 characters." }),
  company: z.string().optional(),
})

// Define the event type
type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: string
  registrations: Registration[]
  attendees: string[]
  createdAt: string
}

// Define the registration type
type Registration = {
  id: string
  eventId: string
  name: string
  email: string
  phone: string
  company: string
  registeredAt: string
  attended: boolean
  attendedAt: string | null
}

interface RegisterClientProps {
  eventId: string
}

export default function RegisterClient({ eventId }: RegisterClientProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events")
      if (savedEvents) {
        const events = JSON.parse(savedEvents)
        return events.find((e: Event) => e.id === eventId) || null
      }
    }
    return null
  })

  const [registered, setRegistered] = useState(false)
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [qrCodeData, setQrCodeData] = useState("")

  // Registration form
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  })

  // Handle registration
  const onRegister = (data: z.infer<typeof registrationSchema>) => {
    if (!event) return

    // Check if event is at capacity
    if (event.registrations.length >= Number.parseInt(event.capacity)) {
      toast({
        title: "Event Full",
        description: "This event has reached its maximum capacity.",
        variant: "destructive",
      })
      return
    }

    // Check if email is already registered
    if (event.registrations.some((reg) => reg.email === data.email)) {
      toast({
        title: "Already Registered",
        description: "This email address is already registered for this event.",
        variant: "destructive",
      })
      return
    }

    // Create new registration
    const newRegistration: Registration = {
      id: Date.now().toString(),
      eventId: event.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || "",
      registeredAt: new Date().toISOString(),
      attended: false,
      attendedAt: null,
    }

    // Update event with new registration
    const updatedEvent = {
      ...event,
      registrations: [...event.registrations, newRegistration],
    }

    // Update events in localStorage
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events")
      if (savedEvents) {
        const events = JSON.parse(savedEvents)
        const updatedEvents = events.map((e: Event) => (e.id === event.id ? updatedEvent : e))
        localStorage.setItem("events", JSON.stringify(updatedEvents))
      }
    }

    // Generate QR code data
    const qrData = JSON.stringify({
      eventId: event.id,
      registrationId: newRegistration.id,
    })

    setEvent(updatedEvent)
    setRegistration(newRegistration)
    setQrCodeData(qrData)
    setRegistered(true)

    toast({
      title: "Registration Successful",
      description: "You have been registered for this event.",
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (!event) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">The event you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      {!registered ? (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>Please fill out the form below to register for this event.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormDescription>Enter your company name if applicable.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Registration Successful</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Registration Details</CardTitle>
              <CardDescription>
                Thank you for registering for {event.title}. Please save or print your QR code for check-in.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-6">
                <QRCodeGenerator data={qrCodeData} size={250} />
              </div>

              {registration && (
                <div className="text-left w-full max-w-md">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-semibold">Name:</div>
                    <div className="col-span-2">{registration.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-semibold">Email:</div>
                    <div className="col-span-2">{registration.email}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-semibold">Event:</div>
                    <div className="col-span-2">{event.title}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-semibold">Date:</div>
                    <div className="col-span-2">{formatDate(event.date)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-semibold">Time:</div>
                    <div className="col-span-2">{event.time}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-semibold">Location:</div>
                    <div className="col-span-2">{event.location}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => window.print()}>Print QR Code</Button>
            </CardFooter>
          </Card>

          <p className="text-muted-foreground mb-6">
            A confirmation email has been sent to your email address with your QR code and event details.
          </p>

          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      )}
    </div>
  )
}
