$(document).ready(function () {

    // First Page Load: Show All Cases
    GetCaseManagementByCaseWorker("all", "New Case");
    document.getElementById('displayCaseStatus').innerHTML = "New Case";
    
    $('#caseModal').on('show.bs.modal', function () {
        $('#clientId option[value="' + $('#id').val() + '"]').attr("selected", "selected");
        if ($('#id').val() != '') {

            DisabledCases();

            ClearCases();

            $('#openDate').css('border-color', '#cccccc');
            $('#caseSubject').css('border-color', '#cccccc');

            document.getElementById('btnCasesAction').innerText = "Add New";

            $("#clientId").prop('disabled', true);
        }
        else {
            $("#clientId").prop('disabled', false);
        }
    });

});

// Case Management

var tableCaseManagement = [];

function GetCaseManagementByCaseWorker(caseWorkerId, status) {
    tableCaseManagement = $('#caseListTable').DataTable({
        ajax: {
            url: "/api/cases/bycaseworker?caseWorkerId=" + caseWorkerId + "&status=" + encodeURIComponent(status),
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: function (data) {
                    return data.client.firstName + " " + data.client.lastName;
                }
            },
            {
                data: "client.contactPhone"
            },
            {
                //data: "caseWorker.name "
                data: function (data) {
                    return data.caseWorker.program + " |  " + data.caseWorker.name;
                }
            },
            {
                data: "priority"
            },
            {
                data: "serviceType"
            },
            {
                data: "subject"
            },
            {
                data: "openDate",
                render: function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                }
            },
            {
                data: "closeDate",
                render: function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return date.getFullYear() == '1970' ? '' : (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                }
            },
            {
                data: "status"
            },
            {
                data: "id",
                render: function (data) {
                    var status = document.getElementById('displayCaseStatus').innerHTML;
                    if (status == 'New Case')
                    {
                        return "<a href='#' onclick='OpenCase(" + data + ");'><i class='fa fa-share'></i> Open</a>" + " | " + "<a href='#' onclick='CaseEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='CaseDelete(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
                    }
                    else if (status == 'Opened Case')
                    {
                        return "<a href='#' onclick='InProgressCase(" + data + ");'><i class='fa fa-rotate'></i> In Progress</a>" + " | " + "<a href='#' onclick='HoldCase(" + data + ");'><i class='fa fa-stop'></i> Hold</a>" + " | " + "<a href='#' onclick='CaseEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>";
                    }
                    else if (status == 'In Progress Case') {
                        return "<a href='#' onclick='CloseCase(" + data + ");'><i class='fa fa-circle-check'></i> Close</a>" + " | " + "<a href='#' onclick='HoldCase(" + data + ");'><i class='fa fa-stop'></i> Hold</a>" + " | " + "<a href='#' onclick='CaseEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>";
                    }
                    else if (status == 'Hold Case') {
                        return "<a href='#' onclick='InProgressCase(" + data + ");'><i class='fa fa-share'></i> In Progress</a>" + " | " + "<a href='#' onclick='CaseEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>";
                    }
                    else if (status == 'Closed Case') {
                        return "<a href='#' onclick='ReopenCase(" + data + ");'><i class='fa fa-repeat'></i> Reopen</a>";
                    }
                }
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

function ShowOpenedCase()
{
    var caseWorkerId = $('#displayCaseWorker').val();
    if (caseWorkerId != "--Show All Cases--") {
        GetCaseManagementByCaseWorker(caseWorkerId, "Opened Case");
        document.getElementById('displayCaseStatus').innerHTML = "Opened Case";
    }
    else {
        GetCaseManagementByCaseWorker("all", "Opened Case");
        document.getElementById('displayCaseStatus').innerHTML = "Opened Case";
    }
}

function ShowInProgressCase()
{
    var caseWorkerId = $('#displayCaseWorker').val();
    if (caseWorkerId != "--Show All Cases--") {
        GetCaseManagementByCaseWorker(caseWorkerId, "In Progress Case");
        document.getElementById('displayCaseStatus').innerHTML = "In Progress Case";
    }
    else {
        GetCaseManagementByCaseWorker("all", "In Progress Case");
        document.getElementById('displayCaseStatus').innerHTML = "In Progress Case";
    }
}

function ShowHoldCase()
{
    var caseWorkerId = $('#displayCaseWorker').val();
    if (caseWorkerId != "--Show All Cases--") {
        GetCaseManagementByCaseWorker(caseWorkerId, "Hold Case");
        document.getElementById('displayCaseStatus').innerHTML = "Hold Case";
    }
    else {
        GetCaseManagementByCaseWorker("all", "Hold Case");
        document.getElementById('displayCaseStatus').innerHTML = "Hold Case";
    }
}

function ShowClosedCase()
{
    var caseWorkerId = $('#displayCaseWorker').val();
    if (caseWorkerId != "--Show All Cases--") {
        GetCaseManagementByCaseWorker(caseWorkerId, "Closed Case");
        document.getElementById('displayCaseStatus').innerHTML = "Closed Case";
    }
    else {
        GetCaseManagementByCaseWorker("all", "Closed Case");
        document.getElementById('displayCaseStatus').innerHTML = "Closed Case";
    }
}

function ShowNewCase()
{
    var caseWorkerId = $('#displayCaseWorker').val();
    if (caseWorkerId != "--Show All Cases--") {
        GetCaseManagementByCaseWorker(caseWorkerId, "New Case");
        document.getElementById('displayCaseStatus').innerHTML = "New Case";
    }
    else {
        GetCaseManagementByCaseWorker("all", "New Case");
        document.getElementById('displayCaseStatus').innerHTML = "New Case";
    }
}

function OpenCase(id)
{
    bootbox.confirm("Do you want to open this case?", function (result) {
        if (result) {
            var data = {
                status: 'Opened Case'
            };
            $.ajax({
                url: "/api/cases/" + id,
                data: JSON.stringify(data),
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Case has been opened.", "Server Response");
                    tableCaseManagement.ajax.reload();
                },
                error: function (errormessage) {
                    toastr.error("Unexpected problem.", "Server Response");
                }
            });
        }
    });
}

function InProgressCase(id) {
    bootbox.confirm("Do you want to make it in progress?", function (result) {
        if (result) {
            var data = {
                status: 'In Progress Case'
            };
            $.ajax({
                url: "/api/cases/" + id,
                data: JSON.stringify(data),
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Case has been assigned to in progress status.", "Server Response");
                    tableCaseManagement.ajax.reload();
                },
                error: function (errormessage) {
                    toastr.error("Unexpected problem.", "Server Response");
                }
            });
        }
    });
}

function HoldCase(id) {
    bootbox.confirm("Do you want to hold this case?", function (result) {
        if (result) {
            var data = {
                status: 'Hold Case'
            };
            $.ajax({
                url: "/api/cases/" + id,
                data: JSON.stringify(data),
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Case has been holded.", "Server Response");
                    tableCaseManagement.ajax.reload();
                },
                error: function (errormessage) {
                    toastr.error("Unexpected problem.", "Server Response");
                }
            });
        }
    });
}

