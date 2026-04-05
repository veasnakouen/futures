$(document).ready(function () {
    $('#businessSetupMonitoringModal').on('show.bs.modal', function () {
        GetbusinessSetupMonitoringByClientId()
    });

    $('#businessSetuptMonitoringActionModal').on('shown.bs.modal', function () {
        GetBusinessSetupCategory($('#businessSetupMonitoringCategoryShown').val());
    });
    
});


function GetBusinessSetupCategory(SelectedValue) {
    var data = {};
    $.ajax({
        url: "/api/businesscategories",
        data: JSON.stringify(data),
        type: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (rusult) {
            $("#businessSetupTypeCatagory").empty();
            $("#businessSetupTypeCatagory").prepend("<option value=''>Select Category</option>");
            for (var i = 0; i < rusult.length; i++) {
                $("#businessSetupTypeCatagory").append('<option value="' + rusult[i].id + '">' + rusult[i].busCategoryName + '</option>');
            }
            $("select option[value='" + SelectedValue + "']").attr('selected', 'selected');;
            $.ajax(data);
        },
        error: function (errormessage) {
            toastr.error("Something goes wrong!!", "Server Response");
        }
    });
}

////Display subject in Company BusinessSetupMonitoring monitoring
var tablebusinessSetupMonitoring = [];
function GetbusinessSetupMonitoringByClientId() {
    tablebusinessSetupMonitoring = $('#BusinessSetupMonitoringTable').DataTable({
            ajax: {
                url: "/api/businessSetupMonitoring?ClientId=" + $('#id').val(),
                dataSrc: ""
            },
            "lengthMenu": [[3, 10, 25, 50, -1], [3, 10, 25, 50, "All"]],
            columns: [
                 {
                   data: "id" 
                 },

                 {
                     data: "countTime"
                 },
               
                 {
                   data: "startBusinessSetUpDate",
                   render: function (data) {
                       var date = new Date(data);
                       var month = date.getMonth() + 1;
                       return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                   }
                 },
                   {
                       data: "businessType"
                   },
                 {
                     data: { a: "id", b: "businessType", c: "businessSetUpCategoryId" },
                    render: function (data) {
                        return "<a href='#' onclick='businessSetupMonitoring(" + data.id + ',' + '"' + data.businessType + '"' + ',' + data.businessSetUpCategoryId + ")'><i class='fa fa-pen-to-square'></i> Manage Monitoring</a>"
                        ;  
                    },
                    "width": "130px"
                 }
            ],

            destroy: true,
            "order": [[1, "asc"], [2, "asc"]]
        });
    } 

////Add Monitoring BusinessSetup  
var tablebusinessSetupMonitoringAction = [];
function GetbusinessSetupMonitoringActionByClientId() {
    tablebusinessSetupMonitoringAction = $('#BusinessSetupMonitoringActionTable').DataTable({
        ajax: {
            url: "/api/businessSetupMonitoring/monitoring?clientId=" + $('#id').val(),
            dataSrc: ""
        },
        "lengthMenu": [[3, 10, 25, 50, -1], [3, 10, 25, 50, "All"]],
        columns: [

              {
               data: "monitoring",
                    render: function (data) {
                    var date = new Date(data.monitoringDate);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                }
              },
              {
                data: "monitoring",
                render: function (data) {
                    var date = new Date(data.nextMonitoringDate);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                }
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
                  data: "businessType"
              },
              {
                  data: "stillInbusiness"
              },
              {
                  data: "expense"
              },
              {
                  data: "income"
              },
              {
                  data: "note"
              },
             {
                 data: { a: "id", b: "countedTime" },
                 render: function (data) {
                     return "<a href='#' onclick='BusinessSetupMonitoringEdit(" + data.id + ")'><i class='fa fa-pen-to-square'></i> Edit</a> <a href='#' onclick='BusinessSetupMonitoringDelete(" + data.monitoringId + ")'><i class='fa fa-pen-to-square'></i>Delete</a>"
                     ;
                 },
                 "width": "250px"
             }
        ],

        destroy: true,
        "order": [[1, "asc"], [2, "asc"]]
    });
}

function businessSetupMonitoring(Id, Business, businessSetUpCategoryId) {
    $('#businessSetuptMonitoringActionModal').modal('show');
    GetbusinessSetupMonitoringActionByClientId();
    document.getElementById('btnBusinessSetupProgressMonitoringAction').innerText = "Add New";
    ClearBusinessSetupMonitor();
    ControlBusinessSetupMonitor(true);
    $('#businessSetupMonitoringCategoryShown').val(businessSetUpCategoryId);
    $('#businessSetupMonitoringCounttimeId').val(Id);
    document.getElementById("BusinessSetuptMonitoringCompany").innerHTML = (" : Business  " + Business);

}

