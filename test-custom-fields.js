async function test() {
  try {
    const res = await fetch("http://localhost:8080/api/custom-reports/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "source": "Inventory",
        "fields": ["Brand", "Category", "Description", "Price", "Quality", "VoucherNumber", "CodeNumber", "Name"],
        "filters": [],
        "groupBy": "",
        "aggregations": [{ "field": "Price", "function": "SUM" }],
        "customFields": [
          { "name": "Age", "type": "blank", "formula": "" },
          { "name": "FQ", "type": "blank", "formula": "" },
          { "name": "Job", "type": "blank", "formula": "" }
        ],
        "page": 0,
        "size": 50
      })
    });
    const data = await res.json();
    console.log("Keys in row 0:", Object.keys(data.content[0]));
  } catch (err) {
    console.error(err.message);
  }
}

test();
