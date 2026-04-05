$(document).ready(function () {
    GetJobCategories();
    $('#jobCategoryModal').on('show.bs.modal', function () {
        $('#jobCategoryName').css('border-color', '#cccccc');
        document.getElementById('jobCategoryName').disabled = true;
        document.getElementById('btnjobCategoryAction').innerText = "Add New";
        $('#jobCategoryName').val('');
    });
});

var tableJobCategories = [];

function GetJobCategories() {
    tableJobCategories = $('#jobCategoryTable').DataTable({
        ajax: {
            url: "/api/jobcategories",
            dataSrc: ""
        },
        columns: [
            {
                data: "name"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='JobCategoryEdit(" + data + ")'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='JobCategoryDelete(" + data + ")'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ]
    });
}

function JobCategoryAction() {
    var action = '';
    action = document.getElementById('btnjobCategoryAction').innerText;
    if (action === "Save") {
        if ($('#jobCategoryName').val().trim() === "") {
            $('#jobCategoryName').css('border-color', 'red');
            $('#jobCategoryName').focus();
        }
        else {
            $('#jobCategoryName').css('border-color', '#cccccc');

            var data = {
                Name: $('#jobCategoryName').val()
            };
            $.ajax({
                url: "/api/jobcategories",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Job Category has been saved to database.", "Server Response");
                    tableJobCategories.ajax.reload();
                    document.getElementById('jobCategoryName').disabled = true;
                    document.getElementById('btnjobCategoryAction').innerText = "Add New";
                    $('#jobCategoryName').val('');
                },
                error: function (errormessage) {
                    toastr.error("This job category is already exists.", "Server Response");
                    document.getElementById('jobCategoryName').disabled = true;
                    document.getElementById('btnjobCategoryAction').innerText = "Add New";
                    $('#jobCategoryName').val('');
                }
            });
        }
    }
    else if (action === "Add New") {
        document.getElementById('jobCategoryName').disabled = false;
        document.getElementById('btnjobCategoryAction').innerText = "Save";
        $('#jobCategoryName').val('');
        $('#jobCategoryName').focus();
    }
    else if (action === "Update") {
        $('#jobCategoryName').css('border-color', '#cccccc');

        $("div#divLoadingModal").addClass('show');

        var data = {
            Id: $('#id').val(),
            Name: $('#jobCategoryName').val()
        };
        $.ajax({
            url: "/api/jobcategories/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Job Category has been updated.", "Server Response");
                tableJobCategories.ajax.reload();
                document.getElementById('jobCategoryName').disabled = true;
                document.getElementById('btnjobCategoryAction').innerText = "Add New";
                $('#jobCategoryName').val('');
                $("div#divLoadingModal").removeClass('show');
            },
            error: function (errormessage) {
                toastr.error("This job category is already exists.", "Server Response");
                document.getElementById('jobCategoryName').disabled = true;
                document.getElementById('btnjobCategoryAction').innerText = "Add New";
                $('#jobCategoryName').val('');
                $("div#divLoadingModal").removeClass('show');
            }
        });
    }
}

function JobCategoryEdit(id) {

    $('#jobCategoryName').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/jobcategories/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#id').val(result.id);
            $('#jobCategoryName').val(result.name);
            document.getElementById('btnjobCategoryAction').innerText = "Update";
            document.getElementById('jobCategoryName').disabled = false;
            $('#jobCategoryName').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function JobCategoryDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/jobcategories/" + id,
                method: "DELETE",
                success: function () {
                    tableJobCategories.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This job category is being used.", "Server Response");
                }
            });
        }
    });
}