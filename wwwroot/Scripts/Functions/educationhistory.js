// Reset Form
function resetFormEducationHistory() {
    $('#educationHistoryId').val('');
    $('#educationHistoryLevel').val('');
    $('#educationHistoryGrade').val('');
    $('#educationHistorySubject').val('');
    $('#educationHistoryGraduatedYear').val('');
    $('#educationHistorySchoolName').val('');
    $('#educationHistoryDescription').val('');
}

// Disable Form
function disableFormEducationHistory() {
    document.getElementById('educationHistoryId').disabled = true;
    document.getElementById('educationHistoryLevel').disabled = true;
    document.getElementById('educationHistoryGrade').disabled = true;
    document.getElementById('educationHistorySubject').disabled = true;
    document.getElementById('educationHistoryGraduatedYear').disabled = true;
    document.getElementById('educationHistorySchoolName').disabled = true;
    document.getElementById('educationHistoryDescription').disabled = true;
    $('#educationHistoryId').css('border-color', '#cccccc');
}

// Enable Form
function enableFormEducationHistory() {
    document.getElementById('educationHistoryId').disabled = false;
    document.getElementById('educationHistoryLevel').disabled = false;
    document.getElementById('educationHistoryGrade').disabled = false;
    document.getElementById('educationHistorySubject').disabled = false;
    document.getElementById('educationHistoryGraduatedYear').disabled = false;
    document.getElementById('educationHistorySchoolName').disabled = false;
    document.getElementById('educationHistoryDescription').disabled = false;
    $('#educationHistoryId').css('border-color', '#cccccc');
    $('#educationHistoryLevel').focus();
}

var tableEducationHistory = [];
function getEducationHistories() {
    tableEducationHistory = $('#EducationHistoryTable').DataTable({
        ajax: {
            url: "/api/educations?clientId=" + $('#id').val(),
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "level"
            },
            {
                data: "grade"
            },
            {
                data: "subject"
            },
            {
                data: "year"
            },
            {
                data: "schoolName"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='EducationHistoryEdit(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='EducationHistoryDelete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

function EducationHistoryAction() {
    var action = '';
    action = document.getElementById('btnEducationHistoryAction').innerText;
    if (action === "Save changes") {
        if ($('#educationHistoryLevel').val().trim() === "") {
            $('#educationHistoryLevel').css('border-color', 'red');
            $('#educationHistoryLevel').focus();
        }
        else {
            $('#educationHistoryLevel').css('border-color', '#cccccc');

            if ($('#educationHistoryGrade').val().trim() === "") {
                $('#educationHistoryGrade').css('border-color', 'red');
                $('#educationHistoryGrade').focus();
            }
            else {
                $('#educationHistoryGrade').css('border-color', '#cccccc');

                var data = {
                    ClientId: $('#id').val(),
                    Level: $('#educationHistoryLevel').val(),
                    Grade: $('#educationHistoryGrade').val(),
                    Subject: $('#educationHistorySubject').val(),
                    Year: $('#educationHistoryGraduatedYear').val(),
                    SchoolName: $('#educationHistorySchoolName').val(),
                    Description: $('#educationHistoryDescription').val()
                };

                $.ajax({
                    url: "/api/educations",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Education history has been saved to database.", "Server Response");
                        tableEducationHistory.ajax.reload();
                        $('#EducationHistoryModal').modal('hide');
                        disableFormEducationHistory();
                        document.getElementById('btnEducationHistoryAction').innerText = "Add New";
                    },
                    error: function (errormessage) {
                        toastr.error("This referral source is already exists.", "Server Response");
                        $('#EducationHistoryModal').modal('hide');
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        enableFormEducationHistory();
        document.getElementById('btnEducationHistoryAction').innerText = "Save changes";
        resetFormEducationHistory();
        $('#educationHistoryLevel').focus();
    }
    else if (action === "Update") {
        $('#educationHistoryId').css('border-color', '#cccccc');

        var data = {
            Id: $('#educationHistoryId').val(),
            ClientId: $('#id').val(),
            Level: $('#educationHistoryLevel').val(),
            Grade: $('#educationHistoryGrade').val(),
            Subject: $('#educationHistorySubject').val(),
            Year: $('#educationHistoryGraduatedYear').val(),
            SchoolName: $('#educationHistorySchoolName').val(),
            Description: $('#educationHistoryDescription').val()
        };

        $.ajax({
            url: "/api/educations/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Job experience has been updated.", "Server Response");
                tableEducationHistory.ajax.reload();
                disableFormEducationHistory();
                resetFormEducationHistory();
                document.getElementById('btnEducationHistoryAction').innerText = "Add New";
                $('#educationHistoryLevel').val('');
                $('#EducationHistoryModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This referral source is already exists.", "Server Response");
                disableFormEducationHistory();
                resetFormEducationHistory();
                document.getElementById('btnEducationHistoryAction').innerText = "Add New";
                $('#educationHistoryLevel').val('');
                $('#EducationHistoryModal').modal('hide');
            }
        });
    }
}

function EducationHistoryEdit(id) {

    $('#educationHistoryId').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/educations/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#EducationHistoryModal').modal('show');
            $('#educationHistoryId').val(result.id);
            $('#educationHistoryLevel').val(result.level);
            $('#educationHistoryGrade').val(result.grade);
            $('#educationHistorySubject').val(result.subject);
            $('#educationHistoryGraduatedYear').val(result.year);
            $('#educationHistorySchoolName').val(result.schoolName);
            $('#educationHistoryDescription').val(result.description);
            document.getElementById('btnEducationHistoryAction').innerText = "Update";
            enableFormEducationHistory();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function EducationHistoryDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/educations/" + id,
                method: "DELETE",
                success: function () {
                    tableEducationHistory.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This education history is being used.", "Server Response");
                }
            });
        }
    });
}