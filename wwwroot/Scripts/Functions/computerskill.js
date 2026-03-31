// Reset Form
function resetFormComputerSkill() {
    $('#computerSkillId').val('');
    $('#computerSkillSubject').val('');
    $('#computerSkillLevel').val('');
    $('#computerSkillCertified').val('');
    $('#computerSkillDuring').val('');
    $('#computerSkillDescription').val('');
}

// Disable Form
function disableFormComputerSkill() {
    document.getElementById('computerSkillId').disabled = true;
    document.getElementById('computerSkillSubject').disabled = true;
    document.getElementById('computerSkillLevel').disabled = true;
    document.getElementById('computerSkillCertified').disabled = true;
    document.getElementById('computerSkillDuring').disabled = true;
    document.getElementById('computerSkillDescription').disabled = true;
    $('#computerSkillId').css('border-color', '#cccccc');
}

// Enable Form
function enableFormComputerSkill() {
    document.getElementById('computerSkillId').disabled = false;
    document.getElementById('computerSkillSubject').disabled = false;
    document.getElementById('computerSkillLevel').disabled = false;
    document.getElementById('computerSkillCertified').disabled = false;
    document.getElementById('computerSkillDuring').disabled = false;
    document.getElementById('computerSkillDescription').disabled = false;
    $('#computerSkillId').css('border-color', '#cccccc');
    $('#computerSkillSubject').focus();
}

var tableComputerSkill = [];
function getComputerSkill() {
    tableComputerSkill = $('#computerSkillTable').DataTable({
        ajax: {
            url: "/api/computerskills?clientId=" + $('#id').val(),
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "skill"
            },
            {
                data: "level"
            },
            {
                data: "certified"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='ComputerSkillEdit(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='ComputerSkillDelete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

function ComputerSkillAction() {
    var action = '';
    action = document.getElementById('btnComputerSkillAction').innerText;
    if (action === "Save changes") {
        if ($('#computerSkillSubject').val().trim() === "") {
            $('#computerSkillSubject').css('border-color', 'red');
            $('#computerSkillSubject').focus();
        }
        else {
            $('#computerSkillSubject').css('border-color', '#cccccc');

            if ($('#computerSkillLevel').val().trim() === "") {
                $('#computerSkillLevel').css('border-color', 'red');
                $('#computerSkillLevel').focus();
            }
            else {
                $('#computerSkillLevel').css('border-color', '#cccccc');

                var data = {
                    ClientId: $('#id').val(),
                    Skill: $('#computerSkillSubject').val(),
                    Level: $('#computerSkillLevel').val(),
                    Certified: $('#computerSkillCertified').val(),
                    During: $('#computerSkillDuring').val(),
                    Description: $('#computerSkillDescription').val()
                };

                $.ajax({
                    url: "/api/computerskills",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Computer skill has been saved to database.", "Server Response");
                        tableComputerSkill.ajax.reload();
                        disableFormComputerSkill();
                        resetFormComputerSkill();
                        document.getElementById('btnComputerSkillAction').innerText = "Add New";
                        $('#ComputerSkillModal').modal('hide');
                    },
                    error: function (errormessage) {
                        toastr.error("This computer skill is already exists.", "Server Response");
                        $('#ComputerSkillModal').modal('hide');
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        enableFormComputerSkill();
        document.getElementById('btnComputerSkillAction').innerText = "Save changes";
        resetFormComputerSkill();
        $('#computerSkillSubject').focus();
    }
    else if (action === "Update") {
        $('#computerSkillId').css('border-color', '#cccccc');

        var data = {
            Id: $('#computerSkillId').val(),
            ClientId: $('#id').val(),
            Skill: $('#computerSkillSubject').val(),
            Level: $('#computerSkillLevel').val(),
            Certified: $('#computerSkillCertified').val(),
            During: $('#computerSkillDuring').val(),
            Description: $('#computerSkillDescription').val()
        };

        $.ajax({
            url: "/api/computerskills/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Computer skill has been updated.", "Server Response");
                tableComputerSkill.ajax.reload();
                disableFormComputerSkill();
                resetFormComputerSkill();
                document.getElementById('btnComputerSkillAction').innerText = "Add New";
                $('#ComputerSkillModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This computer skill is already exists.", "Server Response");
                disableFormComputerSkill();
                resetFormComputerSkill();
                document.getElementById('btnComputerSkillAction').innerText = "Add New";
                $('#ComputerSkillModal').modal('hide');
            }
        });
    }
}

function ComputerSkillEdit(id) {

    $('#computerSkillId').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/computerskills/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ComputerSkillModal').modal('show');
            $('#computerSkillId').val(result.id);
            $('#computerSkillSubject').val(result.skill);
            $('#computerSkillLevel').val(result.level);
            $('#computerSkillCertified').val(result.certified);
            $('#computerSkillDuring').val(result.during);
            $('#computerSkillDescription').val(result.description);
            document.getElementById('btnComputerSkillAction').innerText = "Update";
            enableFormComputerSkill();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function ComputerSkillDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/computerskills/" + id,
                method: "DELETE",
                success: function () {
                    tableComputerSkill.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This computer skill is being used.", "Server Response");
                }
            });
        }
    });
}