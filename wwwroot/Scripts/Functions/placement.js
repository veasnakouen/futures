
/*Note if have get Id or not*/
$(document).ready(function () {
    $('#placementModal').on('show.bs.modal', function () {
        if ($('#id').val() != '') {
            DisabledPlacements();
            ClearPlacements();
            $('#placementDate').css('border-color', '#cccccc');
            document.getElementById('btnPlacementsAction').innerText = "Add New";
            $("#clientId").prop('disabled', true);     
        }
        else {
            $("#clientId").prop('disabled', false);
        }
    });

    $("#placementSalary").change(function () {
        var salary = document.getElementById('placementSalary').value;
        var tip = document.getElementById('placementTip').value;
        var total = parseFloat(salary) + parseFloat(tip);
        $('#totalIncome').val(total);
    });

    $("#placementTip").change(function () {
        var salary = document.getElementById('placementSalary').value;
        var tip = document.getElementById('placementTip').value;
        var total = parseFloat(salary) + parseFloat(tip);
        $('#totalIncome').val(total);
    });
});

var tablePlacements = [];

function GetPlacementByClientId(id) {
    tablePlacements = $('#placementTable').DataTable({
        ajax: {
            url: "/api/placements?clientId=" + id,
            dataSrc: ""
        },
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
                data: "totalIncome",
                render: function (data) {
                    return   "$" + data;
                }
            },
            {
                data: "jobPosition.name"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='PlacementEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='PlacementDelete(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
                }
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

// Cases Action
function PlacementAction() {
    var action = '';
    action = document.getElementById('btnPlacementsAction').innerText;
    if (action === "Save changes") {
        if ($('#placementDate').val().trim() === "") {
            $('#placementDate').css('border-color', 'red');
            $('#placementDate').focus();
        }
        else {
            $('#placementDate').css('border-color', '#cccccc');

            if ($('#companyName').val().trim() === "") {
                $('#companyName').css('border-color', 'red');
                $('#companyName').focus();
            }
            else {
                $('#companyName').css('border-color', '#cccccc');
                var data = new FormData();
                data.append("PlacementDate", $("#placementDate").val());
                data.append("PlacementType", $("#placementType").val());
                data.append("JobPositionId", $("#positionId").val());
                data.append("CompanyName", $("#companyName").val());
                data.append("CompanyContactName", $("#companyContactName").val());
                data.append("CompanyContactPhone", $("#companyContactPhone").val());
                data.append("CompanyContactEmail", $("#companyEmail").val());
                data.append("CompanyAddress", $("#companyAddress").val());
                data.append("JobPlacedBy", $("#placementBy").val());
                data.append("Salary", $("#placementSalary").val());
                data.append("Tips", $("#placementTip").val());
                data.append("TotalIncome", $("#totalIncome").val());
                data.append("WorkTime", $("#workingTime").val());
                data.append("DayOff", $("#numberOfDayOff").val());
                data.append("NumberOfAnnualLeave", $("#numberOfAnnualLeave").val());
                data.append("CaseId", $("#caseIds").val());
                data.append("ClientId", $("#id").val());
                data.append("Status", '');
                data.append("DropfromDate", '');
                if ($('#placementHealth').is(':checked')) {
                    data.append("Health", true);
                } else {
                    data.append("Health", false);
                }
                if ($('#placementMeal').is(':checked')) {
                    data.append("Meal", true);
                } else {
                    data.append("Meal", false);
                }
                if ($('#placementTransport').is(':checked')) {
                    data.append("Transport", true);
                } else {
                    data.append("Transport", false);
                }
                if ($('#placementBonus').is(':checked')) {
                    data.append("Bonus", true);
                } else {
                    data.append("Bonus", false);
                }
                if ($('#placementPublicHoliday').is(':checked')) {
                    data.append("PublicHoliday", true);
                } else {
                    data.append("PublicHoliday", false);
                }
                if ($('#placementAccidentInsurance').is(':checked')) {
                    data.append("AccidentInsurance", true);
                } else {
                    data.append("AccidentInsurance", false);
                }
                if ($('#placementAccommodation').is(':checked')) {
                    data.append("Accommodation", true);
                } else {
                    data.append("Accommodation", false);
                }
                if ($('#placementOvertime').is(':checked')) {
                    data.append("Overtime", true);
                } else {
                    data.append("Overtime", false);
                }
                if ($('#placementThirteenMonthsSalary').is(':checked')) {
                    data.append("ThirteenMonthsSalary", true);
                } else {
                    data.append("ThirteenMonthsSalary", false);
                }
                if ($('#placementAnnualLeave').is(':checked')) {
                    data.append("AnnualLeave", true);
                } else {
                    data.append("AnnualLeave", false);
                }
                $.ajax({
                    url: "/api/placements",
                    type: "POST",
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (result) {
                        toastr.success("New placement has been saved to database.", "Server Response");
                        tablePlacements.ajax.reload();
                        DisabledPlacements();
                        document.getElementById('btnPlacementsAction').innerText = "Add New";
                        ClearPlacements();
                        $('#placementModal').modal('hide');
                    },
                    error: function (errormessage) {
                        toastr.error("This placement is already exists.", "Server Response");
                        DisabledPlacements();
                        document.getElementById('btnPlacementsAction').innerText = "Add New";
                        ClearPlacements();
                    }
                });
               
            }
        }
    }
    else if (action === "Add New") {
        EnabledPlacements();
        document.getElementById('btnPlacementsAction').innerText = "Save changes";
        ClearPlacements();
        $('#caseId').focus();
    }
    else if (action === "Update") {
        $('#placementDate').css('border-color', '#cccccc');

        var data = new FormData();
        data.append("PlacementId", $("#placementId").val());
        data.append("PlacementDate", $("#placementDate").val());
        data.append("PlacementType", $("#placementType").val());
        data.append("JobPositionId", $("#positionId").val());
        data.append("CompanyName", $("#companyName").val());
        data.append("CompanyContactName", $("#companyContactName").val());
        data.append("CompanyContactPhone", $("#companyContactPhone").val());
        data.append("CompanyContactEmail", $("#companyEmail").val());
        data.append("CompanyAddress", $("#companyAddress").val());
        data.append("JobPlacedBy", $("#placementBy").val());
        data.append("Salary", $("#placementSalary").val());
        data.append("Tips", $("#placementTip").val());
        data.append("TotalIncome", $("#totalIncome").val());
        data.append("WorkTime", $("#workingTime").val());
        data.append("DayOff", $("#numberOfDayOff").val());
        data.append("NumberOfAnnualLeave", $("#numberOfAnnualLeave").val());
        data.append("CaseId", $("#caseIds").val());
        data.append("ClientId", $("#id").val());
        data.append("Status", '');
        data.append("DropfromDate", '');
        if ($('#placementHealth').is(':checked')) {
            data.append("Health", true);
        } else {
            data.append("Health", false);
        }
        if ($('#placementMeal').is(':checked')) {
            data.append("Meal", true);
        } else {
            data.append("Meal", false);
        }
        if ($('#placementTransport').is(':checked')) {
            data.append("Transport", true);
        } else {
            data.append("Transport", false);
        }
        if ($('#placementBonus').is(':checked')) {
            data.append("Bonus", true);
        } else {
            data.append("Bonus", false);
        }
        if ($('#placementPublicHoliday').is(':checked')) {
            data.append("PublicHoliday", true);
        } else {
            data.append("PublicHoliday", false);
        }
        if ($('#placementAccidentInsurance').is(':checked')) {
            data.append("AccidentInsurance", true);
        } else {
            data.append("AccidentInsurance", false);
        }
        if ($('#placementAccommodation').is(':checked')) {
            data.append("Accommodation", true);
        } else {
            data.append("Accommodation", false);
        }
        if ($('#placementOvertime').is(':checked')) {
            data.append("Overtime", true);
        } else {
            data.append("Overtime", false);
        }
        if ($('#placementThirteenMonthsSalary').is(':checked')) {
            data.append("ThirteenMonthsSalary", true);
        } else {
            data.append("ThirteenMonthsSalary", false);
        }
        if ($('#placementAnnualLeave').is(':checked')) {
            data.append("AnnualLeave", true);
        } else {
            data.append("AnnualLeave", false);
        }

        $.ajax({
            url: "/api/placements/" + data.Id,
            type: "PUT",
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                toastr.success("Placement has been updated.", "Server Response");
                tablePlacements.ajax.reload();
                DisabledPlacements();
                document.getElementById('btnPlacementsAction').innerText = "Add New";
                ClearPlacements();
                $('#placementModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This placement is already exists.", "Server Response");
                DisabledPlacements();
                document.getElementById('btnPlacementsAction').innerText = "Add New";
                ClearPlacements();
            }
        });
    }
}

function PlacementEdit(id) {

    $('#placementDate').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/placements/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#placementModal').modal('show');
            $('#placementId').val(result.id);
            $('#caseIds').val(result.countedTime);
            $('#placementType').val(result.placementType);
            $('#positionId').val(result.jobPosition.id);
            $('#placementBy').val(result.jobPlacedBy);
            $('#companyName').val(result.companyName);
            $('#companyContactName').val(result.companyContactName);
            $('#companyContactPhone').val(result.companyContactPhone);
            $('#companyEmail').val(result.companyContactEmail);
            $('#companyAddress').val(result.companyAddress);
            $('#placementSalary').val(result.salary);
            $('#placementTip').val(result.tips);
            $('#totalIncome').val(result.totalIncome);
            $('#workingTime').val(result.workTime);
            $('#numberOfDayOff').val(result.dayOff);
            $('#numberOfAnnualLeave').val(result.numberOfAnnualLeave);
            if (result.health == true) {
                $('#placementHealth').prop('checked', true);
            }
            else {
                $('#placementHealth').prop('checked', false);
            }
            if (result.meal == true) {
                $('#placementMeal').prop('checked', true);
            }
            else {
                $('#placementMeal').prop('checked', false);
            }
            if (result.transport == true) {
                $('#placementTransport').prop('checked', true);
            }
            else {
                $('#placementTransport').prop('checked', false);
            }
            if (result.bonus == true) {
                $('#placementBonus').prop('checked', true);
            }
            else {
                $('#placementBonus').prop('checked', false);
            }
            if (result.publicHoliday == true) {
                $('#placementPublicHoliday').prop('checked', true);
            }
            else {
                $('#placementPublicHoliday').prop('checked', false);
            }
            if (result.accidentInsurance == true) {
                $('#placementAccidentInsurance').prop('checked', true);
            }
            else {
                $('#placementAccidentInsurance').prop('checked', false);
            }
            if (result.accommodation == true) {
                $('#PlacementAccommodation').prop('checked', true);
            }
            else {
                $('#PlacementAccommodation').prop('checked', false);
            }
            if (result.overtime == true) {
                $('#placementOvertime').prop('checked', true);
            }
            else {
                $('#placementOvertime').prop('checked', false);
            }
            if (result.thirteenMonthsSalary == true) {
                $('#placementThirteenSalary').prop('checked', true);
            }
            else {
                $('#placementThirteenSalary').prop('checked', false);
            }
            if (result.annualLeave == true) {
                $('#placementAnnualLeave').prop('checked', true);
            }
            else {
                $('#placementAnnualLeave').prop('checked', false);
            }

            var placementDate = new Date(result.placementDate);
            var dd = placementDate.getDate();
            var mm = placementDate.getMonth() + 1; //January is 0!
            var yyyy = placementDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            placementDate = mm + '/' + dd + '/' + yyyy;
            $('#placementDate').val(placementDate);

            document.getElementById('btnPlacementsAction').innerText = "Update";
            EnabledPlacements();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function PlacementDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/placements/" + id,
                method: "DELETE",
                success: function () {
                    tablePlacements.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This placement is being used.", "Server Response");
                }
            });
        }
    });
}

