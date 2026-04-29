$(document).ready(function () {
    $('#placementMonitoringModal').on('show.bs.modal', function () {
        GetplacementMonitoringByClientId()
    });
});

////Display subject in Company placement monitoring
var tableplacementMonitoring = [];
function GetplacementMonitoringByClientId() {
    tableplacementMonitoring = $('#PlacementMonitoringTable').DataTable({
            ajax: {

                url: "/api/PlacementMonitoring?ClientId=" + $('#id').val(),
                dataSrc: ""
            },
            "lengthMenu": [[3, 10, 25, 50, -1], [3, 10, 25, 50, "All"]],
            columns: [
                 {
                   data: "id" 
                 },

                 {
                   data: "countedTime"  
                 },
                 {
                   data: "placementDate",
                   render: function (data) {
                       var date = new Date(data);
                       var month = date.getMonth() + 1;
                       return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                   }
                 },
                 {
                     data: "companyName"
                 },

                 {
                     data: { a: "id", b: "companyName" },
                    render: function (data) {
                        return "<a href='#' onclick='placementMonitoring(" + data.id + ',' + '"' + data.companyName + '"' + ")'><i class='fa fa-pen-to-square'></i> Manage Monitoring</a>"
                        ;  
                    },
                    "width": "130px"
                 }
            ],

            destroy: true,
            "order": [[1, "asc"], [2, "asc"]]
        });
    } 
////Add Monitoring Placement  
var tableplacementMonitoringAction = [];
function GetplacementMonitoringActionByPlacementId() {
    tableplacementMonitoringAction = $('#PlacementMonitoringActionTable').DataTable({
        ajax: {
            url: "/api/PlacementMonitoring/process?PlacementId=" + $('#placementclientId').val(),
            dataSrc: ""
        },
        "lengthMenu": [[3, 10, 25, 50, -1], [3, 10, 25, 50, "All"]],
        columns: [
               {
                   data: "monitoring",
                   render: function (data) {
                       var date = new Date(data.nextMonitoringDate);
                       var month = date.getMonth() + 1;
                       return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                   },
                   "width": "150px"
               },
              {
                  data: "monitoring",
                  render: function (data) {
                      var month= "Month"
                      if (data.monitoringtype >  1 ) {
                          month = "Months"
                      }
                      return data.monitoringtype + " " + month;
                  }
              },
              {
                  data: "completed"
              },
              {
                  data: "placementStatus",
                  "width": "120px"
              },
              {
                  data: "salary"
              },
              {
                  data: "note"
              },
             {
                 data: { a: "id", b: "countedTime" },
                 render: function (data) {
                     return "<a href='#' onclick='placementMonitoringEdit(" + data.id + ")'><i class='fa fa-pen-to-square'></i> Edit</a> <a href='#' onclick='placementMonitoringDelete(" + data.monitoringId + ")'><i class='fa fa-pen-to-square'></i>Delete</a>"
                     ;
                 },
                 "width": "250px"
             }
        ],

        destroy: true,
        "order": [[1, "asc"], [2, "asc"]]
    });
}

function placementMonitoring(Id, Commpany) {
    $('#placementMonitoringActionModal').modal('show');
    $('#placementclientId').val(Id);
    GetplacementMonitoringActionByPlacementId()
    document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Add New";
    ClearPlacmentMonitor();
    ControlPlacmentprocesssMonitor(true);
    $('#PlacementMonitoringCounttimeId').val(Id);
    document.getElementById("PlacementMonitoringCompany").innerHTML = (" : Company  " + Commpany);
}

function validatePlacementMonitoring() {
    var isvalid = true;
        if ($('#placementnextmonitoringdate').val().trim() === "") {
            $('#placementnextmonitoringdate').css('border-color', 'red');
            $('#placementnextmonitoringdate').focus();
            isvalid = false;
        }
        else {
            $('#placementnextmonitoringdate').css('border-color', '#cccccc');
            if ($('#placementmonitoringtype').val().trim() === "") {
                $('#placementmonitoringtype').css('border-color', 'red');
                $('#placementmonitoringtype').focus();
                isvalid = false;
            }
            else {
                $('#placementmonitoringtype').css('border-color', '#cccccc');
                if ($('#placementcompleted').val().trim() === "") {
                    $('#placementcompleted').css('border-color', 'red');
                    $('#placementcompleted').focus();
                    isvalid = false;
                }
                else {
                    $('#placementcompleted').css('border-color', '#cccccc');   
            }
        }
    }
    return isvalid
}

