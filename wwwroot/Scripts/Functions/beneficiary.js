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
                        return "<a href='javascript:void(0);' onclick='EditBeneficiary(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='javascript:void(0);' onclick='DeleteBeneficiary(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</a>";
                    }
                }
            ],
            destroy: true,
            "order": [[1, "desc"]]
        });
    }
}

function DeleteBeneficiary(id) {
    bootbox.confirm("Are you sure you want to delete this beneficiary?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/beneficiaries/" + id,
                method: "DELETE",
                success: function () {
                    if (tableBeneficiary && typeof tableBeneficiary.ajax !== 'undefined') {
                        tableBeneficiary.ajax.reload();
                    }
                    toastr.success("Beneficiary deleted successfully.", "Success");
                },
                error: function (xhr) {
                    console.error('Delete beneficiary error:', xhr);
                    toastr.error("Cannot delete this beneficiary. It may be in use.", "Error");
                }
            });
        }
    });
}

function UpdateBeneficiary() {
    if (!$('#beneficiaryId').val() || $('#beneficiaryId').val() === '') {
        toastr.error("Please select a beneficiary to update.", "Error");
        return;
    }

    if (!$('#beneficiaryAge').val() || $('#beneficiaryAge').val().trim() === '') {
        $('#beneficiaryAge').css('border-color', 'red');
        $('#beneficiaryAge').focus();
        toastr.error("Age is required.", "Validation Error");
        return;
    }

    $('#beneficiaryAge').css('border-color', '#cccccc');

    var data = {
        Id: parseInt($('#beneficiaryId').val()),
        ClientId: parseInt($('#id').val()),
        Gender: $('#beneficiaryGender').val(),
        Age: parseInt($('#beneficiaryAge').val())
    };

    $.ajax({
        url: "/api/beneficiaries/" + data.Id,
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            toastr.success("Beneficiary has been updated.", "Success");
            if (tableBeneficiary && typeof tableBeneficiary.ajax !== 'undefined') {
                tableBeneficiary.ajax.reload();
            }
            $('#beneficiaryAge').val('');
            $('#beneficiaryId').val('');
        },
        error: function (xhr) {
            console.error('Update beneficiary error:', xhr);
            toastr.error("Failed to update beneficiary. Please try again.", "Error");
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
            toastr.info("Beneficiary loaded for editing.", "Info");
        },
        error: function (xhr) {
            console.error('Edit beneficiary error:', xhr);
            toastr.error("Failed to load beneficiary data.", "Error");
        }
    });
    return false;
}

function SaveBeneficiary() {
    if (!$('#id').val() || $('#id').val() === '') {
        toastr.error("Please save the client first before adding beneficiaries.", "Error");
        return;
    }

    if (!$('#beneficiaryAge').val() || $('#beneficiaryAge').val().trim() === '') {
        $('#beneficiaryAge').css('border-color', 'red');
        $('#beneficiaryAge').focus();
        toastr.error("Age is required.", "Validation Error");
        return;
    }

    $('#beneficiaryAge').css('border-color', '#cccccc');

    var age = parseInt($('#beneficiaryAge').val());
    if (isNaN(age) || age < 0 || age > 150) {
        $('#beneficiaryAge').css('border-color', 'red');
        $('#beneficiaryAge').focus();
        toastr.error("Please enter a valid age (0-150).", "Validation Error");
        return;
    }

    var data = {
        ClientId: parseInt($('#id').val()),
        Gender: $('#beneficiaryGender').val(),
        Age: age
    };

    $.ajax({
        url: "/api/beneficiaries",
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            toastr.success("Beneficiary has been added successfully.", "Success");
            if (tableBeneficiary && typeof tableBeneficiary.ajax !== 'undefined') {
                tableBeneficiary.ajax.reload();
            }
            $('#beneficiaryAge').val('');
            $('#beneficiaryId').val('');
        },
        error: function (xhr) {
            console.error('Save beneficiary error:', xhr);
            toastr.error("Failed to save beneficiary. Please try again.", "Error");
        }
    });
}