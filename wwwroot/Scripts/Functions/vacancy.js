$(document).ready(function () {
    GetVacancies("all");
    
    $('#btnPostNewVacancy').attr('disabled', 'disabled');
    $('#vacancyModal').on('show.bs.modal', function () {
        document.getElementById("titleVacancy").innerHTML = " in " + $("#displayEmployer option:selected").text();
        clearForm();
    });

    $('#overDeadlineVacancy').on('show.bs.modal', function () {
        GetOverDeadline();
    });

    $('#displayEmployer').on('change', function () {
        var employerId = this.value;
        if (employerId != "--Select Employer--") {
            GetVacancies(employerId);
            $('#btnPostNewVacancy').removeAttr('disabled');
        }
        else
        {
            GetVacancies("all");
            $('#btnPostNewVacancy').attr('disabled', 'disabled');
        }
    })

    $(function () {
        $(".js-date").datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1950:2100'
        });
    });
});

function Edit(id) {
    $('#positionAvailable').css('border-color', '#cccccc');
    $('#postingDate').css('border-color', '#cccccc');
    $('#deadline').css('border-color', '#cccccc');
    $.ajax({
        url: "/api/vacancies/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#vacancyModal').modal('show');
            $('#btnUpdate').show();
            $('#btnSave').hide();
            $('#id').val(result.id);
            $('#employerId').val(result.employerId);
            $('#jobPositionId').val(result.jobPositions.id);
            $('#jobCategoryId').val(result.jobCategories.id);
            $('#positionAvailable').val(result.positionAvailable);
            $('#contractType').val(result.contractType);
            $('#salary').val(result.salary);
            $('#salaryMax').val(result.salarymax);
            $('#schedule').val(result.schedule);
            $('#location').val(result.location);
            $('#responsibilities').val(result.responsibilities);
            $('#requirement').val(result.requirement);
            $('#applicationInformation').val(result.applicationInformation);
            var postingDate = new Date(result.postingDate);
            var dd = postingDate.getDate();
            var mm = postingDate.getMonth() + 1; //January is 0!
            var yyyy = postingDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            postingDate = mm + '/' + dd + '/' + yyyy;
            $('#postingDate').val(postingDate);

            var deadline = new Date(result.deadline);
            var dd = deadline.getDate();
            var mm = deadline.getMonth() + 1; //January is 0!
            var yyyy = deadline.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            deadline = mm + '/' + dd + '/' + yyyy;
            $('#deadline').val(deadline);
            $('#status').val(result.status);
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.");
        }
    });
    return false;
}

function Activate() {
    var res = validate();
    if (res === false) {
        return false;
    }

    ShowLoadingScreen();

    var data = {
        Id: $('#id').val(),
        PostingDate: $('#postingDate').val(),
        Deadline: $('#deadline').val(),
        EmployerId: $('#employerId').val(),
        JobPositionId: $('#jobPositionId').val(),
        JobCategoryId: $('#jobCategoryId').val(),
        PositionAvailable: $('#positionAvailable').val(),
        ContractType: $('#contractType').val(),
        Schedule: $('#schedule').val(),
        Salarymax: $('#salaryMax').val(),
        Salary: $('#salary').val(),
        Location: $('#location').val(),
        Responsibilities: $('#responsibilities').val(),
        Requirement: $('#requirement').val(),
        ApplicationInformation: $('#applicationInformation').val(),
        Status: $('#status').val()
    };
    $.ajax({
        url: "/api/vacancies/" + data.Id,
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            toastr.success("Vacancy has been updated.");
            clearForm();
            tablevacanciesView.ajax.reload();
            tableOverDeadline.ajax.reload();
            RemoveLoadingScreen();
            $('#vacancyModal').modal('hide');
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#name').focus();
                toastr.error("This vacancy is already taken.");
            }

        }
    });
}

function Reactivate(id) {
    $('#positionAvailable').css('border-color', '#cccccc');
    $('#postingDate').css('border-color', '#cccccc');
    $('#deadline').css('border-color', '#cccccc');
    $.ajax({
        url: "/api/vacancies?jobId=" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#vacancyModal').modal('show');
            $('#btnSave').hide();
            $('#btnUpdate').hide();
            $('#btnActivate').show();
            $('#id').val(result.id);
            $('#employerId').val(result.employerId);
            $('#jobPositionId').val(result.jobPositions.id);
            $('#jobCategoryId').val(result.jobCategories.id);
            $('#positionAvailable').val(result.positionAvailable);
            $('#contractType').val(result.contractType);
            $('#salary').val(result.salary);
            $('#salaryMax').val(result.salarymax);
            $('#schedule').val(result.schedule);
            $('#location').val(result.location);
            $('#responsibilities').val(result.responsibilities);
            $('#requirement').val(result.requirement);
            $('#applicationInformation').val(result.applicationInformation);
            var postingDate = new Date(result.postingDate);
            var dd = postingDate.getDate();
            var mm = postingDate.getMonth() + 1; //January is 0!
            var yyyy = postingDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            postingDate = mm + '/' + dd + '/' + yyyy;
            $('#postingDate').val(postingDate);

            var deadline = new Date(result.deadline);
            var dd = deadline.getDate();
            var mm = deadline.getMonth() + 1; //January is 0!
            var yyyy = deadline.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            deadline = mm + '/' + dd + '/' + yyyy;
            $('#deadline').val(deadline);
            $('#status').val(result.status);
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.");
        }
    });
    return false;
}

function Delete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            ShowLoadingScreen();
            $.ajax({
                url: "/api/vacancies/" + id,
                method: "DELETE",
                success: function () {
                    RemoveLoadingScreen();
                    table.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    RemoveLoadingScreen();
                }
            });
        }
    });
}

