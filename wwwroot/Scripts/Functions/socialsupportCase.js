$(document).ready(function () {
    $('#socialSupportCaseModel').on('show.bs.modal', function () {
        document.getElementById('btnSocialSupportCasesAction').innerText = "Add New";
        ClearSocialSupportCase();
        ControlSocialSupportCase(true)
        document.getElementById('caseworkerprogramCase').innerHTML = " ";
        activateSocialSupportTab('SocialSopportCase');
    });
});

function ControlSocialSupportCase(bool) {
    document.getElementById('HavecaseWorkerCase').disabled = bool;
    document.getElementById('noHaveCaseWorkerCase').disabled = bool;
    document.getElementById('SocialSupportcaseId').disabled = bool;
    document.getElementById('NohaveProblemCase').disabled = bool;
    document.getElementById('OpendatesocialSupportCase').disabled = bool;
    document.getElementById('ClosedateSocialsupportCase').disabled = bool;
    document.getElementById('StatusSocialsupportCase').disabled = bool;
    document.getElementById("SocialsupportdhealthProblemCheckbox").disabled = bool;
    document.getElementById("SocialsupportdrugProblemCheckbox").disabled = bool;
    document.getElementById("SocialsupportdbabycareProblemCheckbox").disabled = bool;
    document.getElementById("SocialsupportdpersonalProblemCheckbox").disabled = bool;
    document.getElementById("SocialsupportdlegalProblemCheckbox").disabled = bool;
    document.getElementById("SocialsupportdotherProblemCheckbox").disabled = bool;
    document.getElementById("SocialsupportNoteProblem").disabled = bool;
}

function ClearSocialSupportCase() {
    $("#noHaveCaseWorkerCase").prop("checked", true);
    $("#NohaveProblemCase").prop("checked", true);
    $('#OpendatesocialSupportCase').val('');
    $('#ClosedateSocialsupportCase').val('');
    document.getElementById("SocialSupportcaseId").selectedIndex = "0";
    document.getElementById('StatusSocialsupportCase').selectedIndex = "0";
    document.getElementById("SocialsupportdhealthProblemCheckbox").checked = false;
    document.getElementById("SocialsupportdrugProblemCheckbox").checked = false;
    document.getElementById("SocialsupportdbabycareProblemCheckbox").checked = false;
    document.getElementById("SocialsupportdpersonalProblemCheckbox").checked = false;
    document.getElementById("SocialsupportdlegalProblemCheckbox").checked = false;
    document.getElementById("SocialsupportdotherProblemCheckbox").checked = false;
    $('#SocialsupportNoteProblem').val('');
}


function activateSocialSupportTab(tab) {
    $('.nav-pills a[href="#' + tab + '"]').tab('show');
};


var tableSocialSupportCase = [];
//This function used when get Id when click and use the selector from table Socials  in clients 
function GetSocialSupportCasesByClientId(id) {
        if ($('#id').val() != "") {
            tableSocialSupportCase = $('#SocialsSupportCaseTable').DataTable({
                ajax: {    
                    url: "/api/SocialSupportCases?clientId=" + id,
                    dataSrc: ""
                },
                columns: [
                    {
                        data: "id"
                    },
                    {
                        data: "haveCaseManager"
                    },
                    {
                        data: "caseWorker",
                        render: function (data) {
                            return  data.program + " - " + data.name ;
                        },
                        "width": "70px"
                    },
                    {
                        data: "openDate",
                        render: function (data) {
                            var date = new Date(data);
                            var month = date.getMonth() + 1;
                            return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                        }
                    },
                    {
                        data: "closeDate",
                        render: function (data) {

                            if (data == null) {
                                return  "no date";
                            } else {
                                var date = new Date(data);
                                var month = date.getMonth() + 1;
                                return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                            }
                        }
                    },
                     {
                         data: "haveProblem"
                     },
                    {
                        data: "id",
                        render: function (data) {
                            return "<a href='#' onclick='EditSocialSupportCaseByCase(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='DeleteSocialSupportCase(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
                        }
                    }
                ],
                
                destroy: true,
                "order": [[1, "desc"]]
            });
        }
}

