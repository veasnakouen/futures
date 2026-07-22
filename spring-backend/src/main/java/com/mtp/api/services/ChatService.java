package com.mtp.api.services;

import com.mtp.api.dto.ChatRequest;
import com.mtp.api.dto.ChatResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    public ChatResponse processMessage(ChatRequest request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return new ChatResponse(
                "Hello! I am your AI System Guide. I am trained on the complete MTP Microservices Ecosystem & Enterprise App Flows.\n\nHow can I assist you today?",
                "Explore Main Dashboard",
                "/",
                Arrays.asList("Hardware Assets Flow", "Clinic & Inpatient Flow", "User Security & RBAC", "Billing & Payments")
            );
        }

        String rawMsg = request.getMessage().trim();
        String msg = normalizeText(rawMsg);

        // NLU Domain Scoring Engine
        Map<String, Integer> scores = new HashMap<>();

        // 1. HARDWARE & ASSET MANAGEMENT
        int assetScore = countMatches(msg, "asset", "hardware", "laptop", "serial", "custodian", "deploy", "print tag", "inventory tag", "specs", "property label", "decommission");
        scores.put("ASSETS", assetScore * 3);

        // 2. CLINIC & HOSPITAL SYSTEM
        int clinicScore = countMatches(msg, "clinic", "patient", "doctor", "prescription", "ipd", "ward", "bed", "inpatient", "outpatient", "medical", "lab", "vitals", "allergy", "អ្នកជំងឺ", "គ្លីនិក");
        scores.put("CLINIC", clinicScore * 3);

        // 3. USER MANAGEMENT, ROLES & SECURITY (RBAC)
        int rbacScore = countMatches(msg, "user", "role", "permission", "rbac", "password", "security", "status", "active", "inactive", "create user", "reset password", "account");
        scores.put("RBAC", rbacScore * 3);

        // 4. TELEMETRY, AUDIT LOGS & DATA CLEANUP
        int telemetryScore = countMatches(msg, "telemetry", "audit", "access log", "ip", "geolocation", "browser", "device os", "clean", "data cleanup", "purge");
        scores.put("TELEMETRY", telemetryScore * 3);

        // 5. BILLING, INVOICES & PAYMENTS
        int billingScore = countMatches(msg, "billing", "invoice", "payment", "finance", "receipt", "cash", "bank transfer", "card", "aba pay", "revenue", "due date", "ទូទាត់");
        scores.put("BILLING", billingScore * 3);

        // 6. RETAIL POS & CHECKOUT
        int posScore = countMatches(msg, "pos", "point of sale", "checkout", "barcode", "product", "retail", "sale", "cashier", "receipt print", "cart");
        scores.put("POS", posScore * 3);

        // 7. INVENTORY LEDGER & WAREHOUSE
        int stockScore = countMatches(msg, "inventory", "stock", "warehouse", "sku", "threshold", "low stock", "reorder", "transfer stock");
        scores.put("INVENTORY", stockScore * 3);

        // 8. SCHOOL & EDUCATION MANAGEMENT
        int schoolScore = countMatches(msg, "school", "student", "teacher", "course", "enroll", "enrollment", "grade", "term", "academic", "branch", "សិស្ស");
        scores.put("SCHOOL", schoolScore * 3);

        // 9. HOTEL & HOSPITALITY
        int hotelScore = countMatches(msg, "hotel", "room", "booking", "guest", "reservation", "check in", "check out", "suite", "deluxe");
        scores.put("HOTEL", hotelScore * 3);

        // 10. HR, RECRUITMENT & BIOMETRICS
        int hrScore = countMatches(msg, "hr", "employee", "staff", "biometric", "fingerprint", "attendance", "recruitment", "candidate", "onboarding", "leave", "vacancies", "បុគ្គលិក");
        scores.put("HR", hrScore * 3);

        // 11. SYSTEM REPORTS & EXPORT
        int reportScore = countMatches(msg, "report", "export", "pdf", "excel", "template", "analytics", "download");
        scores.put("REPORTS", reportScore * 3);

        // 12. ARCHITECTURE & TECHNICAL TROUBLESHOOTING
        int archScore = countMatches(msg, "architecture", "microservices", "spring", "nextjs", "turbopack", "503", "gateway", "port", "cache", "eureka", "8080", "3000", "500");
        scores.put("ARCH", archScore * 3);

        // Determine highest scoring intent domain
        String bestDomain = "";
        int maxScore = 0;

        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            if (entry.getValue() > maxScore) {
                maxScore = entry.getValue();
                bestDomain = entry.getKey();
            }
        }

        // Return Domain-Specific App Flow Guides
        if (maxScore > 0) {
            switch (bestDomain) {
                case "ASSETS":
                    return new ChatResponse(
                        "### 💻 Hardware & Asset Management App Flow\n\n" +
                        "1. **Register Hardware Asset**: Go to **HR Management** (`/hr`) -> **Hardware Inventory** -> Click **'Register Asset'**. Fill in Model Name, Serial Number, Category (Laptop, Desktop, Smartphone, Monitor), Acquisition Date, Purchase Price, and Node ID -> Click **'Save'**.\n" +
                        "2. **Deploy to Staff**: Click the **'Deploy'** action on any `AVAILABLE` asset card -> Search staff custodian by Name/ID -> Select Department -> Click **'Confirm Deployment'**.\n" +
                        "3. **Inspect Specifications**: Click the **Eye icon** on an asset row to launch the **Asset Specifications Telemetry Inspector** (pulsating status, font-mono node ID, serial badge, custodian history).\n" +
                        "4. **Return Asset to Stock**: Click **'Process Return'** -> Confirm in the prompt -> Status reverts to `AVAILABLE`.\n" +
                        "5. **Print Property Label**: Click **'Print Tag'** to generate a printable QR/Barcode asset label.",
                        "Open Hardware Inventory",
                        "/hr",
                        Arrays.asList("How to deploy asset to staff?", "How to print property tag?", "Asset Specs Inspector")
                    );

                case "CLINIC":
                    return new ChatResponse(
                        "### 🏥 Clinic & Inpatient System App Flow\n\n" +
                        "1. **Register New Patient**: Navigate to **Clinic Management** (`/clinic`) -> **Patients** tab -> Click **'Register Patient'**. Fill out Medical History, Emergency Contact, DOB, and Allergies -> Click **'Save Patient'**.\n" +
                        "2. **IPD Inpatient Bed Allocation**: Go to **IPD Ward** tab -> View real-time bed map -> Click **'Admit Patient'** -> Select Ward/Bed, Doctor in charge, Vitals monitoring, and Admission reason.\n" +
                        "3. **Issue Prescriptions**: Go to **Prescriptions** tab -> Click **'New Prescription'** -> Select Patient ID, Attending Doctor, Medication items, Dosage, and Duration.\n" +
                        "4. **Lab Results**: Go to **Lab Results** tab -> Select Patient -> Record test parameters and update status (`Pending` -> `Completed`).",
                        "Open Clinic Management",
                        "/clinic",
                        Arrays.asList("How to admit inpatient bed?", "Issue new prescription", "Register clinic doctor")
                    );

                case "RBAC":
                    return new ChatResponse(
                        "### 🛡️ User Management & Security (RBAC) App Flow\n\n" +
                        "1. **Create Operator Account**: Go to **Admin Console** (`/admin`) -> **User Management** -> Click **'Create User'**. Enter Username, Email, Password, and initial Role (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `USER`) -> Click **'Save'**.\n" +
                        "2. **Row Hover Action Menu**: Hover mouse over any user row to smoothly reveal action icons:\n" +
                        "   - **Toggle Status**: Switch account status between `Active` and `Inactive` (with confirmation modal).\n" +
                        "   - **Reset Password**: Instantly update credentials.\n" +
                        "   - **Edit Roles**: Modify permission roles.\n" +
                        "3. **Granular RBAC Permissions**: Go to **Role & Permission Management** tab -> Click **'Create Custom Role'** -> Select permissions across services (Create, Read, Update, Delete).",
                        "Open User Management",
                        "/admin",
                        Arrays.asList("How to assign user roles?", "Reset user password", "Toggle account status")
                    );

                case "TELEMETRY":
                    return new ChatResponse(
                        "### 📊 Telemetry, Audit Logs & Data Cleanup App Flow\n\n" +
                        "1. **Inspect Access Telemetry**: Go to **Admin Console** (`/admin`) -> **Telemetry & Data Clean** tab.\n" +
                        "2. **Access Logs**: View real-time user activity, IP addresses, Geolocation tracking, Browser Agents, and Device OS types.\n" +
                        "3. **Automated Data Cleanup**: Click **'Run Data Cleanup'** -> Select retention threshold -> Confirm to purge obsolete audit entries.\n" +
                        "4. **Telemetry Analytics**: Inspect active operator sessions and API traffic charts.",
                        "Open Telemetry Dashboard",
                        "/admin",
                        Arrays.asList("Inspect user access logs", "Run data cleanup", "Track user IP & location")
                    );

                case "BILLING":
                    return new ChatResponse(
                        "### 💵 Billing, Invoices & Payments App Flow\n\n" +
                        "1. **Generate Invoice**: Go to **Billing & Finance** (`/billing`) -> **Invoices** tab -> Click **'Create Invoice'**. Select Client/Patient ID, Add line items (Service fee, product SKU, tax, discount), Set Due Date -> Click **'Generate'**.\n" +
                        "2. **Record Payment**: Go to **Payments** tab -> Click **'Record Payment'**. Select target Invoice ID, enter Amount Received, choose Payment Method (`Bank Transfer`, `Cash`, `Credit Card`, `ABA Pay`) -> Click **'Save Payment'**.\n" +
                        "3. **Export Official Receipt**: Click **'Download PDF Invoice'** on any ledger row.",
                        "Open Billing & Finance",
                        "/billing",
                        Arrays.asList("How to generate invoice?", "Record cash payment", "Download PDF receipt")
                    );

                case "POS":
                    return new ChatResponse(
                        "### 🛒 Retail POS & Order Checkout App Flow\n\n" +
                        "1. **POS Terminal Checkout**: Open **Retail & POS** (`/pos`) -> Scan item barcode or click product catalog cards -> Adjust item quantities -> Select Customer/Discount -> Click **'Checkout'**.\n" +
                        "2. **Payment & Receipt**: Select Payment Method -> Complete transaction -> Auto-generates receipt and decrements inventory ledger in real-time.\n" +
                        "3. **Sales History & Refunds**: Go to **Sales History** tab to review cashier shifts, daily revenue totals, and process refunds.",
                        "Open POS Terminal",
                        "/pos",
                        Arrays.asList("How to process POS sale?", "Manage retail products", "View sales history")
                    );

                case "INVENTORY":
                    return new ChatResponse(
                        "### 📦 Inventory Ledger & Stock App Flow\n\n" +
                        "1. **Add Inventory Item**: Open **Inventory & Stock** (`/inventory`) -> **Inventory Ledger** -> Click **'Add Item'**. Fill in SKU, Item Name, Storage Unit Price, Initial Quantity, and Minimum Threshold -> Click **'Save'**.\n" +
                        "2. **Low Stock Threshold Alert**: Items dropping below minimum threshold are automatically flagged with warning badges.\n" +
                        "3. **Stock Transfer**: Click **'Transfer Stock'** -> Select Source Warehouse Node, Destination Node, Quantity -> Click **'Execute Transfer'**.",
                        "Open Inventory Ledger",
                        "/inventory",
                        Arrays.asList("Add new inventory item", "Transfer stock between warehouses", "Low stock alerts")
                    );

                case "SCHOOL":
                    return new ChatResponse(
                        "### 🎓 School & Education Management App Flow\n\n" +
                        "1. **Register Student**: Go to **School Management** (`/school`) -> **Students** tab -> Click **'Add New Student'**. Fill in Student Name, Grade Level, Parent Contact, DOB -> Click **'Save'**.\n" +
                        "2. **Term Enrollment**: Go to **Enrollments** tab -> Click **'New Enrollment'** -> Link Student to Academic Term and Course.\n" +
                        "3. **Teacher & Course Management**: Go to **Teachers** / **Courses** tabs -> Assign subject leads, room schedules, and credit hours.",
                        "Open School Management",
                        "/school",
                        Arrays.asList("How to enroll student?", "Add new teacher", "Manage course catalog")
                    );

                case "HOTEL":
                    return new ChatResponse(
                        "### 🏨 Hospitality & Hotel Booking App Flow\n\n" +
                        "1. **New Reservation**: Navigate to **Hospitality & Hotel** (`/hotel`) -> **Bookings** tab -> Click **'New Booking'**. Pick Check-in/Check-out dates -> Select Room Tier (Deluxe, Suite, Standard) -> Enter Guest Name -> Click **'Confirm'**.\n" +
                        "2. **Guest Check-in / Check-out**: Hover over booking row -> Click **'Check In'** or **'Check Out'** to tally room charges and balance.",
                        "Open Hotel Management",
                        "/hotel",
                        Arrays.asList("Create room reservation", "Guest check-in", "View room rates")
                    );

                case "HR":
                    return new ChatResponse(
                        "### 👥 HR, Workforce & Biometric Fleet App Flow\n\n" +
                        "1. **Register Employee**: Go to **HR Management** (`/hr`) -> **Employees** tab -> Click **'Register Employee'**. Enter Profile info, Job Title, Department, Salary, Onboarding kit -> Click **'Save'**.\n" +
                        "2. **Department Hierarchy Node**: Go to **Structure** tab -> Click **'Add Hierarchy Node'** to map organizational divisions.\n" +
                        "3. **Biometric Devices**: Go to **Attendance** tab -> Click **'Biometric Devices'** to manage connected IP scanners -> Click **'Sync Attendance Logs'**.\n" +
                        "4. **Talent Onboarding Wizard**: Go to **Recruitment** -> Launch **Candidate Onboarding Wizard** stepper.",
                        "Open HR Management",
                        "/hr",
                        Arrays.asList("Register new employee", "Sync biometric devices", "Candidate onboarding wizard")
                    );

                case "REPORTS":
                    return new ChatResponse(
                        "### 📈 Reports & Enterprise Analytics App Flow\n\n" +
                        "1. **Select Report Template**: Go to **Reports & Analytics** (`/reports`) -> Select template (Financial Summary, Student Attendance, Inventory Valuation, Clinic Admissions).\n" +
                        "2. **Apply Filters**: Set custom Start Date & End Date range filters.\n" +
                        "3. **Export Document**: Click **'Export to PDF'** or **'Export to Excel'** to download official reporting documents.",
                        "Open Reports Center",
                        "/reports",
                        Arrays.asList("Export financial report", "Export attendance log", "Export inventory report")
                    );

                case "ARCH":
                    return new ChatResponse(
                        "### ⚡ MTP Architecture & Technical Stack\n\n" +
                        "1. **System Topology**: Microservices ecosystem via Spring Cloud API Gateway (port `8080`/`8088`), Eureka Discovery (`mtp-discovery-server`), and Next.js Turbopack (`3000`).\n" +
                        "2. **Backend Microservices**: `mtp-auth-service`, `mtp-billing-service`, `mtp-clinic-service`, `mtp-hotel-service`, `mtp-pos-service`, `mtp-report-service`, `mtp-school-service`, `mtp-stock-service`, `spring-backend`.\n" +
                        "3. **Common Diagnostics**:\n" +
                        "   - **503 Service Unavailable**: Start downstream microservice in terminal.\n" +
                        "   - **EADDRINUSE :::3000**: Next.js is already running in a background terminal tab.\n" +
                        "   - **Turbopack infinite compile**: Stop server, delete `.next` cache directory, and restart.",
                        "View Architecture Notes",
                        "/admin",
                        Arrays.asList("How to fix 503 service error?", "Next.js port conflict resolution", "Turbopack cache fix")
                    );
            }
        }

        // DEFAULT GREETING & GENERAL OVERVIEW
        if (msg.contains("hi") || msg.contains("hello") || msg.contains("hey") || msg.contains("guide") || msg.contains("help") || msg.contains("flow") || msg.contains("doc")) {
            return new ChatResponse(
                "Hello! I am your AI System Guide. I contain complete documentation for the MTP Microservices Ecosystem & Enterprise App Flows.\n\n" +
                "You can ask me about:\n" +
                "- **Hardware Assets**: Registration, staff deployment, property tag printing.\n" +
                "- **Clinic & Patients**: Patient registration, IPD Ward bed map, prescriptions.\n" +
                "- **User Security & RBAC**: User creation, status toggle, role assignment.\n" +
                "- **Billing & POS**: Invoices, payment recording, POS checkout.\n" +
                "- **School & HR**: Student enrollment, biometric attendance, talent onboarding.",
                "Explore Main Dashboard",
                "/",
                Arrays.asList("Hardware Assets Flow", "Clinic & Inpatient Flow", "User Security & RBAC", "Billing & Payments")
            );
        }

        // FALLBACK WITH INTELLIGENT DOMAIN SUGGESTIONS
        return new ChatResponse(
            "I received your inquiry regarding **'" + rawMsg + "'**.\n\n" +
            "I can guide you step-by-step through any app flow in the system. Which domain would you like to explore?",
            "Explore Main Dashboard",
            "/",
            Arrays.asList("Hardware Assets Flow", "Clinic & Inpatients", "User Security & RBAC", "Billing & POS")
        );
    }

    private String normalizeText(String input) {
        if (input == null) return "";
        String s = input.toLowerCase();
        
        // Typo replacements & stem normalizations
        s = s.replaceAll("\\bpaint\\b|\\bpaitent\\b|\\bpatiet\\b|\\bpatien\\b", "patient");
        s = s.replaceAll("\\bguid\\b|\\bgide\\b|\\bguie\\b", "guide");
        s = s.replaceAll("\\bclnic\\b|\\bclinik\\b|\\bclinck\\b", "clinic");
        s = s.replaceAll("\\bassest\\b|\\bassets\\b|\\bharware\\b|\\blaptap\\b", "hardware");
        s = s.replaceAll("\\bpament\\b|\\bpaymnt\\b|\\binvois\\b|\\binvoic\\b", "payment");
        s = s.replaceAll("\\bdoktor\\b|\\bdoctar\\b", "doctor");
        s = s.replaceAll("\\bskool\\b|\\bschol\\b|\\bstydent\\b", "student");
        s = s.replaceAll("\\bhotle\\b|\\bhotal\\b|\\bgues\\b", "hotel");
        s = s.replaceAll("\\busr\\b|\\bpasword\\b|\\brols\\b", "user");
        
        return s;
    }

    private int countMatches(String input, String... keywords) {
        int count = 0;
        for (String kw : keywords) {
            if (input.contains(kw)) {
                count++;
            }
        }
        return count;
    }
}
