//Beneficiary
var tableBeneficiary = [];

function GetBeneficiariesByClientId(id) {
    if ($('#id').val() != "") {
        tableBeneficiary = $('#beneficiaryTable').DataTable({
            ajax: {
                url: "/api/beneficiaries?clientId=" + id,
                dataSrc: ""
            },
            columns: [
                {
                    data: "gender"
                },
                {
                    data: "age"
                },
                {
                    data: "id",
                    render: function (data) {
                        return "<a href='#' onclick='EditBeneficiary(" + data + ");'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='DeleteBeneficiary(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Delete</a>";
                    }
                }
            ],
            destroy: true,
            "order": [[1, "desc"]]
        });
    }
}

function DeleteBeneficiary(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/beneficiaries/" + id,
                method: "DELETE",
                success: function () {
                    tableBeneficiary.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                }
            });
        }
    });
}

function UpdateBeneficiary() {
    $('#beneficiaryAge').css('border-color', '#cccccc');

    var data = {
        Id: $('#beneficiaryId').val(),
        ClientId: $('#id').val(),
        Gender: $('#beneficiaryGender').val(),
        Age: $('#beneficiaryAge').val()
    };
    $.ajax({
        url: "/api/beneficiaries/" + data.Id,
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            toastr.success("Beneficiary has been updated.", "Server Response");
            tableBeneficiary.ajax.reload();
            $('#beneficiaryAge').val('');
        }
    });
}

function EditBeneficiary(id) {
    $('#beneficiaryAge').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/beneficiaries/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#beneficiaryId').val(result.id);
            $('#beneficiaryGender').val(result.gender);
            $('#beneficiaryAge').val(result.age);
            $('#beneficiaryAge').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function SaveBeneficiary() {
    if ($('#id').val() == '') {
        toastr.error("You must save the client first to create beneficiary.", "Server Response");
    }
    else {
        if ($('#beneficiaryAge').val().trim() === "") {
            $('#beneficiaryAge').css('border-color', 'red');
            $('#beneficiaryAge').focus();
        }
        else {
            $('#beneficiaryAge').css('border-color', '#cccccc');

            var data = {
                ClientId: $('#id').val(),
                Gender: $('#beneficiaryGender').val(),
                Age: $('#beneficiaryAge').val()
            };

            $.ajax({
                url: "/api/beneficiaries",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Beneficiary has been saved to database.", "Server Response");
                    tableBeneficiary.ajax.reload();
                    $('#beneficiaryAge').val('');
                }
            });
        }
    }
}