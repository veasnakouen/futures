$(document).ready(function () {
    $('#futureTrainingMonitoringModal').on('show.bs.modal', function () {
        GetfutureTrainingLessionMonitoringByClientId()
    });
});

//Display subject in Future training lession monitoring
var tablefutureTrainingLessionMonitoring = [];
function GetfutureTrainingLessionMonitoringByClientId() {
    tablefutureTrainingLessionMonitoring = $('#futureTrainingMonitoringTable').DataTable({
            ajax: {
                url: "/api/futurestrainings?clientId=" + $('#id').val() ,
                dataSrc: ""
            },
            columns: [
               {
                   data: "id"
               },
               {
                   data: "subject",
                   render: function (data) {
                       return data.subjectName;
                   },
               },
                {
                    data: {a:"id",b:"type"}  ,
                    render: function (data) {
                        return "<a href='#' onclick='FutureTrainingMonitoring(" + data.subjectId + ',' + '"' + data.subject.subjectName + '"' + ")'><i class='fa fa-pen-to-square'></i> Manage Monitoring</a>"
                        ;  
                    },
                    "width": "130px"
                }
            ],

            destroy: true,
            "order": [[1, "asc"], [2, "asc"]]
        });
    } 

//Add Monitoring Subject   
var tablefutureTrainingMonitoring = [];
function GetfutureTrainingMonitoringByClientId(SubjectId) {
    tablefutureTrainingMonitoring = $('#futureTrainingMonitoringActionTable').DataTable({
        ajax: {
            url: "/api/futureTrainingMonitoring/bysubject?clientid=" + $('#id').val() + "&subjectId=" + SubjectId,
            dataSrc: ""
        },
        "lengthMenu": [[3, 10, 25, 50, -1], [3, 10, 25, 50, "All"]],
        columns: [
           {
               data: "id"
           },
           {
               data: "monitoring",
               render: function (data) {
                   var date = new Date(data.monitoringDate);
                   var month = date.getMonth() + 1;
                   return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
               }
           },
           {
               data: "lession",
               render: function (data) {
                   return data.lessionSub;
               },
           },
           {
               data: "ontraining"
           },
           {
               data: "reason"
           },
           
            {
                data: { a: "id", b: "type" },
                render: function (data) {
                    return "<a href='#' onclick='FunctionFutureTrainingMonitoringEdit(" + data.id + ")'><i class='fa fa-pen-to-square'></i> Edit </a> " + "<a href='#' onclick='FutureTrainingMonitoringDelete(" + data.monitoringId + ")'><i class='fa fa-trash'></i> Delete </a>   "
                    ;
                },
                "width": "130px"
            }
        ],

        destroy: true,
        "order": [[1, "asc"], [2, "asc"]]
    });
}

function FutureTrainingMonitoring(Id, subjectName) {
    $('#futureTrainingMonitoringActionModal').modal('show');
    GetfutureTrainingMonitoringByClientId(Id) // Get by subjectId
    document.getElementById('btnFutureTrainingMonitoringAction').innerText = "Add New";
    ControlFutureTraningMonitor(true);
    ClearFuturetrainingMonitor();
    $('#subjectfutureTrainingActionId').val(Id);
    $('#subjectfuturetrainingName').val(subjectName);
    document.getElementById("subjectfuturetrainingName").innerHTML = (" Subject : " + subjectName);
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    GetLoopData($('#subjectfutureTrainingActionId').val(), '#futureTrainingLessonActionId', 'id', 'lessionSub', '');
}

function GetLoopData(Area, ShowinOption, Id, Name, seletedValue) {
    var data = {};
    $.ajax({
        url: "/api/lessions/?subjectId=" + Area,
        data: JSON.stringify(data),
        type: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('' + ShowinOption + ' .DynamicOption').remove();
            for (var i = 0; i < result.length; i++) {
                $(ShowinOption).append('<option class="DynamicOption" value="' + result[i][Id] + '">' + result[i][Name] + '</option>');
            }
            $("" + ShowinOption + " option[value='" + seletedValue + "']").attr('selected', 'selected');
            $.ajax(data);
        },
        error: function (errormessage) {
            //toastr.error("Something goes wrong!!", "Server Response");
        }
    });
}

