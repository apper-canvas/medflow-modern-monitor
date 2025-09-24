import React from "react"
import { useOutletContext } from "react-router-dom"
import StaffDirectory from "@/components/organisms/StaffDirectory"

const Staff = () => {
  const { searchTerm } = useOutletContext() || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Directory</h1>
        <p className="text-gray-600">
          Manage hospital staff information, schedules, and contact details
        </p>
      </div>

      <StaffDirectory searchTerm={searchTerm} />
    </div>
  )
}

export default Staff