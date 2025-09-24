import { toast } from 'react-toastify'

export const patientService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "medical_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "insurance_provider_c"}},
          {"field": {"Name": "insurance_number_c"}}
        ]
      }

      const response = await apperClient.fetchRecords('patient_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error)
      toast.error("Failed to load patients. Please try again.")
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "medical_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "insurance_provider_c"}},
          {"field": {"Name": "insurance_number_c"}}
        ]
      }

      const response = await apperClient.getRecordById('patient_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load patient. Please try again.")
      return null
    }
  },

  async create(patientData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
records: [{
          Name: patientData.name_c || '',
          name_c: patientData.name_c || patientData.name || '',
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth || '',
          gender_c: patientData.gender_c || patientData.gender || '',
          phone_c: patientData.phone_c || patientData.phone || '',
          address_c: patientData.address_c || patientData.address || '',
          emergency_contact_c: patientData.emergency_contact_c || (typeof patientData.emergencyContact === 'object' ? JSON.stringify(patientData.emergencyContact) : patientData.emergencyContact) || '',
          medical_id_c: patientData.medical_id_c || patientData.medicalId || `MED-${Date.now()}`,
          department_c: patientData.department_c || patientData.department || '',
          status_c: patientData.status_c || patientData.status || 'admitted',
          admission_date_c: patientData.admission_date_c || patientData.admissionDate || new Date().toISOString().split("T")[0],
          email_c: patientData.email_c || patientData.email || '',
          insurance_provider_c: patientData.insurance_provider_c || patientData.insuranceProvider || '',
          insurance_number_c: patientData.insurance_number_c || patientData.insuranceNumber || ''
        }]
      }

      const response = await apperClient.createRecord('patient_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} patient records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error)
      toast.error("Failed to create patient. Please try again.")
      return null
    }
  },

  async update(id, patientData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: patientData.name_c || patientData.name || '',
          name_c: patientData.name_c || patientData.name || '',
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth || '',
          gender_c: patientData.gender_c || patientData.gender || '',
          phone_c: patientData.phone_c || patientData.phone || '',
          address_c: patientData.address_c || patientData.address || '',
          emergency_contact_c: patientData.emergency_contact_c || (typeof patientData.emergencyContact === 'object' ? JSON.stringify(patientData.emergencyContact) : patientData.emergencyContact) || '',
          medical_id_c: patientData.medical_id_c || patientData.medicalId || '',
          department_c: patientData.department_c || patientData.department || '',
          status_c: patientData.status_c || patientData.status || '',
          admission_date_c: patientData.admission_date_c || patientData.admissionDate || '',
          email_c: patientData.email_c || patientData.email || '',
          insurance_provider_c: patientData.insurance_provider_c || patientData.insuranceProvider || '',
          insurance_number_c: patientData.insurance_number_c || patientData.insuranceNumber || ''
        }]
      }

      const response = await apperClient.updateRecord('patient_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} patient records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error)
      toast.error("Failed to update patient. Please try again.")
      return null
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('patient_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} patient records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return false
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error)
      toast.error("Failed to delete patient. Please try again.")
      return false
    }
  }
}