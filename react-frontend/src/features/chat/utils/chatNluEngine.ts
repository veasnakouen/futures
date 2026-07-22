export interface ChatMessageData {
  content: string;
  sender: string;
  type: string;
  recipient?: string;
  actionLabel?: string;
  actionLink?: string;
  suggestedTopics?: string[];
}

export const processClientAiQuery = (queryText: string, username: string = "User"): ChatMessageData => {
  let s = (queryText || "").toLowerCase();

  // Fuzzy Typo Replacements
  s = s.replaceAll(/\bpaint\b|\bpaitent\b|\bpatiet\b|\bpatien\b/g, "patient");
  s = s.replaceAll(/\bguid\b|\bgide\b|\bguie\b/g, "guide");
  s = s.replaceAll(/\bclnic\b|\bclinik\b|\bclinck\b/g, "clinic");
  s = s.replaceAll(/\bassest\b|\bassets\b|\bharware\b|\blaptap\b/g, "hardware");
  s = s.replaceAll(/\bpament\b|\bpaymnt\b|\binvois\b|\binvoic\b/g, "payment");
  s = s.replaceAll(/\bdoktor\b|\bdoctar\b/g, "doctor");
  s = s.replaceAll(/\bskool\b|\bschol\b|\bstydent\b/g, "student");
  s = s.replaceAll(/\bhotle\b|\bhotal\b|\bgues\b/g, "hotel");
  s = s.replaceAll(/\busr\b|\bpasword\b|\brols\b/g, "user");

  if (s.includes("patient") || s.includes("clinic") || s.includes("doctor") || s.includes("prescription") || s.includes("ward") || s.includes("ipd") || s.includes("lab")) {
    return {
      content: "### 🏥 Clinic & Inpatient System App Flow\n\n1. **Register New Patient**: Navigate to **Clinic Management** (`/clinic`) -> **Patients** tab -> Click **'Register Patient'**. Fill out Medical History, Emergency Contact, DOB, and Allergies -> Click **'Save Patient'**.\n2. **IPD Inpatient Bed Allocation**: Go to **IPD Ward** tab -> View real-time bed map -> Click **'Admit Patient'** -> Select Ward/Bed, Doctor in charge, Vitals monitoring, and Admission reason.\n3. **Issue Prescriptions**: Go to **Prescriptions** tab -> Click **'New Prescription'** -> Select Patient ID, Attending Doctor, Medication items, Dosage, and Duration.\n4. **Lab Results**: Go to **Lab Results** tab -> Select Patient -> Record test parameters and update status (`Pending` -> `Completed`).",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open Clinic Management",
      actionLink: "/clinic",
      suggestedTopics: ["How to admit inpatient bed?", "Issue new prescription", "Register clinic doctor"],
    };
  }

  if (s.includes("hardware") || s.includes("asset") || s.includes("laptop") || s.includes("serial") || s.includes("deploy") || s.includes("print tag") || s.includes("specs")) {
    return {
      content: "### 💻 Hardware & Asset Management App Flow\n\n1. **Register Hardware Asset**: Go to **HR Management** (`/hr`) -> **Hardware Inventory** -> Click **'Register Asset'**. Fill in Model Name, Serial Number, Category (Laptop, Desktop, Smartphone, Monitor), Acquisition Date, Purchase Price, and Node ID -> Click **'Save'**.\n2. **Deploy to Staff**: Click the **'Deploy'** action on any `AVAILABLE` asset card -> Search staff custodian by Name/ID -> Select Department -> Click **'Confirm Deployment'**.\n3. **Inspect Specifications**: Click the **Eye icon** on an asset row to launch the **Asset Specifications Telemetry Inspector** (pulsating status, font-mono node ID, serial badge, custodian history).\n4. **Return Asset to Stock**: Click **'Process Return'** -> Confirm in the prompt -> Status reverts to `AVAILABLE`.\n5. **Print Property Label**: Click **'Print Tag'** to generate a printable QR/Barcode asset label.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open Hardware Inventory",
      actionLink: "/hr",
      suggestedTopics: ["How to deploy asset to staff?", "How to print property tag?", "Asset Specs Inspector"],
    };
  }

  if (s.includes("user") || s.includes("role") || s.includes("permission") || s.includes("rbac") || s.includes("password") || s.includes("security") || s.includes("status")) {
    return {
      content: "### 🛡️ User Management & Security (RBAC) App Flow\n\n1. **Create Operator Account**: Go to **Admin Console** (`/admin`) -> **User Management** -> Click **'Create User'**. Enter Username, Email, Password, and initial Role (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `USER`) -> Click **'Save'**.\n2. **Row Hover Action Menu**: Hover mouse over any user row to smoothly reveal action icons:\n   - **Toggle Status**: Switch account status between `Active` and `Inactive` (with confirmation modal).\n   - **Reset Password**: Instantly update credentials.\n   - **Edit Roles**: Modify permission roles.\n3. **Granular RBAC Permissions**: Go to **Role & Permission Management** tab -> Click **'Create Custom Role'** -> Select permissions across services (Create, Read, Update, Delete).",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open User Management",
      actionLink: "/admin",
      suggestedTopics: ["How to assign user roles?", "Reset user password", "Toggle account status"],
    };
  }

  if (s.includes("billing") || s.includes("invoice") || s.includes("payment") || s.includes("finance") || s.includes("receipt") || s.includes("cash") || s.includes("card")) {
    return {
      content: "### 💵 Billing, Invoices & Payments App Flow\n\n1. **Generate Invoice**: Go to **Billing & Finance** (`/billing`) -> **Invoices** tab -> Click **'Create Invoice'**. Select Client/Patient ID, Add line items (Service fee, product SKU, tax, discount), Set Due Date -> Click **'Generate'**.\n2. **Record Payment**: Go to **Payments** tab -> Click **'Record Payment'**. Select target Invoice ID, enter Amount Received, choose Payment Method (`Bank Transfer`, `Cash`, `Credit Card`, `ABA Pay`) -> Click **'Save Payment'**.\n3. **Export Official Receipt**: Click **'Download PDF Invoice'** on any ledger row.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open Billing & Finance",
      actionLink: "/billing",
      suggestedTopics: ["How to generate invoice?", "Record cash payment", "Download PDF receipt"],
    };
  }

  if (s.includes("pos") || s.includes("checkout") || s.includes("barcode") || s.includes("product") || s.includes("retail") || s.includes("sale")) {
    return {
      content: "### 🛒 Retail POS & Order Checkout App Flow\n\n1. **POS Terminal Checkout**: Open **Retail & POS** (`/pos`) -> Scan item barcode or click product catalog cards -> Adjust item quantities -> Select Customer/Discount -> Click **'Checkout'**.\n2. **Payment & Receipt**: Select Payment Method -> Complete transaction -> Auto-generates receipt and decrements inventory ledger in real-time.\n3. **Sales History & Refunds**: Go to **Sales History** tab to review cashier shifts, daily revenue totals, and process refunds.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open POS Terminal",
      actionLink: "/pos",
      suggestedTopics: ["How to process POS sale?", "Manage retail products", "View sales history"],
    };
  }

  if (s.includes("inventory") || s.includes("stock") || s.includes("warehouse") || s.includes("sku") || s.includes("threshold")) {
    return {
      content: "### 📦 Inventory Ledger & Stock App Flow\n\n1. **Add Inventory Item**: Open **Inventory & Stock** (`/inventory`) -> **Inventory Ledger** -> Click **'Add Item'**. Fill in SKU, Item Name, Storage Unit Price, Initial Quantity, and Minimum Threshold -> Click **'Save'**.\n2. **Low Stock Threshold Alert**: Items dropping below minimum threshold are automatically flagged with warning badges.\n3. **Stock Transfer**: Click **'Transfer Stock'** -> Select Source Warehouse Node, Destination Node, Quantity -> Click **'Execute Transfer'**.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open Inventory Ledger",
      actionLink: "/inventory",
      suggestedTopics: ["Add new inventory item", "Transfer stock between warehouses", "Low stock alerts"],
    };
  }

  if (s.includes("student") || s.includes("school") || s.includes("teacher") || s.includes("course") || s.includes("enroll")) {
    return {
      content: "### 🎓 School & Education Management App Flow\n\n1. **Register Student**: Go to **School Management** (`/school`) -> **Students** tab -> Click **'Add New Student'**. Fill in Student Name, Grade Level, Parent Contact, DOB -> Click **'Save'**.\n2. **Term Enrollment**: Go to **Enrollments** tab -> Click **'New Enrollment'** -> Link Student to Academic Term and Course.\n3. **Teacher & Course Management**: Go to **Teachers** / **Courses** tabs -> Assign subject leads, room schedules, and credit hours.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open School Management",
      actionLink: "/school",
      suggestedTopics: ["How to enroll student?", "Add new teacher", "Manage course catalog"],
    };
  }

  if (s.includes("hotel") || s.includes("room") || s.includes("booking") || s.includes("guest") || s.includes("reservation")) {
    return {
      content: "### 🏨 Hospitality & Hotel Booking App Flow\n\n1. **New Reservation**: Navigate to **Hospitality & Hotel** (`/hotel`) -> **Bookings** tab -> Click **'New Booking'**. Pick Check-in/Check-out dates -> Select Room Tier (Deluxe, Suite, Standard) -> Enter Guest Name -> Click **'Confirm'**.\n2. **Guest Check-in / Check-out**: Hover over booking row -> Click **'Check In'** or **'Check Out'** to tally room charges and balance.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open Hotel Management",
      actionLink: "/hotel",
      suggestedTopics: ["Create room reservation", "Guest check-in", "View room rates"],
    };
  }

  if (s.includes("employee") || s.includes("hr") || s.includes("biometric") || s.includes("attendance") || s.includes("recruitment") || s.includes("candidate")) {
    return {
      content: "### 👥 HR, Workforce & Biometric Fleet App Flow\n\n1. **Register Employee**: Go to **HR Management** (`/hr`) -> **Employees** tab -> Click **'Register Employee'**. Enter Profile info, Job Title, Department, Salary, Onboarding kit -> Click **'Save'**.\n2. **Department Hierarchy Node**: Go to **Structure** tab -> Click **'Add Hierarchy Node'** to map organizational divisions.\n3. **Biometric Devices**: Go to **Attendance** tab -> Click **'Biometric Devices'** to manage connected IP scanners -> Click **'Sync Attendance Logs'**.\n4. **Talent Onboarding Wizard**: Go to **Recruitment** -> Launch **Candidate Onboarding Wizard** stepper.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open HR Management",
      actionLink: "/hr",
      suggestedTopics: ["Register new employee", "Sync biometric devices", "Candidate onboarding wizard"],
    };
  }

  if (s.includes("report") || s.includes("export") || s.includes("pdf") || s.includes("excel")) {
    return {
      content: "### 📈 Reports & Enterprise Analytics App Flow\n\n1. **Select Report Template**: Go to **Reports & Analytics** (`/reports`) -> Select template (Financial Summary, Student Attendance, Inventory Valuation, Clinic Admissions).\n2. **Apply Filters**: Set custom Start Date & End Date range filters.\n3. **Export Document**: Click **'Export to PDF'** or **'Export to Excel'** to download official reporting documents.",
      sender: "System Guide (AI)",
      type: "CHAT",
      recipient: username,
      actionLabel: "Open Reports Center",
      actionLink: "/reports",
      suggestedTopics: ["Export financial report", "Export attendance log", "Export inventory report"],
    };
  }

  // Default Fallback Guide
  return {
    content: `### 🧭 System Guide Assistance\n\nI processed your request regarding **'${queryText}'**.\n\nHere are the primary enterprise app flows available in the system:\n- **Hardware Assets**: Register & deploy devices to staff custodian.\n- **Clinic & Inpatient**: Patient registration, IPD Ward bed map, prescriptions.\n- **User Security & RBAC**: Account creation, status toggle, role management.\n- **Billing & POS**: Invoices, payment recording, POS terminal checkout.`,
    sender: "System Guide (AI)",
    type: "CHAT",
    recipient: username,
    actionLabel: "Explore Main Dashboard",
    actionLink: "/",
    suggestedTopics: ["Hardware Assets Flow", "Clinic & Inpatient Flow", "User Security & RBAC", "Billing & Payments"],
  };
};
