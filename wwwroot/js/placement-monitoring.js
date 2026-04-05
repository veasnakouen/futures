// Placement Monitoring Notification JS
var tableplacementMonitoringAction = [];

function getClientPlacementNotification(PlacementId, ClientId, ClientName) {
    $('#placementMonitoringActionModal').modal('show');
    $('#placementclientId').val(ClientId);
    GetplacementMonitoringActionByPlacementIdNotification(PlacementId);
    document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Add New";
    ClearPlacmentMonitor();
    ControlPlacmentprocesssMonitor(false);
    document.getElementById("PlacementMonitoringCompany").innerHTML = (" : " + ClientName);
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
    document.getElementsByName("placementMonitoringstatus").disabled = bool;
}

function placementMonitoringNoficationDelete(Id) {
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
    });
}

function validatePlacementMonitoring() {
    var isvalid = true;
    if ($('#placementnextmonitoringdate').val().trim() === "") {
        $('#placementnextmonitoringdate').css('border-color', 'red');
        $('#placementnextmonitoringdate').focus();
        isvalid = false;
    } else {
        $('#placementnextmonitoringdate').css('border-color', '#cccccc');
        if ($('#placementmonitoringtype').val().trim() === "") {
            $('#placementmonitoringtype').css('border-color', 'red');
            $('#placementmonitoringtype').focus();
            isvalid = false;
        } else {
            $('#placementmonitoringtype').css('border-color', '#cccccc');
            if ($('#placementcompleted').val().trim() === "") {
                $('#placementcompleted').css('border-color', 'red');
                $('#placementcompleted').focus();
                isvalid = false;
            } else {
                $('#placementcompleted').css('border-color', '#cccccc');
            }
        }
    }
    return isvalid;
}

function placementMonitoringNotificationEdit(Id) {
    $.ajax({
        url: "/api/PlacementMonitoring?Id=" + Id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            ControlPlacmentprocesssMonitor(false);
            $('#placementprocessMonitoringId').val(result[0]['id']);
            $('#PlacementMonitoringId').val(result[0]['monitoringId']);
            var monitoringDate = new Date(result[0]['monitoring']['monitoringDate']);
            var dd = monitoringDate.getDate();
            var mm = monitoringDate.getMonth() + 1;
            var yyyy = monitoringDate.getFullYear();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            monitoringDate = mm + '/' + dd + '/' + yyyy;

            var NextmonitoringDate = new Date(result[0]['monitoring']['nextMonitoringDate']);
            var dd = NextmonitoringDate.getDate();
            var mm = NextmonitoringDate.getMonth() + 1;
            var yyyy = NextmonitoringDate.getFullYear();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            NextmonitoringDate = mm + '/' + dd + '/' + yyyy;
            $('#placementnextmonitoringdate').val(NextmonitoringDate);
            $('#placementmonitoringtype').val(result[0]['monitoring']['monitoringtype']);

            if (result[0]['placementStatus'] === "Yes") {
                $("input[name='placementMonitoringstatus'][value='Yes']").prop('checked', true);
            } else if (result[0]['placementStatus'] === "No") {
                $("input[name='placementMonitoringstatus'][value='No']").prop('checked', true);
            } else {
                $("input[name='placementMonitoringstatus'][value='ChangedJob']").prop('checked', true);
            }
            $("#placementcompleted").val(result[0]['completed']);
            $('#placementsalary').val(result[0]['salary']);
            $('#placementprogressnotes').val(result[0]['note']);
            $('#placementclientId').val(result[0].monitoring.placementId);
            document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Update";
        },
        error: function () {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
}

function PlacementMonitoringActionNotification() {
    var action = document.getElementById('btnPlacementProcessMonitoringAction').innerText;
    if (action === "Save changes") {
        var ResM = validatePlacementMonitoring();
        if (ResM === false) return false;

        var monitoringobj = {
            MonitoringTime: 1,
            Enroll: "Get in API",
            Type: "Placement",
            ClientId: $('#placementclientId').val(),
            MonitoringDate: $('#placementnextmonitoringdate').val(),
            NextMonitoringDate: $('#placementnextmonitoringdate').val(),
            Monitoringtype: $('#placementmonitoringtype').val(),
            PlacementId: $('#placementclientId').val()
        };
        var Placementobj = {
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
            success: function () {
                toastr.success("Placement monitoring has been updated.", "Server Response");
                tableplacementMonitoringAction.ajax.reload();
                ClearPlacmentMonitor();
                ControlPlacmentprocesssMonitor(true);
                document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Add New";
            },
            error: function () {
                toastr.error("This Placement monitoring cannot saved!", "Server Response");
            }
        });
    } else if (action === "Add New") {
        document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Save changes";
        ControlPlacmentprocesssMonitor(false);
    } else if (action === "Update") {
        var ResM = validatePlacementMonitoring();
        if (ResM === false) return false;

        var monitoringobj = {
            Id: $('#PlacementMonitoringId').val(),
            MonitoringTime: 1,
            Enroll: "Get in API",
            Type: "Placement",
            ClientId: $('#placementclientId').val(),
            MonitoringDate: $('#placementnextmonitoringdate').val(),
            NextMonitoringDate: $('#placementnextmonitoringdate').val(),
            Monitoringtype: $('#placementmonitoringtype').val(),
            PlacementId: $('#placementclientId').val()
        };
        var Placementobj = {
            Id: $('#placementprocessMonitoringId').val(),
            Completed: $('#placementcompleted').val(),
            MonitoringId: monitoringobj.Id,
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
            success: function () {
                toastr.success("Placement monitoring has been updated.", "Server Response");
                tableplacementMonitoringAction.ajax.reload();
                ClearPlacmentMonitor();
                ControlPlacmentprocesssMonitor(true);
                document.getElementById('btnPlacementProcessMonitoringAction').innerText = "Add New";
            },
            error: function () {
                toastr.error("This Placement monitoring cannot saved!", "Server Response");
            }
        });
    }
}

