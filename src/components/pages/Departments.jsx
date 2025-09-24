import React from "react"
import { useOutletContext } from "react-router-dom"
import DepartmentOverview from "@/components/organisms/DepartmentOverview"

const Departments = () => {
  const { searchTerm } = useOutletContext() || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
        <p className="text-gray-600">
          Monitor department capacity, bed availability, and resource allocation
        </p>
      </div>

      <DepartmentOverview searchTerm={searchTerm} />
    </div>
  )
}

export default Departments