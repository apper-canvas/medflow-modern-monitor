import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import { patientService } from '@/services/api/patientService'
import { toast } from 'react-toastify'

const PatientForm = ({ onClose, onPatientAdded }) => {
const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name_c: '',
    email_c: '',
    phone_c: '',
    date_of_birth_c: '',
    address_c: '',
    emergency_contact_c: '',
    insurance_provider_c: '',
    insurance_number_c: '',
    gender_c: '',
    department_c: '',
    status_c: 'admitted'
  })
  const [errors, setErrors] = useState({})

const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Name is required'
    }
    
    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = 'Email format is invalid'
    }
    
    if (!formData.phone_c.trim()) {
      newErrors.phone_c = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_c)) {
      newErrors.phone_c = 'Phone format is invalid'
    }
    
    if (!formData.date_of_birth_c) {
      newErrors.date_of_birth_c = 'Date of birth is required'
    }
    
    if (!formData.address_c.trim()) {
      newErrors.address_c = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form')
      return
    }

    try {
      setLoading(true)
      await patientService.create(formData)
      toast.success('Patient added successfully!')
      
// Reset form
      setFormData({
        name_c: '',
        email_c: '',
        phone_c: '',
        date_of_birth_c: '',
        address_c: '',
        emergency_contact_c: '',
        insurance_provider_c: '',
        insurance_number_c: '',
        gender_c: '',
        department_c: '',
        status_c: 'admitted'
      })
      
      if (onPatientAdded) {
        onPatientAdded()
      }
      
      if (onClose) {
        onClose()
      }
    } catch (error) {
      toast.error('Failed to add patient. Please try again.')
      console.error('Error creating patient:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <ApperIcon name="UserPlus" className="h-5 w-5 mr-2 text-primary-600" />
                Add New Patient
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_c" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name_c"
                    name="name_c"
                    value={formData.name_c}
                    onChange={handleInputChange}
                    placeholder="Enter patient's full name"
                    className={errors.name_c ? 'border-red-500' : ''}
                  />
                  {errors.name_c && (
                    <p className="text-red-500 text-sm">{errors.name_c}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_c" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email_c"
                    name="email_c"
                    type="email"
                    value={formData.email_c}
                    onChange={handleInputChange}
                    placeholder="patient@example.com"
                    className={errors.email_c ? 'border-red-500' : ''}
                  />
                  {errors.email_c && (
                    <p className="text-red-500 text-sm">{errors.email_c}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_c" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone_c"
                    name="phone_c"
                    value={formData.phone_c}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone_c ? 'border-red-500' : ''}
                  />
                  {errors.phone_c && (
                    <p className="text-red-500 text-sm">{errors.phone_c}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth_c" className="text-sm font-medium">
                    Date of Birth *
                  </Label>
                  <Input
                    id="date_of_birth_c"
                    name="date_of_birth_c"
                    type="date"
                    value={formData.date_of_birth_c}
                    onChange={handleInputChange}
                    className={errors.date_of_birth_c ? 'border-red-500' : ''}
                  />
                  {errors.date_of_birth_c && (
                    <p className="text-red-500 text-sm">{errors.date_of_birth_c}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender_c" className="text-sm font-medium">
                    Gender *
                  </Label>
                  <select
                    id="gender_c"
                    name="gender_c"
                    value={formData.gender_c}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_c" className="text-sm font-medium">
                    Status
                  </Label>
                  <select
                    id="status_c"
                    name="status_c"
                    value={formData.status_c}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="admitted">Admitted</option>
                    <option value="discharged">Discharged</option>
                    <option value="emergency">Emergency</option>
                    <option value="outpatient">Outpatient</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_c" className="text-sm font-medium">
                  Address *
                </Label>
                <Input
                  id="address_c"
                  name="address_c"
                  value={formData.address_c}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, State 12345"
                  className={errors.address_c ? 'border-red-500' : ''}
                />
                {errors.address_c && (
                  <p className="text-red-500 text-sm">{errors.address_c}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_c" className="text-sm font-medium">
                  Emergency Contact
                </Label>
                <Input
                  id="emergency_contact_c"
                  name="emergency_contact_c"
                  value={formData.emergency_contact_c}
                  onChange={handleInputChange}
                  placeholder="Emergency contact name and phone"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_provider_c" className="text-sm font-medium">
                    Insurance Provider
                  </Label>
                  <Input
                    id="insurance_provider_c"
                    name="insurance_provider_c"
                    value={formData.insurance_provider_c}
                    onChange={handleInputChange}
                    placeholder="Insurance company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance_number_c" className="text-sm font-medium">
                    Insurance Number
                  </Label>
                  <Input
                    id="insurance_number_c"
                    name="insurance_number_c"
                    value={formData.insurance_number_c}
                    onChange={handleInputChange}
                    placeholder="Policy number"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      Adding Patient...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      Add Patient
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PatientForm