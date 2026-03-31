$(document).ready(function () {
    GetEmployers("Active");

    $('#employerModal').on('shown.bs.modal', function () {
        $('#name').focus();
    });

    $(function () {
        $(".js-date").datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1950:2100'
        });
    });

    $('#displayStatus').on('change', function () {
        GetEmployers(this.value)
    })
});

function resetFilter()
{
    GetEmployers("Active");
}

var table = [];

function GetEmployers(status) {

    table = $('#employers').DataTable({
        ajax: {
            url: (status == "Active") ? "/api/employers?status=Active" : "/api/employers?status=Inactive",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "corporateDate",
                render: function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : "0" + month)+ "-" + date.getDate() + "-" + date.getFullYear();
                }
            },
            {
                data: "corporateDate",
                render: function (data) {
                    return moment(data, "YYYYMMDD").fromNow();
                }
            },
            {
                data: "name"
            },
            {
                data: "jobCategory.name"
            },
            {
                data: "contactPerson"
            },
            {
                data: "contactPhone"
            },
            {
                data: "email"
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
}

function searchPartnership(startDate, endDate) {

    var start = $('#startDate').val();
    var end = $('#endDate').val();

    if (start > end)
    {
        toastr.error("Start Date cannot be bigger than End Date.");
    }
    else if (start == '' || end == '')
    {
        toastr.error("Please enter required field.");
    }
    else
    {
        var dateStart = new Date(start);
        var monthStart = dateStart.getMonth() + 1;
        var start = (monthStart.length > 1 ? monthStart : "0" + monthStart) + "-" + dateStart.getDate() + "-" + dateStart.getFullYear();

        var dateEnd = new Date(end);
        var monthEnd = dateEnd.getMonth() + 1;
        var end = (monthEnd.length > 1 ? monthEnd : "0" + monthEnd) + "-" + dateEnd.getDate() + "-" + dateEnd.getFullYear();

        table = $('#employers').DataTable({
            ajax: {
                url: "/api/employers?start=" + start + "&end=" + end,
                dataSrc: ""
            },
            columns: [
                {
                    data: "id"
                },
                {
                    data: "corporateDate",
                    render: function (data) {
                        var date = new Date(data);
                        var month = date.getMonth() + 1;
                        return (month.length > 1 ? month : "0" + month) + "-" + date.getDate() + "-" + date.getFullYear();
                    }
                },
                {
                    data: "corporateDate",
                    render: function (data) {
                        return moment(data, "YYYYMMDD").fromNow();
                    }
                },
                {
                    data: "name"
                },
                {
                    data: "jobCategory.name"
                },
                {
                    data: "contactPerson"
                },
                {
                    data: "contactPhone"
                },
                {
                    data: "email"
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

        $('#newPartnerFilter').modal('hide');
    }
}

//Delete
function Delete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            ShowLoadingScreen();
            $.ajax({
                url: "/api/employers/" + id,
                method: "DELETE",
                success: function () {
                    RemoveLoadingScreen();
                    table.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    $("div#divLoading").removeClass('show');
                }
            });
        }
    });
}

//Update
function Update() {
    var res = validate();
    if (res === false) {
        return false;
    }
    
    ShowLoadingScreen();

    var data = {
        Id: $('#id').val(),
        Name: $('#name').val(),
        JobCategoryId: $('#sector').val(),
        Address: $('#address').val(),
        ContactPhone: $('#contactPhone').val(),
        ContactPerson: $('#contactPerson').val(),
        Email: $('#email').val(),
        Website: $('#website').val(),
        Note: $('#note').val(),
        CorporateDate: $('#corporateDate').val(),
        Status: $('#status').val()
    };

    $.ajax({
        url: "/api/employers/" + data.Id,
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            toastr.success("Employer has been updated.");
            clearForm();
            table.ajax.reload();
            RemoveLoadingScreen();
            $('#employerModal').modal('hide');
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#name').focus();
                toastr.error("This employer name is already taken.");
            }

        }
    });
}

//Save
function Save() {
    var res = validate();
    if (res === false) {
        return false;
    }

    ShowLoadingScreen();

    var data = {
        Name: $('#name').val(),
        JobCategoryId: $('#sector').val(),
        Address: $('#address').val(),
        ContactPhone: $('#contactPhone').val(),
        ContactPerson: $('#contactPerson').val(),
        Email: $('#email').val(),
        Website: $('#website').val(),
        Note: $('#note').val(),
        CorporateDate: $('#corporateDate').val(),
        Status: $('#status').val()
    };

    $.ajax({
        url: "/api/employers",
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            toastr.success("Employer has been added to the database.");
            clearForm();
            table.ajax.reload();
            RemoveLoadingScreen();
            $('#employerModal').modal('hide');
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#name').focus();
                toastr.error("This employer name is already have in database.");
            }
            
        }
    });
}

//Edit
function Edit(id) {

    $('#name').css('border-color', '#cccccc');
    $('#contactPerson').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/employers/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#employerModal').modal('show');
            $('#btnUpdate').show();
            $('#btnSave').hide();

            $('#id').val(result.id);
            $('#name').val(result.name);
            $('#sector').val(result.jobCategory.id);
            $('#location').val(result.location);
            $('#address').val(result.address);
            $('#contactPerson').val(result.contactPerson);
            $('#contactPhone').val(result.contactPhone);
            $('#email').val(result.email);
            $('#website').val(result.website);
            $('#note').val(result.note);
            $('#status').val(result.status);

            var corporateDate = new Date(result.corporateDate);
            var dd = corporateDate.getDate();
            var mm = corporateDate.getMonth() + 1; //January is 0!
            var yyyy = corporateDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            corporateDate = mm + '/' + dd + '/' + yyyy;
            $('#corporateDate').val(corporateDate);



        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.");
        }
    });
    return false;
}

//ClearModalInput
function clearForm() {
    $('#id').val('');
    $('#name').val('');
    $('#corporateDate').val('');
    $('#address').val('');
    $('#contactPerson').val('');
    $('#contactPhone').val('');
    $('#email').val('');
    $('#website').val('');
    $('#note').val('');
    $('#btnUpdate').hide();
    $('#btnSave').show();
    $('#name').css('border-color', '#cccccc');
    $('#contactPerson').css('border-color', '#cccccc');
}

//Validate
function validate() {
    var isValid = true;
    if ($('#corporateDate').val().trim() === "") {
        $('#corporateDate').css('border-color', 'red');
        $('#corporateDate').focus();
        isValid = false;
    } else {
        $('#corporateDate').css('border-color', '#cccccc');
        if ($('#status').val().trim() === "") {
            $('#status').css('border-color', 'red');
            $('#status').focus();
            isValid = false;
        } else {
            $('#status').css('border-color', '#cccccc');
            if ($('#name').val().trim() === "") {
                $('#name').css('border-color', 'red');
                $('#name').focus();
                isValid = false;
            } else {
                $('#name').css('border-color', '#cccccc');
                if ($('#contactPerson').val().trim() === "") {
                    $('#contactPerson').css('border-color', 'red');
                    $('#contactPerson').focus();
                    isValid = false;
                } else {
                    $('#contactPerson').css('border-color', '#cccccc');
                }
            }
        }
    }
    return isValid;
}