function EnabledPlacements() {
    document.getElementById('caseIds').disabled = false;
    document.getElementById('placementDate').disabled = false;
    document.getElementById('placementType').disabled = false;
    document.getElementById('positionId').disabled = false;
    document.getElementById('placementBy').disabled = false;
    document.getElementById('companyName').disabled = false;
    document.getElementById('companyContactName').disabled = false;
    document.getElementById('companyContactPhone').disabled = false;
    document.getElementById('companyEmail').disabled = false;
    document.getElementById('companyAddress').disabled = false;
    document.getElementById('placementSalary').disabled = false;
    document.getElementById('placementTip').disabled = false;
    document.getElementById('workingTime').disabled = false;
    document.getElementById('numberOfDayOff').disabled = false;
    document.getElementById('numberOfAnnualLeave').disabled = false;
    document.getElementById('placementHealth').disabled = false;
    document.getElementById('placementMeal').disabled = false;
    document.getElementById('placementTransport').disabled = false;
    document.getElementById('placementBonus').disabled = false;
    document.getElementById('placementPublicHoliday').disabled = false;
    document.getElementById('placementAccidentInsurance').disabled = false;
    document.getElementById('placementAccomodation').disabled = false;
    document.getElementById('placementOvertime').disabled = false;
    document.getElementById('placementThirteenSalary').disabled = false;
    document.getElementById('placementAnnualLeave').disabled = false;
}



