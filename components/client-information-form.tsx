"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ClientInformation {
  firstName: string
  lastName: string
  agencyName?: string
  passportNo?: string
  emiratesId?: string
  phoneNumber?: string
  email?: string
  registrationDate: Date | undefined
  residencyDetails?: string
  isAgency: boolean
}

interface ClientInformationFormProps {
  clientInfo: ClientInformation
  onChange: (info: ClientInformation) => void
  isRequired?: boolean
}

export function ClientInformationForm({ clientInfo, onChange, isRequired = false }: ClientInformationFormProps) {
  const handleChange = (field: keyof ClientInformation, value: any) => {
    onChange({
      ...clientInfo,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="isAgency"
          checked={clientInfo.isAgency}
          onCheckedChange={(checked) => handleChange("isAgency", checked)}
        />
        <label
          htmlFor="isAgency"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          This is an agency booking
        </label>
      </div>

      {clientInfo.isAgency && (
        <div className="space-y-2">
          <Label htmlFor="agencyName">Agency Name {isRequired && "*"}</Label>
          <Input
            id="agencyName"
            value={clientInfo.agencyName || ""}
            onChange={(e) => handleChange("agencyName", e.target.value)}
            required={isRequired && clientInfo.isAgency}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name {isRequired && "*"}</Label>
          <Input
            id="firstName"
            value={clientInfo.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required={isRequired}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name {isRequired && "*"}</Label>
          <Input
            id="lastName"
            value={clientInfo.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required={isRequired}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passportNo">Passport Number</Label>
          <Input
            id="passportNo"
            value={clientInfo.passportNo || ""}
            onChange={(e) => handleChange("passportNo", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emiratesId">Emirates ID</Label>
          <Input
            id="emiratesId"
            value={clientInfo.emiratesId || ""}
            onChange={(e) => handleChange("emiratesId", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={clientInfo.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={clientInfo.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationDate">Registration Date {isRequired && "*"}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !clientInfo.registrationDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {clientInfo.registrationDate ? format(clientInfo.registrationDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={clientInfo.registrationDate}
              onSelect={(date) => handleChange("registrationDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="residencyDetails">Residency Details</Label>
        <Input
          id="residencyDetails"
          value={clientInfo.residencyDetails || ""}
          onChange={(e) => handleChange("residencyDetails", e.target.value)}
        />
      </div>
    </div>
  )
}
