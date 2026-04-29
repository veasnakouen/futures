$(document).ready(function () {
    // Initialize cascading dropdowns for Job Category and Job Position
    initializeJobCascadingDropdowns();
});

// Initialize cascading dropdowns
function initializeJobCascadingDropdowns() {
    // Row 1
    $('#jobCategoryId1').change(function () {
        filterJobPositionsByCategory($(this).val(), '#jobPositionId1');
    });

    // Row 2
    $('#jobCategoryId2').change(function () {
        filterJobPositionsByCategory($(this).val(), '#jobPositionId2');
    });

    // Row 3
    $('#jobCategoryId3').change(function () {
        filterJobPositionsByCategory($(this).val(), '#jobPositionId3');
    });
}

// Filter Job Positions based on selected Job Category
function filterJobPositionsByCategory(jobCategoryId, jobPositionSelectId) {
    var $jobPositionSelect = $(jobPositionSelectId);
    
    // Clear existing options
    $jobPositionSelect.empty();
    $jobPositionSelect.append('<option value="0">--Click to choose--</option>');

    if (!jobCategoryId || jobCategoryId === '' || jobCategoryId === '0') {
        return;
    }

    // Fetch job positions filtered by category
    $.ajax({
        url: '/api/jobpositions?jobCategoryId=' + jobCategoryId,
        type: 'GET',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        success: function (result) {
            if (result && result.length > 0) {
                $.each(result, function (index, jobPosition) {
                    $jobPositionSelect.append('<option value="' + jobPosition.id + '">' + jobPosition.name + '</option>');
                });
            } else {
                $jobPositionSelect.append('<option value="0">--No positions available--</option>');
            }
        },
        error: function (xhr) {
            console.error('Error loading job positions:', xhr);
            toastr.error("Failed to load job positions.", "Error");
        }
    });
}

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
                
                // Set Job Categories first
                $('#jobCategoryId1').val(result[0].jobCategoryIdOne);
                $('#jobCategoryId2').val(result[0].jobCategoryIdTwo);
                $('#jobCategoryId3').val(result[0].jobCategoryIdThree);
                
                // Then load filtered Job Positions for each category
                if (result[0].jobCategoryIdOne) {
                    filterJobPositionsByCategory(result[0].jobCategoryIdOne, '#jobPositionId1').done(function() {
                        $('#jobPositionId1').val(result[0].jobPositionIdOne);
                    });
                } else {
                    $('#jobPositionId1').val(result[0].jobPositionIdOne);
                }
                
                if (result[0].jobCategoryIdTwo) {
                    filterJobPositionsByCategory(result[0].jobCategoryIdTwo, '#jobPositionId2').done(function() {
                        $('#jobPositionId2').val(result[0].jobPositionIdTwo);
                    });
                } else {
                    $('#jobPositionId2').val(result[0].jobPositionIdTwo);
                }
                
                if (result[0].jobCategoryIdThree) {
                    filterJobPositionsByCategory(result[0].jobCategoryIdThree, '#jobPositionId3').done(function() {
                        $('#jobPositionId3').val(result[0].jobPositionIdThree);
                    });
                } else {
                    $('#jobPositionId3').val(result[0].jobPositionIdThree);
                }
                
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