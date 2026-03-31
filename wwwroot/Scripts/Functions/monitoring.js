$(document).ready(function () {
    $('#monitoiringModal').on('show.bs.modal', function () {
        ShowPlacement();
        document.getElementById('btnMonitoringAction').innerText = "Add New";
        //ClearMonitor();
        //Clearplacement();
        ControlMonitor(true);
        ControlPlacementProgress(true);
    });
});

function ShowPlacement() {
    document.getElementsByClassName('businesssetupcontrol')[0].style.display = "none";
    document.getElementsByClassName('furthereducationcontrol')[0].style.display = "none";
    document.getElementsByClassName('futuretrainingcontrol')[0].style.display = "none";
    document.getElementsByClassName('Placementcontrol')[0].style.display = "block";
}

function ShowBusinesssetup() {
    document.getElementsByClassName('Placementcontrol')[0].style.display = "none";
    document.getElementsByClassName('furthereducationcontrol')[0].style.display = "none";
    document.getElementsByClassName('futuretrainingcontrol')[0].style.display = "none";
    document.getElementsByClassName('businesssetupcontrol')[0].style.display = "block";
}

function ShowFurthereducation() {
    document.getElementsByClassName('Placementcontrol')[0].style.display = "none";
    document.getElementsByClassName('furthereducationcontrol')[0].style.display = "block";
    document.getElementsByClassName('futuretrainingcontrol')[0].style.display = "none";
    document.getElementsByClassName('businesssetupcontrol')[0].style.display = "none";
}

function ShowFutureTraining() {
    document.getElementsByClassName('Placementcontrol')[0].style.display = "none";
    document.getElementsByClassName('furthereducationcontrol')[0].style.display = "none";
    document.getElementsByClassName('futuretrainingcontrol')[0].style.display = "block";
    document.getElementsByClassName('businesssetupcontrol')[0].style.display = "none";
}

// Pass ClientId to GetCountTime  ??
var NotEdit;
function GetCountTime(Obj) {
    var data = {};
    $.ajax({
        url: Obj['UrlParam'],
        data: JSON.stringify(data),
        type: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (rusult) {
            Obj['DisplayOn'].empty();
            Obj['DisplayOn'].prepend("<option value=''>Select count time </option>");
            if (Obj['Text1'] === "FurtherEducation") {
                for (var i = 0; i < rusult.length; i++) {
                    Obj['DisplayOn'].append('<option value="' + rusult[i][Obj['Value']] + '">' + rusult[i].id + '  |  ' + rusult[i].subject + '</option>');
                }
            }
            else if (Obj['Text1'] != "subject") {
                SortValue(rusult, Obj['Text1']);
                for (var i = 0; i < rusult.length; i++) {
                    Obj['DisplayOn'].append('<option value="' + rusult[i][Obj['Value']] + '">' + rusult[i][Obj['Text1']] + '  |  ' + rusult[i][Obj['Text2']] + '</option>');
                }
                $("select option[value='" + Obj['SelectedValue'] + "']").attr('selected', 'selected');
            } else {
                //Future Training cannot sort select option
                for (var i = 0; i < rusult.length; i++) {
                    Obj['DisplayOn'].append('<option value="' + rusult[i][Obj['Value']] + '">' + rusult[i].subject.subjectName + '  |  ' + rusult[i][Obj['Text2']] + '</option>');
                }
                $("select option[value='" + Obj['SelectedValue'] + "']").attr('selected', 'selected');
            }
            $.ajax(data);
        },
        error: function (errormessage) {
            toastr.error("Something goes wrong!!", "Server Response");
        }
    });
}
//Sort Array
function SortValue(obj, Text1) {
    obj.sort(compare);
    function compare(a, b) {
        if (a[Text1] < b[Text1]) {
            return -1;
        }
        if (a[Text1] > b[Text1]) {
            return 1;
        }
        return 0;
    }
}

