import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { patientService } from "@/services/api/patientService";
import PatientForm from "@/components/organisms/PatientForm";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
const PatientTable = ({ searchTerm = "" }) => {
const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filteredPatients, setFilteredPatients] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const loadPatients = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await patientService.getAll()
      setPatients(data)
      setFilteredPatients(data)
    } catch (err) {
      setError("Failed to load patients. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(patient => {
        const name = patient.name_c || patient.Name || ''
        const medicalId = patient.medical_id_c || ''
        const department = patient.department_c || ''
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               medicalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
               department.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setFilteredPatients(filtered)
      setCurrentPage(1)
    } else {
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPatients} />
  if (filteredPatients.length === 0) return <Empty message="No patients found" />

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }
return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ApperIcon name="Users" className="h-5 w-5 mr-2 text-primary-600" />
            Patient Directory ({filteredPatients.length})
          </CardTitle>
<Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowForm(true)}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
{currentPatients.map((patient) => {
                const name = patient.name_c || patient.Name || 'Unknown'
                const dateOfBirth = patient.date_of_birth_c || ''
                const gender = patient.gender_c || ''
                const medicalId = patient.medical_id_c || ''
                const department = patient.department_c || ''
                const status = patient.status_c || ''
                const admissionDate = patient.admission_date_c || ''

                return (
                  <tr key={patient.Id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{name}</div>
                          <div className="text-sm text-gray-500">
                            Age {calculateAge(dateOfBirth)} • {gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{medicalId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={status} type="patient" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(admissionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Eye" className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Phone" className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
})}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredPatients.length)} of{" "}
              {filteredPatients.length} patients
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ApperIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
</CardContent>
    </Card>
    
    {showForm && (
      <PatientForm
        onClose={() => setShowForm(false)}
        onPatientAdded={() => {
          loadPatients()
          setShowForm(false)
        }}
      />
    )}
    </>
  )
}

export default PatientTable