// Reset Form
function resetFormJobExperience() {
    $('#jobExperiencePositionId').val('');
    $('#jobExperienceEmployer').val('');
    $('#jobExperienceCategoryId').val('');
    $('#jobExperienceDuration').val('');
    $('#jobExperienceSalary').val('');
    $('#jobExperienceDescription').val('');
}

// Disable Form
function disableForm() {
    document.getElementById('jobExperiencePositionId').disabled = true;
    document.getElementById('jobExperienceEmployer').disabled = true;
    document.getElementById('jobExperienceCategoryId').disabled = true;
    document.getElementById('jobExperienceDuration').disabled = true;
    document.getElementById('jobExperienceSalary').disabled = true;
    document.getElementById('jobExperienceDescription').disabled = true;
    $('#jobExperiencePositionId').css('border-color', '#cccccc');
}

// Enable Form
function enableForm() {
    document.getElementById('jobExperiencePositionId').disabled = false;
    document.getElementById('jobExperienceEmployer').disabled = false;
    document.getElementById('jobExperienceCategoryId').disabled = false;
    document.getElementById('jobExperienceDuration').disabled = false;
    document.getElementById('jobExperienceSalary').disabled = false;
    document.getElementById('jobExperienceDescription').disabled = false;
    $('#jobExperiencePositionId').css('border-color', '#cccccc');
}

// GET: Job Experiences Data
var tableJobExperience = [];
function getJobExperiences() {
    tableJobExperience = $('#jobExperienceTable').DataTable({
        ajax: {
            url: "/api/jobexperiences?clientId=" + $('#id').val(),
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "jobPositions.name"
            },
            {
                data: "employer"
            },
            {
                data: "jobCategories.name"
            },
            {
                data: "duration"
            },
            {
                data: "salary"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='javascript:void(0);' onclick='JobExperienceEdit(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='javascript:void(0);' onclick='JobExperienceDelete(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

// Job Experience Action
function JobExperienceAction() {
    var action = '';
    action = document.getElementById('btnJobExperienceAction').innerText;
    if (action === "Save changes") {
        if ($('#jobExperiencePositionId').val().trim() === "") {
            $('#jobExperiencePositionId').css('border-color', 'red');
            $('#jobExperiencePositionId').focus();
        }
        else {
            $('#jobExperiencePositionId').css('border-color', '#cccccc');

            if ($('#jobExperienceEmployer').val().trim() === "") {
                $('#jobExperienceEmployer').css('border-color', 'red');
                $('#jobExperienceEmployer').focus();
            }
            else {
                $('#jobExperienceEmployer').css('border-color', '#cccccc');

                if ($('#jobExperienceCategoryId').val().trim() === "") {
                    $('#jobExperienceCategoryId').css('border-color', 'red');
                    $('#jobExperienceCategoryId').focus();
                }
                else {
                    $('#jobExperienceCategoryId').css('border-color', '#cccccc');

                    var data = {
                        ClientId: parseInt($('#id').val()),
                        JobPositionId: parseInt($('#jobExperiencePositionId').val()),
                        Employer: $('#jobExperienceEmployer').val(),
                        JobCategoryId: parseInt($('#jobExperienceCategoryId').val()),
                        Duration: $('#jobExperienceDuration').val(),
                        Salary: $('#jobExperienceSalary').val(),
                        Description: $('#jobExperienceDescription').val()
                    };

                    $.ajax({
                        url: "/api/jobexperiences",
                        data: JSON.stringify(data),
                        type: "POST",
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            toastr.success("Job experience has been saved to database.", "Server Response");
                            tableJobExperience.ajax.reload();
                            $('#jobExperienceModal').modal('hide');
                            document.getElementById('btnJobExperienceAction').innerText = "Add New";
                        },
                        error: function (errormessage) {
                            toastr.error("This referral source is already exists.", "Server Response");
                            $('#jobExperienceModal').modal('hide');
                        }
                    });
                }
            }
        }
    }
    else if (action === "Add New") {
        enableForm();
        document.getElementById('btnJobExperienceAction').innerText = "Save changes";
        resetFormJobExperience();
        $('#jobExperiencePositionId').focus();
    }
    else if (action === "Update") {
        $('#jobExperiencePositionId').css('border-color', '#cccccc');

        var data = {
            Id: parseInt($('#jobExperienceId').val()),
            ClientId: parseInt($('#id').val()),
            JobPositionId: parseInt($('#jobExperiencePositionId').val()),
            Employer: $('#jobExperienceEmployer').val(),
            JobCategoryId: parseInt($('#jobExperienceCategoryId').val()),
            Duration: $('#jobExperienceDuration').val(),
            Salary: $('#jobExperienceSalary').val(),
            Description: $('#jobExperienceDescription').val()
        };

        $.ajax({
            url: "/api/jobexperiences/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Job experience has been updated.", "Server Response");
                tableJobExperience.ajax.reload();
                disableForm();
                resetFormJobExperience();
                document.getElementById('btnJobExperienceAction').innerText = "Add New";
                $('#referralSourceName').val('');
                $('#jobExperienceModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This referral source is already exists.", "Server Response");
                disableForm();
                resetFormJobExperience();
                document.getElementById('btnJobExperienceAction').innerText = "Add New";
                $('#referralSourceName').val('');
                $('#jobExperienceModal').modal('hide');
            }
        });
    }
}

// Edit Job Exerpience
function JobExperienceEdit(id) {

    $('#jobExperiencePositionId').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/jobexperiences/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#jobExperienceModal').modal('show');
            $('#jobExperienceId').val(result.id);
            $('#jobExperiencePositionId').val(result.jobPositionId);
            $('#jobExperienceEmployer').val(result.employer);
            $('#jobExperienceCategoryId').val(result.jobCategoryId);
            $('#jobExperienceDuration').val(result.duration);
            $('#jobExperienceSalary').val(result.salary);
            $('#jobExperienceDescription').val(result.description);
            document.getElementById('btnJobExperienceAction').innerText = "Update";
            enableForm();
            $('#jobExperiencePositionId').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

// Delete Job Experience
function JobExperienceDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/jobexperiences/" + id,
                method: "DELETE",
                success: function () {
                    tableJobExperience.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This referral is being used.", "Server Response");
                }
            });
        }
    });
}