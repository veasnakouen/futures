// Create Further Education
function SaveFurtherEducation() {

    var data = new FormData();

    data.append("ClientId", $("#id").val());

    if ($('#university').is(':checked')) {
        data.append("University", true);
    } else {
        data.append("University", false);
    }

    if ($('#publicSchool').is(':checked')) {
        data.append("PublicSchool", true);
    } else {
        data.append("PublicSchool", false);
    }

    if ($('#vocationalTraining').is(':checked')) {
        data.append("VocationalTraining", true);
    } else {
        data.append("VocationalTraining", false);
    }

    if ($('#computerSchool').is(':checked')) {
        data.append("ComputerSchool", true);
    } else {
        data.append("ComputerSchool", false);
    }

    if ($('#englishSchool').is(':checked')) {
        data.append("EnglishSchool", true);
    } else {
        data.append("EnglishSchool", false);
    }

    if ($('#chineseSchool').is(':checked')) {
        data.append("ChineseSchool", true);
    } else {
        data.append("ChineseSchool", false);
    }

    data.append("AvailableTime", $("#availableTime").val());

    $.ajax({
        type: "PUT",
        url: "/api/furthereducations/" + $("#id").val(),
        contentType: false,
        processData: false,
        data: data,
        success: function (result) {
            toastr.success("Education information saved successfully.");
            table.ajax.reload();
            RemoveLoadingScreen();
        },
        error: function (errormessage) {
            RemoveLoadingScreen();
            toastr.error("Something unexpected happen.");
        }
    });
}

// Clear Form Further Education
function clearFurtherEducation() {
    $('#university').prop('checked', false);
    $('#publicSchool').prop('checked', false);
    $('#vocationalTraining').prop('checked', false);
    $('#computerSchool').prop('checked', false);
    $('#englishSchool').prop('checked', false);
    $('#chineseSchool').prop('checked', false);
    $('#availableTime').val('');
}

// Get Further Education
function GetFurtherEducationByClientId(id) {

    clearFurtherEducation();

    $.ajax({
        url: "/api/furthereducations?clientId=" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result[0] != null) {
                $('#availableTime').val(result[0].availableTime);
                if (result[0].university == true) {
                    $('#university').prop('checked', true);
                }
                else {
                    $('#university').prop('checked', false);
                }
                if (result[0].publicSchool == true) {
                    $('#publicSchool').prop('checked', true);
                }
                else {
                    $('#publicSchool').prop('checked', false);
                }
                if (result[0].vocationalTraining == true) {
                    $('#vocationalTraining').prop('checked', true);
                }
                else {
                    $('#vocationalTraining').prop('checked', false);
                }
                if (result[0].computerSchool == true) {
                    $('#computerSchool').prop('checked', true);
                }
                else {
                    $('#computerSchool').prop('checked', false);
                }
                if (result[0].englishSchool == true) {
                    $('#englishSchool').prop('checked', true);
                }
                else {
                    $('#englishSchool').prop('checked', false);
                }
                if (result[0].chineseSchool == true) {
                    $('#chineseSchool').prop('checked', true);
                }
                else {
                    $('#chineseSchool').prop('checked', false);
                }
            }
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}