$('#type').change(function () {
        var val = $("#type option:selected").val();
        switch (val) {
            case 'Placement':
                $("select option[value='Placement']").attr('selected', 'selected');
                GetCountTime
                     (obj =
                        {
                            UrlParam: ("/api/placements?clientId=" + $('#id').val()),
                            DisplayOn:  ($("#monitoringTime")),
                            Value: 'countedTime',
                            Text1:"countedTime",
                            Text2: "companyName",
                            SelectedValue: ""
                        });
                ShowPlacement();
                break;
            case 'Businesssetup':
                $("select option[value='Businesssetup']").attr('selected', 'selected');
                GetCountTime
                    (obj =
                       {
                           UrlParam: ("/api/BusinessSetups?clientId=" + $('#id').val()),
                           DisplayOn: ($("#monitoringTime")),
                           Value: "countTime",
                           Text1: "countTime",
                           Text2: "businessType",
                           SelectedValue: ""
                       });
                ShowBusinesssetup();
                ClearBusinessSetup();
                break;
            case 'Furthereducation':
                GetCountTime
                    (obj =
                      {
                          UrlParam: ("/api/furthereducationreferrals?clientId=" + $('#id').val()),
                          DisplayOn: ($("#monitoringTime")),
                          Value: "id",
                          Text1: "FurtherEducation",
                          Text2: "subject",
                          SelectedValue: ""
                      });
                ShowFurthereducation();
                Clearfurthereducation();
                break;
            default:
                GetCountTime
                     (obj =
                       {
                           UrlParam: ("/api/subjects/"),
                           DisplayOn: ($("#monitoringTime")),
                           Value: "id",
                           Text1: "id",
                           Text2: "subjectName",
                           SelectedValue: ""
                       });
                GetCountTime
                     (obj =
                       {
                           UrlParam: ("/api/lessions/"),
                           DisplayOn: ($("#futuretrainingLessonId")),
                           Value: "id",
                           Text1: "subject",
                           Text2: "lessionSub",
                           SelectedValue: ""
                       });
                ShowFutureTraining();
                ClearFuturetraining();
        }
});

$('#monitoringTime').change(function () {
    //var futuretraining = $('#monitoringTime').find(":selected").val();
    //alert(futuretraining);
    //if (futuretraining != "Select future subject") {
    //    GetLessionFutureTraining(futuretraining);
    //}
});

var tableMonitoring = [];
function GetMonitoringByClientId(id) {
        tableMonitoring = $('#MonitoringTableshow').DataTable({
            ajax: {
                url: "api/monitorings?clientId=" + id,
                dataSrc: ""
            },
           
            columns: [
               {
                   data: "id"
               },

               {
                   data: "type"
               },
             
               {
                   data: "monitoringDate",
                   render: function (data) {
                       var date = new Date(data);
                       var month = date.getMonth() + 1;
                       return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                   }
               },
               {
                   data: "nextMonitoringDate",
                   render: function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                }
               },

               {
                   data: "monitoringtype",
                   render: function (data) {
                           return data + " months";
                }
               }
            ],

            destroy: true,
            "order": [[1, "asc"], [2, "asc"]]
        });

        tableMonitoring = $('#MonitoringPlacementTableshow').DataTable({
            ajax: {
                url: "api/placementMonitoring?clientId2=" + id,
                dataSrc: ""
            },

            columns: [
               {
                   data: "m.id"
               },

               {
                   data: "m.type"
               },

               {
                   data: "m.monitoringDate",
                   render: function (data) {
                       var date = new Date(data);
                       var month = date.getMonth() + 1;
                       return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                   }
               },
               {
                   data: "m.nextMonitoringDate",
                   render: function (data) {
                       var date = new Date(data);
                       var month = date.getMonth() + 1;
                       return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                   }
               },

               {
                   data: "m.monitoringtype",
                   render: function (data) {
                       return data + " months";
                   }
               },
               {
                   data: "p.companyName"
               },
            ],

            destroy: true,
            "order": [[1, "asc"], [2, "asc"]]
        });

        
}

//var tableMonitoring2 = [];
//function GetMonitoringByClientIdOnly(id) {
//    tableMonitoring2 = $('#MonitoringPlacementTableshow').DataTable({
//        ajax: {
//            url: "api/monitorings?clientId=" + id,
//            dataSrc: ""
//        },

//        columns: [
//           {
//               data: "id"
//           },

//           {
//               data: "type"
//           },

//           {
//               data: "monitoringDate",
//               render: function (data) {
//                   var date = new Date(data);
//                   var month = date.getMonth() + 1;
//                   return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
//               }
//           },
//           {
//               data: "nextMonitoringDate",
//               render: function (data) {
//                   var date = new Date(data);
//                   var month = date.getMonth() + 1;
//                   return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
//               }
//           },

//           {
//               data: "monitoringtype",
//               render: function (data) {
//                   return data + " months";
//               }
//           }
//        ],

//        destroy: true,
//        "order": [[1, "asc"], [2, "asc"]]
//    });





//}

