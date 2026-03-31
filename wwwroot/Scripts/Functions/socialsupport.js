$(document).ready(function () {
    $('#socialSupportModel').on('show.bs.modal', function () {
        document.getElementById('btnSocialSupportsAction').innerText = "Add New";
        GetSocialSupportsByClientId;
    });
});

function ControlSocialSupport(bool) {
    document.getElementById('healthProblemCheckbox').disabled = bool;
    document.getElementById('drugProblemCheckbox').disabled = bool;
    document.getElementById('babycareProblemCheckbox').disabled = bool;
    document.getElementById('personalProblemCheckbox').disabled = bool;
    document.getElementById('legalProblemCheckbox').disabled = bool;
    document.getElementById('otherProblemCheckbox').disabled = bool;
    document.getElementById('healthProblem').disabled = bool;
    document.getElementById('drugProblem').disabled = bool;
    document.getElementById('babycareProblem').disabled = bool;
    document.getElementById('personalProblem').disabled = bool;
    document.getElementById('legalProblem').disabled = bool;
    document.getElementById('otherProblem').disabled = bool;
    document.getElementById('caseIdss').disabled = bool;
}

function ClearSocialSupport() {
    document.getElementById("healthProblemCheckbox").checked = false;
    document.getElementById("drugProblemCheckbox").checked = false;
    document.getElementById("babycareProblemCheckbox").checked = false;
    document.getElementById("personalProblemCheckbox").checked = false;
    document.getElementById("legalProblemCheckbox").checked = false;
    document.getElementById("otherProblemCheckbox").checked = false;
    $('#healthProblem').val('');
    $('#drugProblem').val('');
    $('#babycareProblem').val('');
    $('#personalProblem').val('');
    $('#legalProblem').val('');
    $('#otherProblem').val('');
}

var tableSocialSupport = [];
//This function used when get Id when click and use the selector from table Socials  in clients 
function GetSocialSupportsByClientId(id) {
    ClearSocialSupport()

        if ($('#id').val() != "") {
            tableSocialSupport = $('#Socials').DataTable({
                ajax: {    
                    url: "/api/socialsupports?clientId=" + id,
                    dataSrc: ""
                },
                columns: [
                    {
                        data: "id"
                    },
                    {
                        data: function (data) {
                            
                            if (data.healthProblem.length > 10) {
                                return data.healthProblem.substring(0, 10) + ".....";
                            }
                            else {
                                return data.healthProblem.substring(0, 10);
                            }
                             
                        } 
                    },
                    {
                        data: function (data) {
                            
                            if (data.drugProblem.length > 10) {
                                return data.drugProblem.substring(0, 10) + ".....";
                            }
                            else {
                                return data.drugProblem.substring(0, 10);
                            }
                             
                        }
                    },
                    {
                         data: function (data) {
                            
                             if (data.babyProblem.length > 10) {
                                 return data.babyProblem.substring(0, 10) + ".....";
                            }
                            else {
                                 return data.babyProblem.substring(0, 10);
                            }
                             
                        }
                    },
                    {
                        data: function (data) {
                            
                            if (data.personalProblem.length > 10) {
                                return data.personalProblem.substring(0, 10) + ".....";
                            }
                            else {
                                return data.personalProblem.substring(0, 10);
                            }
                             
                        }
                    },
                     {
                         data: function (data) {

                             if (data.legalProblem.length > 10) {
                                 return data.legalProblem.substring(0, 10) + ".....";
                             }
                             else {
                                 return data.legalProblem.substring(0, 10);
                             }

                         }
                     },
                      {
                          data: function (data) {

                              if (data.otherProblem.length > 10) {
                                  return data.otherProblem.substring(0, 10) + ".....";
                              }
                              else {
                                  return data.otherProblem.substring(0, 10);
                              }

                          }
                      },
                    {
                        data: "id",
                        render: function (data) {
                            return "<a href='#' onclick='EditSocial(" + data + ");'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='DeleteSocial(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Delete</a>";
                        }
                    }
                ],
                
                destroy: true,
                "order": [[1, "desc"]]
            });
        }
}

