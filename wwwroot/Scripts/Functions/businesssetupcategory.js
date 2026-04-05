$(document).ready(function () {
    $('#businessSetUpCategoryModal').on('show.bs.modal', function () {
        document.getElementById('btnBusinessSetupCateogry').innerText = "Add New";
        $('#busCategoryName').val('');
        document.getElementById('busCategoryName').disabled = true;
        GetBusinessSetUpCategoryBy();
    });
});


var tableBusinessSetUpCategories = [];

function GetBusinessSetUpCategoryBy() {
    tableBusinessSetUpCategories = $('#businessSetUpCategory').DataTable({
            ajax: {
                url: "/api/businesscategories",
                dataSrc: ""
            },
            columns: [
                {
                    data: "id"
                },
                {
                    data: "busCategoryName"
                },
                {
                    data: "id",
                    render: function (data) {
                        return "<a href='#' onclick='EditbusinessSetUpCategory(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='DeletebusinessSetUpCategory(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
                    }
                }
            ],

            destroy: true,
            "order": [[1, "desc"]]
        });
}

function BusinessSetupCateogryAction() {
    var action = '';
    action = document.getElementById('btnBusinessSetupCateogry').innerText;
    if (action === "Save") {
        if ($('#busCategoryName').val().trim() === "") {
            $('#busCategoryName').css('border-color', 'red');
            $('#busCategoryName').focus();
        }
        else {
            $('#busCategoryName').css('border-color', '#cccccc');

            var data = {
                BusCategoryName: $('#busCategoryName').val(),
                isDeleted: 'Deactive'
            };
            $.ajax({
                url: "/api/businesscategories",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Business set up cateogry has been saved to database.", "Server Response");
                    tableBusinessSetUpCategories.ajax.reload();
                    document.getElementById('busCategoryName').disabled = true;
                    document.getElementById('btnBusinessSetupCateogry').innerText = "Add New";
                    $('#busCategoryName').val('');
                },
                error: function (errormessage) {
                    toastr.error("This Business set up cateogry is already exists.", "Server Response");
                    document.getElementById('busCategoryName').disabled = true;
                    $('#busCategoryName').val('');
                }
            });
        }
    }
    else if (action === "Add New") {
        document.getElementById('busCategoryName').disabled = false;
        document.getElementById('btnBusinessSetupCateogry').innerText = "Save";
        $('#busCategoryName').val('');
        $('#busCategoryName').focus();
    }
    else if (action === "Update") {
        $('#busCategoryName').css('border-color', '#cccccc');
        //$("div#divLoadingModal").addClass('show');
        var data = {
            Id: $('#id').val(),
            busCategoryName: $('#busCategoryName').val(),
            isDeleted: 'Deactive'
        };
        $.ajax({
            url: "/api/businesscategories/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Business setup cateogry has been updated.", "Server Response");
                tableBusinessSetUpCategories.ajax.reload();
                document.getElementById('busCategoryName').disabled = true;
                document.getElementById('btnBusinessSetupCateogry').innerText = "Add New";
                $('#busCategoryName').val('');
                //$("div#divLoadingModal").removeClass('show');
            },
            error: function (errormessage) {
                toastr.error("This Business setup cateogry is already exists.", "Server Response");
                document.getElementById('busCategoryName').disabled = true;
                document.getElementById('btnBusinessSetupCateogry').innerText = "Add New";
                $('#busCategoryName').val('');
                //$("div#divLoadingModal").removeClass('show');
            }
        });
    }
}


function EditbusinessSetUpCategory(id) {
    document.getElementById('busCategoryName').disabled = false;
    $.ajax({
        url: "/api/businesscategories/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            //$('#socialSupportModel').modal('show');
            $('#id').val(result.id);
            $('#busCategoryName').val(result.busCategoryName);
            document.getElementById('btnBusinessSetupCateogry').innerText = "Update";
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }

    });

    return false;
}

function DeletebusinessSetUpCategory(id) {
    bootbox.confirm("Are you sure you want to delete this Business setup cateogry record?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/businesscategories/" + id,
                method: "DELETE",
                success: function () {
                    tableBusinessSetUpCategories.ajax.reload();
                    toastr.success("Record Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This Business setup cateogry  record is being used.", "Server Response");
                }
            });
        }
    });
}