$(function () {
    $("input[name=HavecaseWorkerCase]:radio").click(function () {
        var program = "";
        if ($('input[name=HavecaseWorkerCase]:checked').val() == "noHaveCaseWorker") {
            GetSocialCaseWorker("Futures" , "");
            document.getElementById('caseworkerprogramCase').innerHTML = " by futures";
        } else {
            GetSocialCaseWorker("OtherProgram", "");
            document.getElementById('caseworkerprogramCase').innerHTML = " by other programs";
        }
    });
});

function GetSocialCaseWorker(program, SelectedValue) {
        var data = {};
        $.ajax({
            url: "/api/CaseWorkers?Program=" + program,
            data: JSON.stringify(data),
            type: "get",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (rusult) {
                $("#SocialSupportcaseId").empty();
                $("#SocialSupportcaseId").prepend("<option value=''>Select case worker</option>");

                for (var i = 0; i < rusult.length; i++) {
                    $("#SocialSupportcaseId").append('<option value="' + rusult[i]['id'] + '">' + rusult[i].name + " | " + rusult[i].program + '</option>');
                }
                $("select option[value='" + SelectedValue + "']").attr('selected', 'selected');
                $.ajax(data);
            },
            error: function (errormessage) {
                toastr.error("Something goes wrong!!", "Server Response");
            }
        });
}

function validateSocialSupportCase ()
{
    var isvalid = true;
    if ($('#SocialSupportcaseId').val().trim() === "") {
        $('#SocialSupportcaseId').css('border-color', 'red');
        $('#SocialSupportcaseId').focus();
        isvalid = false;
    }
    else {
        $('#SocialSupportcaseId').css('border-color', '#cccccc');
        if ($('#OpendatesocialSupportCase').val().trim() === "") {
            $('#OpendatesocialSupportCase').css('border-color', 'red');
            $('#OpendatesocialSupportCase').focus();
            isvalid = false;
        }else{
            $('#OpendatesocialSupportCase').css('border-color', '#cccccc');
            if ($('#StatusSocialsupportCase').val().trim() === "") {
                $('#StatusSocialsupportCase').css('border-color', 'red');
                $('#StatusSocialsupportCase').focus();
                isvalid = false;
            } else {
                $('#StatusSocialsupportCase').css('border-color', '#cccccc');
                if (($('#StatusSocialsupportCase').val().trim() === "CloseCase") && ($('#ClosedateSocialsupportCase').val().trim() === "")) {
                    $('#StatusSocialsupportCase').css('border-color', 'red');
                    $('#StatusSocialsupportCase').focus();
                    isvalid = false;
                } else {
                    $('#StatusSocialsupportCase').css('border-color', '#cccccc');
                    $('#ClosedateSocialsupportCase').css('border-color', '#cccccc');
                    if (($('#StatusSocialsupportCase').val().trim() === "OpenCase") && ($('#ClosedateSocialsupportCase').val().trim() !== "")) {
                        $('#StatusSocialsupportCase').css('border-color', 'red');
                        $('#ClosedateSocialsupportCase').css('border-color', 'red');
                        $('#StatusSocialsupportCase').focus();
                        isvalid = false;
                    } else {
                        $('#StatusSocialsupportCase').css('border-color', '#cccccc');
                        $('#ClosedateSocialsupportCase').css('border-color', '#cccccc');
                    }
                }
            }
        }
    }
    return isvalid
}


