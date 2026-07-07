package com.mtp.api.services;

import com.mtp.api.dto.ChatRequest;
import com.mtp.api.dto.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public ChatResponse processMessage(ChatRequest request) {
        if (request == null || request.getMessage() == null) {
            return new ChatResponse("How can I help you today?");
        }
        
        String msg = request.getMessage().toLowerCase();
        String response;

        if (msg.contains("payment") || msg.contains("invoice") || msg.contains("billing")) {
            response = "To manage payments or invoices:\n1. Open the **Billing & Finance** module from the main sidebar.\n2. To record a payment, go to the **Payments** tab and click the blue **'Record Payment'** button in the top right.\n3. Select the associated Invoice ID, enter the amount received, and choose the payment method (e.g., Bank Transfer, Cash).\n4. Click **Save Payment**.";
        } else if (msg.contains("add student") || msg.contains("new student")) {
            response = "To add a new student:\n1. Navigate to the **School Management** module.\n2. Select the **Students** tab.\n3. Click the **'Add New Student'** button.\n4. Fill in the required details including Name, Grade, and Parent Contact Info.\n5. Click **Save**. The student will now appear in your active roster.";
        } else if (msg.contains("student") || msg.contains("school") || msg.contains("teacher") || msg.contains("course") || msg.contains("enroll")) {
            response = "Welcome to School Management! Here are some common tasks:\n- **To enroll a student:** Go to the Enrollments tab and click 'New Enrollment'.\n- **To manage teachers:** Go to the Teachers tab to assign subjects and schedules.\n- **To add a student:** Go to the Students tab and click 'Add New Student'.";
        } else if (msg.contains("clinic") || msg.contains("patient") || msg.contains("prescription") || msg.contains("doctor") || msg.contains("lab")) {
            response = "To register a patient in the Clinic:\n1. Visit the **Clinic Management** module.\n2. Under the **Patients** tab, click **'Register Patient'**.\n3. Fill out their medical history and emergency contact details.\n4. To issue a prescription, visit the **Prescriptions** tab and link it to an existing Patient ID.";
        } else if (msg.contains("hotel") || msg.contains("room") || msg.contains("booking") || msg.contains("guest")) {
            response = "To create a Hotel Booking:\n1. Navigate to the **Hospitality & Hotel** module.\n2. Select the **Bookings** tab and click **'New Booking'**.\n3. Select the dates, choose an available room, and enter the Guest details.\n4. Confirm the booking to lock the room schedule.";
        } else if (msg.contains("inventory") || msg.contains("stock") || msg.contains("item") || msg.contains("warehouse")) {
            response = "To add new inventory:\n1. Go to the **Retail & POS** or **Inventory** module.\n2. Under the **Inventory Ledger**, click **'Add New Item'**.\n3. Provide the SKU, Item Name, Quantity, and Minimum Threshold.\n4. Click Save. Items that drop below their minimum threshold will automatically be flagged as 'Low Stock'.";
        } else if (msg.contains("report") || msg.contains("export") || msg.contains("dashboard")) {
            response = "To export a report:\n1. Navigate to the **System & Core** -> **Reports** module.\n2. Select your desired report template (e.g., Financial Summary, Student Attendance).\n3. Set the date range filters.\n4. Click **'Export to Excel'** or **'Export to PDF'**.";
        } else if (msg.contains("hi") || msg.contains("hello") || msg.contains("help") || msg.contains("guide")) {
            response = "Hello! I am your AI System Guide. I can provide detailed, step-by-step instructions on how to use any module in the system. Try asking me:\n- 'How to add a new student?'\n- 'How to record a payment?'\n- 'How to add inventory?'";
        } else {
            response = "I'm not exactly sure how to help with that yet. Could you specify which module you are trying to use? I am fully trained on Billing, Clinic, Hotel, School, and Inventory workflows!";
        }

        return new ChatResponse(response);
    }
}
