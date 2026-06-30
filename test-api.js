async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin123!' })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.accessToken || loginData.token;
    
    if (!token) return;

    const casesRes = await fetch('http://localhost:8080/api/cases?size=1000', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Cases API Status:", casesRes.status);
    if (!casesRes.ok) console.log(await casesRes.text());
    
  } catch (err) {
    console.log("Error:", err);
  }
}

testApi();