function validateSocialSupportProblem() {
    var isvalid = true;
    if ($('#SocialSupportcaseId').val().trim() === "") {
        $('#SocialSupportcaseId').css('border-color', 'red');
        $('#SocialSupportcaseId').focus();
        isvalid = false;
    }
    else {
        $('#SocialSupportcaseId').css('border-color', '#cccccc');
        if ($('#OpendatesocialSupportCase').val().trim() === "") {
            $('#OpendatesocialSupportCase').css('border-color', 'red');
            $('#OpendatesocialSupportCase').focus();
            isvalid = false;
        } else {
            $('#OpendatesocialSupportCase').css('border-color', '#cccccc');
            if ($('#StatusSocialsupportCase').val().trim() === "") {
                $('#StatusSocialsupportCase').css('border-color', 'red');
                $('#StatusSocialsupportCase').focus();
                isvalid = false;
            } else {
                $('#StatusSocialsupportCase').css('border-color', '#cccccc');
                if (($('#StatusSocialsupportCase').val().trim() === "CloseCase") && ($('#ClosedateSocialsupportCase').val().trim() === "")) {
                    $('#StatusSocialsupportCase').css('border-color', 'red');
                    $('#StatusSocialsupportCase').focus();
                    isvalid = false;
                } else {
                    $('#StatusSocialsupportCase').css('border-color', '#cccccc');
                    $('#ClosedateSocialsupportCase').css('border-color', '#cccccc');
                }
            }
        }
    }
    return isvalid
}