function SocialSupportAction() {
    
    var action = '';
    action = document.getElementById('btnSocialSupportsAction').innerText;
    if (action === "Save changes") {
        var healthProblemCheckboxCon;
        if ($('#healthProblemCheckbox').prop('checked') === true) {
            healthProblemCheckboxCon = true;
            $('#healthProblem').val();
        }
        else {
            healthProblemCheckboxCon = false;
            $('#healthProblem').val('');
        }

        var drugProblemCheckboxCon;
        if ($('#drugProblemCheckbox').prop('checked') === true) {
            drugProblemCheckboxCon = true;
            $('#drugProblem').val();
        }
        else {
            drugProblemCheckboxCon = false;
            $('#drugProblem').val('');
        }

        var personalProblemCheckboxCon;
        if ($('#personalProblemCheckbox').prop('checked') === true) {
            personalProblemCheckboxCon = true;
            $('#personalProblem').val();
        }
        else {
            personalProblemCheckboxCon = false;
            $('#personalProblem').val('');
        }

        var legalProblemCheckboxCon;
        if ($('#legalProblemCheckbox').prop('checked') === true) {
            legalProblemCheckboxCon = true;
            $('#legalProblem').val();
        }
        else {
            legalProblemCheckboxCon = false;
            $('#legalProblem').val('');
        }

        var babycareProblemCheckboxCon;
        if ($('#babycareProblemCheckbox').prop('checked') === true) {
            babycareProblemCheckboxCon = true;
            $('#babycareProblem').val();
        }
        else {
            babycareProblemCheckboxCon = false;
            $('#babycareProblem').val('');
        }

        var otherProblemCheckboxCon;
        if ($('#otherProblemCheckbox').prop('checked') === true) {
            otherProblemCheckboxCon = true;
            $('#otherProblem').val();
        }
        else {
            otherProblemCheckboxCon = false;
            $('#otherProblem').val('');
        }       
            var data = {
                clientId: $('#id').val(),
                caseId: $('#caseIdss').val(),
                healthProblembool:
                   healthProblemCheckboxCon,
                healthProblem:
                    $("#healthProblem").val(),
                drugProblembool:
                   drugProblemCheckboxCon,
                drugProblem:
                    $("#drugProblem").val(),
                personalProblembool:
                   personalProblemCheckboxCon,
                personalProblem:
                    $("#personalProblem").val(),
                legalProblembool:
                    legalProblemCheckboxCon,
                legalProblem:
                    $("#legalProblem").val(),
                babyProblembool:
                   babycareProblemCheckboxCon,
                babyProblem:
                    $("#babycareProblem").val(),
                otherProblembool:
                  otherProblemCheckboxCon,
                otherProblem:
                    $("#otherProblem").val(),     
        };
        $.ajax({
            url: "/api/socialsupports",
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("New social support record has been saved to database.", "Server Response");
                tableSocialSupport.ajax.reload();
                document.getElementById('btnSocialSupportsAction').innerText = "Add New";
                $('#socialSupportModel').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This social support record is already exists.", "Server Response");
                //document.getElementById('btnSocialSupportsAction').innerText = "Add New";
            }
        });
    }
    else if (action === "Add New") {
        ClearSocialSupport();
        document.getElementById('btnSocialSupportsAction').innerText = "Save changes";
        ControlSocialSupport()
    }
    else if (action === "Update") {

        ControlSocialSupport(false);
        var healthProblemCheckboxCon;
        if ($('#healthProblemCheckbox').prop('checked') === true) {
            healthProblemCheckboxCon = true;
            $('#healthProblem').val();
        }
        else {
            healthProblemCheckboxCon = false;
            $('#healthProblem').val('');
        }

        var drugProblemCheckboxCon;
        if ($('#drugProblemCheckbox').prop('checked') === true) {
            drugProblemCheckboxCon = true;
            $('#drugProblem').val();
        }
        else {
            drugProblemCheckboxCon = false;
            $('#drugProblem').val('');
        }

        var personalProblemCheckboxCon;
        if ($('#personalProblemCheckbox').prop('checked') === true) {
            personalProblemCheckboxCon = true;
            $('#personalProblem').val();
        }
        else {
            personalProblemCheckboxCon = false;
            $('#personalProblem').val('');
        }

        var legalProblemCheckboxCon;
        if ($('#legalProblemCheckbox').prop('checked') === true) {
            legalProblemCheckboxCon = true;
            $('#legalProblem').val();
        }
        else {
            legalProblemCheckboxCon = false;
            $('#legalProblem').val('');
        }

        var babycareProblemCheckboxCon;
        if ($('#babycareProblemCheckbox').prop('checked') === true) {
            babycareProblemCheckboxCon = true;
            $('#babycareProblem').val();
        }
        else {
            babycareProblemCheckboxCon = false;
            $('#babycareProblem').val('');
        }

        var otherProblemCheckboxCon;
        if ($('#otherProblemCheckbox').prop('checked') === true) {
            otherProblemCheckboxCon = true;
            $('#otherProblem').val();
        }
        else {
            otherProblemCheckboxCon = false;
            $('#otherProblem').val('');
        }
            var data = {
                Id: $('#socialSupportId').val(),
                clientId: $('#id').val(),
                caseId: $('#caseIdss').val(),
                healthProblembool:
                   healthProblemCheckboxCon,
                healthProblem:
                    $("#healthProblem").val(),
                drugProblembool:
                   drugProblemCheckboxCon,
                drugProblem:
                    $("#drugProblem").val(),
                personalProblembool:
                   personalProblemCheckboxCon,
                personalProblem:
                    $("#personalProblem").val(),
                legalProblembool:
                    legalProblemCheckboxCon,
                legalProblem:
                    $("#legalProblem").val(),
                babyProblembool:
                   babycareProblemCheckboxCon,
                babyProblem:
                    $("#babycareProblem").val(),
                otherProblembool:
                  otherProblemCheckboxCon,
                otherProblem:
                    $("#otherProblem").val(),
            };
        $.ajax({
            url: "/api/socialsupports/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Record has been updated.", "Server Response");
                tableSocialSupport.ajax.reload();
                document.getElementById('btnSocialSupportsAction').innerText = "Add New";
                $('#socialSupportModel').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This Record is already exists.", "Server Response");
                document.getElementById('btnSocialSupportsAction').innerText = "Add New";

            }
        });
    }
}


