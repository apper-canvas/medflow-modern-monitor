import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import StatusIndicator from "@/components/molecules/StatusIndicator"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { appointmentService } from "@/services/api/appointmentService"
import { patientService } from "@/services/api/patientService"
import { staffService } from "@/services/api/staffService"

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("day")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [appointmentsData, patientsData, staffData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        staffService.getAll()
      ])
      setAppointments(appointmentsData)
      setPatients(patientsData)
      setStaff(staffData)
    } catch (err) {
      setError("Failed to load appointment data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId))
    return patient ? patient.name : "Unknown Patient"
  }

  const getDoctorName = (doctorId) => {
    const doctor = staff.find(s => s.Id === parseInt(doctorId))
    return doctor ? doctor.name : "Unknown Doctor"
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter(apt => apt.date === today).sort((a, b) => a.time.localeCompare(b.time))
  }

  const todayAppointments = getTodayAppointments()

  if (todayAppointments.length === 0) {
    return <Empty message="No appointments scheduled for today" />
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-primary-600" />
              Today's Schedule - {formatDate(new Date())}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ApperIcon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              <Button variant="primary" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.Id}
                className="flex items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
                    <ApperIcon name="Clock" className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getPatientName(appointment.patientId)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <ApperIcon name="User" className="h-4 w-4 mr-1" />
                          Dr. {getDoctorName(appointment.doctorId)}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Building2" className="h-4 w-4 mr-1" />
                          {appointment.department}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                          {formatTime(appointment.time)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <StatusIndicator status={appointment.status} type="appointment" />
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Eye" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Phone" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-500">
                <ApperIcon name="CheckCircle" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {todayAppointments.filter(a => a.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-500">
                <ApperIcon name="Clock" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Scheduled</p>
                <p className="text-2xl font-bold text-blue-900">
                  {todayAppointments.filter(a => a.status === "scheduled").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-500">
                <ApperIcon name="XCircle" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Cancelled</p>
                <p className="text-2xl font-bold text-red-900">
                  {todayAppointments.filter(a => a.status === "cancelled").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AppointmentCalendar