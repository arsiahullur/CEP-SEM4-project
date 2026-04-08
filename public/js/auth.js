// public/js/auth.js — shared auth helpers
const Auth = {
  getUser() { const r=localStorage.getItem('user'); return r?JSON.parse(r):null; },
  setUser(u) { localStorage.setItem('user',JSON.stringify(u)); },
  logout()   { localStorage.removeItem('user'); },
  requirePatient() { const u=this.getUser(); if(!u){location.href='login-patient.html';return null;} if(u.role!=='patient'){location.href='login-doctor.html';return null;} return u; },
  requireDoctor()  { const u=this.getUser(); if(!u){location.href='login-doctor.html';return null;}  if(u.role!=='doctor'){location.href='login-patient.html';return null;}  return u; }
};