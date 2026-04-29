
$(document).ready(function () {
    if ($.fn.dataTable && $.fn.dataTable.ext) {
        $.fn.dataTable.ext.errMode = 'none';
    }

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
});

var tableCases = null;

function refreshCaseSelectPickers() {
    if ($.fn.selectpicker) {
        $('#caseModal .selectpicker').selectpicker('refresh');
    }
}

function getCaseTableInstance() {
    if ($.fn.DataTable && $.fn.DataTable.isDataTable('#caseTable')) {
        return $('#caseTable').DataTable();
    }

    return null;
}

function clearCaseTable() {
    if (!$('#caseTable').length) {
        return;
    }

    var table = getCaseTableInstance();
    if (table) {
        table.clear().draw();
    }
}

function getCurrentCaseClientId() {
    return parseInt($('#caseModal #clientId').val()) || parseInt($('#clientModal #id').val()) || parseInt(window.currentClientId) || 0;
}

function RefreshCasesTable(clientId) {
    if (!$('#caseTable').length) {
        return;
    }

    if (!clientId || clientId <= 0) {
        clearCaseTable();
        return;
    }

    GetCaseByClientId(clientId);
}

function GetCaseByClientId(id) {
    console.log('===== GetCaseByClientId START =====');
    console.log('Client ID:', id);
    console.log('Type of id:', typeof id);
    console.log('ID > 0:', id > 0);
    console.log('#caseTable exists:', $('#caseTable').length > 0);

    if (!id || id <= 0) {
        console.log('Invalid client ID, clearing table');
        clearCaseTable();
        console.log('===== GetCaseByClientId END (invalid ID) =====');
        return;
    }

    var casesUrl = '/api/cases?clientId=' + id;
    console.log('Cases API URL:', casesUrl);

    var existingTable = getCaseTableInstance();
    console.log('Existing DataTable instance:', existingTable ? 'YES' : 'NO');

    if (existingTable) {
        console.log('Reloading existing DataTable...');
        existingTable.ajax.url(casesUrl).load();
        tableCases = existingTable;
        console.log('===== GetCaseByClientId END (reloaded) =====');
        return;
    }

    console.log('Creating new DataTable...');
    tableCases = $('#caseTable').DataTable({
        ajax: {
            url: casesUrl,
            dataSrc: function(json) {
                console.log('===== AJAX dataSrc called =====');
                console.log('Response type:', typeof json);
                console.log('Is array:', Array.isArray(json));
                console.log('Response length:', Array.isArray(json) ? json.length : 'N/A');
                console.log('Response data:', json);
                
                if (json && Array.isArray(json) && json.length > 0) {
                    console.log('First case:', json[0]);
                } else if (!json || json.length === 0) {
                    console.warn('WARNING: No cases returned from API!');
                    console.warn('Expected cases for client ID:', id);
                    console.warn('API URL:', casesUrl);
                }
                
                console.log('===== AJAX dataSrc END =====');
                return json || [];
            },
            error: function(xhr, error, thrown) {
                console.error('===== AJAX ERROR =====');
                console.error('Error:', error);
                console.error('Thrown:', thrown);
                console.error('Status:', xhr.status);
                console.error('Response:', xhr.responseText);
                console.error('===== AJAX ERROR END =====');
            }
        },
        columns: [
            {
                data: "id"
            },
            {
                data: function (data) {
                    var first = data.client && data.client.firstName ? data.client.firstName : '';
                    var last = data.client && data.client.lastName ? data.client.lastName : '';
                    var full = (first + ' ' + last).trim();
                    console.log('Column render - Client name:', full, 'from data:', data);
                    return full || 'N/A';
                }
            },
            {
                data: function (data) {
                    return data.caseWorker && data.caseWorker.name ? data.caseWorker.name : 'N/A';
                }
            },
            {
                data: "serviceType"
            },
            {
                data: "openDate",
                render: function (data) {
                    if (!data) return '';
                    var date = new Date(data);
                    if (isNaN(date.getTime())) return '';
                    var month = date.getMonth() + 1;
                    return month + "-" + date.getDate() + "-" + date.getFullYear();
                }
            },
            {
                data: "closeDate",
                render: function (data) {
                    if (!data) return '';
                    var date = new Date(data);
                    if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return '';
                    var month = date.getMonth() + 1;
                    return month + "-" + date.getDate() + "-" + date.getFullYear();
                }
            },
            {
                data: "status"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='javascript:void(0);' onclick='CaseEdit(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='javascript:void(0);' onclick='CaseDelete(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</a>";
                }
            }
        ],
        destroy: true,
        order: [[0, "desc"]],
        initComplete: function(settings, json) {
            console.log('===== DataTable initComplete =====');
            console.log('Table initialized successfully');
            console.log('Number of rows:', tableCases ? tableCases.rows().count() : 'table not defined');
            console.log('===== DataTable initComplete END =====');
        }
    });
    console.log('===== GetCaseByClientId END (created new) =====');
}

