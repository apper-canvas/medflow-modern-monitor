import appointmentsData from "@/services/mockData/appointments.json"

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const appointmentService = {
  async getAll() {
    await delay()
    return [...appointmentsData]
  },

  async getById(id) {
    await delay()
    const appointment = appointmentsData.find(a => a.Id === parseInt(id))
    if (!appointment) {
      throw new Error("Appointment not found")
    }
    return { ...appointment }
  },

  async create(appointmentData) {
    await delay()
    const newId = Math.max(...appointmentsData.map(a => a.Id)) + 1
    const newAppointment = {
      Id: newId,
      ...appointmentData
    }
    appointmentsData.push(newAppointment)
    return { ...newAppointment }
  },

  async update(id, appointmentData) {
    await delay()
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Appointment not found")
    }
    appointmentsData[index] = { ...appointmentsData[index], ...appointmentData }
    return { ...appointmentsData[index] }
  },

  async delete(id) {
    await delay()
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Appointment not found")
    }
    const deletedAppointment = appointmentsData.splice(index, 1)[0]
    return { ...deletedAppointment }
  }
}