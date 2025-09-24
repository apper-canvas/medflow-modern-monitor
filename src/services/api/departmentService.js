import departmentsData from "@/services/mockData/departments.json"

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const departmentService = {
  async getAll() {
    await delay()
    return [...departmentsData]
  },

  async getById(id) {
    await delay()
    const department = departmentsData.find(d => d.Id === parseInt(id))
    if (!department) {
      throw new Error("Department not found")
    }
    return { ...department }
  },

  async create(departmentData) {
    await delay()
    const newId = Math.max(...departmentsData.map(d => d.Id)) + 1
    const newDepartment = {
      Id: newId,
      ...departmentData
    }
    departmentsData.push(newDepartment)
    return { ...newDepartment }
  },

  async update(id, departmentData) {
    await delay()
    const index = departmentsData.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Department not found")
    }
    departmentsData[index] = { ...departmentsData[index], ...departmentData }
    return { ...departmentsData[index] }
  },

  async delete(id) {
    await delay()
    const index = departmentsData.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Department not found")
    }
    const deletedDepartment = departmentsData.splice(index, 1)[0]
    return { ...deletedDepartment }
  }
}