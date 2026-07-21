const loginResponse = await fetch("http://127.0.0.1:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    username: "admin@mtp.com",
    password: "admin123"
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;

console.log("Token:", token.substring(0, 15) + "...");

const fetchEndpoint = async (url) => {
  console.log(`\nFetching ${url}...`);
  const res = await fetch(`http://127.0.0.1:3000${url}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text.substring(0, 200));
};

await fetchEndpoint("/api/v1/hr/scheduling/current");
await fetchEndpoint("/api/lookups/clients");
await fetchEndpoint("/api/lookups/users");
