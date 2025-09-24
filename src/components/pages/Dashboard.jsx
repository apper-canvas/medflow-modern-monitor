import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import StatCard from "@/components/molecules/StatCard"
import QuickAction from "@/components/molecules/QuickAction"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import StatusIndicator from "@/components/molecules/StatusIndicator"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { patientService } from "@/services/api/patientService"
import { appointmentService } from "@/services/api/appointmentService"
import { staffService } from "@/services/api/staffService"
import { departmentService } from "@/services/api/departmentService"

const Dashboard = () => {
  const { searchTerm } = useOutletContext() || {}
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [staff, setStaff] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const [patientsData, appointmentsData, staffData, departmentsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        departmentService.getAll()
      ])
      setPatients(patientsData)
      setAppointments(appointmentsData)
      setStaff(staffData)
      setDepartments(departmentsData)
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading message="Loading hospital dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  // Calculate dashboard statistics
  const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0)
  const occupiedBeds = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0)
  const availableBeds = totalBeds - occupiedBeds
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split("T")[0]
    return apt.date === today
  })

  const emergencyPatients = patients.filter(patient => patient.status === "emergency").length

  const getRecentActivities = () => {
    const activities = []
    
    // Recent admissions
    const recentAdmissions = patients
      .filter(p => p.status === "admitted")
      .slice(0, 3)
      .map(p => ({
        type: "admission",
        message: `${p.name} admitted to ${p.department}`,
        time: "2 hours ago",
        icon: "UserPlus",
        color: "text-green-600"
      }))

    // Today's appointments
    const upcomingAppointments = todayAppointments
      .slice(0, 2)
      .map(apt => {
        const patient = patients.find(p => p.Id === parseInt(apt.patientId))
        return {
          type: "appointment",
          message: `Appointment scheduled for ${patient?.name || "Patient"}`,
          time: `Today at ${apt.time}`,
          icon: "Calendar",
          color: "text-blue-600"
        }
      })

    activities.push(...recentAdmissions, ...upcomingAppointments)
    return activities.slice(0, 5)
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to MedFlow Dashboard</h1>
            <p className="text-primary-100 text-lg">
              Monitor hospital operations and patient care in real-time
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
              <ApperIcon name="Heart" className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon="Calendar"
          color="info"
          trend="neutral"
          trendValue="Same as yesterday"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon="Bed"
          color={availableBeds < 10 ? "warning" : "success"}
          trend={availableBeds < 10 ? "down" : "up"}
          trendValue={`${occupancyRate}% occupied`}
        />
        <StatCard
          title="Emergency Cases"
          value={emergencyPatients}
          icon="AlertTriangle"
          color="danger"
          trend="up"
          trendValue="Immediate attention"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon="UserPlus"
            title="Register Patient"
            description="Add new patient to system"
            onClick={() => {}}
          />
          <QuickAction
            icon="Calendar"
            title="Schedule Appointment"
            description="Book new appointment"
            onClick={() => {}}
          />
          <QuickAction
            icon="Stethoscope"
            title="Emergency Check-in"
            description="Fast-track emergency patient"
            onClick={() => {}}
          />
          <QuickAction
            icon="FileText"
            title="View Reports"
            description="Access hospital analytics"
            onClick={() => {}}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-primary-600" />
              Today's Schedule ({todayAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find(p => p.Id === parseInt(appointment.patientId))
                  return (
                    <div key={appointment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center mr-3">
                          <ApperIcon name="Clock" className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient?.name || "Unknown Patient"}</p>
                          <p className="text-sm text-gray-600">{appointment.department} • {formatTime(appointment.time)}</p>
                        </div>
                      </div>
                      <StatusIndicator status={appointment.status} type="appointment" />
                    </div>
                  )
                })}
                {todayAppointments.length > 5 && (
                  <p className="text-center text-sm text-gray-500 pt-3">
                    +{todayAppointments.length - 5} more appointments
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Activity" className="h-5 w-5 mr-2 text-primary-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getRecentActivities().map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full bg-gray-100 mr-3 ${activity.color}`}>
                    <ApperIcon name={activity.icon} className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
              {getRecentActivities().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Activity" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Building2" className="h-5 w-5 mr-2 text-primary-600" />
            Department Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => {
              const occupancyRate = department.totalBeds > 0 
                ? Math.round((department.occupiedBeds / department.totalBeds) * 100) 
                : 0
              const statusColor = occupancyRate >= 90 ? "danger" : occupancyRate >= 70 ? "warning" : "success"
              
              return (
                <div key={department.Id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{department.name}</h3>
                    <StatusIndicator status={occupancyRate >= 90 ? "Full" : "Available"} type="bed" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Beds: {department.occupiedBeds}/{department.totalBeds}</p>
                    <p>Occupancy: {occupancyRate}%</p>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        occupancyRate >= 90 ? "bg-red-500" : 
                        occupancyRate >= 70 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard