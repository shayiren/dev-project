"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Filter, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocalStorage, setLocalStorage } from "@/utils/storage-utils"

// Define log entry type
interface LogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  module: string
  details: string
  entityId?: string
  entityType?: string
  severity: "info" | "warning" | "error" | "success"
}

// Mock log data generator
function generateMockLogs(count = 50): LogEntry[] {
  const actions = [
    "created",
    "updated",
    "deleted",
    "viewed",
    "exported",
    "imported",
    "status changed",
    "price updated",
    "assigned",
  ]

  const modules = [
    "Properties",
    "Units",
    "Clients",
    "Users",
    "Projects",
    "Developers",
    "Sales",
    "Documents",
    "Settings",
  ]

  const users = ["admin@example.com", "agent@example.com", "manager@example.com", "support@example.com"]

  const severities: ("info" | "warning" | "error" | "success")[] = ["info", "warning", "error", "success"]

  const logs: LogEntry[] = []

  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const module = modules[Math.floor(Math.random() * modules.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    // Generate a random date within the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    let details = ""
    const entityId = `${module.toLowerCase()}-${Math.floor(Math.random() * 1000)}`
    const entityType = module.slice(0, -1) // Remove 's' to get singular form

    switch (action) {
      case "created":
        details = `New ${entityType.toLowerCase()} created`
        break
      case "updated":
        details = `${entityType} information updated`
        break
      case "deleted":
        details = `${entityType} removed from system`
        break
      case "status changed":
        const statuses = ["Available", "Reserved", "Sold", "Under Offer"]
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
        details = `Status changed to ${newStatus}`
        break
      case "price updated":
        const oldPrice = Math.floor(Math.random() * 1000000) + 100000
        const newPrice = Math.floor(Math.random() * 1000000) + 100000
        details = `Price updated from $${oldPrice.toLocaleString()} to $${newPrice.toLocaleString()}`
        break
      default:
        details = `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType.toLowerCase()}`
    }

    logs.push({
      id: `log-${i}`,
      timestamp: date.toISOString(),
      user,
      action,
      module,
      details,
      entityId,
      entityType,
      severity,
    })
  }

  // Sort by timestamp, newest first
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return logs
}

// Get severity badge color
function getSeverityColor(severity: string) {
  switch (severity) {
    case "info":
      return "bg-blue-100 text-blue-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    case "success":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function LogsClient() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const logsPerPage = 10

  // Load logs from localStorage or generate mock data
  useEffect(() => {
    setIsLoading(true)

    // Try to get logs from localStorage
    const storedLogs = getLocalStorage("systemLogs")

    if (storedLogs && Array.isArray(storedLogs) && storedLogs.length > 0) {
      setLogs(storedLogs)
    } else {
      // Generate mock logs if none exist
      const mockLogs = generateMockLogs(50)
      setLogs(mockLogs)

      // Save to localStorage
      setLocalStorage("systemLogs", mockLogs)
    }

    setIsLoading(false)
  }, [])

  // Filter logs based on search and filters
  useEffect(() => {
    let result = [...logs]

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (log) =>
          log.details.toLowerCase().includes(term) ||
          log.user.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term) ||
          log.module.toLowerCase().includes(term),
      )
    }

    // Apply module filter
    if (moduleFilter !== "all") {
      result = result.filter((log) => log.module === moduleFilter)
    }

    // Apply action filter
    if (actionFilter !== "all") {
      result = result.filter((log) => log.action === actionFilter)
    }

    // Apply user filter
    if (userFilter !== "all") {
      result = result.filter((log) => log.user === userFilter)
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      result = result.filter((log) => log.severity === severityFilter)
    }

    setFilteredLogs(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [logs, searchTerm, moduleFilter, actionFilter, userFilter, severityFilter])

  // Get unique values for filter dropdowns
  const modules = ["all", ...Array.from(new Set(logs.map((log) => log.module)))]
  const actions = ["all", ...Array.from(new Set(logs.map((log) => log.action)))]
  const users = ["all", ...Array.from(new Set(logs.map((log) => log.user)))]
  const severities = ["all", ...Array.from(new Set(logs.map((log) => log.severity)))]

  // Calculate pagination
  const indexOfLastLog = currentPage * logsPerPage
  const indexOfFirstLog = indexOfLastLog - logsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  // Generate pagination items
  const paginationItems = []
  for (let i = 1; i <= totalPages; i++) {
    // Show first page, last page, and pages around current page
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === currentPage} onClick={() => setCurrentPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    } else if ((i === currentPage - 2 && currentPage > 3) || (i === currentPage + 2 && currentPage < totalPages - 2)) {
      paginationItems.push(
        <PaginationItem key={`ellipsis-${i}`}>
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Logs</h1>
        <Button variant="outline">Export Logs</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>View all system activities and changes made by users</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module === "all" ? "All Modules" : module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action === "all" ? "All Actions" : action.charAt(0).toUpperCase() + action.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user === "all" ? "All Users" : user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity === "all" ? "All Types" : severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm("")
                  setModuleFilter("all")
                  setActionFilter("all")
                  setUserFilter("all")
                  setSeverityFilter("all")
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Logs table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Date & Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead className="hidden md:table-cell">Details</TableHead>
                      <TableHead className="w-[100px] text-right">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.length > 0 ? (
                      currentLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                              {format(new Date(log.timestamp), "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="mr-2 h-3 w-3" />
                              {format(new Date(log.timestamp), "h:mm a")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-gray-500" />
                              <span className="truncate max-w-[120px]">{log.user}</span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{log.action}</TableCell>
                          <TableCell>{log.module}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[300px] truncate">{log.details}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredLogs.length > logsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {paginationItems}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
