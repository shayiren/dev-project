"\"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 lg:h-10 lg:w-10">
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem>
            <span className="mr-2">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
