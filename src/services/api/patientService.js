import patientsData from "@/services/mockData/patients.json"

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const patientService = {
  async getAll() {
    await delay()
    return [...patientsData]
  },

  async getById(id) {
    await delay()
    const patient = patientsData.find(p => p.Id === parseInt(id))
    if (!patient) {
      throw new Error("Patient not found")
    }
    return { ...patient }
  },

  async create(patientData) {
    await delay()
    const newId = Math.max(...patientsData.map(p => p.Id)) + 1
    const newPatient = {
      Id: newId,
      ...patientData,
      admissionDate: new Date().toISOString().split("T")[0]
    }
    patientsData.push(newPatient)
    return { ...newPatient }
  },

  async update(id, patientData) {
    await delay()
    const index = patientsData.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Patient not found")
    }
    patientsData[index] = { ...patientsData[index], ...patientData }
    return { ...patientsData[index] }
  },

  async delete(id) {
    await delay()
    const index = patientsData.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Patient not found")
    }
    const deletedPatient = patientsData.splice(index, 1)[0]
    return { ...deletedPatient }
  }
}