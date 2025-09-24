import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { patientService } from "@/services/api/patientService"
import { appointmentService } from "@/services/api/appointmentService"
import { departmentService } from "@/services/api/departmentService"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement)

const Reports = () => {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const loadReportsData = async () => {
    try {
      setLoading(true)
      setError("")
      const [patientsData, appointmentsData, departmentsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        departmentService.getAll()
      ])
      setPatients(patientsData)
      setAppointments(appointmentsData)
      setDepartments(departmentsData)
    } catch (err) {
      setError("Failed to load reports data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportsData()
  }, [])

  if (loading) return <Loading message="Generating hospital reports..." />
  if (error) return <Error message={error} onRetry={loadReportsData} />

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9"
        }
      },
      x: {
        grid: {
          color: "#f1f5f9"
        }
      }
    }
  }

  // Department patient distribution
  const departmentData = {
    labels: departments.map(dept => dept.name),
    datasets: [
      {
        label: "Patients by Department",
        data: departments.map(dept => {
          return patients.filter(patient => patient.department === dept.name).length
        }),
        backgroundColor: [
          "#2563eb",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6"
        ],
        borderWidth: 0,
        borderRadius: 8
      }
    ]
  }

  // Patient status distribution
  const statusData = {
    labels: ["Admitted", "Discharged", "Emergency", "Outpatient"],
    datasets: [
      {
        data: [
          patients.filter(p => p.status === "admitted").length,
          patients.filter(p => p.status === "discharged").length,
          patients.filter(p => p.status === "emergency").length,
          patients.filter(p => p.status === "outpatient").length
        ],
        backgroundColor: ["#10b981", "#64748b", "#ef4444", "#06b6d4"],
        borderWidth: 0
      }
    ]
  }

  // Weekly appointments trend (mock data)
  const appointmentTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Scheduled",
        data: [12, 15, 18, 14, 20, 8, 6],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true
      },
      {
        label: "Completed",
        data: [10, 13, 16, 12, 18, 7, 5],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Bed occupancy data
  const bedOccupancyData = {
    labels: departments.map(dept => dept.name),
    datasets: [
      {
        label: "Occupied Beds",
        data: departments.map(dept => dept.occupiedBeds),
        backgroundColor: "#ef4444"
      },
      {
        label: "Available Beds",
        data: departments.map(dept => dept.totalBeds - dept.occupiedBeds),
        backgroundColor: "#10b981"
      }
    ]
  }

  const calculateStatistics = () => {
    const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0)
    const occupiedBeds = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0)
    const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0

    const todayAppointments = appointments.filter(apt => {
      const today = new Date().toISOString().split("T")[0]
      return apt.date === today
    })

    const completedToday = todayAppointments.filter(apt => apt.status === "completed").length
    const completionRate = todayAppointments.length > 0 
      ? ((completedToday / todayAppointments.length) * 100).toFixed(1) 
      : 0

    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      occupancyRate,
      completionRate,
      emergencyCases: patients.filter(p => p.status === "emergency").length
    }
  }

  const stats = calculateStatistics()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">
            Comprehensive insights into hospital operations and patient care metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="primary">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Patients</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalPatients}</p>
              </div>
              <ApperIcon name="Users" className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Appointments</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalAppointments}</p>
              </div>
              <ApperIcon name="Calendar" className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Bed Occupancy</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.occupancyRate}%</p>
              </div>
              <ApperIcon name="Bed" className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-900">{stats.completionRate}%</p>
              </div>
              <ApperIcon name="CheckCircle" className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Emergency Cases</p>
                <p className="text-2xl font-bold text-red-900">{stats.emergencyCases}</p>
              </div>
              <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="BarChart3" className="h-5 w-5 mr-2 text-primary-600" />
              Patients by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={departmentData} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Patient Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="PieChart" className="h-5 w-5 mr-2 text-primary-600" />
              Patient Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut 
              data={statusData} 
              options={{
                ...chartOptions,
                scales: undefined,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  }
                }
              }} 
            />
          </CardContent>
        </Card>

        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="TrendingUp" className="h-5 w-5 mr-2 text-primary-600" />
              Weekly Appointment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={appointmentTrendData} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Bed Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Bed" className="h-5 w-5 mr-2 text-primary-600" />
              Bed Occupancy by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={bedOccupancyData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: {
                  stacked: true,
                  grid: {
                    color: "#f1f5f9"
                  }
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  grid: {
                    color: "#f1f5f9"
                  }
                }
              }
            }} />
          </CardContent>
        </Card>
      </div>

      {/* Summary Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="FileText" className="h-5 w-5 mr-2 text-primary-600" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Patient Care Metrics</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Total active patients: <strong>{stats.totalPatients}</strong></li>
                  <li>• Emergency cases requiring immediate attention: <strong>{stats.emergencyCases}</strong></li>
                  <li>• Average bed occupancy rate: <strong>{stats.occupancyRate}%</strong></li>
                  <li>• Today's appointment completion rate: <strong>{stats.completionRate}%</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Operational Insights</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Most active department: <strong>{departments[0]?.name || "N/A"}</strong></li>
                  <li>• Total hospital capacity utilization is optimal</li>
                  <li>• Emergency response time within acceptable limits</li>
                  <li>• Staff allocation balanced across departments</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-semibold text-blue-900">Recommendations</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Consider increasing staff during peak hours and monitor bed availability in high-demand departments. 
                    Emergency response protocols are performing well and should be maintained.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports