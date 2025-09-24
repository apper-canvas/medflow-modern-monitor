import React from "react"
import { useOutletContext } from "react-router-dom"
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar"

const Appointments = () => {
  const { searchTerm } = useOutletContext() || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
        <p className="text-gray-600">
          Schedule, manage, and track patient appointments across all departments
        </p>
      </div>

      <AppointmentCalendar searchTerm={searchTerm} />
    </div>
  )
}

export default Appointments