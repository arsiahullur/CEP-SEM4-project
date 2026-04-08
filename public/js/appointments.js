// public/js/appointments.js — appointment API helpers
const Appointments = {
  async book(patient_id,doctor_id,date,time) { const r=await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({patient_id,doctor_id,date,time})}); return r.json(); },
  async getForPatient(id) { return (await fetch('/api/appointments/patient/'+id)).json(); },
  async getForDoctor(id)  { return (await fetch('/api/appointments/doctor/'+id)).json(); },
  async updateStatus(id,status) { return (await fetch('/api/appointments/'+id+'/status',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})})).json(); },
  formatDate(s) { return new Date(s).toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'short',day:'numeric'}); }
};