import { toast } from 'react-toastify'

export const staffService = {
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
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      }

      const response = await apperClient.fetchRecords('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error)
      toast.error("Failed to load staff directory. Please try again.")
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
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      }

      const response = await apperClient.getRecordById('staff_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching staff ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load staff member. Please try again.")
      return null
    }
  },

  async create(staffMemberData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: staffMemberData.name_c || staffMemberData.name || '',
          name_c: staffMemberData.name_c || staffMemberData.name || '',
          role_c: staffMemberData.role_c || staffMemberData.role || '',
          department_c: staffMemberData.department_c || staffMemberData.department || '',
          phone_c: staffMemberData.phone_c || staffMemberData.phone || '',
          email_c: staffMemberData.email_c || staffMemberData.email || '',
          schedule_c: staffMemberData.schedule_c || (typeof staffMemberData.schedule === 'object' ? JSON.stringify(staffMemberData.schedule) : staffMemberData.schedule) || ''
        }]
      }

      const response = await apperClient.createRecord('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} staff records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating staff:", error?.response?.data?.message || error)
      toast.error("Failed to create staff member. Please try again.")
      return null
    }
  },

  async update(id, staffMemberData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: staffMemberData.name_c || staffMemberData.name || '',
          name_c: staffMemberData.name_c || staffMemberData.name || '',
          role_c: staffMemberData.role_c || staffMemberData.role || '',
          department_c: staffMemberData.department_c || staffMemberData.department || '',
          phone_c: staffMemberData.phone_c || staffMemberData.phone || '',
          email_c: staffMemberData.email_c || staffMemberData.email || '',
          schedule_c: staffMemberData.schedule_c || (typeof staffMemberData.schedule === 'object' ? JSON.stringify(staffMemberData.schedule) : staffMemberData.schedule) || ''
        }]
      }

      const response = await apperClient.updateRecord('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} staff records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating staff:", error?.response?.data?.message || error)
      toast.error("Failed to update staff member. Please try again.")
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

      const response = await apperClient.deleteRecord('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} staff records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return false
    } catch (error) {
      console.error("Error deleting staff:", error?.response?.data?.message || error)
      toast.error("Failed to delete staff member. Please try again.")
      return false
    }
  }
}