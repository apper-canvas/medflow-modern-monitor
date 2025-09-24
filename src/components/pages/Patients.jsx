import React from "react"
import { useOutletContext } from "react-router-dom"
import PatientTable from "@/components/organisms/PatientTable"
import PatientForm from "@/components/organisms/PatientForm"

const Patients = () => {
  const { searchTerm } = useOutletContext() || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
        <p className="text-gray-600">
          Manage patient records, registrations, and medical information
        </p>
      </div>

      <PatientTable searchTerm={searchTerm} />
    </div>
  )
}

export default Patients