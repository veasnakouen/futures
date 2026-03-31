
var tableCaseWorker = [];

function GetCaseWorkers() {
    tableCaseWorker = $('#caseWorkerTable').DataTable({
        ajax: {
            url: "/api/caseworkers",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "name"
            },
            {
                data: "program"
            },
            {
                data: "status"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='CaseWorkerEdit(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='CaseWorkerDelete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[2, "asc"],[0, "desc"]]
    });
}

function CaseWorkerAction() {
    var action = '';
    action = document.getElementById('btnCaseWorkerAction').innerText;
    if (action === "Save changes") {
        if ($('#caseWorkerName').val().trim() === "") {
            $('#caseWorkerName').css('border-color', 'red');
            $('#caseWorkerName').focus();
        }
        else {
            $('#caseWorkerName').css('border-color', '#cccccc');

            if ($('#caseWorkerStatus').val().trim() === "") {
                $('#caseWorkerStatus').css('border-color', 'red');
                $('#caseWorkerStatus').focus();
            }
            else {
                $('#caseWorkerStatus').css('border-color', '#cccccc');

                var data = {
                    Name: $('#caseWorkerName').val(),
                    Program: $('#Program').val(),
                    Status: $('#caseWorkerStatus').val()
                };
                $.ajax({
                    url: "/api/caseworkers",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Case Worker has been saved to database.", "Server Response");
                        tableCaseWorker.ajax.reload();
                        document.getElementById('caseWorkerName').disabled = true;
                        document.getElementById('Program').disabled = true;
                        document.getElementById('caseWorkerStatus').disabled = true;
                        document.getElementById('btnCaseWorkerAction').innerText = "Add New";
                        $('#caseWorkerName').val('');
                    },
                    error: function (errormessage) {
                        toastr.error("This case worker is already exists.", "Server Response");
                        document.getElementById('caseWorkerName').disabled = true;
                        document.getElementById('Program').disabled = true;
                        document.getElementById('caseWorkerStatus').disabled = true;
                        document.getElementById('btnCaseWorkerAction').innerText = "Add New";
                        $('#caseWorkerName').val('');
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        document.getElementById('caseWorkerName').disabled = false;
        document.getElementById('Program').disabled = false;
        document.getElementById('caseWorkerStatus').disabled = false;
        document.getElementById('btnCaseWorkerAction').innerText = "Save changes";
        $('#caseWorkerName').val('');
        $('#caseWorkerName').focus();
    }
    else if (action === "Update") {
        $('#caseWorkerName').css('border-color', '#cccccc');

        var data = {
            Id: $('#caseWorkerId').val(),
            Name: $('#caseWorkerName').val(),
            Program: $('#Program').val(),
            Status: $('#caseWorkerStatus').val()
        };
        $.ajax({
            url: "/api/caseworkers/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Case Worker has been updated.", "Server Response");
                tableCaseWorker.ajax.reload();
                document.getElementById('caseWorkerName').disabled = true;
                document.getElementById('Program').disabled = true;
                document.getElementById('caseWorkerStatus').disabled = true;
                document.getElementById('btnCaseWorkerAction').innerText = "Add New";
                $('#caseWorkerName').val('');
            },
            error: function (errormessage) {
                toastr.error("This case worker is already exists.", "Server Response");
                document.getElementById('caseWorkerName').disabled = true;
                document.getElementById('Program').disabled = true;
                document.getElementById('caseWorkerStatus').disabled = true;
                document.getElementById('btnCaseWorkerAction').innerText = "Add New";
                $('#caseWorkerName').val('');
            }
        });
    }
}

function CaseWorkerEdit(id) {

    $('#caseWorkerName').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/caseworkers/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#caseWorkerId').val(result.id);
            $('#caseWorkerName').val(result.name);
            $('#Program').val(result.program);
            $('#caseWorkerStatus').val(result.status);
            document.getElementById('btnCaseWorkerAction').innerText = "Update";
            document.getElementById('caseWorkerName').disabled = false;
            document.getElementById('Program').disabled = false;
            document.getElementById('caseWorkerStatus').disabled = false;
            $('#caseWorkerName').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function CaseWorkerDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/caseworkers/" + id,
                method: "DELETE",
                success: function () {
                    tableCaseWorker.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This case worker is being used.", "Server Response");
                }
            });
        }
    });
}