function MonitoringAction() {
        var action = '';
        action = document.getElementById('btnMonitoringAction').innerText;
        if (action === "Save changes") {
            var ResM = validateMonitoring();
            if (ResM === false) {
                return false;
            }
            var monitoringobj = {
                MonitoringTime: $('#monitoringTime').val(),
                Enroll: $('#enrollby').val(),
                Type: $('#type').val(),
                ClientId: $('#id').val(),
                MonitoringDate: $('#monitoringDate').val(),
                NextMonitoringDate: $('#nextmonitoringdate').val(),
                Monitoringtype: $('#monitoringtype').val()
            };
            //Monitoring
            var TypeCondition = $('#type').val();
            switch (TypeCondition) {
                //Placement 
                case 'Placement':
                    var ResP = validatePlacement();
                    if (ResP === false) {
                        return false;
                    }
                    //2.
                    var placementobj = [
                        {
                            Completed: $('#completed').val(),
                            PlacementStatus: $('input[name=placementstatus]:checked').val(),
                            Salary: $('#salary').val(),
                            Note: $('#placementprogressnote').val()
                        }
                    ];
                    //3.
                    $.ajax({
                        url: '/api/MonitoringOption?TypeCondition='+ TypeCondition ,
                        type: 'POST',
                        //4.
                        data: {
                            monitoring: monitoringobj,
                            placements: placementobj
                        },
                        ContentType: 'application/json;utf-8',
                        datatype: 'json'
                    }).done(function (resp) {
                        toastr.success(" Placement monitoring has been saved.", "Server Response");
                        tableMonitoring.ajax.reload();
                        $('#monitoiringModal').modal('hide');
                    }).error(function (err) {
                        toastr.error("This record is already exists.", "Server Response");
                    });
                    break;
                    //Businesssetup 
                case 'Businesssetup':
                    var BusinessSetupobj = [
                       {
                           StillInbusiness: $('input[name=stillinbusiness]:checked').val(),
                           BusinessType: $('#completedB').val(),
                           Expense: $('#expenseB').val(),
                           Income: $('#incomeB').val(),
                           Note: $('#note').val()
                       }
                    ];
                    //3.
                    $.ajax({
                        url: '/api/MonitoringOption?TypeCondition=' + TypeCondition,
                        type: 'POST',
                        //4.
                        data: {
                            monitoring: monitoringobj,
                            businessSetups: BusinessSetupobj
                        },
                        ContentType: 'application/json;utf-8',
                        datatype: 'json'
                    }).done(function (resp) {
                        toastr.success(" Placement monitoring has been saved.", "Server Response");
                        tableMonitoring.ajax.reload();
                    }).error(function (err) {
                        toastr.error("Something unexpected happen.", "Server Response");
                    });
                    break;
               //Furthereducation
                case 'Furthereducation': 
                    var FutureEducationobj = [
                        {
                            Ontraining: $('#ontraining').val(),
                            GraduateDate: $('#graduatedateFuther').val(),
                            DropoutDate: $('#dropoutdateFuther').val(),
                            Reason: $('#reasondateFuther').val()
                        }
                    ];
                    //3.
                    $.ajax({
                        url: '/api/MonitoringOption?TypeCondition=' + TypeCondition,
                        type: 'POST',
                        //4.
                        data: {
                            monitoring: monitoringobj,
                            futureeducation: FutureEducationobj
                        },
                        ContentType: 'application/json;utf-8',
                        datatype: 'json'
                    }).done(function (resp) {
                        toastr.success(" Placement monitoring has been saved.", "Server Response");
                        tableMonitoring.ajax.reload();
                    }).error(function (err) {
                        toastr.error("Something unexpected happen.", "Server Response");
                    });
                    break;
               //Futuretraining
                default:
                    var Futuretrainingobj = [
                        {
                            LessionId: $('#futuretrainingLessonId').find(":selected").val(),
                            Ontraining: $('#futuretrainingType').val(),
                            GraduateDate: $('#futuretraininggraduatedate').val(),
                            DropoutDate: $('#futuretrainingdropoutdate').val(),
                            Reason: $('#futuretrainingreason').val()
                        }
                    ];
                    //3.
                    $.ajax({
                        url: '/api/MonitoringOption?TypeCondition=' + TypeCondition,
                        type: 'POST',
                        //4.
                        data: {
                            monitoring: monitoringobj,
                            futuretraining: Futuretrainingobj
                        },
                        ContentType: 'application/json;utf-8',
                        datatype: 'json'
                    }).done(function (resp) {
                        toastr.success(" Placement monitoring has been saved.", "Server Response");
                        tableMonitoring.ajax.reload();
                    }).error(function (err) {
                        toastr.error("Something unexpected happen.", "Server Response");
                    });
            }
        }
        else if (action === "Add New") {
            ClearMonitor();
            Clearplacement();
            GetCountTime
                     (obj =
                        {
                            UrlParam: ("/api/placements?clientId=" + $('#id').val()),
                            DisplayOn: ($("#monitoringTime")),
                            Value: 'countedTime',
                            Text1: "countedTime",
                            Text2: "companyName",
                            SelectedValue: ""
                        });
            document.getElementById('btnMonitoringAction').innerText = "Save changes";
            ControlMonitor(false);
            ControlPlacementProgress(false);
        }
        else if (action === "Update") {
            var data = new FormData();
            //Monitoring
            data.append("MonitoringId", $("#monitoringId").val());
            data.append("MonitoringTime", $("#monitoringTime").val());
            data.append("Type", $("#type").val());
            data.append("ClientId", $("#id").val());
            data.append("MonitoringDate", $("#monitoringDate").val());
            data.append("Nextmonitoringdate", $("#nextmonitoringdate").val());
            data.append("Monitoringtype", $("#monitoringtype").val());
            var TypeCondition = $('#type').val();
            switch (TypeCondition) {
                //Placement 
                case 'Placement':
                    var ResP = validatePlacement();
                    if (ResP === false) {
                        return false;
                    }
                    data.append("PlacementprocessId", $("#placementprocessId").val());
                    data.append("Completed", $("#completed").val());
                    //Note this data need to use MonitoiringId from MonitoringModel
                    data.append("PlacementpmonitoringId", $("#monitoringId").val());
                    data.append("Placementstatus", $('input[name=placementstatus]:checked').val());
                    data.append("Salary", $("#salary").val());
                    data.append("Placementprogressnote", $("#placementprogressnote").val());
                    break;
                    //Businesssetup 
                case 'Businesssetup':
                    ShowBusinesssetup();
                    data.append("BusinesssetupId", $("#businesssetupId").val());
                    data.append("Sillinbusiness", $('input[name=stillinbusiness]:checked').val());
                    //Note this data need to use MonitoiringId from MonitoringModel
                    data.append("BusinessmonitoringId", $("#monitoringId").val());
                    data.append("BusinessnameType", $("#completedB").val());
                    data.append("Expense", $("#expenseB").val());
                    data.append("Income", $("#incomeB").val());
                    data.append("Businessprogressnote", $("#note").val());
                    break;
                    //Furthereducation
                case 'Furthereducation':
                    //ShowBusinesssetup();
                    data.append("FurthereducationId", $("#furthereducationId").val());
                    //Note this data need to use MonitoiringId from MonitoringModel
                    data.append("FurtherEducationmonitoringId", $("#monitoringId").val());
                    data.append("Ontraining", $("#ontraining").val());
                    data.append("GraduatedateFuther", $("#graduatedateFuther").val());
                    data.append("DropoutdateFuther", $("#dropoutdateFuther").val());
                    data.append("ReasondateFuther", $("#reasondateFuther").val());
                    break;
                default:
                    //Futuretraining
                    //use when date is empty
                    var futuretraininggraduatedate = $("#futuretraininggraduatedate").val();
                    if (futuretraininggraduatedate == "") {
                        var futuretraininggraduatedate = "01/01/1970";
                    }
                    var futuretrainingdropoutdate = $("#futuretrainingdropoutdate").val();
                    if (futuretrainingdropoutdate == "") {
                        var futuretrainingdropoutdate = "01/01/1970";
                    }

                    data.append("FurtureTrainingId", $("#futuretrainingprocessId").val());
                    data.append("LessionId", $("#futuretrainingLessonId").val());
                    //Note this data need to use MonitoiringId from MonitoringModel
                    data.append("FurtureTrainingmonitoringId", $("#monitoringId").val());
                    data.append("OntrainingFurtureTraining", $("#futuretrainingType").val());
                    data.append("GraduatedateFurtureTraining", futuretraininggraduatedate);
                    data.append("DropoutdateFurtureTraining", futuretrainingdropoutdate);
                    data.append("ReasondateFurtureTraining", $("#futuretrainingreason").val());
            }
            $.ajax({
                url: "/api/monitoringoption?" + data.id + "&" + data.type, //Value get directly from form
                type: "PUT",
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    toastr.success("Placement has been updated.", "Server Response");
                    tableMonitoring.ajax.reload();
                    //DisabledPlacements();
                    //document.getElementById('btnPlacementsAction').innerText = "Add New";
                    //ClearPlacements();
                    $('#monitoiringModal').modal('hide');
                },
                error: function (errormessage) {
                    toastr.error("This placement is already exists.", "Server Response");
                    //DisabledPlacements();
                    //document.getElementById('btnPlacementsAction').innerText = "Add New";
                    //ClearPlacements();
                }
            });   
        }
}

