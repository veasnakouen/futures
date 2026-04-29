# Case Management - Edit and Delete Fixes

## Problems Fixed

### Problem 1: Delete Works But Table Doesn't Refresh
**Root Cause:** The `CaseDelete` function was trying to get the client ID from `getCurrentCaseClientId()` which looks at `$('#caseModal #clientId')`, but when deleting from the case table in the client modal, the case modal might not be open, so this returns 0 or undefined.

**Fix:** Changed to get client ID from `$('#clientModal #id')` which is always available when viewing a client.

### Problem 2: Edit Button Closes the Modal
**Root Cause:** Two issues:
1. The Edit link used `href='#'` which triggers navigation and can cause Bootstrap modal to close
2. The `show.bs.modal` event handler was resetting the form EVERY time the modal opened, including when opening for Edit (clearing the data that was just loaded)

**Fix:**
1. Changed links to use `href='javascript:void(0);'` with `return false;` to prevent navigation
2. Added check in `show.bs.modal` to only reset form if not in edit mode (checking if `caseId` is empty)
3. Moved `$('#caseModal').modal('show')` to AFTER populating form fields in `CaseEdit` function

## Changes Made

### 1. Fixed Edit/Delete Links in DataTable
**File:** `case.js` - Line ~180

**Before:**
```javascript
return "<a href='#' onclick='CaseEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='CaseDelete(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
```

**After:**
```javascript
return "<a href='javascript:void(0);' onclick='CaseEdit(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='javascript:void(0);' onclick='CaseDelete(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</a>";
```

**Why:**
- `href='javascript:void(0);'` prevents any navigation
- `return false;` prevents the default click behavior
- Changed Delete icon to trash icon for better UX

### 2. Fixed CaseDelete Function
**File:** `case.js` - Line ~377

**Before:**
```javascript
function CaseDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/cases/" + id,
                method: "DELETE",
                success: function () {
                    var currentClientId = getCurrentCaseClientId();
                    if (currentClientId > 0 && $('#caseTable').length) {
                        RefreshCasesTable(currentClientId);
                    } else if (typeof tableCaseManagement !== 'undefined' && $.fn.DataTable.isDataTable('#caseListTable')) {
                        tableCaseManagement.ajax.reload();
                    }
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This case is being used.", "Server Response");
                }
            });
        }
    });
}
```

**After:**
```javascript
function CaseDelete(id) {
    bootbox.confirm("Are you sure you want to delete this case?", function (result) {
        if (result) {
            // Get client ID from the main client modal
            var currentClientId = parseInt($('#clientModal #id').val()) || getCurrentCaseClientId();
            console.log('Deleting case ID:', id, 'for client ID:', currentClientId);

            $.ajax({
                url: "/api/cases/" + id,
                method: "DELETE",
                success: function () {
                    console.log('Case deleted successfully. Refreshing table...');

                    // Refresh the case table in the client modal
                    if (currentClientId > 0) {
                        RefreshCasesTable(currentClientId);
                        console.log('Table refreshed for client:', currentClientId);
                    }

                    // Also refresh case management table if it exists
                    if (typeof tableCaseManagement !== 'undefined' && $.fn.DataTable.isDataTable('#caseListTable')) {
                        tableCaseManagement.ajax.reload(null, false);
                    }

                    toastr.success("Case deleted successfully.", "Success");
                },
                error: function (xhr) {
                    console.error('Delete case error:', xhr);
                    toastr.error("Cannot delete this case. It may be in use.", "Error");
                }
            });
        }
    });
}
```

**Why:**
- Gets client ID from `$('#clientModal #id')` which is always available
- Added console logging for debugging
- Better error handling with XHR object
- More descriptive messages

### 3. Fixed CaseEdit Function
**File:** `case.js` - Line ~320

**Before:**
```javascript
function CaseEdit(id) {
    $('#openDate').css('border-color', '#cccccc');
    $('#caseSubject').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/cases/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#caseModal').modal('show');  // ← Showed modal FIRST
            $('#caseId').val(result.id);
            // ... populate fields ...
            EnabledCases();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}
```

