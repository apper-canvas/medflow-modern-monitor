import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { staffService } from "@/services/api/staffService"

const StaffDirectory = ({ searchTerm = "" }) => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filteredStaff, setFilteredStaff] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const loadStaff = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await staffService.getAll()
      setStaff(data)
      setFilteredStaff(data)
    } catch (err) {
      setError("Failed to load staff directory. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  useEffect(() => {
    let filtered = staff

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(member => member.department === selectedDepartment)
    }

    setFilteredStaff(filtered)
  }, [searchTerm, staff, selectedDepartment])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadStaff} />
  if (filteredStaff.length === 0) return <Empty message="No staff members found" />

  const departments = [...new Set(staff.map(member => member.department))]

  const getRoleColor = (role) => {
    const roleColors = {
      "Doctor": "info",
      "Nurse": "success",
      "Surgeon": "danger",
      "Technician": "warning",
      "Administrator": "default"
    }
    return roleColors[role] || "default"
  }

  const getStatusColor = (schedule) => {
    if (!schedule || schedule.length === 0) return "default"
    const today = new Date().getDay()
    const isWorkingToday = schedule.some(shift => shift.day === today)
    return isWorkingToday ? "success" : "warning"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDepartment === "all" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSelectedDepartment("all")}
              >
                All Departments
              </Button>
              {departments.map(dept => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
            <Button variant="primary" size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <Card key={member.Id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <Badge variant={getRoleColor(member.role)} className="mt-1">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <Badge variant={getStatusColor(member.schedule)}>
                  {getStatusColor(member.schedule) === "success" ? "On Duty" : "Off Duty"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Building2" className="h-4 w-4 mr-2" />
                  <span>{member.department}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                  <span>{member.phone}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                  <span className="truncate">{member.email}</span>
                </div>

                {member.schedule && member.schedule.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      This Week's Schedule
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                        const hasShift = member.schedule.some(shift => shift.day === index + 1)
                        return (
                          <span
                            key={day}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              hasShift
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {day}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Phone" className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Mail" className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="primary" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StaffDirectory