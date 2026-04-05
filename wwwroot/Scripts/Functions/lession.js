
var tableLession = [];

function GetLessions() {

    tableLession = $('#LessionTable').DataTable({
        ajax: {
            url: "/api/Lessions",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: function (data) {
                    return data.subject.subjectName;
                }
            },

             {
                 data: "lessionSub"
             },
            
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='lessionEdit(" + data + ")'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='LessionDelete(" + data + ")'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[1, "desc"], [2, "asc"]]
    });
}

function LessionAction() {
    var action = '';
    action = document.getElementById('btnLessionAction').innerText;
    if (action === "Save changes") {
        if ($('#SubjectLesson').val().trim() === "") {
            $('#SubjectLesson').css('border-color', 'red');
            $('#SubjectLesson').focus();
        }
        else {
            $('#SubjectLesson').css('border-color', '#cccccc');
            if ($('#lessionSub').val().trim() === "") {
                $('#lessionSub').css('border-color', 'red');
                $('#lessionSub').focus();
            }
            else {
                $('#lessionSub').css('border-color', '#cccccc');
                var data = {
                    subjectId: $('#SubjectLesson').val(),
                    lessionSub: $('#lessionSub').val()
                };
                $.ajax({
                    url: "/api/Lessions/",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Lession has been saved to database.", "Server Response");
                        tableLession.ajax.reload();
                        document.getElementById('SubjectLesson').disabled = true;
                        document.getElementById('lessionSub').disabled = true;
                        document.getElementById('btnLessionAction').innerText = "Add New";
                        $('#subjectName').val('');
                    },
                    error: function (errormessage) {
                        toastr.error("This lession is already exists.", "Server Response");
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        document.getElementById('SubjectLesson').disabled = false;
        document.getElementById('lessionSub').disabled = false;
        document.getElementById('btnLessionAction').innerText = "Save changes";
        $('#subjectName').val('');
        $('#lessionSub').val('');
        $('#subjectName').focus();
        GetLessionData(true);
    }
    else if (action === "Update")
    {
        $('#SubjectLesson').css('border-color', '#cccccc');
        var data = {
            Id: $('#lessonId').val(),
            subjectId: $('#SubjectLesson').val(),
            lessionSub: $('#lessionSub').val()
        };
        console.log(data);
        $.ajax({
            url: "/api/lessions/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Lession has been updated.", "Server Response");
                tableLession.ajax.reload();
                document.getElementById('SubjectLesson').disabled = true;
                document.getElementById('lessionSub').disabled = true;
                document.getElementById('btnLessionAction').innerText = "Add New";
                $('#SubjectLesson').val('');
                $('#SubjectLesson').val('');
            },
            error: function (errormessage) {
                toastr.error("This lession is already exists.", "Server Response");
                //document.getElementById('subjectName').disabled = true;
                //document.getElementById('btnCaseWorkerAction').innerText = "Add New";
                //$('#subjectName').val('');
            }
        });
    }
}
 


function lessionEdit(id) {
    $('#SubjectLesson').css('border-color', '#cccccc');
    GetLessionData(true);
    $.ajax({
        url: "/api/Lessions/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#lessonId').val(result.id);
            $('#SubjectLesson').val(result.subjectId);
            $('#lessionSub').val(result.lessionSub);
            document.getElementById('btnLessionAction').innerText = "Update";
            document.getElementById('SubjectLesson').disabled = false;
            document.getElementById('lessionSub').disabled = false;
            $('#SubjectLesson').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}



function LessionDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/lessions/" + id,
                method: "DELETE",
                success: function () {
                    tableLession.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This lession is being used.", "Server Response");
                }
            });
        }
    });
}


function GetLessionData(Select) {
    if (Select == true) {
        var data = {};
        $.ajax({
            url: "/api/subjects/",
            data: JSON.stringify(data),
            type: "get",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (rusult) {
                $("#SubjectLesson").empty();
                $("#SubjectLesson").prepend("<option value=''>Select subject</option>");
                for (var i = 0; i < rusult.length; i++) {
                    $("#SubjectLesson").append('<option value="' + rusult[i]['id'] + '">' + rusult[i].subjectName + '</option>');
                }
                $.ajax(data);
            },
            error: function (errormessage) {
                toastr.error("Something goes wrong!!", "Server Response");
            }
        });
    } else {
        $("#SubjectLesson").empty();
        $("#SubjectLesson").prepend("<option value=''>Select subject</option>");
    }
}