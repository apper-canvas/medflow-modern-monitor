import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StatusIndicator = ({ status, type = "default" }) => {
  const getStatusConfig = () => {
    switch (type) {
      case "patient":
        switch (status?.toLowerCase()) {
          case "admitted":
            return { variant: "admitted", icon: "UserCheck", text: "Admitted" }
          case "discharged":
            return { variant: "discharged", icon: "UserX", text: "Discharged" }
          case "emergency":
            return { variant: "emergency", icon: "AlertTriangle", text: "Emergency" }
          default:
            return { variant: "default", icon: "User", text: status }
        }
      
      case "appointment":
        switch (status?.toLowerCase()) {
          case "scheduled":
            return { variant: "scheduled", icon: "Calendar", text: "Scheduled" }
          case "completed":
            return { variant: "completed", icon: "CheckCircle", text: "Completed" }
          case "cancelled":
            return { variant: "cancelled", icon: "XCircle", text: "Cancelled" }
          default:
            return { variant: "default", icon: "Clock", text: status }
        }
      
      case "bed":
        switch (status?.toLowerCase()) {
          case "available":
            return { variant: "available", icon: "Bed", text: "Available" }
          case "occupied":
            return { variant: "occupied", icon: "User", text: "Occupied" }
          default:
            return { variant: "default", icon: "Bed", text: status }
        }
      
      default:
        return { variant: "default", icon: "Info", text: status }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <ApperIcon name={config.icon} className="h-3 w-3" />
      <span>{config.text}</span>
    </Badge>
  )
}

export default StatusIndicator