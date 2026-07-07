import axios from 'axios';

async function seed() {
  const items = [
    {
      name: "Ergonomic Office Chair",
      sku: "FURN-CHR-001",
      category: "Furniture",
      quantity: 45,
      unit: "pcs",
      minQuantity: 10,
      unitPrice: 199.99,
      location: "Main Warehouse A",
      status: "In Stock",
      description: "High-quality ergonomic mesh office chair with lumbar support.",
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dell UltraSharp 27 Monitor",
      sku: "IT-MON-U2722D",
      category: "IT Equipment",
      quantity: 12,
      unit: "pcs",
      minQuantity: 15,
      unitPrice: 349.00,
      location: "IT Storage Room",
      status: "Low Stock",
      description: "27-inch 1440p monitor for office workstations.",
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "A4 Printer Paper (500 sheets)",
      sku: "OFF-PAP-A4",
      category: "Office Supplies",
      quantity: 120,
      unit: "packs",
      minQuantity: 50,
      unitPrice: 5.99,
      location: "Supply Closet B",
      status: "In Stock",
      description: "Standard A4 white printer paper, 80gsm.",
      imageUrl: "https://images.unsplash.com/photo-1612042858178-02434b9d0312?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Wireless Mouse (Logitech)",
      sku: "IT-MOU-WL",
      category: "IT Equipment",
      quantity: 3,
      unit: "pcs",
      minQuantity: 10,
      unitPrice: 29.99,
      location: "IT Storage Room",
      status: "Low Stock",
      description: "Logitech MX Anywhere 3 wireless mouse.",
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Standing Desk Frame",
      sku: "FURN-DSK-STD",
      category: "Furniture",
      quantity: 0,
      unit: "pcs",
      minQuantity: 5,
      unitPrice: 249.00,
      location: "Main Warehouse B",
      status: "Out of Stock",
      description: "Adjustable height standing desk frame (motorized).",
      imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=300"
    }
  ];

  for (const item of items) {
    try {
      console.log(`Seeding ${item.name}...`);
      const res = await axios.post("http://127.0.0.1:8080/api/stock/inventory", item);
      console.log(`Success: ${item.name}`);
    } catch (e) {
      console.error(`Failed for ${item.name}:`, e.response?.data || e.message);
    }
  }
}

seed();