function MonitoringEdit(id, typeCon) {
    $.ajax({
        url: "/api/monitoringoption?Id=" + id + "&conditionType=" + typeCon,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#monitoiringModal').modal('show');
            ControlMonitor(false);
            var TypeCondition = result.arrayobj[0][0]['monitoring']['type'];
            $('#monitoringId').val(result.arrayobj[0][0]['monitoringId']);
            $('#Type').val(result.arrayobj[0][0]['monitoring']['type']);
            var monitoringDate = new Date(result.arrayobj[0][0]['monitoring']['monitoringDate']);
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
            $('#monitoringDate').val(monitoringDate);
            var nextmonitoringdate = new Date(result.arrayobj[0][0]['monitoring']['nextMonitoringDate']);
            var dd = nextmonitoringdate.getDate();
            var mm = nextmonitoringdate.getMonth() + 1; //January is 0!
            var yyyy = nextmonitoringdate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            nextmonitoringdate = mm + '/' + dd + '/' + yyyy;
            $('#nextmonitoringdate').val(nextmonitoringdate);
            $('#monitoringtype').val(result.arrayobj[0][0]['monitoring']['monitoringtype']);
            var monitorTime = result.arrayobj[0][0]['monitoring']['monitoringTime'];
            switch (TypeCondition) {
                //Placement 
                case 'Placement':
                    ShowPlacement();
                    $('#type').val("Placement");
                    GetCountTime
                     (obj =
                        {
                            UrlParam: ("/api/placements?clientId=" + $('#id').val()),
                            DisplayOn:  ($("#monitoringTime")),
                            Value: 'countedTime',
                            Text1:"countedTime",
                            Text2: "companyName",
                            SelectedValue: monitorTime
                        }
                     );
                    ControlPlacementProgress(false);
                    $('#placementprocessId').val(result.arrayobj[0][0]['id']);
                    $('#completed').val(result.arrayobj[0][0]['completed']);
                    //$('#placementstatus').val(result.arrayobj[0][0]['placementStatus']);
                    if ((result.arrayobj[0][0]['placementStatus']) == "Yes") {
                        $("input[name='placementstatus'][value='Yes']").prop('checked', true);
                    } else if ((result.arrayobj[0][0]['placementStatus']) == "No") {
                        $("input[name='placementstatus'][value='No']").prop('checked', true);
                    } else {
                        $("input[name='placementstatus'][value='ChangedJob']").prop('checked', true);
                    };

                    $('#salary').val(result.arrayobj[0][0]['salary']);
                    $('#placementprogressnote').val(result.arrayobj[0][0]['note']);
                    break;
                    //Businesssetup 
                case 'Businesssetup':
                    ShowBusinesssetup();
                    $('#type').val("Businesssetup");
                    GetCountTime
                        (obj =
                           {
                               UrlParam: ("/api/BusinessSetups?clientId=" + $('#id').val()),
                               DisplayOn: ($("#monitoringTime")),
                               Value: "countTime",
                               Text1: "countTime",
                               Text2: "businessType",
                               SelectedValue: monitorTime
                           });
                    $('#businesssetupId').val(result.arrayobj[0][0]['id']);
                    if ((result.arrayobj[0][0]['stillInbusiness']) == "Yes") {
                        $("input[name='stillinbusiness'][value='Yes']").prop('checked', true);
                    } else if ((result.arrayobj[0][0]['stillInbusiness']) == "No") {
                        $("input[name='stillinbusiness'][value='No']").prop('checked', true);
                    } else {
                        $("input[name='stillinbusiness'][value='ChangedBusiness']").prop('checked', true);

                    };
                    $('#businessnameType').val(result.arrayobj[0][0]['businessType']);
                    $('#expenseB').val(result.arrayobj[0][0]['expense']);
                    $('#incomeB').val(result.arrayobj[0][0]['income']);
                    $('#note').val(result.arrayobj[0][0]['note']);
                    break;
                case 'Furthereducation':
                    ShowFurthereducation();
                    $('#type').val("Furthereducation");
                    GetCountTime
                    (obj =
                        {
                            UrlParam: ("/api/furthereducationreferrals?clientId=" + $('#id').val()),
                            DisplayOn: ($("#monitoringTime")),
                            Value: "id",
                            Text1: "id",
                            Text2: "subject",
                            SelectedValue: monitorTime
                        }
                    );
                    $('#furthereducationId').val(result.arrayobj[0][0]['id']);
                    $('#ontraining').val(result.arrayobj[0][0]['ontraining']);
                    var GraduateDate = new Date(result.arrayobj[0][0]['graduateDate']);
                    var dd = GraduateDate.getDate();
                    var mm = GraduateDate.getMonth() + 1; //January is 0!
                    var yyyy = GraduateDate.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    GraduateDate = mm + '/' + dd + '/' + yyyy;
                    $('#graduatedateFuther').val(GraduateDate);
                    var DropoutDate = new Date(result.arrayobj[0][0]['dropoutDate']);
                    var dd = DropoutDate.getDate();
                    var mm = DropoutDate.getMonth() + 1; //January is 0!
                    var yyyy = DropoutDate.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    DropoutDate = mm + '/' + dd + '/' + yyyy;
                    $('#dropoutdateFuther').val(DropoutDate);
                    $('#reasondateFuther').val(result.arrayobj[0][0]['reason']);
                    break;
                default:
                    ShowFutureTraining();
                    $('#type').val("Futuretraining");
                    GetCountTime
                         (obj =
                           {
                               UrlParam: ("/api/lessions/"),
                               DisplayOn: ($("#futuretrainingLessonId")),
                               Value: "id",
                               Text1: "subject",
                               Text2: "lessionSub",
                               SelectedValue: (result.arrayobj[0][0]['lessionId'])
                           });
                    GetCountTime
                    (obj =
                      {
                          UrlParam: ("/api/subjects/"),
                          DisplayOn: ($("#monitoringTime")),
                          Value: "id",
                          Text1: "id",
                          Text2: "subjectName",
                          SelectedValue: (result.arrayobj[0][0]['monitoring']['monitoringTime'])
                      });
                    $('#futuretrainingprocessId').val(result.arrayobj[0][0]['id']);
                    $('#futuretrainingType').val(result.arrayobj[0][0]['ontraining']);
                    var GraduateDate = new Date(result.arrayobj[0][0]['graduateDate']);
                    var dd = GraduateDate.getDate();
                    var mm = GraduateDate.getMonth() + 1; //January is 0!
                    var yyyy = GraduateDate.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    GraduateDate = mm + '/' + dd + '/' + yyyy;

                    if (GraduateDate == "01/01/1970") {
                        GraduateDate = "";
                    }

                    $('#futuretraininggraduatedate').val(GraduateDate);
                    var DropoutDate = new Date(result.arrayobj[0][0]['dropoutDate']);
                    var dd = DropoutDate.getDate();
                    var mm = DropoutDate.getMonth() + 1; //January is 0!
                    var yyyy = DropoutDate.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }

                    DropoutDate = mm + '/' + dd + '/' + yyyy;

                    if (DropoutDate == "01/01/1970") {
                        DropoutDate = "";
                    }
                    $('#futuretrainingdropoutdate').val(DropoutDate);
                    $('#futuretrainingreason').val(result.arrayobj[0][0]['reason']);
            }
            document.getElementById('btnMonitoringAction').innerText = "Update";
            //EnabledPlacements();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function MonitoringDelete(id, typeCon) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/monitoringoption?Id=" + id + "&conditionType=" + typeCon,
                method: "DELETE",
                success: function () {
                    tableMonitoring.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This case worker is being used.", "Server Response");
                }
            });
        }
    });
}