// Cases Action
function CaseAction() {
    var action = '';
    action = document.getElementById('btnCasesAction').innerText;
    if (action === "Save changes") {
        if ($('#openDate').val().trim() === "") {
            $('#openDate').css('border-color', 'red');
            $('#openDate').focus();
        }
        else {
            $('#openDate').css('border-color', '#cccccc');

            if ($('#caseSubject').val().trim() === "") {
                $('#caseSubject').css('border-color', 'red');
                $('#caseSubject').focus();
            }
            else {
                $('#caseSubject').css('border-color', '#cccccc');

                var currentClientId = getCurrentCaseClientId();
                if (!currentClientId) {
                    toastr.error("Please select client.", "Server Response");
                    return;
                }
                var openRaw = $('#openDate').val();
                var closeRaw = $('#closeDate').val();
                var data = {
                    ClientId: currentClientId,
                    CaseWorkerId: parseInt($('#caseWorkerIds').val()),
                    Priority: $('#priority').val(),
                    ServiceType: $('#serviceType').val(),
                    OpenDate: openRaw ? new Date(openRaw).toISOString() : null,
                    CloseDate: closeRaw ? new Date(closeRaw).toISOString() : null,
                    Subject: $('#caseSubject').val(),
                    Description: $('#caseDescription').val(),
                    Status: $('#caseStatus').val()
                };
                $.ajax({
                    url: "/api/cases",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("New case has been saved to database.", "Server Response");

                        var currentClientId = parseInt(result.clientId) || getCurrentCaseClientId();
                        RefreshCasesTable(currentClientId);

                        if (typeof tableCaseManagement !== 'undefined' && $.fn.DataTable.isDataTable('#caseListTable')) {
                            tableCaseManagement.ajax.reload(null, false);
                        }
                        
                        DisabledCases();
                        document.getElementById('btnCasesAction').innerText = "Add New";
                        ClearCases();
                        $('#caseModal').modal('hide');
                    },
                    error: function (errormessage) {
                        toastr.error("Failed to save case. Please check all fields and try again.", "Server Response");
                        document.getElementById('btnCasesAction').innerText = "Save changes";
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        EnabledCases();
        document.getElementById('btnCasesAction').innerText = "Save changes";
        ClearCases();
        $('#referralSourceName').focus();
    }
    else if (action === "Update") {
        $('#openDate').css('border-color', '#cccccc');
        $('#caseSubject').css('border-color', '#cccccc');

        var currentClientId2 = getCurrentCaseClientId();
        if (!currentClientId2) {
            toastr.error("Please select client.", "Server Response");
            return;
        }
        var openRaw2 = $('#openDate').val();
        var closeRaw2 = $('#closeDate').val();
        var data = {
            Id: parseInt($('#caseId').val()),
            ClientId: currentClientId2,
            CaseWorkerId: parseInt($('#caseWorkerIds').val()),
            Priority: $('#priority').val(),
            ServiceType: $('#serviceType').val(),
            OpenDate: openRaw2 ? new Date(openRaw2).toISOString() : null,
            CloseDate: closeRaw2 ? new Date(closeRaw2).toISOString() : null,
            Subject: $('#caseSubject').val(),
            Description: $('#caseDescription').val(),
            Status: $('#caseStatus').val()
        };
        $.ajax({
            url: "/api/cases/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Case has been updated.", "Server Response");
                var currentClientId = parseInt(result.clientId) || getCurrentCaseClientId();
                RefreshCasesTable(currentClientId);

                if (typeof tableCaseManagement !== 'undefined' && $.fn.DataTable.isDataTable('#caseListTable')) {
                    tableCaseManagement.ajax.reload(null, false);
                }
                
                DisabledCases();
                document.getElementById('btnCasesAction').innerText = "Add New";
                ClearCases();
                $('#caseModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("Failed to update case. Please check all fields and try again.", "Server Response");
                document.getElementById('btnCasesAction').innerText = "Update";
            }
        });
    }
}

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

            // Populate the case modal form fields
            $('#caseId').val(result.id);
            $('#caseModal #clientId').val(result.clientId);
            $('#caseWorkerIds').val(result.caseWorkerId);
            $('#priority').val(result.priority);
            $('#serviceType').val(result.serviceType);
            $('#caseSubject').val(result.subject);
            $('#caseDescription').val(result.description);
            $('#caseStatus').val(result.status);
            refreshCaseSelectPickers();

            // Format open date
            var openDate = new Date(result.openDate);
            var dd = openDate.getDate();
            var mm = openDate.getMonth() + 1; //January is 0!
            var yyyy = openDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            openDate = mm + '/' + dd + '/' + yyyy;
            $('#openDate').val(openDate);

            // Format close date if it exists
            var closeDate = result.closeDate ? new Date(result.closeDate) : null;
            if (closeDate && !isNaN(closeDate.getTime()) && closeDate.getFullYear() > 1970) {
                var dd2 = closeDate.getDate();
                var mm2 = closeDate.getMonth() + 1;
                var yyyy2 = closeDate.getFullYear();
                if (dd2 < 10) dd2 = '0' + dd2;
                if (mm2 < 10) mm2 = '0' + mm2;
                $('#closeDate').val(mm2 + '/' + dd2 + '/' + yyyy2);
            } else {
                $('#closeDate').val('');
            }

            // Set button to Update mode
            document.getElementById('btnCasesAction').innerText = "Update";
            EnabledCases();

            // Show the case modal (on top of client modal)
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

function EnabledCases() {
    document.getElementById('clientId').disabled = false;
    document.getElementById('caseWorkerIds').disabled = false;
    document.getElementById('priority').disabled = false;
    document.getElementById('serviceType').disabled = false;
    document.getElementById('openDate').disabled = false;
    document.getElementById('closeDate').disabled = false;
    document.getElementById('caseSubject').disabled = false;
    document.getElementById('caseDescription').disabled = false;
    document.getElementById('caseStatus').disabled = false;
}

function DisabledCases() {
    document.getElementById('caseWorkerIds').disabled = true;
    document.getElementById('priority').disabled = true;
    document.getElementById('serviceType').disabled = true;
    document.getElementById('openDate').disabled = true;
    document.getElementById('closeDate').disabled = true;
    document.getElementById('caseSubject').disabled = true;
    document.getElementById('caseDescription').disabled = true;
    document.getElementById('caseStatus').disabled = true;
}

function ClearCases() {
    $('#openDate').val('');
    $('#closeDate').val('');
    $('#caseSubject').val('');
    $('#caseDescription').val('');
}

