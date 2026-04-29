// Reset Form
function resetFormReferecnce() {
    $('#cvReferencePositionId').val('');
    $('#cvReferenceName').val('');
    $('#cvReferenceDescription').val('');
    $('#cvReferenceOrganization').val('');
    $('#cvReferencePhone').val('');
    $('#cvReferenceEmail').val('');
}

// Disable Form
function disableFormReferecnce() {
    document.getElementById('cvReferencePositionId').disabled = true;
    document.getElementById('cvReferenceName').disabled = true;
    document.getElementById('cvReferenceDescription').disabled = true;
    document.getElementById('cvReferenceOrganization').disabled = true;
    document.getElementById('cvReferencePhone').disabled = true;
    document.getElementById('cvReferenceEmail').disabled = true;
    $('#jobExperiencePositionId').css('border-color', '#cccccc');
}

// Enable Form
function enableFormReferecnce() {
    document.getElementById('cvReferencePositionId').disabled = false;
    document.getElementById('cvReferenceName').disabled = false;
    document.getElementById('cvReferenceDescription').disabled = false;
    document.getElementById('cvReferenceOrganization').disabled = false;
    document.getElementById('cvReferencePhone').disabled = false;
    document.getElementById('cvReferenceEmail').disabled = false;
    $('#jobExperiencePositionId').css('border-color', '#cccccc');
}

// GET: Job Experiences Data
var tablecvReference = [];
function getcvReference() {
    tablecvReference = $('#cvReferenceTable').DataTable({
        ajax: {
            url: "/api/CvReferences/byclient/" + $('#id').val(),
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
                data: "jobPositions",
                render: function (data) {
                    return data.name;
                },
            },
            {
                data: "organization"
            },
            {
                data: "phone"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='javascript:void(0);' onclick='CvReferencesEdit(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='javascript:void(0);' onclick='CvReferencesDelete(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

// Job Experience Action
function cvReferenceAction() {
    var action = '';
    action = document.getElementById('btncvReferenceAction').innerText;
    if (action === "Save changes") {
        if ($('#cvReferenceName').val().trim() === "") {
            $('#cvReferenceName').css('border-color', 'red');
            $('#cvReferenceName').focus();
        }
        else {
            $('#cvReferenceName').css('border-color', '#cccccc');
                    var data = {
                        ClientId: parseInt($('#id').val()),
                        Name: $('#cvReferenceName').val(),
                        JobPositionId: parseInt($('#cvReferencePositionId').val()),
                        Description: $('#cvReferenceDescription').val(),
                        Organization: $('#cvReferenceOrganization').val(),
                        Phone: $('#cvReferencePhone').val(),
                        Email: $('#cvReferenceEmail').val()
                    };

                    $.ajax({
                        url: "/api/CvReferences",
                        data: JSON.stringify(data),
                        type: "POST",
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            toastr.success("reference has been saved to database.", "Server Response");
                            tablecvReference.ajax.reload();
                            $('#cvReferenceModal').modal('hide');
                            document.getElementById('btncvReferenceAction').innerText = "Add New";
                        },
                        error: function (errormessage) {
                            toastr.error("This reference cannot saved.", "Server Response");
                        }
                    });
        }
    }
    else if (action === "Add New") {
        enableFormReferecnce();
        document.getElementById('btncvReferenceAction').innerText = "Save changes";
        resetFormReferecnce();
        $('#cvReferencePositionId').focus();
    }
    else if (action === "Update") {
        $('#cvReferencePositionId').css('border-color', '#cccccc');

        var data = {
            Id: parseInt($('#cvReferenceId').val()),
            ClientId: parseInt($('#id').val()),
            Name: $('#cvReferenceName').val(),
            JobPositionId: parseInt($('#cvReferencePositionId').val()),
            Description: $('#cvReferenceDescription').val(),
            Organization: $('#cvReferenceOrganization').val(),
            Phone: $('#cvReferencePhone').val(),
            Email: $('#cvReferenceEmail').val()
        };

        $.ajax({
            url: "/api/CvReferences/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Job Reference has been updated.", "Server Response");
                tablecvReference.ajax.reload();
                disableFormReferecnce();
                resetFormReferecnce();
                document.getElementById('btncvReferenceAction').innerText = "Add New";
                $('#referralSourceName').val('');
                $('#cvReferenceModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This reference cannot updated.", "Server Response");
            }
        });
    }
}

// Edit Job Exerpience
function CvReferencesEdit(id) {

    $('#cvReferencePositionId').css('border-color', '#cccccc');

    $('#cvReferenceModal').modal('show');

    $.ajax({
        url: "/api/CvReferences/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#cvReferenceId').val(result.id);
            $('#cvReferencePositionId').val(result.jobPositionId);
            $('#cvReferenceName').val(result.name);
            $('#cvReferenceDescription').val(result.description);
            $('#cvReferenceOrganization').val(result.organization);
            $('#cvReferencePhone').val(result.phone);
            $('#cvReferenceEmail').val(result.email);
            document.getElementById('btncvReferenceAction').innerText = "Update";
            enableFormReferecnce();
            $('#cvReferenceName').focus();
            toastr.info("Reference loaded for editing.", "Info");
        },
        error: function (xhr) {
            console.error('Edit CV reference error:', xhr);
            toastr.error("Failed to load reference data.", "Error");
        }
    });
    return false;
}

// Delete Job Experience
function CvReferencesDelete(id) {
    bootbox.confirm("Are you sure you want to delete this reference?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/CvReferences/" + id,
                method: "DELETE",
                success: function () {
                    if (tablecvReference && typeof tablecvReference.ajax !== 'undefined') {
                        tablecvReference.ajax.reload();
                    }
                    toastr.success("Reference deleted successfully.", "Success");
                },
                error: function (xhr) {
                    console.error('Delete CV reference error:', xhr);
                    toastr.error("Cannot delete this reference. It may be in use.", "Error");
                }
            });
        }
    });
}