function Update() {
    var res = validate();
    if (res === false) {
        return false;
    }

    ShowLoadingScreen();

    var data = {
        Id: $('#id').val(),
        PostingDate: $('#postingDate').val(),
        Deadline: $('#deadline').val(),
        EmployerId: $('#employerId').val(),
        JobPositionId: $('#jobPositionId').val(),
        JobCategoryId: $('#jobCategoryId').val(),
        PositionAvailable: $('#positionAvailable').val(),
        ContractType: $('#contractType').val(),
        Schedule: $('#schedule').val(),
        Salarymax: $('#salaryMax').val(),
        Salary: $('#salary').val(),
        Location: $('#location').val(),
        Responsibilities: $('#responsibilities').val(),
        Requirement: $('#requirement').val(),
        ApplicationInformation: $('#applicationInformation').val(),
        Status: $('#status').val()
    };
    $.ajax({
        url: "/api/vacancies/" + data.Id,
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            toastr.success("Vacancy has been updated.");
            clearForm();
            tablevacanciesView.ajax.reload();
            RemoveLoadingScreen();
            $('#vacancyModal').modal('hide');
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#name').focus();
                toastr.error("This vacancy is already taken.");
            }

        }
    });
}

function Save() {
    var res = validate();
    if (res === false) {
        return false;
    }

    ShowLoadingScreen();

    var data = {
        PostingDate: $('#postingDate').val(),
        Deadline: $('#deadline').val(),
        EmployerId: $('#displayEmployer').val(),
        JobPositionId: $('#jobPositionId').val(),
        JobCategoryId: $('#jobCategoryId').val(),
        PositionAvailable: $('#positionAvailable').val(),
        ContractType: $('#contractType').val(),
        Schedule: $('#schedule').val(),
        Salarymax: $('#salaryMax').val(),
        Salary: $('#salary').val(),
        Location: $('#location').val(),
        Responsibilities: $('#responsibilities').val(),
        Requirement: $('#requirement').val(),
        ApplicationInformation: $('#applicationInformation').val(),
        Status: $('#status').val()
    };

    $.ajax({
        url: "/api/vacancies",
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            toastr.success("Vacancies has been added to the database.");
            clearForm();
            tablevacanciesView.ajax.reload();
            RemoveLoadingScreen();
            $('#vacancyModal').modal('hide');
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#jobPositionId').focus();
                toastr.error("This vacancy is already have in database.");
            }

        }
    });
}

function ShowAllVacancies() {
    GetVacancies("all");
    $("#displayEmployer").val($("#displayEmployer option:first").val());
    $('#btnPostNewVacancy').attr('disabled', 'disabled');
}

var tablevacanciesView = [];

function GetVacancies(employerId) {
    ShowLoadingScreen();
    tablevacanciesView = $('#vacancies').DataTable({
        ajax: {
            url: (employerId == "all") ? "/api/vacancies?employerId=all" : "/api/vacancies?employerId=" + employerId,
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "employers.name"
            },
            {
                data: "jobPositions.name"
            },
            {
                data: "positionAvailable"
            },
            {
                data: "contractType"
            },
            {
                data: "jobCategories.name"
            },
            {
                data: "schedule"
            },
            {
                data:{salary:"salary",salaryMax:"salarymax"},
                render: function (data) {
                    return "$"+ data.salary + " - $" + data.salarymax;
                }
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='Edit(" + data + ");'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='Delete(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Delete</a>";
                }
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
    RemoveLoadingScreen();
}
var tableOverDeadline = [];
function GetOverDeadline() {
    ShowLoadingScreen();
    tableOverDeadline = $('#overDeadline').DataTable({
        ajax: {
            url: "/api/vacancies?employerId=over",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "deadline",
                render: function (data) {
                    return moment.utc(data).format("DD-MMM-YYYY");
                }
            },
            {
                data: "employers.name"
            },
            {
                data: "jobPositions.name"
            },
            {
                data: "jobCategories.name"
            },
            {
                data: { salary: "salary", salaryMax: "salarymax" },
                render: function (data) {
                    return "$" + data.salary + " - $" + data.salarymax;
                }
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='Reactivate(" + data + ")'><span class='glyphicon glyphicon-refresh'></span> Reactivate</a>";
                }
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
    RemoveLoadingScreen();
}

function clearForm() {
    $('#id').val('');
    $('#positionAvailable').val('');
    $('#contractType').val('');
    $('#salary').val('');
    $('#salarymax').val('');
    $('#schedule').val('');
    $('#location').val('');
    $('#responsibilities').val('');
    $('#requirement').val('');
    $('#applicationInformation').val('');
    $('#postingDate').val('');
    $('#deadline').val('');
    $('#status').val('');
    $('#btnUpdate').hide();
    $('#btnActivate').hide();
    $('#btnSave').show();
    $('#positionAvailable').css('border-color', '#cccccc');
    $('#postingDate').css('border-color', '#cccccc');
    $('#deadline').css('border-color', '#cccccc');
}

function validate() {
    var isValid = true;
    if ($('#positionAvailable').val().trim() === "") {
        $('#positionAvailable').css('border-color', 'red');
        $('#positionAvailable').focus();
        isValid = false;
    } else {
        $('#positionAvailable').css('border-color', '#cccccc');
        if ($('#postingDate').val().trim() === "") {
            $('#postingDate').css('border-color', 'red');
            $('#postingDate').focus();
            isValid = false;
        } else {
            $('#postingDate').css('border-color', '#cccccc');
            if ($('#deadline').val().trim() === "") {
                $('#deadline').css('border-color', 'red');
                $('#deadline').focus();
                isValid = false;
            } else {
                $('#deadline').css('border-color', '#cccccc');
            }
        }
    }
    return isValid;
}