function EditSocial(id) {
    $.ajax({
        url: "/api/socialsupports/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#socialSupportModel').modal('show');

            $('#caseIds').val(result.caseId);

            $('#socialSupportId').val(result.id);

            $('#healthProblem').val(result.healthProblem);

            $('#drugProblem').val(result.drugProblem);

            $('#babycareProblem').val(result.babyProblem);

            $('#personalProblem').val(result.personalProblem);

            $('#legalProblem').val(result.legalProblem);

            $('#otherProblem').val(result.otherProblem);

            if (result.healthProblembool == true) {
                $('#healthProblemCheckbox').prop('checked', true);
            }
            else {
                $('#healthProblemCheckbox').prop('checked', false);
            }
            if (result.drugProblembool == true) {
                $('#drugProblemCheckbox').prop('checked', true);
            }
            else {
                $('#drugProblemCheckbox').prop('checked', false);
            }
            if (result.babyProblembool == true) {
                $('#babycareProblemCheckbox').prop('checked', true);
            }
            else {
                $('#babycareProblemCheckbox').prop('checked', false);
            }
            if (result.personalProblembool == true) {
                $('#personalProblemCheckbox').prop('checked', true);
            }
            else {
                $('#personalProblemCheckbox').prop('checked', false);
            }
            if (result.publicHoliday == true) {
                $('#placementPublicHoliday').prop('checked', true);
            }
            else {
                $('#placementPublicHoliday').prop('checked', false);
            }
            if (result.legalProblembool == true) {
                $('#legalProblemCheckbox').prop('checked', true);
            }
            else {
                $('#legalProblemCheckbox').prop('checked', false);
            }
            if (result.otherProblembool == true) {
                $('#otherProblemCheckbox').prop('checked', true);
            }
            else {
                $('#otherProblemCheckbox').prop('checked', false);
            }
            document.getElementById('btnSocialSupportsAction').innerText = "Update";
        },
        
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }

    });
 
    return false;
}

function DeleteSocial(id) {
    bootbox.confirm("Are you sure you want to delete this Social support record?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/socialsupports/" + id,
                method: "DELETE",
                success: function () {
                    tableSocialSupport.ajax.reload();
                    toastr.success("Record Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This Social support record is being used.", "Server Response");
                }
            });
        }
    });
}

function BtnSocialsupport() {
    ControlSocialSupport(true);
    ClearSocialSupport();
}