import { toast } from 'react-toastify'

export const departmentService = {
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
          {"field": {"Name": "total_beds_c"}},
          {"field": {"Name": "occupied_beds_c"}},
          {"field": {"Name": "head_of_department_c"}}
        ]
      }

      const response = await apperClient.fetchRecords('department_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error)
      toast.error("Failed to load departments. Please try again.")
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
          {"field": {"Name": "total_beds_c"}},
          {"field": {"Name": "occupied_beds_c"}},
          {"field": {"Name": "head_of_department_c"}}
        ]
      }

      const response = await apperClient.getRecordById('department_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load department. Please try again.")
      return null
    }
  },

  async create(departmentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: departmentData.name_c || departmentData.name || '',
          name_c: departmentData.name_c || departmentData.name || '',
          total_beds_c: departmentData.total_beds_c || departmentData.totalBeds || 0,
          occupied_beds_c: departmentData.occupied_beds_c || departmentData.occupiedBeds || 0,
          head_of_department_c: departmentData.head_of_department_c || departmentData.headOfDepartment || ''
        }]
      }

      const response = await apperClient.createRecord('department_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} department records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error)
      toast.error("Failed to create department. Please try again.")
      return null
    }
  },

  async update(id, departmentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.name_c || departmentData.name || '',
          name_c: departmentData.name_c || departmentData.name || '',
          total_beds_c: departmentData.total_beds_c || departmentData.totalBeds || 0,
          occupied_beds_c: departmentData.occupied_beds_c || departmentData.occupiedBeds || 0,
          head_of_department_c: departmentData.head_of_department_c || departmentData.headOfDepartment || ''
        }]
      }

      const response = await apperClient.updateRecord('department_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} department records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error)
      toast.error("Failed to update department. Please try again.")
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

      const response = await apperClient.deleteRecord('department_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} department records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return false
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error)
      toast.error("Failed to delete department. Please try again.")
      return false
    }
  }
}