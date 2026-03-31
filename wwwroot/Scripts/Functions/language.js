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
                data: "id"
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
                    return "<a href='#' onclick='LanguageEdit(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='LanguageDelete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>";
                },
                "width": "130px"
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
                    ClientId: $('#id').val(),
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
            Id: $('#languageId').val(),
            ClientId: $('#id').val(),
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
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/languages/" + id,
                method: "DELETE",
                success: function () {
                    tableLanguage.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This language is being used.", "Server Response");
                }
            });
        }
    });
}