"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Plus, QrCode, Send, Trash, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeScanner } from "@/components/qr-code-scanner"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define the event schema
const eventSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  capacity: z.string().min(1, { message: "Capacity is required." }),
})

// Define the email schema
const emailSchema = z.object({
  emails: z.string().min(5, { message: "Please enter at least one valid email." }),
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

export default function EventsClient() {
  const { toast } = useToast()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events")
      if (savedEvents) {
        return JSON.parse(savedEvents)
      }
    }
    return [
      {
        id: "1",
        title: "Property Showcase: Luxury Apartments",
        description: "Join us for an exclusive showcase of our newest luxury apartment development.",
        date: "2025-06-15",
        time: "14:00",
        location: "123 Main Street, Downtown",
        capacity: "50",
        registrations: [
          {
            id: "reg1",
            eventId: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            company: "ABC Corp",
            registeredAt: "2025-05-10T10:30:00Z",
            attended: true,
            attendedAt: "2025-06-15T14:05:00Z",
          },
          {
            id: "reg2",
            eventId: "1",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "123-456-7891",
            company: "XYZ Inc",
            registeredAt: "2025-05-11T11:45:00Z",
            attended: false,
            attendedAt: null,
          },
        ],
        attendees: ["reg1"],
        createdAt: "2025-05-01T09:00:00Z",
      },
      {
        id: "2",
        title: "Investment Seminar: Real Estate Opportunities",
        description: "Learn about the latest investment opportunities in the real estate market.",
        date: "2025-07-20",
        time: "10:00",
        location: "Grand Hotel Conference Room",
        capacity: "100",
        registrations: [],
        attendees: [],
        createdAt: "2025-05-05T14:30:00Z",
      },
    ]
  })

  const [activeTab, setActiveTab] = useState("upcoming")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openSendDialog, setOpenSendDialog] = useState(false)
  const [openScanDialog, setOpenScanDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [scanResult, setScanResult] = useState("")
  const [scannedAttendee, setScannedAttendee] = useState<Registration | null>(null)

  // Create event form
  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
    },
  })

  // Email form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      emails: "",
    },
  })

  // Filter events by upcoming or past
  const currentDate = new Date()
  const upcomingEvents = events.filter((event) => new Date(`${event.date}T${event.time}`) >= currentDate)
  const pastEvents = events.filter((event) => new Date(`${event.date}T${event.time}`) < currentDate)

  // Create a new event
  const onCreateEvent = (data: z.infer<typeof eventSchema>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...data,
      registrations: [],
      attendees: [],
      createdAt: new Date().toISOString(),
    }

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(updatedEvents))
    }

    setOpenCreateDialog(false)
    eventForm.reset()

    toast({
      title: "Event Created",
      description: "Your event has been created successfully.",
    })
  }

  // Send invitations
  const onSendInvitations = (data: z.infer<typeof emailSchema>) => {
    if (!selectedEvent) return

    const emails = data.emails.split(",").map((email) => email.trim())

    toast({
      title: "Invitations Sent",
      description: `Invitations sent to ${emails.length} recipients.`,
    })

    setOpenSendDialog(false)
    emailForm.reset()
  }

  // Delete an event
  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId)
    setEvents(updatedEvents)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(updatedEvents))
    }

    toast({
      title: "Event Deleted",
      description: "The event has been deleted successfully.",
    })
  }

  // Handle QR code scan
  const handleScan = (data: string) => {
    if (data && selectedEvent) {
      setScanResult(data)

      try {
        const scanData = JSON.parse(data)

        if (scanData.eventId === selectedEvent.id) {
          const registration = selectedEvent.registrations.find((reg) => reg.id === scanData.registrationId)

          if (registration) {
            setScannedAttendee(registration)

            if (!registration.attended) {
              // Mark as attended
              const updatedEvents = events.map((event) => {
                if (event.id === selectedEvent.id) {
                  const updatedRegistrations = event.registrations.map((reg) => {
                    if (reg.id === registration.id) {
                      return {
                        ...reg,
                        attended: true,
                        attendedAt: new Date().toISOString(),
                      }
                    }
                    return reg
                  })

                  return {
                    ...event,
                    registrations: updatedRegistrations,
                    attendees: [...event.attendees, registration.id],
                  }
                }
                return event
              })

              setEvents(updatedEvents)

              // Save to localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem("events", JSON.stringify(updatedEvents))
              }

              toast({
                title: "Attendance Recorded",
                description: `${registration.name} has been checked in successfully.`,
              })
            } else {
              toast({
                title: "Already Checked In",
                description: `${registration.name} has already been checked in.`,
                variant: "destructive",
              })
            }
          } else {
            toast({
              title: "Invalid Registration",
              description: "This registration was not found for this event.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Wrong Event",
            description: "This QR code is for a different event.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Invalid QR Code",
          description: "The scanned QR code is not valid.",
          variant: "destructive",
        })
      }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => setOpenCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No upcoming events. Create one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
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
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.registrations.length} / {event.capacity} registered
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedEvent(event)
                        setOpenSendDialog(true)
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" /> Invite
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedEvent(event)
                        setOpenScanDialog(true)
                        setScanResult("")
                        setScannedAttendee(null)
                      }}
                    >
                      <QrCode className="mr-2 h-4 w-4" /> Check-in
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => deleteEvent(event.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No past events.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
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
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.attendees.length} / {event.registrations.length} attended
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/dashboard/events/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new event. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(onCreateEvent)} className="space-y-4">
              <FormField
                control={eventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Property Showcase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter event description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={eventForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={eventForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={eventForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="50" {...field} />
                    </FormControl>
                    <FormDescription>Maximum number of attendees</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Send Invitations Dialog */}
      <Dialog open={openSendDialog} onOpenChange={setOpenSendDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Invitations</DialogTitle>
            <DialogDescription>
              Enter email addresses separated by commas to send invitations for {selectedEvent?.title}.
            </DialogDescription>
          </DialogHeader>

          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSendInvitations)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Addresses</FormLabel>
                    <FormControl>
                      <Textarea placeholder="john@example.com, jane@example.com" {...field} rows={5} />
                    </FormControl>
                    <FormDescription>Each recipient will receive a unique registration link.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Send Invitations</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* QR Code Scanner Dialog */}
      <Dialog open={openScanDialog} onOpenChange={setOpenScanDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Check-in Attendee</DialogTitle>
            <DialogDescription>Scan the QR code from the attendee's email or printed ticket.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <QRCodeScanner onScan={handleScan} />
            </div>

            {scannedAttendee && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendee Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-semibold">Name:</div>
                      <div className="col-span-2">{scannedAttendee.name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-semibold">Email:</div>
                      <div className="col-span-2">{scannedAttendee.email}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-semibold">Phone:</div>
                      <div className="col-span-2">{scannedAttendee.phone}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-semibold">Company:</div>
                      <div className="col-span-2">{scannedAttendee.company}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="font-semibold">Status:</div>
                      <div className="col-span-2">
                        {scannedAttendee.attended ? (
                          <span className="text-green-600 font-medium">Checked In</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">Not Checked In</span>
                        )}
                      </div>
                    </div>
                    {scannedAttendee.attended && scannedAttendee.attendedAt && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-semibold">Check-in Time:</div>
                        <div className="col-span-2">{new Date(scannedAttendee.attendedAt).toLocaleTimeString()}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