function validateBusinessSetuponitoring() {
    var isvalid = true;
    if ($('#businessSetupmonitoringDate').val().trim() === "") {
        $('#businessSetupmonitoringDate').css('border-color', 'red');
        $('#businessSetupmonitoringDate').focus();
        isvalid = false;
    }
    else {
        $('#businessSetupmonitoringDate').css('border-color', '#cccccc');
        if ($('#businessSetupnextmonitoringdate').val().trim() === "") {
            $('#businessSetupnextmonitoringdate').css('border-color', 'red');
            $('#businessSetupnextmonitoringdate').focus();
            isvalid = false;
        }
        else {
            $('#businessSetupnextmonitoringdate').css('border-color', '#cccccc');
            if ($('#businessSetupmonitoringtype').val().trim() === "") {
                $('#businessSetupmonitoringtype').css('border-color', 'red');
                $('#businessSetupmonitoringtype').focus();
                isvalid = false;
            }
            else {
                $('#businessSetupmonitoringtype').css('border-color', '#cccccc');
                if ($('#businessSetupcompleted').val().trim() === "") {
                    $('#businessSetupcompleted').css('border-color', 'red');
                    $('#businessSetupcompleted').focus();
                    isvalid = false;
                }
                else {
                    $('#businessSetupcompleted').css('border-color', '#cccccc');
                    if ($('#businessSetupTypeCatagory').val().trim() === "") {
                        $('#businessSetupTypeCatagory').css('border-color', 'red');
                        $('#businessSetupTypeCatagory').focus();
                        isvalid = false;
                    }
                    else {
                        $('#businessSetupTypeCatagory').css('border-color', '#cccccc');
                    }
                }
            }
        }
    }
    return isvalid
}

function BusinessSetupMonitoringAction() {
    var action = '';
    action = document.getElementById('btnBusinessSetupProgressMonitoringAction').innerText;
    if (action === "Save changes") {
        var ResM = validateBusinessSetuponitoring();
        if (ResM === false) {
            return false;
        }
        var monitoringobj = {
            MonitoringTime: $('#businessSetupMonitoringCounttimeId').val(),
            Enroll: "Get in API",
            Type: "Businesssetup",
            ClientId: $('#id').val(),
            MonitoringDate: $('#businessSetupmonitoringDate').val(),
            NextMonitoringDate: $('#businessSetupnextmonitoringdate').val(),
            Monitoringtype: $('#businessSetupmonitoringtype').val()
        };

        var businessInProgressDto =
            {
                BusinessSetUpCategoryId: $('#businessSetupTypeCatagory').val(),
                StillInbusiness: $('input[name=businessSetupMonitoringstatus]:checked').val(),
                BusinessType: $('#businessSetupcompleted').val(),
                Expense: $('#businessSetupExpense').val(),
                Income: $('#businessSetupIncome').val(),
                Note: $('#businessSetupsalarynotes').val(),
            };
        var businessInProgressMonitorIngMulObj = {
            "businessInProgressDto": businessInProgressDto,
            "monitoringDto": monitoringobj
        };
        $.ajax({
            url: "/api/businessSetupMonitoring",
            data: JSON.stringify(businessInProgressMonitorIngMulObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Business setup monitoring has been updated.", "Server Response");
                tablebusinessSetupMonitoringAction.ajax.reload();
                tableMonitoring.ajax.reload();
                ClearBusinessSetupMonitor();
                ControlBusinessSetupMonitor(true);
                document.getElementById('btnBusinessSetupProgressMonitoringAction').innerText = "Add New";
            },
            error: function (errormessage) {
                toastr.error("This Business setup  monitoring cannot saved!", "Server Response");

            }
        });
    }
    else if (action === "Add New") {

        document.getElementById('btnBusinessSetupProgressMonitoringAction').innerText = "Save changes";
        ControlBusinessSetupMonitor(false);
    }
    else if (action === "Update") {
        var ResM = validateBusinessSetuponitoring();
        if (ResM === false) {
            return false;
        }

        var monitoringobj = {
            Id: $('#businessMonitoringId').val(),
            MonitoringTime: $('#businessSetupMonitoringCounttimeId').val(),
            Enroll: "Get in API",
            Type: "Businesssetup",
            ClientId: $('#id').val(),
            MonitoringDate: $('#businessSetupmonitoringDate').val(),
            NextMonitoringDate: $('#businessSetupnextmonitoringdate').val(),
            Monitoringtype: $('#businessSetupmonitoringtype').val()
        };

        var BusinessInprogressobj =
            {
                Id: $('#businessSetupMonitoringId').val(),
                MonitoringId: monitoringobj.Id,
                BusinessSetUpCategoryId: $('#businessSetupTypeCatagory').val(),
                StillInbusiness: $('input[name=businessSetupMonitoringstatus]:checked').val(),
                BusinessType: $('#businessSetupcompleted').val(),
                Expense: $('#businessSetupExpense').val(),
                Income: $('#businessSetupIncome').val(),
                Note: $('#businessSetupsalarynotes').val()
            };
        var businessInProgressMonitorIngMulObj = {
            "businessInProgressDto": BusinessInprogressobj,
            "monitoringDto": monitoringobj
        };

        $.ajax({
            url: "/api/businessSetupMonitoring/",
            data: JSON.stringify(businessInProgressMonitorIngMulObj),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Business setup monitoring has been updated.", "Server Response");
                tablebusinessSetupMonitoringAction.ajax.reload();
                tableMonitoring.ajax.reload();
                ClearBusinessSetupMonitor();
                ControlBusinessSetupMonitor(true);
                document.getElementById('btnBusinessSetupProgressMonitoringAction').innerText = "Add New";
            },
            error: function (errormessage) {
                toastr.error("This Business setup monitoring cannot saved!", "Server Response");
               
            }
        });
    }
}

