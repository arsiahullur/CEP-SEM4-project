// public/js/prescriptions.js — prescription API helpers
const Prescriptions = {
  async add(data) { return (await fetch('/api/prescriptions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})).json(); },
  async getForPatient(id) { return (await fetch('/api/prescriptions/patient/'+id)).json(); },
  async getForDoctor(id)  { return (await fetch('/api/prescriptions/doctor/'+id)).json(); }
};