function validatefutureTrainingMonitoring() {
    var isvalid = true;
    if ($('#monitoringDateAction').val().trim() === "") {
        $('#monitoringDateAction').css('border-color', 'red');
        $('#monitoringDateAction').focus();
        isvalid = false;
    }
    else {
        $('#monitoringDateAction').css('border-color', '#cccccc');
        if ($('#nextmonitoringdateAction').val().trim() === "") {
            $('#nextmonitoringdateAction').css('border-color', 'red');
            $('#nextmonitoringdateAction').focus();
            isvalid = false;
        }
        else {
            $('#nextmonitoringdateAction').css('border-color', '#cccccc');
            if ($('#futureTrainingLessonActionId').val().trim() === "") {
                $('#futureTrainingLessonActionId').css('border-color', 'red');
                $('#futureTrainingLessonActionId').focus();
                isvalid = false;
            }
            else {
                $('#futureTrainingLessonActionId').css('border-color', '#cccccc');
                if ($('#futureTrainingLessonActionId').val().trim() === "") {
                    $('#futureTrainingLessonActionId').css('border-color', 'red');
                    $('#futureTrainingLessonActionId').focus();
                    isvalid = false;
                }
                else {
                    $('#futureTrainingLessonActionId').css('border-color', '#cccccc');
                    if (($('#futuretrainingOntrainingIdAction').val().trim() === "")) {
                        $('#futuretrainingOntrainingIdAction').css('border-color', 'red');
                        $('#futuretrainingOntrainingIdAction').focus();
                        isvalid = false;
                    }
                    else {
                        $('#futuretrainingOntrainingIdAction').css('border-color', '#cccccc');
                        if (($('#futuretrainingdropoutdateAction').val().trim() === "") && ($('#futuretrainingOntrainingIdAction').val().trim() === "dropout")) {
                            $('#futuretrainingdropoutdateAction').css('border-color', 'red');
                            $('#futuretrainingdropoutdateAction').focus();
                            isvalid = false;
                        }
                        else {
                            $('#futuretrainingdropoutdateAction').css('border-color', '#cccccc');
                                if (($('#futuretraininggraduatedateAction').val().trim() !== "") && ($('#futuretrainingdropoutdateAction').val().trim() !== "")) {
                                    $('#futuretraininggraduatedateAction').css('border-color', 'red');
                                    $('#futuretrainingdropoutdateAction').css('border-color', 'red');
                                    $('#futuretraininggraduatedateAction').focus();
                                    isvalid = false;
                                }
                                else {
                                    $('#futuretraininggraduatedateAction').css('border-color', '#cccccc');
                                    $('#futuretrainingdropoutdateAction').css('border-color', '#cccccc');

                                    if (($('#monitoringTypeAction').val().trim() === "")) {
                                        $('#monitoringTypeAction').css('border-color', 'red');
                                        $('#monitoringTypeAction').focus();
                                        isvalid = false;
                                    }
                                    else {
                                        $('#monitoringTypeAction').css('border-color', '#cccccc');
                                        if ($('#futuretrainingOntrainingIdAction').val().trim() === "Completed") {
                                            if (($('#futuretraininggraduatedateAction').val().trim() === "")) {
                                                $('#futuretraininggraduatedateAction').css('border-color', 'red');
                                                $('#futuretraininggraduatedateAction').focus();
                                                isvalid = false;
                                            }
                                        }
                                        else if ($('#futuretrainingOntrainingIdAction').val().trim() !== "Completed") {
                                            if (($('#futuretraininggraduatedateAction').val().trim() !== "")) {
                                                $('#futuretraininggraduatedateAction').css('border-color', 'red');
                                                $('#futuretraininggraduatedateAction').focus();
                                                isvalid = false;
                                            }
                                        }
                                        else {
                                            $('#futuretraininggraduatedateAction').css('border-color', '#cccccc');
                                    } 
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return isvalid
}

function FutureTrainingMonitoringAction() {
    var action = '';
    action = document.getElementById('btnFutureTrainingMonitoringAction').innerText;
    if (action === "Save changes") {
        var ResM = validatefutureTrainingMonitoring();
        if (ResM === false) {
            return false;
        }
        var monitoringobj = {
            MonitoringTime: "Testing subject only",
            Enroll: "Testing Only",
            Type: "Futuretraining",
            ClientId: parseInt($('#id').val()),
            MonitoringDate: $('#monitoringDateAction').val(),
            NextMonitoringDate: $('#nextmonitoringdateAction').val(),
            Monitoringtype: $('#monitoringTypeAction').val()
        };

        var futureTrainingObj =
            {
                //LessionId: $('#futureTrainingLessonActionId').find(":selected").val(),
                //id: $('#futuretrainingprocessActionId').val(),
                //monitoringId: monitoringobj.Id,  // get Id from monitoringobj 
                LessionId: parseInt($('#futureTrainingLessonActionId').val()),
                Ontraining: $('#futuretrainingOntrainingIdAction').val(),
                GraduateDate: $('#futuretraininggraduatedateAction').val(),
                DropoutDate: $('#futuretrainingdropoutdateAction').val(),
                Reason: $('#futuretrainingreasonAction').val()
            };


        var futureTrainingMonitorIngMulObj = {
            "futureTrainingProgressDto": futureTrainingObj,
            "monitoringDto": monitoringobj
        };

        $.ajax({
            url: "/api/FutureTrainingMonitoring/",
            data: JSON.stringify(futureTrainingMonitorIngMulObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("future training monitoring has been saved.", "Server Response");
                tablefutureTrainingMonitoring.ajax.reload();
                tableMonitoring.ajax.reload();
                ClearFuturetrainingMonitor();
                ControlFutureTraningMonitor(true);
                document.getElementById('btnFutureTrainingMonitoringAction').innerText = "Add New";
            },
            error: function (errormessage) {
                toastr.error("This future training monitoring cannot saved!", "Server Response");

            }
        });
    }
    else if (action === "Add New") {

        document.getElementById('btnFutureTrainingMonitoringAction').innerText = "Save changes";
        ControlFutureTraningMonitor(false);
    }
    else if (action === "Update") {
        var ResM = validatefutureTrainingMonitoring();
        if (ResM === false) {
            return false;
        }
        var monitoringobj = {
            Id: parseInt($('#futureTrainingmonitoringActionId').val()),
            MonitoringTime: "Testing subject only",
            Enroll: "Testing Only",
            Type: "Futuretraining",
            ClientId: parseInt($('#id').val()),
            MonitoringDate: $('#monitoringDateAction').val(),
            NextMonitoringDate: $('#nextmonitoringdateAction').val(),
            Monitoringtype: $('#monitoringTypeAction').val()
        };

        var futureTrainingObj =
            {
                //LessionId: $('#futureTrainingLessonActionId').find(":selected").val(),
                id: parseInt($('#futuretrainingprocessActionId').val()),
                monitoringId: monitoringobj.Id,  // get Id from monitoringobj 
                LessionId: parseInt($('#futureTrainingLessonActionId').val()),
                Ontraining: $('#futuretrainingOntrainingIdAction').val(),
                GraduateDate: $('#futuretraininggraduatedateAction').val(),
                DropoutDate: $('#futuretrainingdropoutdateAction').val(),
                Reason: $('#futuretrainingreasonAction').val()
            };


        var futureTrainingMonitorIngMulObj = {
            "futureTrainingProgressDto": futureTrainingObj,
            "monitoringDto": monitoringobj
        };

        $.ajax({
            url: "/api/FutureTrainingMonitoring/",
            data: JSON.stringify(futureTrainingMonitorIngMulObj),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("future training monitoring has been updated.", "Server Response");
                tablefutureTrainingMonitoring.ajax.reload();
                tableMonitoring.ajax.reload();
                ClearFuturetrainingMonitor();
                ControlFutureTraningMonitor(true);
                document.getElementById('btnFutureTrainingMonitoringAction').innerText = "Add New";
            },
            error: function (errormessage) {
                toastr.error("This future training monitoring cannot saved!", "Server Response");
               
            }
        });
    }
}

function FunctionFutureTrainingMonitoringEdit(Id) {
         $.ajax({
         url: "/api/futureTrainingMonitoring/byid?Id=" + Id,
         type: "GET",
         contentType: "application/json;charset=UTF-8",
         dataType: "json",
         success: function (result) {
             ControlFutureTraningMonitor(false);
             $('#futureTrainingmonitoringActionId').val(result[0]['monitoringId']);
             var monitoringDate = new Date(result[0]['monitoring']['monitoringDate']);
             var dd = monitoringDate.getDate();
             var mm = monitoringDate.getMonth() + 1; //January is 0!
             var yyyy = monitoringDate.getFullYear();
             if (dd < 10) {
                 dd = '0' + dd;
             }
             if (mm < 10) {
                 mm = '0' + mm;
             }
             monitoringDate = mm + '/' + dd + '/' + yyyy;
             $('#monitoringDateAction').val(monitoringDate);
             var NextmonitoringDate = new Date(result[0]['monitoring']['nextMonitoringDate']);
             var dd = NextmonitoringDate.getDate();
             var mm = NextmonitoringDate.getMonth() + 1; //January is 0!
             var yyyy = NextmonitoringDate.getFullYear();
             if (dd < 10) {
                 dd = '0' + dd;
             }
             if (mm < 10) {
                 mm = '0' + mm;
             }
             NextmonitoringDate = mm + '/' + dd + '/' + yyyy;
             $('#nextmonitoringdateAction').val(NextmonitoringDate);
             $('#monitoringTypeAction').val(result[0]['monitoring']['monitoringtype']);
             $('#futureTrainingLessonActionId').val(result[0]['lessionId']);
             $('#futuretrainingprocessActionId').val(result[0]['id']);

             var GratudateDate = new Date(result[0]['graduateDate']);
             var dd = GratudateDate.getDate();
             var mm = GratudateDate.getMonth() + 1; //January is 0!
             var yyyy = GratudateDate.getFullYear();
             if (dd < 10) {
                 dd = '0' + dd;
             }
             if (mm < 10) {
                 mm = '0' + mm;
             }
             GratudateDate = mm + '/' + dd + '/' + yyyy;
             if (GratudateDate == "01/01/1970") {
                 GratudateDate = "";
             };
             $('#futuretraininggraduatedateAction').val(GratudateDate);

             var Dropoutdate = new Date(result[0]['dropoutDate']);
             var dd = Dropoutdate.getDate();
             var mm = Dropoutdate.getMonth() + 1; //January is 0!
             var yyyy = Dropoutdate.getFullYear();
             if (dd < 10) {
                 dd = '0' + dd;
             }
             if (mm < 10) {
                 mm = '0' + mm;
             }
             Dropoutdate = mm + '/' + dd + '/' + yyyy;
             if (Dropoutdate == "01/01/1970") {
                 Dropoutdate = "";
             };
             $('#futuretrainingdropoutdateAction').val(Dropoutdate);
           $("#futuretrainingOntrainingIdAction").val(result[0]['ontraining']);
             $('#futuretrainingreasonAction').val(result[0]['reason']);      
             document.getElementById('btnFutureTrainingMonitoringAction').innerText = "Update";
         },
         error: function (errormessage) {
             toastr.error("Something unexpected happen.", "Server Response");
            }
         });
}

function FutureTrainingMonitoringDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/futureTrainingMonitoring?id=" + id,
                method: "DELETE",
                success: function () {
                    tablefutureTrainingMonitoring.ajax.reload();
                    tableMonitoring.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This future training monitoring cannot saved.", "Server Response");
                }
            });
        }
    });;
};

function ClearFuturetrainingMonitor() {
    $('#monitoringDateAction').val('');
    $('#nextmonitoringdateAction').val('');
    $('#monitoringTypeAction').val('');
    $('#futureTrainingLessonActionId').val('');
    $('#futuretraininggraduatedateAction').val('');
    $('#futuretrainingdropoutdateAction').val('');
    document.getElementById("futuretrainingOntrainingIdAction").selectedIndex = "0";
    $('#futuretrainingreasonAction').val('');
}

function ControlFutureTraningMonitor(bool) {
    document.getElementById('monitoringDateAction').disabled = bool;
    document.getElementById('nextmonitoringdateAction').disabled = bool;
    document.getElementById('monitoringTypeAction').disabled = bool;
    document.getElementById('futureTrainingLessonActionId').disabled = bool;
    document.getElementById('futuretraininggraduatedateAction').disabled = bool;
    document.getElementById('futuretrainingdropoutdateAction').disabled = bool;
    document.getElementById('futuretrainingOntrainingIdAction').disabled = bool;
    document.getElementById('futuretrainingreasonAction').disabled = bool;
}
