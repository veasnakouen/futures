// Site utility functions
function GetCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return mm + '/' + dd + '/' + yyyy;
}

function ShowLoadingScreen() {
    $("div#divLoadingModal").addClass('show');
}

function RemoveLoadingScreen() {
    $("div#divLoadingModal").removeClass('show');
}

// Set CSRF token for AJAX requests
$(function () {
    var token = $("input[name='__RequestVerificationToken']").val();
    if (token) {
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": token
            }
        });
    }
});
