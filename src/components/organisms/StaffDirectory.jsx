import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { staffService } from "@/services/api/staffService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

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
      filtered = filtered.filter(member => {
        const name = member.name_c || member.Name || ''
        const role = member.role_c || ''
        const department = member.department_c || ''
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               role.toLowerCase().includes(searchTerm.toLowerCase()) ||
               department.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(member => {
        const department = member.department_c || ''
        return department === selectedDepartment
      })
    }

    setFilteredStaff(filtered)
  }, [searchTerm, staff, selectedDepartment])

  const departments = [...new Set(staff.map(member => member.department_c || '').filter(Boolean))]

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
    if (!schedule || schedule === '') return "default"
    try {
      const scheduleData = typeof schedule === 'string' ? JSON.parse(schedule) : schedule
      if (!Array.isArray(scheduleData) || scheduleData.length === 0) return "default"
      const today = new Date().getDay()
      const isWorkingToday = scheduleData.some(shift => shift.day === today)
      return isWorkingToday ? "success" : "warning"
    } catch (e) {
      return "default"
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadStaff} />
  if (!staff.length) return <Empty message="No staff members found" />

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
{filteredStaff.map((member) => {
          const name = member.name_c || member.Name || 'Unknown'
          const role = member.role_c || ''
          const department = member.department_c || ''
          const phone = member.phone_c || ''
          const email = member.email_c || ''
          const scheduleData = member.schedule_c || ''
          
          let parsedSchedule = []
          try {
            parsedSchedule = scheduleData && typeof scheduleData === 'string' ? JSON.parse(scheduleData) : (Array.isArray(scheduleData) ? scheduleData : [])
          } catch (e) {
            parsedSchedule = []
          }

          return (
            <Card key={member.Id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                      <Badge variant={getRoleColor(role)} className="mt-1">
                        {role}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(scheduleData)}>
                    {getStatusColor(scheduleData) === "success" ? "On Duty" : "Off Duty"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Building2" className="h-4 w-4 mr-2" />
                    <span>{department}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                    <span>{phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    <span className="truncate">{email}</span>
                  </div>

                  {parsedSchedule && parsedSchedule.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        This Week's Schedule
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                          const hasShift = parsedSchedule.some(shift => shift.day === index + 1)
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