function SocialSupportCaseAction() {
    var action = '';
    action = document.getElementById('btnSocialSupportCasesAction').innerText;
    if (action === "Save changes") {

        var ResM = validateSocialSupportCase();
        if (ResM === false) {
            toastr.error("Please check validation!!!", "Server Response");
            return false;
        } 

        var Havecasemanager = "";
        if ($('input[name=HavecaseWorkerCase]:checked').val() === "noHaveCaseWorker") {
            Havecasemanager ="NoHave"
        } else {
            Havecasemanager ="Have"
        }
        var CloseDateVar = null
        if ($('#ClosedateSocialsupportCase').val().trim() !== "") {
            CloseDateVar = $('#ClosedateSocialsupportCase').val();
        }

        var healthProblemCheckboxCon = false;
        if ($('#SocialsupportdhealthProblemCheckbox').prop('checked') === true) {
            healthProblemCheckboxCon = true;
        }

        var drugProblemCheckboxCon = false;
        if ($('#SocialsupportdrugProblemCheckbox').prop('checked') === true) {
            drugProblemCheckboxCon = true;
        }

        var babycareProblemCheckboxCon = false;
        if ($('#SocialsupportdbabycareProblemCheckbox').prop('checked') === true) {
            babycareProblemCheckboxCon = true;
        }

        var personalProblemCheckboxCon = false;
        if ($('#SocialsupportdpersonalProblemCheckbox').prop('checked') === true) {
            personalProblemCheckboxCon = true;
        }

        var legalProblemCheckboxCon = false;
        if ($('#SocialsupportdlegalProblemCheckbox').prop('checked') === true) {
            legalProblemCheckboxCon = true;
        }

        var OtherProblemCheckboxCon = false;
        if ($('#SocialsupportdotherProblemCheckbox').prop('checked') === true) {
            OtherProblemCheckboxCon = true;
        }

        var HaveProblem = "Have";

        var socialSupportCase = {
            HaveCaseManager: Havecasemanager,
            CaseWorkerId: $("#SocialSupportcaseId").val(),
            OpenDate: $("#OpendatesocialSupportCase").val(),
            CloseDate: CloseDateVar,
            HaveProblem: HaveProblem,
            ClientId: $('#id').val(),
            Status: $('#StatusSocialsupportCase').val()
        };

        var socialSupportProblem = {
            HealthProblembool: healthProblemCheckboxCon,
            DrugProblembool: drugProblemCheckboxCon,
            BabyProblembool: babycareProblemCheckboxCon,
            PersonalProblembool: personalProblemCheckboxCon,
            LegalProblembool: legalProblemCheckboxCon,
            OtherProblembool: OtherProblemCheckboxCon,
            Note: $('#SocialsupportNoteProblem').val()
        };

        var SocialsupportCaseMulObj = {
            "SocialsupportCaseDto": socialSupportCase,
            "SocialSupportProblemDto": socialSupportProblem
        };
        $.ajax({
            url: "/api/SocialSupportCases/withproblem",
            data: JSON.stringify(SocialsupportCaseMulObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("New social support record has been saved to database.", "Server Response");
                tableSocialSupportCase.ajax.reload();
                document.getElementById('btnSocialSupportCasesAction').innerText = "Add New";
                $('#socialSupportCaseModel').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This social support record is already exists.", "Server Response");
            }
        });
    }
    else if (action === "Add New") {
        ClearSocialSupportCase();
        GetSocialCaseWorker("Futures", "");
        document.getElementById('btnSocialSupportCasesAction').innerText = "Save changes";
        ControlSocialSupportCase(false);
    }
    else if (action === "Update") {

        var ResM = validateSocialSupportCase();
        if (ResM === false) {
            toastr.error("Please check validation!!!", "Server Response");
            return false;
        } 

        var healthProblemCheckboxCon = false;
        if ($('#SocialsupportdhealthProblemCheckbox').prop('checked') === true) {
            healthProblemCheckboxCon = true;
        }

        var drugProblemCheckboxCon = false;
        if ($('#SocialsupportdrugProblemCheckbox').prop('checked') === true) {
            drugProblemCheckboxCon = true;
        }

        var babycareProblemCheckboxCon = false;
        if ($('#SocialsupportdbabycareProblemCheckbox').prop('checked') === true) {
            babycareProblemCheckboxCon = true;
        }

        var personalProblemCheckboxCon = false;
        if ($('#SocialsupportdpersonalProblemCheckbox').prop('checked') === true) {
            personalProblemCheckboxCon = true;
        }

        var legalProblemCheckboxCon = false;
        if ($('#SocialsupportdlegalProblemCheckbox').prop('checked') === true) {
            legalProblemCheckboxCon = true;
        }

        var OtherProblemCheckboxCon = false;
        if ($('#SocialsupportdotherProblemCheckbox').prop('checked') === true) {
            OtherProblemCheckboxCon = true;
        }

        var Havecasemanager = "";
        if ($('input[name=HavecaseWorkerCase]:checked').val() === "noHaveCaseWorker") {
            Havecasemanager = "NoHave"
        } else {
            Havecasemanager = "Have"
        }
        var CloseDateVar = null
        if ($('#ClosedateSocialsupportCase').val().trim() !== "") {
            CloseDateVar = $('#ClosedateSocialsupportCase').val();
        }
        var HaveProblem = "Have";
        var socialSupportCase = {
            Id: $("#socialSupportCaseId").val(),
            HaveCaseManager: Havecasemanager,
            CaseWorkerId: $("#SocialSupportcaseId").val(),
            OpenDate: $("#OpendatesocialSupportCase").val(),
            CloseDate: CloseDateVar,
            HaveProblem: HaveProblem,
            ClientId: $('#id').val(),
            Status: $('#StatusSocialsupportCase').val()
        };

        var socialSupportProblem = {
            HealthProblembool: healthProblemCheckboxCon,
            DrugProblembool: drugProblemCheckboxCon,
            BabyProblembool: babycareProblemCheckboxCon,
            PersonalProblembool: personalProblemCheckboxCon,
            LegalProblembool: legalProblemCheckboxCon,
            OtherProblembool: OtherProblemCheckboxCon,
            Note: $('#SocialsupportNoteProblem').val()
        };

        var SocialsupportCaseMulObj = {
            "SocialsupportCaseDto": socialSupportCase,
            "SocialSupportProblemDto": socialSupportProblem
        };

        $.ajax({
            url: "/api/SocialSupportCases/" + socialSupportCase.Id + "/withproblem",
            data: JSON.stringify(SocialsupportCaseMulObj),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("New social support record has been saved to database.", "Server Response");
                tableSocialSupportCase.ajax.reload();
                document.getElementById('btnSocialSupportCasesAction').innerText = "Add New";
                $('#socialSupportCaseModel').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This social support record is already exists.", "Server Response");
            }
        });
       
    }
}

