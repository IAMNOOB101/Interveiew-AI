(async ()=>{
  try{
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@interviewai.com', password: 'SuperAdmin123!' })
    });
    const data = await res.json();
    console.log('status', res.status, data);
  }catch(err){
    console.error('request error', err.message);
  }
})();
