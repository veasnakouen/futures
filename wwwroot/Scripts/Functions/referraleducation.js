$(document).ready(function () {
    $('#referralEducation').on('show.bs.modal', function () {
        $('#referralDate').css('border-color', '#cccccc');
        $('#subjectfurtherEducationreferral').css('border-color', '#cccccc');
        $('#provider').css('border-color', '#cccccc');
        DisabledReferralEducation();

        GetFurtherEducationSubject("");
        document.getElementById('btnReferralEducationAction').innerText = "Add New";
        $('#referralDate').val('');
    });
});

function GetFurtherEducationSubject(SelectedValue) {
    var data = {};
    $.ajax({
        url: "/api/furtherEducationReferralSubjects" ,
        data: JSON.stringify(data),
        type: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (rusult) {
            $("#subjectfurtherEducationreferral").empty();
            $("#subjectfurtherEducationreferral").prepend("<option value=''>Select case worker</option>");

            for (var i = 0; i < rusult.length; i++) {
                $("#subjectfurtherEducationreferral").append('<option value="' + rusult[i]['id'] + '">'  + rusult[i]['subject'] + '</option>');
            }
            $("select option[value='" + SelectedValue + "']").attr('selected', 'selected');
            $.ajax(data);
        },
        error: function (errormessage) {
            toastr.error("Something goes wrong!!", "Server Response");
        }
    });
}

var tableReferralEducation = [];