function PlacementMonitoringAction() {
    var action = '';
    action = document.getElementById('btnPlacementProcessMonitoringAction').innerText;
    if (action === "Save changes") {
        var ResM = validatePlacementMonitoring();
        if (ResM === false) {
            return false;
        }
        var monitoringobj = {
            MonitoringTime: $('#PlacementMonitoringCounttimeId').val(), 
            Enroll: "Get in API",
            Type: "Placement",
            ClientId: parseInt($('#id').val()),
            MonitoringDate: $('#placementnextmonitoringdate').val(),// update to getdate in server side
            NextMonitoringDate: $('#placementnextmonitoringdate').val(),
            Monitoringtype: $('#placementmonitoringtype').val(),
            PlacementId: parseInt($('#placementclientId').val())
        };
        var Placementobj = 
            {
                Completed: $('#placementcompleted').val(),
                PlacementStatus: $('input[name=placementMonitoringstatus]:checked').val(),
                Salary: $('#placementsalary').val(),
                Note: $('#placementprogressnotes').val()
            };
        var PlacementMonitoringMulObj = {
            "pLacementProcessDto": Placementobj,
            "monitoringDto": monitoringobj
        };

        $.ajax({
            url: "/api/PlacementMonitoring/",
            data: JSON.stringify(PlacementMonitoringMulObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Placement monitoring has been updated.", "Server Response");
                tableplacementMonitoringAction.ajax.reload();
                tableMonitoring.ajax.reload();
                ClearPlacmentMonitor();
                ControlPlacmentprocesssMonitor(true);
                document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Add New";
            },
            error: function (errormessage) {
                toastr.error("This Placement monitoring cannot saved!", "Server Response");

            }
        });
    }
    else if (action === "Add New") {

        document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Save changes";
        ControlPlacmentprocesssMonitor(false);
    }
    else if (action === "Update") {
        var ResM = validatePlacementMonitoring();
        if (ResM === false) {
            return false;
        }

        var monitoringobj = {
            Id : parseInt($('#PlacementMonitoringId').val()),
            MonitoringTime: $('#PlacementMonitoringCounttimeId').val(),
            Enroll: "Get in API",
            Type: "Placement",
            ClientId: parseInt($('#id').val()),
            MonitoringDate: $('#placementnextmonitoringdate').val(),
            NextMonitoringDate: $('#placementnextmonitoringdate').val(),
            Monitoringtype: $('#placementmonitoringtype').val(),
            PlacementId: parseInt($('#placementclientId').val())
        };

        var Placementobj =
            {
                Id: parseInt($('#placementprocessMonitoringId').val()),
                Completed: $('#placementcompleted').val(),
                MonitoringId: monitoringobj.Id ,
                PlacementStatus: $('input[name=placementMonitoringstatus]:checked').val(),
                Salary: $('#placementsalary').val(),
                Note: $('#placementprogressnotes').val()
            };
        var PlacementMonitoringMulObj = {
            "pLacementProcessDto": Placementobj,
            "monitoringDto": monitoringobj
        };

        $.ajax({
            url: "/api/PlacementMonitoring/",
            data: JSON.stringify(PlacementMonitoringMulObj),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Placement monitoring has been updated.", "Server Response");
                tableplacementMonitoringAction.ajax.reload();
                tableMonitoring.ajax.reload();
                ClearPlacmentMonitor();
                ControlPlacmentprocesssMonitor(true);
                document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Add New";
            },
            error: function (errormessage) {
                toastr.error("This Placement monitoring cannot saved!", "Server Response");
               
            }
        });
    }
}

function placementMonitoringEdit(Id) {
         $.ajax({
         url: "/api/PlacementMonitoring/byid?Id=" + Id,
         type: "GET",
         contentType: "application/json;charset=UTF-8",
         dataType: "json",
         success: function (result) {
             ControlPlacmentprocesssMonitor(false);
             $('#placementprocessMonitoringId').val(result[0]['id']); 
             $('#PlacementMonitoringId').val(result[0]['monitoringId']);
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
             $('#placementnextmonitoringdate').val(NextmonitoringDate);
             $('#placementmonitoringtype').val(result[0]['monitoring']['monitoringtype']);

             if ((result[0]['placementStatus']) == "Yes") {
                 $("input[name='placementMonitoringstatus'][value='Yes']").prop('checked', true);
             } else if ((result[0]['placementStatus']) == "No") {
                 $("input[name='placementMonitoringstatus'][value='No']").prop('checked', true);
             } else {
                 $("input[name='placementMonitoringstatus'][value='ChangedJob']").prop('checked', true);
             };
             $("#placementcompleted").val(result[0]['completed']);
             $('#placementsalary').val(result[0]['salary']);
             $('#placementprogressnotes').val(result[0]['note']);
             $('#placementclientId').val(result[0].monitoring.placementId);
             document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Update";
         },
         error: function (errormessage) {
             toastr.error("Something unexpected happen.", "Server Response");
            }
         });
}

function placementMonitoringDelete(Id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/placementmonitoring?id=" + Id,
                method: "DELETE",
                success: function () {
                    tableplacementMonitoringAction.ajax.reload();
                    tableMonitoring.ajax.reload();
                    ClearPlacmentMonitor();
                    ControlPlacmentprocesssMonitor(true);
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This business set up monitoring cannot saved.", "Server Response");
                }
            });
        }
    });;
}

function ClearPlacmentMonitor() {
    $('#placementnextmonitoringdate').val('');
    $('#placementmonitoringtype').val('');
    $('.placementMonitoringstatus').val('');
    $('#placementcompleted').val('');
    $('#placementsalary').val('');
    $('#placementprogressnotes').val('');
}

function ControlPlacmentprocesssMonitor(bool) {
    document.getElementById('placementnextmonitoringdate').disabled = bool;
    document.getElementById('placementmonitoringtype').disabled = bool;
    document.getElementById('placementcompleted').disabled = bool;
    document.getElementById('placementsalary').disabled = bool;
    document.getElementById('placementprogressnotes').disabled = bool;
    document.getElementsByName("placementMonitoringstatus").disabled= bool;
}