//#region All functions Control

function ClearMonitor() {
    document.getElementById("type").selectedIndex = "0";
    document.getElementById("monitoringTime").selectedIndex = "0";
    $('#monitoringDate').val('');
    $('#nextmonitoringdate').val('');
    $('#monitoringtype').val('');
}

function Clearplacement() {
    document.getElementById("completed").selectedIndex = "0";
    $('#placementstatus').val('');
    $('#salary').val('');
    $('#placementprogressnote').val('');
}

function ClearBusinessSetup() {
    $("input[name='stillinbusiness'][value='Yes']").prop('checked', true);
    document.getElementById("completedB").selectedIndex = "0";
    $('#incomeB').val('');
    $('#expenseB').val('');
    $('#note').val('');
}

function Clearfurthereducation() {
    document.getElementById("ontraining").selectedIndex = "0";
    $('#graduatedateFuther').val('');
    $('#dropoutdateFuther').val('');
    $('#reasondateFuther').val('');
}

function ClearFuturetraining() {
    document.getElementById("futuretrainingType").selectedIndex = "0";
    $('#futuretraininggraduatedate').val('');
    $('#dropoutdateFuther').val('');
    $('#futuretrainingdropoutdate').val('');
    $('#futuretrainingreason').val('');
}

function ControlMonitor(bool) {
    document.getElementById('type').disabled = bool;
    document.getElementById('monitoringTime').disabled = bool;
    document.getElementById('monitoringDate').disabled = bool;
    document.getElementById('nextmonitoringdate').disabled = bool;
    document.getElementById('monitoringtype').disabled = bool;
}