function EditSocialSupportCaseByCase(id) {
    $.ajax({
        url: "/api/SocialSupportCases/" + id + "/problem",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#socialSupportCaseModel').modal('show');
            activateSocialSupportTab('SocialSopportCase');
            ControlSocialSupportCase(false);
            $('#socialSupportCaseId').val(result.socialCaseId);
            var haveCaseManagerCheck = "Have"
            if (result.haveCaseManager !== "Have") {
                haveCaseManagerCheck = "Nohave";
                GetSocialCaseWorker("Futures", result['caseworkerId']);
                $("#noHaveCaseWorkerCase").prop("checked", true);
            } else {
                haveCaseManagerCheck = "Have";
                GetSocialCaseWorker("OtherProgram", result['caseworkerId']);
                $("#HavecaseWorkerCase").prop("checked", true);
            }
             
            var openDate = new Date(result.openDate);
            var dd = openDate.getDate();
            var mm = openDate.getMonth() + 1; //January is 0!
            var yyyy = openDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            openDate = mm + '/' + dd + '/' + yyyy;
            $('#OpendatesocialSupportCase').val(openDate);
           
            var CloseDate = new Date(result.CloseDate);
            var dd = CloseDate.getDate();
            var mm = CloseDate.getMonth() + 1; //January is 0!
            var yyyy = CloseDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            CloseDate = mm + '/' + dd + '/' + yyyy;

            if (CloseDate == "NaN/NaN/NaN") {
                $('#ClosedateSocialsupportCase').val('');
            } else {
                $('#ClosedateSocialsupportCase').val(CloseDate);
            }


            $('#StatusSocialsupportCase').val(result.status);

            if (result.socialproblemId != 0 ) {
                //$('#ClosedateSocialsupportCase').val('');
                if (result.statusProblem == "Active") {
                    if (result.healthProblemBool == true) {
                        $('#SocialsupportdhealthProblemCheckbox').prop('checked', true);
                    }
                    else {
                        $('#SocialsupportdhealthProblemCheckbox').prop('checked', false);
                    }
                    if (result.drugProblemBool == true) {
                        $('#SocialsupportdrugProblemCheckbox').prop('checked', true);
                    }
                    else {
                        $('#SocialsupportdrugProblemCheckbox').prop('checked', false);
                    }
                    if (result.babyProblemBool == true) {
                        $('#SocialsupportdbabycareProblemCheckbox').prop('checked', true);
                    }
                    else {
                        $('#SocialsupportdbabycareProblemCheckbox').prop('checked', false);
                    }
                    if (result.personalProblembool == true) {
                        $('#SocialsupportdpersonalProblemCheckbox').prop('checked', true);
                    }
                    else {
                        $('#SocialsupportdpersonalProblemCheckbox').prop('checked', false);
                    }
                    if (result.legalProblembool == true) {
                        $('#SocialsupportdlegalProblemCheckbox').prop('checked', true);
                    }
                    else {
                        $('#SocialsupportdlegalProblemCheckbox').prop('checked', false);
                    }
                    if (result.otherProblembool == true) {
                        $('#SocialsupportdotherProblemCheckbox').prop('checked', true);
                    }
                    else {
                        $('#SocialsupportdotherProblemCheckbox').prop('checked', false);
                    }
                    $('#SocialsupportNoteProblem').val(result.noteProblem);
                }
            }
            document.getElementById('btnSocialSupportCasesAction').innerText = "Update";
        },

        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function DeleteSocialSupportCase(id) {
    bootbox.confirm("Are you sure you want to delete this Social support case record?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/SocialSupportCases/" + id,
                method: "DELETE",
                success: function () {
                    tableSocialSupportCase.ajax.reload();
                    toastr.success("Record Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This Social support case record cannot be deleted", "Server Response");
                }
            });
        }
    });
}

//function BtnSocialsupport() {
//    ControlSocialSupport(true);
//    ClearSocialSupport();
//}