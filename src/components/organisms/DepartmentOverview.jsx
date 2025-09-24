import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { departmentService } from "@/services/api/departmentService"
import { staffService } from "@/services/api/staffService"

const DepartmentOverview = () => {
  const [departments, setDepartments] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [departmentsData, staffData] = await Promise.all([
        departmentService.getAll(),
        staffService.getAll()
      ])
      setDepartments(departmentsData)
      setStaff(staffData)
    } catch (err) {
      setError("Failed to load department data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  if (departments.length === 0) return <Empty message="No departments found" />

const getStaffCount = (departmentName) => {
    return staff.filter(member => {
      const memberDepartment = member.department_c || ''
      return memberDepartment === departmentName
    }).length
  }

  const getOccupancyRate = (occupied, total) => {
    if (total === 0) return 0
    return Math.round((occupied / total) * 100)
  }

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "danger"
    if (rate >= 70) return "warning"
    return "success"
  }

  const getBedStatusColor = (occupied, total) => {
    const rate = getOccupancyRate(occupied, total)
    if (rate >= 90) return "bg-red-100 border-red-200"
    if (rate >= 70) return "bg-yellow-100 border-yellow-200"
    return "bg-green-100 border-green-200"
  }

  return (
    <div className="space-y-6">
      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{departments.map((department) => {
          const name = department.name_c || department.Name || 'Unknown'
          const totalBeds = department.total_beds_c || 0
          const occupiedBeds = department.occupied_beds_c || 0
          const headOfDepartment = department.head_of_department_c || 'Not Assigned'
          const occupancyRate = getOccupancyRate(occupiedBeds, totalBeds)
          const staffCount = getStaffCount(name)
          
          return (
            <Card key={department.Id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">{name}</CardTitle>
                  <Badge variant={getOccupancyColor(occupancyRate)}>
                    {occupancyRate}% Full
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bed Capacity */}
                  <div className={`p-4 rounded-lg border-2 ${getBedStatusColor(occupiedBeds, totalBeds)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ApperIcon name="Bed" className="h-5 w-5 mr-2 text-gray-700" />
                        <span className="font-medium text-gray-900">Bed Capacity</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {occupiedBeds}/{totalBeds}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          occupancyRate >= 90 ? "bg-red-500" : 
                          occupancyRate >= 70 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Available: {totalBeds - occupiedBeds}</span>
                      <span>Occupied: {occupiedBeds}</span>
                    </div>
                  </div>

                  {/* Staff Information */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="Users" className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-900">Staff Members</span>
                    </div>
                    <span className="text-xl font-bold text-primary-600">{staffCount}</span>
                  </div>

                  {/* Head of Department */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-cyan-50 rounded-lg border border-primary-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center mr-3">
                        <ApperIcon name="UserCheck" className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Department Head</p>
                        <p className="font-medium text-gray-900">{headOfDepartment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1">
                      <ApperIcon name="Bed" className="h-4 w-4 mr-2" />
                      Manage Beds
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="BarChart" className="h-5 w-5 mr-2 text-primary-600" />
            Hospital Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {departments.length}
              </div>
              <div className="text-sm font-medium text-blue-800">Total Departments</div>
            </div>
            
<div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-green-900 mb-1">
                {departments.reduce((sum, dept) => sum + (dept.total_beds_c || 0), 0)}
              </div>
              <div className="text-sm font-medium text-green-800">Total Beds</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-900 mb-1">
                {departments.reduce((sum, dept) => sum + (dept.occupied_beds_c || 0), 0)}
              </div>
              <div className="text-sm font-medium text-yellow-800">Occupied Beds</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {staff.length}
              </div>
              <div className="text-sm font-medium text-purple-800">Total Staff</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DepartmentOverview