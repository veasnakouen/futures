$(document).ready(function () {
    GetJobPositions();
    $('#jobPositionModal').on('show.bs.modal', function () {
        $('#jobPositionName').css('border-color', '#cccccc');
        document.getElementById('jobPositionName').disabled = true;
        document.getElementById('btnActionPosition').innerText = "Add New";
        $('#jobPositionName').val('');
    });
});

var tableJobPositions = [];

function GetJobPositions() {
    tableJobPositions = $('#jobPositionTable').DataTable({
        ajax: {
            url: "/api/jobpositions",
            dataSrc: ""
        },
        columns: [
            {
                data: "name"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='JobPositionEdit(" + data + ")'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='JobPositionDelete(" + data + ")'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ]
    });
}

function jobPositionAction() {
    var action = '';
    action = document.getElementById('btnActionPosition').innerText;
    if (action === "Save") {
        if ($('#jobPositionName').val().trim() === "") {
            $('#jobPositionName').css('border-color', 'red');
            $('#jobPositionName').focus();
        }
        else {
            $('#jobPositionName').css('border-color', '#cccccc');

            var data = {
                Name: $('#jobPositionName').val()
            };
            $.ajax({
                url: "/api/jobpositions",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Job position has been saved to database.", "Server Response");
                    tableJobPositions.ajax.reload();
                    document.getElementById('jobPositionName').disabled = true;
                    document.getElementById('btnActionPosition').innerText = "Add New";
                    $('#jobPositionName').val('');
                },
                error: function (errormessage) {
                    toastr.error("This job position is already exists.", "Server Response");
                    document.getElementById('jobPositionName').disabled = true;
                    document.getElementById('btnActionPosition').innerText = "Add New";
                    $('#jobPositionName').val('');
                }
            });
        }
    }
    else if (action === "Add New") {
        document.getElementById('jobPositionName').disabled = false;
        document.getElementById('btnActionPosition').innerText = "Save";
        $('#jobPositionName').val('');
        $('#jobPositionName').focus();
    }
    else if (action === "Update") {
        $('#jobPositionName').css('border-color', '#cccccc');

        $("div#divLoadingModal").addClass('show');

        var data = {
            Id: $('#id').val(),
            Name: $('#jobPositionName').val()
        };
        $.ajax({
            url: "/api/jobpositions/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Job Position has been updated.", "Server Response");
                tableJobPositions.ajax.reload();
                document.getElementById('jobPositionName').disabled = true;
                document.getElementById('btnActionPosition').innerText = "Add New";
                $('#jobPositionName').val('');
                $("div#divLoadingModal").removeClass('show');
            },
            error: function (errormessage) {
                toastr.error("This job position is already exists.", "Server Response");
                document.getElementById('jobPositionName').disabled = true;
                document.getElementById('btnActionPosition').innerText = "Add New";
                $('#jobPositionName').val('');
                $("div#divLoadingModal").removeClass('show');
            }
        });
    }
}

function JobPositionEdit(id) {

    $('#jobPositionName').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/jobpositions/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#id').val(result.id);
            $('#jobPositionName').val(result.name);
            document.getElementById('btnActionPosition').innerText = "Update";
            document.getElementById('jobPositionName').disabled = false;
            $('#jobPositionName').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function JobPositionDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/jobpositions/" + id,
                method: "DELETE",
                success: function () {
                    tableJobPositions.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This job position is being used.", "Server Response");
                }
            });
        }
    });
}