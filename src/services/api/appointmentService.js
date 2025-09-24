import { toast } from 'react-toastify'

export const appointmentService = {
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}}
        ]
      }

      const response = await apperClient.fetchRecords('appointment_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error)
      toast.error("Failed to load appointments. Please try again.")
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}}
        ]
      }

      const response = await apperClient.getRecordById('appointment_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load appointment. Please try again.")
      return null
    }
  },

  async create(appointmentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: `Appointment - ${appointmentData.date_c || appointmentData.date || ''} ${appointmentData.time_c || appointmentData.time || ''}`,
          patient_id_c: appointmentData.patient_id_c || parseInt(appointmentData.patientId) || null,
          doctor_id_c: appointmentData.doctor_id_c || parseInt(appointmentData.doctorId) || null,
          date_c: appointmentData.date_c || appointmentData.date || '',
          time_c: appointmentData.time_c || appointmentData.time || '',
          department_c: appointmentData.department_c || appointmentData.department || '',
          status_c: appointmentData.status_c || appointmentData.status || 'scheduled',
          notes_c: appointmentData.notes_c || appointmentData.notes || '',
          type_c: appointmentData.type_c || appointmentData.type || ''
        }]
      }

      const response = await apperClient.createRecord('appointment_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} appointment records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error)
      toast.error("Failed to create appointment. Please try again.")
      return null
    }
  },

  async update(id, appointmentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Appointment - ${appointmentData.date_c || appointmentData.date || ''} ${appointmentData.time_c || appointmentData.time || ''}`,
          patient_id_c: appointmentData.patient_id_c || parseInt(appointmentData.patientId) || null,
          doctor_id_c: appointmentData.doctor_id_c || parseInt(appointmentData.doctorId) || null,
          date_c: appointmentData.date_c || appointmentData.date || '',
          time_c: appointmentData.time_c || appointmentData.time || '',
          department_c: appointmentData.department_c || appointmentData.department || '',
          status_c: appointmentData.status_c || appointmentData.status || 'scheduled',
          notes_c: appointmentData.notes_c || appointmentData.notes || '',
          type_c: appointmentData.type_c || appointmentData.type || ''
        }]
      }

      const response = await apperClient.updateRecord('appointment_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} appointment records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error)
      toast.error("Failed to update appointment. Please try again.")
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

      const response = await apperClient.deleteRecord('appointment_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} appointment records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return false
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error)
      toast.error("Failed to delete appointment. Please try again.")
      return false
    }
  }
}