function DisabledPlacements() {
    document.getElementById('caseIds').disabled = true;
    document.getElementById('placementDate').disabled = true;
    document.getElementById('placementType').disabled = true;
    document.getElementById('positionId').disabled = true;
    document.getElementById('placementBy').disabled = true;
    document.getElementById('companyName').disabled = true;
    document.getElementById('companyContactName').disabled = true;
    document.getElementById('companyContactPhone').disabled = true;
    document.getElementById('companyEmail').disabled = true;
    document.getElementById('companyAddress').disabled = true;
    document.getElementById('placementSalary').disabled = true;
    document.getElementById('placementTip').disabled = true;
    document.getElementById('workingTime').disabled = true;
    document.getElementById('numberOfDayOff').disabled = true;
    document.getElementById('numberOfAnnualLeave').disabled = true;
    document.getElementById('placementHealth').disabled = true;
    document.getElementById('placementMeal').disabled = true;
    document.getElementById('placementTransport').disabled = true;
    document.getElementById('placementBonus').disabled = true;
    document.getElementById('placementPublicHoliday').disabled = true;
    document.getElementById('placementAccidentInsurance').disabled = true;
    document.getElementById('placementAccomodation').disabled = true;
    document.getElementById('placementOvertime').disabled = true;
    document.getElementById('placementThirteenSalary').disabled = true;
    document.getElementById('placementAnnualLeave').disabled = true;
}

function ClearPlacements() {
    $('#placementDate').val('');
    $('#companyName').val('');
    $('#companyContactName').val('');
    $('#companyContactPhone').val('');
    $('#companyEmail').val('');
    $('#companyAddress').val('');
    $('#placementSalary').val('0');
    $('#placementTip').val('0');
    $('#workingTime').val('');
    $('#numberOfDayOff').val('');
    $('#numberOfAnnualLeave').val('');
}

