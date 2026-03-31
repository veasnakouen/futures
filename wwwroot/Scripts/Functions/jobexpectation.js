// Clear Form Further Education
function resetJobExpectation() {
    $('#permanent').prop('checked', false);
    $('#temporary').prop('checked', false);
    $('#seasonal').prop('checked', false);
    $('#jobExpectationAvailableTime').val('');
    $('#salaryExpectation').val('');
    $('#jobExpectationNote').val('');
    $('#jobExpectationCandidate').val('( Futures Candidate )');
    $('#jobExpectationHobby').val('');
    $('#jobExpectationStatus').val('Active');
}

// Get Further Education
function GetJobExpectationByClientId(id) {
    resetJobExpectation();
    $.ajax({
        url: "/api/jobexpectations?clientId=" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result[0] != null) {
                $('#jobExpectationId').val(result[0].Id);
                $('#jobExpectationAvailableTime').val(result[0].availableTime);
                $('#salaryExpectation').val(result[0].salaryExpectation);
                $('#jobExpectationNote').val(result[0].note);
                $('#jobPositionId1').val(result[0].jobPositionIdOne);
                $('#jobPositionId2').val(result[0].jobPositionIdTwo);
                $('#jobPositionId3').val(result[0].jobPositionIdThree);
                $('#jobCategoryId1').val(result[0].jobCategoryIdOne);
                $('#jobCategoryId2').val(result[0].jobCategoryIdTwo);
                $('#jobCategoryId3').val(result[0].jobCategoryIdThree);
                $('#employmenttype').val(result[0].employmentType);
                $('#jobExpectationCandidate').val(result[0].candidate);
                $('#jobExpectationHobby').val(result[0].hobby);
                $('#jobExpectationStatus').val(result[0].expectationStatus);

                if (result[0].permanent == true) {
                    $('#permanent').prop('checked', true);
                }
                else {
                    $('#permanent').prop('checked', false);
                }

                if (result[0].temporary == true) {
                    $('#temporary').prop('checked', true);
                }
                else {
                    $('#temporary').prop('checked', false);
                }

                if (result[0].seasonal == true) {
                    $('#seasonal').prop('checked', true);
                }
                else {
                    $('#seasonal').prop('checked', false);
                }
            }
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

// Create Further Education
function SaveJobExpectation() {

    var data = new FormData();

    data.append("ClientId", $("#id").val());

    if ($('#permanent').is(':checked')) {
        data.append("Permanent", true);
    } else {
        data.append("Permanent", false);
    }

    if ($('#temporary').is(':checked')) {
        data.append("Temporary", true);
    } else {
        data.append("Temporary", false);
    }

    if ($('#seasonal').is(':checked')) {
        data.append("Seasonal", true);
    } else {
        data.append("Seasonal", false);
    }



    data.append("AvailableTime", $("#jobExpectationAvailableTime").val());
    data.append("SalaryExpectation", $("#salaryExpectation").val());
    data.append("Note", $("#jobExpectationNote").val());
    data.append("JobCategoryIdOne", $("#jobCategoryId1").val());
    data.append("JobCategoryIdTwo", $("#jobCategoryId2").val());
    data.append("JobCategoryIdThree", $("#jobCategoryId3").val());
    data.append("JobPositionIdOne", $("#jobPositionId1").val());
    data.append("JobPositionIdTwo", $("#jobPositionId2").val());
    data.append("JobPositionIdThree", $("#jobPositionId3").val());
    data.append("EmploymentType", $("#employmenttype").val());
    data.append("Candidate", $("#jobExpectationCandidate").val());
    data.append("Hobby", $("#jobExpectationHobby").val());
    data.append("ExpectationStatus", $("#jobExpectationStatus").val());
    data.append("BusinessSetUpCategoryId", $("#jobExpectationBusinessTypeCategory").val());
    if ($('#jobExpectationSelfEmployment').is(':checked')) {
        data.append("SelfEmployment", "Yes");
    } else {
        data.append("SelfEmployment", "No");
    }
    data.append("BusinessType", $("#jobExpectationBusinessType").val());

    $.ajax({
        type: "PUT",
        url: "/api/jobexpectations/" + $("#id").val(),
        contentType: false,
        processData: false,
        data: data,
        success: function (result) {
            toastr.success("Job expectation saved successfully.");
            table.ajax.reload();
            RemoveLoadingScreen();
        },
        error: function (errormessage) {
            RemoveLoadingScreen();
            toastr.error("Something unexpected happen.");
        }
    });
}