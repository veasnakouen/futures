
var tableReferralSource = [];

function GetReferralSources() {
    tableReferralSource = $('#referralSourceTable').DataTable({
        ajax: {
            url: "/api/referralsources",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "referralSource"
            },
            {
                data: "status"
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='ReferralSourceEdit(" + data + ")'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='ReferralSourceDelete(" + data + ")'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
}

function ReferralSourceAction() {
    var action = '';
    action = document.getElementById('btnReferralAction').innerText;
    if (action === "Save changes") {
        if ($('#referralSourceName').val().trim() === "") {
            $('#referralSourceName').css('border-color', 'red');
            $('#referralSourceName').focus();
        }
        else {
            $('#referralSourceName').css('border-color', '#cccccc');

            if ($('#origin').val().trim() === "") {
                $('#origin').css('border-color', 'red');
                $('#origin').focus();
            }
            else {
                $('#origin').css('border-color', '#cccccc');

                var data = {
                    ReferralSource: $('#referralSourceName').val(),
                    Status: $('#origin').val()
                };
                $.ajax({
                    url: "/api/referralsources",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Referral source has been saved to database.", "Server Response");
                        tableReferralSource.ajax.reload();
                        document.getElementById('referralSourceName').disabled = true;
                        document.getElementById('origin').disabled = true;
                        document.getElementById('btnReferralAction').innerText = "Add New";
                        $('#referralSourceName').val('');
                    },
                    error: function (errormessage) {
                        toastr.error("This referral source is already exists.", "Server Response");
                        document.getElementById('referralSourceName').disabled = true;
                        document.getElementById('origin').disabled = true;
                        document.getElementById('btnReferralAction').innerText = "Add New";
                        $('#referralSourceName').val('');
                    }
                });
            }
        }
    }
    else if (action === "Add New") {
        document.getElementById('referralSourceName').disabled = false;
        document.getElementById('origin').disabled = false;
        document.getElementById('btnReferralAction').innerText = "Save changes";
        $('#referralSourceName').val('');
        $('#referralSourceName').focus();
    }
    else if (action === "Update") {
        $('#referralSourceName').css('border-color', '#cccccc');

        var data = {
            Id: parseInt($('#referralSourceId').val()),
            ReferralSource: $('#referralSourceName').val(),
            Status: $('#origin').val()
        };
        $.ajax({
            url: "/api/referralsources/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Referral source has been updated.", "Server Response");
                tableReferralSource.ajax.reload();
                document.getElementById('referralSourceName').disabled = true;
                document.getElementById('origin').disabled = true;
                document.getElementById('btnReferralAction').innerText = "Add New";
                $('#referralSourceName').val('');
            },
            error: function (errormessage) {
                toastr.error("This referral source is already exists.", "Server Response");
                document.getElementById('referralSourceName').disabled = true;
                document.getElementById('origin').disabled = true;
                document.getElementById('btnReferralAction').innerText = "Add New";
                $('#referralSourceName').val('');
            }
        });
    }
}

function ReferralSourceEdit(id) {

    $('#referralSourceName').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/referralsources/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#referralSourceId').val(result.id);
            $('#referralSourceName').val(result.referralSource);
            $('#orgin').val(result.status);
            document.getElementById('btnReferralAction').innerText = "Update";
            document.getElementById('referralSourceName').disabled = false;
            document.getElementById('origin').disabled = false;
            $('#referralSourceName').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function ReferralSourceDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/referralsources/" + id,
                method: "DELETE",
                success: function () {
                    tableReferralSource.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This referral source is being used.", "Server Response");
                }
            });
        }
    });
}