function ControlPlacementProgress(bool) {
    document.getElementById('completed').disabled = bool;
    //document.getElementById('placementstatus').disabled = bool;
    document.getElementById('salary').disabled = bool;
    document.getElementById('placementprogressnote').disabled = bool;
}
//#endregion

function validatePlacement() {
    var isvalid = true;
    $('#placementstatus').css('border-color', '#cccccc');
    if ($('#salary').val().trim() === "") {
        $('#salary').css('border-color', 'red');
        $('#salary').focus();
        isvalid = false;
    }
    else {
        $('#salary').css('border-color', '#cccccc');
    }
    return isvalid
}

function validateMonitoring() {
    var isvalid = true;
    if ($('#monitoringTime').val().trim() === "") {
        $('#monitoringTime').css('border-color', 'red');
        $('#monitoringTime').focus();
        isvalid = false;
    }
    else {
        $('#monitoringTime').css('border-color', '#cccccc');
        if ($('#monitoringDate').val().trim() === "") {
            $('#monitoringDate').css('border-color', 'red');
            $('#monitoringDate').focus();
            isvalid = false;
        }
        else {
            $('#monitoringDate').css('border-color', '#cccccc');
            if ($('#nextmonitoringdate').val().trim() === "") {
                $('#nextmonitoringdate').css('border-color', 'red');
                $('#nextmonitoringdate').focus();
                isvalid = false;
            }
            else {
                $('#nextmonitoringdate').css('border-color', '#cccccc');
                if ($('#monitoringtype').val().trim() === "") {
                    $('#monitoringtype').css('border-color', 'red');
                    $('#monitoringtype').focus();
                    isvalid = false;
                }
                else {
                    $('#monitoringtype').css('border-color', '#cccccc');
                }
            }
        }
    }
    return isvalid
}

