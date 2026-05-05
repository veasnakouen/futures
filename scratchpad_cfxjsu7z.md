# Task: Debug Employee Field Saving Issue

## Plan
1. [x] Navigate to http://localhost:3000/employees
2. [x] Click "Edit" on an employee.
3. [x] Enter values for:
    - First Name (KH): នាមខ្លួនតេស្ត
    - Last Name (KH): នាមត្រកូលតេស្ត
    - Place of Birth: Phnom Penh
    - Identity Card Number: 123456789
    - Home Address: Street 123, Phnom Penh
4. [x] Open Network tab in devtools. (Captured via JS interception)
5. [x] Click "Synchronize Record".
6. [x] Inspect PUT request to `/api/employees/{id}`.
    - Check Request Body (Payload): Captured! Many fields are empty.
    - Check Response Status: 200 OK.
7. [ ] Report findings and take screenshot.

### Captured Payload
```json
{
  "address": "",
  "firstNameKhmer": "",
  "lastNameKhmer": "",
  "placeOfBirth": "",
  "identityCardNumber": "",
  "nationality": "Khmer",
  ...
}
```
Findings: The payload sent to the server has empty strings for `firstNameKhmer`, `lastNameKhmer`, `placeOfBirth`, `identityCardNumber`, and `address`, even though they were filled in the UI. This confirms the issue is on the frontend (data not being collected from the form fields).

### Findings
- The modal fields are accessible via JavaScript by searching for labels and then finding the nearest input/textarea.
- "Home Address" is a textarea.
- "Identity Card Number" and "Place of Birth" are regular inputs.
