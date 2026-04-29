const axios = require('axios');
const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

axios.get('https://localhost:7140/Reports/GetReportPage?reportName=ClientSummaryReport', { httpsAgent: agent })
  .then(res => {
    console.log(Object.keys(res.data));
  })
  .catch(err => console.error(err.message));