function Notuse (){
    //function GetCountTimePlacement() {
    //    var data = {};
    //    $.ajax({
    //        url: "/api/placements?clientId=" + $('#id').val(),
    //        data: JSON.stringify(data),
    //        type: "get",
    //        contentType: "application/json;charset=utf-8",
    //        dataType: "json",
    //        success: function (rusult) {
    //            $("#monitoringTime").empty();
    //            $("#monitoringTime").prepend("<option value=''>Select monitor time </option>");
    //            for (var i = 0; i < rusult.length; i++) {
    //                var placementDate = new Date(rusult[i].placementDate);
    //                var dd = placementDate.getDate();
    //                var mm = placementDate.getMonth() + 1; //January is 0!
    //                var yyyy = placementDate.getFullYear();
    //                if (dd < 10) {
    //                    dd = '0' + dd;
    //                }
    //                if (mm < 10) {
    //                    mm = '0' + mm;
    //                }
    //                placementDate = mm + '/' + dd + '/' + yyyy;
    //                $("#monitoringTime").append('<option value="' + rusult[i].countedTime + '">' + rusult[i].countedTime + '  | Company: ' + rusult[i].companyName + '  |  Placement date: ' + placementDate + '</option>');
    //            }
    //            $.ajax(data);
    //        },
    //        error: function (errormessage) {
    //            toastr.error("Something goes wrong!!", "Server Response");
    //        }
    //    });
    //}

    //function GetCountTimeBusinessSetup() {
    //    var data = {};
    //    $.ajax({
    //        url: "/api/BusinessSetups?clientId=" + $('#id').val(),
    //        data: JSON.stringify(data),
    //        type: "get",
    //        contentType: "application/json;charset=utf-8",
    //        dataType: "json",
    //        success: function (rusult) {
    //            $("#monitoringTime").empty();
    //            $("#monitoringTime").prepend("<option value=''>Select business set up time </option>");
    //            for (var i = 0; i < rusult.length; i++) {
    //                $("#monitoringTime").append('<option value="' + rusult[i].countTime + '">' + rusult[i].countTime + '  |Business type time : ' + rusult[i].businessType + '  | Place by: ' + rusult[i].jobPlaceBy + '</option>');
    //            }
    //            $.ajax(data);
    //        },
    //        error: function (errormessage) {
    //            toastr.error("Something goes wrong!!", "Server Response");
    //        }
    //    });
    //}

    //function GetSubjectFutureTraining() {
    //    var data = {};
    //    $.ajax({
    //        url: "/api/subjects/",
    //        data: JSON.stringify(data),
    //        type: "get",
    //        contentType: "application/json;charset=utf-8",
    //        dataType: "json",
    //        success: function (rusult) {
    //            $("#monitoringTime").empty();
    //            $("#monitoringTime").prepend("<option value=''>Select future subject</option>");
    //            for (var i = 0; i < rusult.length; i++) {
    //                $("#monitoringTime").append('<option value="' + rusult[i]['id'] + '">' + rusult[i].subjectName + '</option>');
    //            }
    //            $.ajax(data);
    //        },
    //        error: function (errormessage) {
    //            toastr.error("Something goes wrong!!", "Server Response");
    //        }
    //    });
    //}

    //function GetLessionFutureTraining() {
    //    var data = {};
    //    $.ajax({
    //        url: "/api/lessions/",
    //        data: JSON.stringify(data),
    //        type: "get",
    //        contentType: "application/json;charset=utf-8",
    //        dataType: "json",
    //        success: function (rusult) {
    //            rusult.sort
    //                (compare);
    //            $("#futuretrainingLessonId").empty();
    //            $("#futuretrainingLessonId").prepend("<option value=''>Select lession by select count time</option>");
    //            for (var i = 0; i < rusult.length; i++) {
    //                $("#futuretrainingLessonId").append('<option value="' + rusult[i]['id'] + '">' + rusult[i]['subject']['subjectName'] + " ::: " + rusult[i]['lessionSub'] + '</option>');
    //            }
    //            $.ajax(data);
    //        },
    //        error: function (errormessage) {
    //            toastr.error("Something goes wrong!!", "Server Response");
    //        }
    //    });
    //}


    function GetCountTimeBusinessSetup() {
        //var data = {};
        //$.ajax({
        //    url: "/api/BusinessSetups?clientId=" + $('#id').val(),
        //    data: JSON.stringify(data),
        //    type: "get",
        //    contentType: "application/json;charset=utf-8",
        //    dataType: "json",
        //    success: function (rusult) {
        //        $("#monitoringTime").empty();
        //        $("#monitoringTime").prepend("<option value=''>Select business set up time </option>");
        //        for (var i = 0; i < rusult.length; i++) {
        //            $("#monitoringTime").append('<option value="' + rusult[i].countTime + '">'  + rusult[i].countTime + '  |Business type time : ' + rusult[i].businessType + '  | Place by: ' + rusult[i].jobPlaceBy + '</option>');
        //        }
        //        $.ajax(data);
        //    },
        //    error: function (errormessage) {
        //        toastr.error("Something goes wrong!!", "Server Response");
        //    }
        //});
    }

    function GetSubjectFutureTraining() {
        //var data = {};
        //$.ajax({
        //    url: "/api/subjects/",
        //    data: JSON.stringify(data),
        //    type: "get",
        //    contentType: "application/json;charset=utf-8",
        //    dataType: "json",
        //    success: function (rusult) {
        //        $("#monitoringTime").empty();
        //        $("#monitoringTime").prepend("<option value=''>Select future subject</option>");
        //        for (var i = 0; i < rusult.length; i++) {
        //            $("#monitoringTime").append('<option value="' + rusult[i]['id'] + '">' + rusult[i].subjectName + '</option>');
        //        }
        //        $.ajax(data);
        //    },
        //    error: function (errormessage) {
        //        toastr.error("Something goes wrong!!", "Server Response");
        //    }
        //});
    }

    function GetLessionFutureTraining() {
        //var data = {};
        //$.ajax({
        //    url: "/api/lessions/",
        //    data: JSON.stringify(data),
        //    type: "get",
        //    contentType: "application/json;charset=utf-8",
        //    dataType: "json",
        //    success: function (rusult) {
        //        rusult.sort
        //            (compare);
        //        $("#futuretrainingLessonId").empty();
        //        $("#futuretrainingLessonId").prepend("<option value=''>Select lession by select count time</option>");
        //        for (var i = 0; i < rusult.length; i++) {
        //            $("#futuretrainingLessonId").append('<option value="' + rusult[i]['id'] + '">' + rusult[i]['subject']['subjectName'] + " ::: " + rusult[i]['lessionSub'] + '</option>');
        //        }
        //        $.ajax(data);
        //    },
        //    error: function (errormessage) {
        //        toastr.error("Something goes wrong!!", "Server Response");
        //    }
        //});
    }
}

