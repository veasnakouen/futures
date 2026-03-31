// Create SocialCare
function SaveSocialCare() {

    var data = new FormData();
    data.append("ClientId", $("#id").val());

    if ($('#socialsupportNeeded').is(':checked')) {
        data.append("SocialsupportNeeded", true);
    } else {
        data.append("SocialsupportNeeded", false);
    }

    if ($('#meetingfuture').is(':checked')) {
        data.append("Meetingfuture", true);
    } else {
        data.append("Meetingfuture", false);
    }

    if ($('#problems').is(':checked')) {
        data.append("problems", true);
    } else {
        data.append("problems", false);
    }

    $.ajax({
        type: "PUT",
        url: "/api/socialcare/" + $("#id").val(),
        contentType: false,
        processData: false,
        data: data,
        success: function (result) {
            toastr.success("Social Care information saved successfully.");
            table.ajax.reload();
            RemoveLoadingScreen();
        },
        error: function (errormessage) {
            RemoveLoadingScreen();
            toastr.error("Something unexpected happen.");
        }
    });
}

// Clear Form SocialCare
function clearSocialCare() {
    $('#socialsupportNeeded').prop('checked', false);
    $('#meetingfuture').prop('checked', false);
    $('#problems').prop('checked', false);
}

// Get SocialCare
function GetSocialCareByClientId(id) {

    clearSocialCare();

    $.ajax({
        url: "/api/socialcare?clientId=" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result[0] != null) {
                if (result[0].socialSupportNeeded == true) {
                    $('#socialsupportNeeded').prop('checked', true);
                }
                else {
                    $('#socialsupportNeeded').prop('checked', false);
                }
                if (result[0].meetingFuture == true) {
                    $('#meetingfuture').prop('checked', true);
                }
                else {
                    $('#meetingfuture').prop('checked', false);
                }
                if (result[0].problem == true) {
                    $('#problems').prop('checked', true);
                }
                else {
                    $('#problems').prop('checked', false);
                }
            }
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}