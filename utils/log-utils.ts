import { getLocalStorage, setLocalStorage } from "./storage-utils"

// Define log entry type
export interface LogEntry {
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

// Add a new log entry
export function addLogEntry(logEntry: Omit<LogEntry, "id" | "timestamp">): boolean {
  try {
    // Get existing logs
    const logs = getLocalStorage("systemLogs") || []

    // Create new log entry with ID and timestamp
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...logEntry,
    }

    // Add to beginning of logs array (newest first)
    logs.unshift(newLog)

    // Limit to 1000 logs to prevent localStorage from getting too large
    const trimmedLogs = logs.slice(0, 1000)

    // Save back to localStorage
    return setLocalStorage("systemLogs", trimmedLogs)
  } catch (error) {
    console.error("Error adding log entry:", error)
    return false
  }
}

// Get all logs
export function getAllLogs(): LogEntry[] {
  return getLocalStorage("systemLogs") || []
}

// Clear all logs
export function clearLogs(): boolean {
  return setLocalStorage("systemLogs", [])
}

// Get logs by module
export function getLogsByModule(module: string): LogEntry[] {
  const logs = getLocalStorage("systemLogs") || []
  return logs.filter((log: LogEntry) => log.module === module)
}

// Get logs by user
export function getLogsByUser(user: string): LogEntry[] {
  const logs = getLocalStorage("systemLogs") || []
  return logs.filter((log: LogEntry) => log.user === user)
}

// Get logs by date range
export function getLogsByDateRange(startDate: Date, endDate: Date): LogEntry[] {
  const logs = getLocalStorage("systemLogs") || []
  return logs.filter((log: LogEntry) => {
    const logDate = new Date(log.timestamp)
    return logDate >= startDate && logDate <= endDate
  })
}

// Get logs by severity
export function getLogsBySeverity(severity: "info" | "warning" | "error" | "success"): LogEntry[] {
  const logs = getLocalStorage("systemLogs") || []
  return logs.filter((log: LogEntry) => log.severity === severity)
}
