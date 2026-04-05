
$(document).ready(function () {
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

var tableCases = [];

function GetCaseByClientId(id) {
    tableCases = $('#caseTable').DataTable({
        ajax: {
            url: "/api/cases?clientId=" + id,
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
                data: "caseWorker.name"
            },
            {
                data: "serviceType"
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
                    return "<a href='#' onclick='CaseEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='CaseDelete(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
                }
               }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
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

                var data = {
                    ClientId: $('#clientId').val(),
                    CaseWorkerId: $('#caseWorkerIds').val(),
                    Priority: $('#priority').val(),
                    ServiceType: $('#serviceType').val(),
                    OpenDate: $('#openDate').val(),
                    CloseDate: $('#closeDate').val(),
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
                        tableCases.ajax.reload();
                        DisabledCases();
                        document.getElementById('btnCasesAction').innerText = "Add New";
                        ClearCases();
                        $('#caseModal').modal('hide');
                    },
                    error: function (errormessage) {
                        toastr.error("This case is already exists.", "Server Response");
                        DisabledCases();
                        document.getElementById('btnCasesAction').innerText = "Add New";
                        ClearCases();
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

        var data = {
            Id: $('#caseId').val(),
            ClientId: $('#clientId').val(),
            CaseWorkerId: $('#caseWorkerIds').val(),
            Priority: $('#priority').val(),
            ServiceType: $('#serviceType').val(),
            OpenDate: $('#openDate').val(),
            CloseDate: $('#closeDate').val(),
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
                tableCases.ajax.reload();
                DisabledCases();
                document.getElementById('btnCasesAction').innerText = "Add New";
                ClearCases();
                $('#caseModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This case is already exists.", "Server Response");
                DisabledCases();
                document.getElementById('btnCasesAction').innerText = "Add New";
                ClearCases();
            }
        });
    }
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

function CaseDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/cases/" + id,
                method: "DELETE",
                success: function () {
                    tableCases.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This case is being used.", "Server Response");
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

