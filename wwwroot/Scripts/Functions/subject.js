//alert("Hello! I am an alert box!!");

var tableSubject = [];

function GetSubjects() {

    tableSubject = $('#subjectTable').DataTable({
        ajax: {
            url: "/api/subjects",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "subjectName"
            },
            
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='SubjectEdit1(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='SubjectDelete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[2, "asc"], [0, "desc"]]
    });
}

function SubjectAction() {
    var action = '';
    action = document.getElementById('btnSubjectAction').innerText;
    if (action === "Save changes") {
        if ($('#subjectName').val().trim() === "") {
            $('#subjectName').css('border-color', 'red');
            $('#subjectName').focus();
        }
        else {
            $('#subjectName').css('border-color', '#cccccc');

            var data = {
                SubjectName: $('#subjectName').val()
            };
            $.ajax({
                url: "/api/subjects",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("Subject has been saved to database.", "Server Response");
                    tableSubject.ajax.reload();
                    document.getElementById('subjectName').disabled = true;
                    document.getElementById('btnSubjectAction').innerText = "Add New";
                    $('#subjectName').val('');
                },
                error: function (errormessage) {
                    toastr.error("This subject is already exists.", "Server Response");
                    document.getElementById('subjectName').disabled = true;
                    document.getElementById('btnSubjectAction').innerText = "Add New";
                    $('#subjectName').val('');
                }
            });
        }
    }
    else if (action === "Add New") {
        document.getElementById('subjectName').disabled = false;
        document.getElementById('btnSubjectAction').innerText = "Save changes";
        $('#subjectName').val('');
        $('#subjectName').focus();
    }
    else if (action === "Update")
    {
        $('#subjectName').css('border-color', '#cccccc');

        var data = {
            Id: $('#id').val(),
            SubjectName: $('#subjectName').val()
        };
        $.ajax({
            url: "/api/subjects/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Subject has been updated.", "Server Response");
                tableSubject.ajax.reload();
                document.getElementById('subjectName').disabled = true;
                
                document.getElementById('btnSubjectAction').innerText = "Add New";
                $('#subjectName').val('');
            },
            error: function (errormessage) {
                toastr.error("This subject is already exists.", "Server Response");
                document.getElementById('subjectName').disabled = true;
                
                document.getElementById('btnCaseWorkerAction').innerText = "Add New";
                $('#subjectName').val('');
            }
        });
    }
}
 


function SubjectEdit1(id) {
    $('#subjectName').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/subjects/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#id').val(result.id);
            $('#subjectName').val(result.subjectName);
            document.getElementById('btnSubjectAction').innerText = "Update";
            document.getElementById('subjectName').disabled = false;
            $('#subjectName').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}



function SubjectDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/subjects/" + id,
                method: "DELETE",
                success: function () {
                    tableSubject.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This subjects is being used.", "Server Response");
                }
            });
        }
    });
}