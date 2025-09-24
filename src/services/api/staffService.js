import staffData from "@/services/mockData/staff.json"

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const staffService = {
  async getAll() {
    await delay()
    return [...staffData]
  },

  async getById(id) {
    await delay()
    const staff = staffData.find(s => s.Id === parseInt(id))
    if (!staff) {
      throw new Error("Staff member not found")
    }
    return { ...staff }
  },

  async create(staffMemberData) {
    await delay()
    const newId = Math.max(...staffData.map(s => s.Id)) + 1
    const newStaffMember = {
      Id: newId,
      ...staffMemberData
    }
    staffData.push(newStaffMember)
    return { ...newStaffMember }
  },

  async update(id, staffMemberData) {
    await delay()
    const index = staffData.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Staff member not found")
    }
    staffData[index] = { ...staffData[index], ...staffMemberData }
    return { ...staffData[index] }
  },

  async delete(id) {
    await delay()
    const index = staffData.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Staff member not found")
    }
    const deletedStaffMember = staffData.splice(index, 1)[0]
    return { ...deletedStaffMember }
  }
}