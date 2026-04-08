// public/js/dashboard.js — accessibility utilities
// Load prefs on page start
(function(){
  if(localStorage.getItem('hc')==='true')document.body.classList.add('high-contrast');
  document.documentElement.style.fontSize=(localStorage.getItem('fs')||'16')+'px';
})();
function toggleContrast(){const on=document.body.classList.toggle('high-contrast');localStorage.setItem('hc',on);}
function changeFontSize(d){let c=parseInt(localStorage.getItem('fs')||'16');c=d===0?16:Math.min(26,Math.max(12,c+d));localStorage.setItem('fs',c);document.documentElement.style.fontSize=c+'px';}
function readPage(){window.speechSynthesis.cancel();const t=document.body.innerText.replace(/\s+/g,' ').trim().substring(0,3000);const u=new SpeechSynthesisUtterance(t);u.lang='en-IN';u.rate=0.95;window.speechSynthesis.speak(u);}
function stopReading(){window.speechSynthesis.cancel();}