**After:**
```javascript
function CaseEdit(id) {
    console.log('CaseEdit called with ID:', id);

    $('#openDate').css('border-color', '#cccccc');
    $('#caseSubject').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/cases/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            console.log('Case data loaded:', result);

            // Populate the case modal form fields FIRST
            $('#caseId').val(result.id);
            $('#caseModal #clientId').val(result.clientId);
            $('#caseWorkerIds').val(result.caseWorkerId);
            $('#priority').val(result.priority);
            $('#serviceType').val(result.serviceType);
            $('#caseSubject').val(result.subject);
            $('#caseDescription').val(result.description);
            $('#caseStatus').val(result.status);
            refreshCaseSelectPickers();

            // Format dates...
            // ...

            // Set button to Update mode
            document.getElementById('btnCasesAction').innerText = "Update";
            EnabledCases();

            // Show the case modal AFTER populating fields
            $('#caseModal').modal('show');
            console.log('Case modal opened for editing');
        },
        error: function (xhr) {
            console.error('CaseEdit error:', xhr);
            toastr.error("Failed to load case data.", "Error");
        }
    });
    return false;
}
```

**Why:**
- Populates form fields BEFORE showing modal
- Added console logging for debugging
- Better error handling

### 4. Fixed Modal Reset Logic
**File:** `case.js` - Line ~7

**Before:**
```javascript
$('#caseModal').on('show.bs.modal', function () {
    var currentClientId = parseInt($('#clientModal #id').val()) || parseInt(window.currentClientId) || 0;
    if (currentClientId) {
        $('#caseModal #clientId').val(currentClientId);
        refreshCaseSelectPickers();
    }
    if ($('#clientModal #id').val() != '') {
        DisabledCases();
        ClearCases();  // ← Always cleared!
        // ...
        document.getElementById('btnCasesAction').innerText = "Add New";
        // ...
    }
});
```

**After:**
```javascript
$('#caseModal').on('show.bs.modal', function () {
    var currentClientId = parseInt($('#clientModal #id').val()) || parseInt(window.currentClientId) || 0;
    if (currentClientId) {
        $('#caseModal #clientId').val(currentClientId);
        refreshCaseSelectPickers();
    }

    // Only reset form if we're not in edit mode (caseId is empty)
    if (!$('#caseId').val() || $('#caseId').val() === '') {
        if ($('#clientModal #id').val() != '') {
            DisabledCases();
            ClearCases();
            $('#openDate').css('border-color', '#cccccc');
            $('#caseSubject').css('border-color', '#cccccc');
            document.getElementById('btnCasesAction').innerText = "Add New";
            $("#caseModal #clientId").prop('disabled', true);
        }
        else {
            $("#caseModal #clientId").prop('disabled', false);
        }
    }
});
```

**Why:**
- Checks if `caseId` is empty before resetting
- Prevents clearing form data when opening for Edit
- Allows "Add New" mode to still work normally

## Testing Instructions

### Test Delete Function
1. Open a client modal
2. Go to Case Management tab
3. Click **Delete** button on any case
4. Confirm deletion
5. **Expected:** Table refreshes and case is removed
6. **Check Console:** Should see "Case deleted successfully. Refreshing table..."

### Test Edit Function
1. Open a client modal
2. Go to Case Management tab
3. Click **Edit** button on any case
4. **Expected:** Case modal opens with all fields populated
5. **Expected:** Button shows "Update" (not "Add New")
6. Modify some fields
7. Click "Update"
8. **Expected:** Case is updated and modal closes
9. **Expected:** Case table shows updated data

### Test Add New Function
1. Open a client modal
2. Go to Case Management tab
3. Click "+ Add New" button
4. **Expected:** Case modal opens with empty form
5. **Expected:** Button shows "Save changes"
6. Fill in the form
7. Click "Save changes"
8. **Expected:** Case is saved and modal closes
9. **Expected:** Case table shows new case

## Debugging

If issues persist, check the browser console (F12) for:

### On Delete:
```
Deleting case ID: 8 for client ID: 123
Case deleted successfully. Refreshing table...
Table refreshed for client: 123
```

### On Edit:
```
CaseEdit called with ID: 8
Case data loaded: {id: 8, clientId: 123, ...}
Case modal opened for editing
```

## Summary

✅ **Delete** now properly refreshes the table
✅ **Edit** now opens the modal with populated data
✅ **Add New** still works as expected
✅ Console logging added for debugging
✅ Better error handling throughout

---

**Last Updated:** 2026-04-05
**Status:** Fixed and ready for testing