function BusinessSetupMonitoringEdit(Id) {
         $.ajax({
         url: "/api/businessSetupMonitoring/" + Id,
         type: "GET",
         contentType: "application/json;charset=UTF-8",
         dataType: "json",
         success: function (result) {
             ControlBusinessSetupMonitor(false);
             GetBusinessSetupCategory(result[0]['businessSetUpCategoryId']);
             $('#businessSetupMonitoringId').val(result[0]['id']);
             $('#businessMonitoringId').val(result[0]['monitoringId']);
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
             $('#businessSetupmonitoringDate').val(monitoringDate);
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
             $('#businessSetupnextmonitoringdate').val(NextmonitoringDate);
             $('#businessSetupmonitoringtype').val(result[0]['monitoring']['monitoringtype']);

             if ((result[0]['stillInbusiness']) == "Yes") {
                 $("input[name='businessSetupMonitoringstatus'][value='Yes']").prop('checked', true);
             } else if ((result[0]['stillInbusiness']) == "No") {
                 $("input[name='businessSetupMonitoringstatus'][value='No']").prop('checked', true);
             } else {
                 $("input[name='businessSetupMonitoringstatus'][value='ChangedBusiness']").prop('checked', true);
             };
             $("#businessSetupcompleted").val(result[0]['businessType']);
             $('#businessSetupIncome').val(result[0]['income']);
             $('#businessSetupExpense').val(result[0]['expense']);
             $('#businessSetupsalarynotes').val(result[0]['note']);
             document.getElementById('btnBusinessSetupProgressMonitoringAction').innerText = "Update";
         },
         error: function (errormessage) {
             toastr.error("Something unexpected happen.", "Server Response");
            }
         });
}

function BusinessSetupMonitoringDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/businessSetupMonitoring/" + id,
                method: "DELETE",
                success: function () {
                    tablebusinessSetupMonitoringAction.ajax.reload();
                    tableMonitoring.ajax.reload();
                    ClearBusinessSetupMonitor();
                    ControlBusinessSetupMonitor(true)
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This business set up monitoring cannot saved.", "Server Response");
                }
            });
        }
    });;
};

function ClearBusinessSetupMonitor() {
    $('#businessSetupmonitoringDate').val('');
    $('#businessSetupnextmonitoringdate').val('');
    $('#businessSetupmonitoringtype').val('');
    $("input[name='businessSetupMonitoringstatus'][value='Yes']").prop('checked', true);
    $('#businessSetupcompleted').val('');
    $('#businessSetupIncome').val('');
    $('#businessSetupExpense').val('');
    $('#businessSetupsalarynotes').val('');
    $('#businessSetupTypeCatagory').val('');
}

function ControlBusinessSetupMonitor(bool) {
    document.getElementById('businessSetupTypeCatagory').disabled = bool;
    document.getElementById('businessSetupmonitoringDate').disabled = bool;
    document.getElementById('businessSetupnextmonitoringdate').disabled = bool;
    document.getElementById('businessSetupmonitoringtype').disabled = bool;
    document.getElementById('businessSetupcompleted').disabled = bool;
    document.getElementById('businessSetupIncome').disabled = bool;
    document.getElementById('businessSetupExpense').disabled = bool;
    document.getElementById('businessSetupIncome').disabled = bool;
    document.getElementsByName("businessSetupMonitoringstatus").disabled = bool;
}