function CloseCase(id) {
    bootbox.confirm("Do you want to close this case?", function (result) {
        if (result) {
            var data = {
                status: 'Closed Case'
            };
            $.ajax({
                url: "/api/cases/" + id,
                data: JSON.stringify(data),
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Case has been closed.", "Server Response");
                    tableCaseManagement.ajax.reload();
                },
                error: function (errormessage) {
                    toastr.error("Unexpected problem.", "Server Response");
                }
            });
        }
    });
}

function ReopenCase(id) {
    bootbox.confirm("Do you want to reopen this case?", function (result) {
        if (result) {
            var data = {
                status: 'Opened Case'
            };
            $.ajax({
                url: "/api/cases/" + id,
                data: JSON.stringify(data),
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Case has been reopened.", "Server Response");
                    tableCaseManagement.ajax.reload();
                },
                error: function (errormessage) {
                    toastr.error("Unexpected problem.", "Server Response");
                }
            });
        }
    });
}

function CaseEdit(id) {

    $('#openDate').css('border-color', '#cccccc');
    $('#caseSubject').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/cases/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#caseModal').modal('show');
            $('#caseId').val(result.id);
            $('#clientId').val(result.clientId);
            $('#caseWorkerIds').val(result.caseWorkerId);
            $('#priority').val(result.priority);
            $('#serviceType').val(result.serviceType);
            $('#caseSubject').val(result.subject);
            $('#caseDescription').val(result.description);
            $('#caseStatus').val(result.status);

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

            var closeDate = new Date(result.closeDate);
            var dd = closeDate.getDate();
            var mm = closeDate.getMonth() + 1; //January is 0!
            var yyyy = closeDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            closeDate = mm + '/' + dd + '/' + yyyy;
            $('#closeDate').val(closeDate);

            document.getElementById('btnCasesAction').innerText = "Update";
            EnabledCases();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
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

                var openRaw = $('#openDate').val();
                var closeRaw = $('#closeDate').val();
                var data = {
                    ClientId: parseInt($('#clientId').val()),
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
                        tableCaseManagement.ajax.reload();
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

        var openRaw2 = $('#openDate').val();
        var closeRaw2 = $('#closeDate').val();
        var data = {
            Id: parseInt($('#caseId').val()),
            ClientId: parseInt($('#clientId').val()),
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
                tableCaseManagement.ajax.reload();
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

$(function () {
    $(".js-date").datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1950:2100'
    });
});


