import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

export default function MessagesPage() {
  // Sample conversations data
  const conversations = [
    {
      id: "conv1",
      name: "John Doe",
      avatar: "/placeholder.svg",
      initials: "JD",
      lastMessage: "I'm interested in scheduling a viewing for the property on Oak Street.",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: "conv2",
      name: "Sarah Miller",
      avatar: "/placeholder.svg",
      initials: "SM",
      lastMessage: "Thank you for sending the contract. I'll review it and get back to you.",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "conv3",
      name: "Robert Johnson",
      avatar: "/placeholder.svg",
      initials: "RJ",
      lastMessage: "Can we discuss the offer on the Miami Beach property?",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "conv4",
      name: "Emily Wilson",
      avatar: "/placeholder.svg",
      initials: "EW",
      lastMessage: "I've signed the documents and sent them back to you.",
      time: "Monday",
      unread: 0,
    },
    {
      id: "conv5",
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      initials: "MC",
      lastMessage: "Are there any other properties available in that neighborhood?",
      time: "Monday",
      unread: 0,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with your clients and team members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="px-4">
            <div className="flex items-center justify-between">
              <CardTitle>Conversations</CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
                <span className="sr-only">New conversation</span>
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted ${
                    conversation.id === "conv1" ? "bg-muted" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{conversation.name}</p>
                      <p className="text-xs text-muted-foreground">{conversation.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>Last active 5 minutes ago</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] border-y flex items-center justify-center text-muted-foreground">
              Select a conversation to view messages
            </div>
            <div className="p-4 flex items-center gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
