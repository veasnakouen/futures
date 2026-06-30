const customFields = [
  { name: "sdfas", type: "blank", formula: "" },
  { name: "Page", type: "blank", formula: "" },
  { name: "Hiring", type: "blank", formula: "" }
];
const aggregations = [
  { field: "Page", function: "SUM" }
];

const filtered = aggregations.filter(agg => !customFields.some(cf => cf.name.toLowerCase() === agg.field.toLowerCase()));

console.log(filtered);