function GetplacementMonitoringActionByPlacementIdNotification(PlacementId) {
    tableplacementMonitoringAction = $('#PlacementMonitoringActionTable').DataTable({
        ajax: {
            url: "/api/PlacementMonitoring?PlacementId=" + PlacementId,
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
                    var month = "Month";
                    if (data.monitoringtype > 1) month = "Months";
                    return data.monitoringtype + " " + month;
                }
            },
            { data: "completed" },
            { data: "placementStatus", "width": "120px" },
            { data: "salary" },
            { data: "note" },
            {
                data: { a: "id", b: "countedTime" },
                render: function (data) {
                    return "<a href='#' onclick='placementMonitoringNotificationEdit(" + data.id + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a> <a href='#' onclick='placementMonitoringNoficationDelete(" + data.monitoringId + ")'><span class='glyphicon glyphicon-edit'></span>Delete</a>";
                },
                "width": "250px"
            }
        ],
        destroy: true,
        "order": [[2, "desc"]]
    });
}

function getAll(countskip) {
    $.ajax({
        url: '/api/PlacementMonitoring?countskip=' + countskip,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result.arrayobj[1] > 0) {
                $("b.NumberNotification").html(
                    "<b class='NumberNotification'>" + result.arrayobj[1] + "</b>"
                );
                for (var i = 0; i < result.arrayobj[0].length; i++) {
                    var clientname = result.arrayobj[0][i].client.lastName + " " + result.arrayobj[0][i].client.firstName;
                    var nextMonitoringDate = new Date(result.arrayobj[0][i].monitorings.nextMonitoringDate);
                    var dd = nextMonitoringDate.getDate();
                    var mm = nextMonitoringDate.getMonth() + 1;
                    var yyyy = nextMonitoringDate.getFullYear();
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                    var monitoringDate = mm + '/' + dd + '/' + yyyy;

                    var image = result.arrayobj[0][i].client.photo;
                    if (!image) image = 'blank_profile.png';

                    $(".drop-content").append(
                        "<li><div class='col-md-3 col-sm-3 col-xs-3'><div class='notify-img'> <img width='45' height='45' src='../Images/" + image + "' alt=''> </div></div>   <div class='col-md-9 col-sm-9 col-xs-9 pd-l0'><a href=''>Id :</a> " + result.arrayobj[0][i].client.clientCode + result.arrayobj[0][i].client.id + ". <a href='#' onclick='getClientPlacementNotification(" + result.arrayobj[0][i].monitorings.placementId + ',' + '"' + result.arrayobj[0][i].client.id + '"' + ',' + '"' + clientname + '"' + ")'>Fullname : " + result.arrayobj[0][i].client.lastName + " " + result.arrayobj[0][i].client.firstName + "</a> <a href='' class='rIcon'><i class='fa fa-dot-circle-o'></i></a><p> Next monitordate on :</p><p class='time'>" + monitoringDate + "</p> </div></li>"
                    );
                }
            }
        }
    });
}

var scrolldown = "0";
jQuery(function ($) {
    $('.drop-content').on('scroll', function () {
        var scrollHeight = document.getElementsByClassName("drop-content")[0].scrollHeight;
        if (scrolldown < $(this).scrollTop()) {
            var a = parseInt($(this)[0].scrollHeight - 1);
            var b = parseInt($(this).scrollTop());
            var c = $(this).outerHeight();
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight || (a - b == c)) {
                var value = parseInt(document.getElementById('countskipNumber').value, 10);
                value = isNaN(value) ? 0 : value;
                value = value + 5;
                document.getElementById('countskipNumber').value = value;
                getAll($('#countskipNumber').val());
            }
        }
        scrolldown = $(this).scrollTop();
    });
});
