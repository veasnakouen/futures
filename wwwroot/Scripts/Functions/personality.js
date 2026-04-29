
function SavePersonality() {

    var data = {
        ClientId: parseInt($('#id').val()),
        Strength: $('#strength').val(),
        Weakness: $('#weakness').val()
    };

    $.ajax({
        url: "/api/personalities/" + data.ClientId,
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            toastr.success("Personality has been updated.", "Server Response");
        }
    });
}

// Clear Form Further Education
function clearPersonality() {
    $('#strength').val('');
    $('#weakness').val('');
}

// Get Further Education
function GetPersonalitiesByClientId(id) {

    clearPersonality();

    $.ajax({
        url: "/api/personalities?clientId=" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result[0] != null) {
                $('#strength').val(result[0].strength);
                $('#weakness').val(result[0].weakness);
            }
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}