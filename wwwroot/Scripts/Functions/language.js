// Reset Form
function resetFormLanguage() {
    $('#languageId').val('');
    $('#language').val('');
    $('#levelLanguage').val('');
}

// Disable Form
function disableFormLanguage() {
    document.getElementById('languageId').disabled = true;
    document.getElementById('language').disabled = true;
    document.getElementById('levelLanguage').disabled = true;
    $('#languageId').css('border-color', '#cccccc');
}

// Enable Form
function enableFormLanguage() {
    document.getElementById('languageId').disabled = false;
    document.getElementById('language').disabled = false;
    document.getElementById('levelLanguage').disabled = false;
    $('#languageId').css('border-color', '#cccccc');
    $('#language').focus();
}

var tableLanguage = [];
function getLanguages() {
    tableLanguage = $('#languageTable').DataTable({
        ajax: {
            url: "/api/languages?clientId=" + $('#id').val(),
            dataSrc: ""
        },
        columns: [
            {
                data: "id",
                visible: false
            },
            {
                data: "name"
            },
            {
                data: "level"
            },
            {
                data: "id",
                render: function (data) {
                    return "<button type='button' class='btn btn-outline-primary btn-xs me-1' onclick='LanguageEdit(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</button>"
                         + "<button type='button' class='btn btn-outline-danger btn-xs' onclick='LanguageDelete(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</button>";
                },
                "width": "150px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

function LanguageAction() {
    var action = '';
    action = document.getElementById('btnLanguageAction').innerText;
    if (action === "Save changes") {
        if ($('#language').val().trim() === "") {
            $('#language').css('border-color', 'red');
            $('#language').focus();
        }
        else {
            $('#language').css('border-color', '#cccccc');

            if ($('#levelLanguage').val().trim() === "") {
                $('#levelLanguage').css('border-color', 'red');
                $('#levelLanguage').focus();
            }
            else {
                $('#levelLanguage').css('border-color', '#cccccc');

                var data = {
                    ClientId: parseInt($('#id').val()),
                    Name: $('#language').val(),
                    Level: $('#levelLanguage').val()
                };

                $.ajax({
                    url: "/api/languages",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Language has been saved to database.", "Server Response");
                        tableLanguage.ajax.reload();
                        disableFormLanguage();
                        resetFormLanguage();
                       
                        $('#LanguageModal').modal('hide');
                        document.getElementById('btnLanguageAction').innerText = "Add New";
                    },
                    error: function (errormessage) {
                        toastr.error("This language is already exists.", "Server Response");
                        $('#LanguageModal').modal('hide');
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        enableFormLanguage();
        document.getElementById('btnLanguageAction').innerText = "Save changes";
        resetFormLanguage();
        $('#language').focus();
    }
    else if (action === "Update") {
        $('#languageId').css('border-color', '#cccccc');

        var data = {
            Id: parseInt($('#languageId').val()),
            ClientId: parseInt($('#id').val()),
            Name: $('#language').val(),
            Level: $('#levelLanguage').val()
        };

        $.ajax({
            url: "/api/languages/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Language has been updated.", "Server Response");
                tableLanguage.ajax.reload();
                disableFormLanguage();
                resetFormLanguage();
                document.getElementById('btnLanguageAction').innerText = "Add New";
                $('#language').val('');
                $('#LanguageModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This language is already exists.", "Server Response");
                disableFormLanguage();
                resetFormLanguage();
                document.getElementById('btnLanguageAction').innerText = "Add New";
                $('#language').val('');
                $('#LanguageModal').modal('hide');
            }
        });
    }
}

function LanguageEdit(id) {

    $('#languageId').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/languages/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#LanguageModal').modal('show');
            $('#languageId').val(result.id);
            $('#language').val(result.name);
            $('#levelLanguage').val(result.level);
            document.getElementById('btnLanguageAction').innerText = "Update";
            enableFormLanguage();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function LanguageDelete(id) {
    bootbox.confirm("Are you sure you want to delete this language record?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/languages/" + id,
                method: "DELETE",
                success: function () {
                    if (tableLanguage && typeof tableLanguage.ajax !== 'undefined') {
                        tableLanguage.ajax.reload();
                    }
                    toastr.success("Language record deleted successfully.", "Success");
                },
                error: function (xhr) {
                    console.error('Delete language error:', xhr);
                    toastr.error("Cannot delete this language record. It may be in use.", "Error");
                }
            });
        }
    });
}