function GetReferralEducation() {
    var clientId = $("#id").val();
    tableReferralEducation = $('#referralEducationTable').DataTable({
        ajax: {
            url: "/api/furthereducationreferrals?clientId=" + clientId,
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "referralDate",
                render: function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : "0" + month) + "-" + date.getDate() + "-" + date.getFullYear();
                }
            },
            {
                data: "educationReferralSource.referralSource"
            },
            {
                data: "furtherEducationReferralSubject",
                render: function (data) {
                    return data.subject;
                },
            },
            {
                data: "duration"
            },
            {
                data: "referralBy"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='ReferralEducationEdit(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='ReferralEducationDelete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}


// Referral Education Action
function ReferralEducationAction(referralClientType) {
    var action = '';
    action = document.getElementById('btnReferralEducationAction').innerText;
    if (action === "Save changes") {
        if ($('#referralDate').val().trim() === "") {
            $('#referralDate').css('border-color', 'red');
            $('#referralDate').focus();
        }
        else {
            $('#referralDate').css('border-color', '#cccccc');

            if ($('#subjectfurtherEducationreferral').val().trim() === "") {
                $('#subjectfurtherEducationreferral').css('border-color', 'red');
                $('#subjectfurtherEducationreferral').focus();
            }
            else {
                $('#subjectfurtherEducationreferral').css('border-color', '#cccccc');

                if ($('#provider').val().trim() === "") {
                    $('#provider').css('border-color', 'red');
                    $('#provider').focus();
                }
                else {
                    $('#provider').css('border-color', '#cccccc');
                   
                        var data = {
                            ClientId: $('#id').val(),
                            ReferralDate: $('#referralDate').val(),
                            EducationReferralSourceId: $('#referralSourceId').val(),
                            furtherEducationReferralSubjectId: $('#subjectfurtherEducationreferral').val(),
                            Provider: $('#provider').val(),
                            Duration: $('#duration').val(),
                            ClientType: 'NONE'
                        };
                        $.ajax({
                            url: "/api/furthereducationreferrals",
                            data: JSON.stringify(data),
                            type: "POST",
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success: function (result) {
                                toastr.success("Referral has been saved to database.", "Server Response");
                                tableReferralEducation.ajax.reload();
                                DisabledReferralEducation();
                                document.getElementById('btnReferralEducationAction').innerText = "Add New";
                                $('#referralDate').val('');
                                $('#subjectfurtherEducationreferral').val('');
                                $('#provider').val('');
                                $('#duration').val('');
                                $('#referralClientType').val('');
                                $('#referralEducation').modal('hide');
                            },
                            error: function (errormessage) {
                                toastr.error("This referral is already exists.", "Server Response");
                                //DisabledReferralEducation();
                                //document.getElementById('btnReferralEducationAction').innerText = "Add New";
                                //$('#referralDate').val('');
                                //$('#subjectfurtherEducationreferral').val('');
                                //$('#provider').val('');
                                //$('#duration').val('');
                                //$('#referralClientType').val('');
                            }
                        });
                }
            }
        }
    }
    else if (action === "Add New") {
        EnabledReferralEducation();
        document.getElementById('btnReferralEducationAction').innerText = "Save changes";
        $('#referralDate').val('');
        $('#subjectfurtherEducationreferral').val('');
        $('#provider').val('');
        $('#duration').val('');
        $('#referralClientType').val('');
        $('#referralSourceName').focus();
    }
    else if (action === "Update") {
        $('#referralDate').css('border-color', '#cccccc');
        $('#subjectfurtherEducationreferral').css('border-color', '#cccccc');
        $('#provider').css('border-color', '#cccccc');


        if ($('#referralDate').val().trim() === "") {
            $('#referralDate').css('border-color', 'red');
            $('#referralDate').focus();
        }
        else {
            $('#referralDate').css('border-color', '#cccccc');

            if ($('#subjectfurtherEducationreferral').val().trim() === "") {
                $('#subjectfurtherEducationreferral').css('border-color', 'red');
                $('#subjectfurtherEducationreferral').focus();
            }
            else {
                $('#subjectfurtherEducationreferral').css('border-color', '#cccccc');

                if ($('#provider').val().trim() === "") {
                    $('#provider').css('border-color', 'red');
                    $('#provider').focus();
                }
                else {
                    $('#provider').css('border-color', '#cccccc');
                        var data = {
                            Id: $('#referralEducationId').val(),
                            ClientId: $('#id').val(),
                            ReferralDate: $('#referralDate').val(),
                            EducationReferralSourceId: $('#referralSourceId').val(),
                            furtherEducationReferralSubjectId: $('#subjectfurtherEducationreferral').val(),
                            Provider: $('#provider').val(),
                            Duration: $('#duration').val(),
                            ClientType: 'NONE'
                        };
                        $.ajax({
                            url: "/api/furthereducationreferrals/" + data.Id,
                            data: JSON.stringify(data),
                            type: "PUT",
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success: function (result) {
                                toastr.success("Referral has been updated.", "Server Response");
                                tableReferralEducation.ajax.reload();
                                DisabledReferralEducation();
                                document.getElementById('btnReferralEducationAction').innerText = "Add New";
                                $('#referralDate').val('');
                                $('#subjectfurtherEducationreferral').val('');
                                $('#provider').val('');
                                $('#duration').val('');
                                $('#referralClientType').val('');
                                $('#referralEducation').modal('hide');
                            },
                            error: function (errormessage) {
                                toastr.error("This referral is already exists.", "Server Response");
                                //DisabledReferralEducation();
                                //document.getElementById('btnReferralEducationAction').innerText = "Add New";
                                //$('#referralDate').val('');
                                //$('#subjectfurtherEducationreferral').val('');
                                //$('#provider').val('');
                                //$('#duration').val('');
                            }
                        });
                    }
            }
        } 
    }
}

function ReferralEducationEdit(id) {

    $('#referralDate').css('border-color', '#cccccc');
    $('#subjectfurtherEducationreferral').css('border-color', '#cccccc');
    $('#provider').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/furthereducationreferrals/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#referralEducation').modal('show');
            $('#referralEducationId').val(result.furtherEducationReferralDto.id);

            GetFurtherEducationSubject(result.furtherEducationReferralDto.furtherEducationReferralSubjectId);

            var referralDate = new Date(result.furtherEducationReferralDto.referralDate);
            var dd = referralDate.getDate();
            var mm = referralDate.getMonth() + 1; //January is 0!
            var yyyy = referralDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            referralDate = mm + '/' + dd + '/' + yyyy;
            $('#referralDate').val(referralDate);

            $('#provider').val(result.furtherEducationReferralDto.provider);
            $('#duration').val(result.furtherEducationReferralDto.duration);
            $('#referralClientType').val(result.furtherEducationReferralDto.clientType);
            $('#referralSourceId').val(result.furtherEducationReferralDto.educationReferralSource.id);
            
            document.getElementById('btnReferralEducationAction').innerText = "Update";
            EnabledReferralEducation();
            $('#referralDate').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function ReferralEducationDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/furthereducationreferrals/" + id,
                method: "DELETE",
                success: function () {
                    tableReferralEducation.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This referral is being used.", "Server Response");
                }
            });
        }
    });
}

function EnabledReferralEducation()
{
    document.getElementById('referralDate').disabled = false;
    document.getElementById('referralSourceId').disabled = false;
    document.getElementById('subjectfurtherEducationreferral').disabled = false;
    document.getElementById('provider').disabled = false;
    document.getElementById('duration').disabled = false;
    
    
}

function DisabledReferralEducation()
{
    document.getElementById('referralDate').disabled = true;
    document.getElementById('referralSourceId').disabled = true;
    document.getElementById('subjectfurtherEducationreferral').disabled = true;
    document.getElementById('provider').disabled = true;
    document.getElementById('duration').disabled = true;
}

