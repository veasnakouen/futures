$(document).ready(function () {
    GetVacanciesByCategory("all", "", "");
});

function FilterByCategory(job) {
    GetVacanciesByCategory(job, "", "");
    document.getElementById("jobCategoryTitle").innerHTML = " for " + job;
}

function FilterByEmployer(employerName) {
    GetVacanciesByEmployer(employerName);
    document.getElementById("jobCategoryTitle").innerHTML = " for " + employerName;
}

function FilterBySalary() {
    var start = parseInt($('#start').val());
    var end = parseInt($('#end').val());
    if (start > end)
    {
        toastr.error("End value cannot be bigger than Start value.", "Salary Range Response");
    }
    else
    {
        GetVacanciesByCategory("", start, end);
    }
}

function ShowAllJobs() {
    GetVacanciesByCategory("all", "", "");
    document.getElementById("jobCategoryTitle").innerHTML = "";
}

function Detail(id) {
    $.ajax({
        url: "/api/vacancies/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result.positionAvailable <= 1) {
                var position = " (" + result.positionAvailable + " position)";
            }
            else {
                var position = " (" + result.positionAvailable + " positions)";
            }
            document.getElementById("positionDisplay").innerHTML = result.jobPositions.name + position;
            document.getElementById("dateDisplay").innerHTML = "Posted: " + moment(result.postingDate, "YYYYMMDD").fromNow() + "  |  Closing Date: " + moment.utc(result.deadline).format("DD-MMMM-YYYY");
            document.getElementById("locationDisplay").innerHTML = result.location;
            document.getElementById("scheduleDisplay").innerHTML = result.schedule;
            document.getElementById("salaryDisplay").innerHTML = "$" + result.salary;
            document.getElementById("responsibilitiesDisplay").innerHTML = (result.responsibilities == "") ? "N/A" : result.responsibilities;
            document.getElementById("requirementDisplay").innerHTML = (result.requirement == "") ? "N/A" : result.requirement;
            document.getElementById("applicationInformationDisplay").innerHTML = (result.applicationInformation == "") ? "N/A" : result.applicationInformation;
            document.getElementById("contractDisplay").innerHTML = result.contractType;
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.");
        }
    });
    return false;
}

var table = [];

function GetVacanciesByCategory(jobCategory, start, end) {
    ShowLoadingScreen();
    table = $('#jobList').DataTable({
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        ajax: {
            url: (jobCategory == "all") ? "/api/vacancies?employerId=all" : (jobCategory == "") ? "/api/vacancies/bysalary?start=" + start + "&end=" + end : "/api/vacancies/bycategory?job=" + jobCategory,
            dataSrc: ""
        },
        columns: [
            {
                data: "id",
                render: function (data) {
                    return data;
                }
            },
            {
                data: "jobPositions.name"
            },
            {
                data: "postingDate",
                render: function (data) {
                    return moment(data, "YYYYMMDD").fromNow();
                }
            },
            {
                data: "deadline",
                render: function (data) {
                    return moment.utc(data).format("DD-MMM-YYYY");
                }
            },
            {
                data: "positionAvailable",
                render: function (data) {
                    return data + "p";
                }
            },
            {
                data: "contractType"
            },
            {
                data: { salary: "salary", salarymax: "salarymax" },
                render: function (data) {
                    //return  (data.salary == "") ? "N/A" : "$" + data.salary +  (data.salaryMax == "") ? "N/A" : "$" + data.salaryMax ;
                    return "$" + data.salary + "- $" + data.salarymax;
                }
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' data-bs-toggle='modal' data-bs-target='#jobDetail' onclick='Detail(" + data + ");' class='btn btn-primary btn-sm'><i class='fa fa-eye'></i> Detail</a>";
                }
            }
        ],
        responsive: true,
        destroy: true,
        "order": [[0, "desc"]]
    });
    RemoveLoadingScreen();
}

function GetVacanciesByEmployer(employerName) {
    ShowLoadingScreen();
    table = $('#jobList').DataTable({
        ajax: {
            url: "/api/vacancies/byemployer?employerName=" + employerName,
            dataSrc: ""
        },
        columns: [
            {
                data: "id",
                render: function (data) {
                    return data;
                }
            },
            {
                data: "jobPositions.name"
            },
            {
                data: "postingDate",
                render: function (data) {
                    return moment(data, "YYYYMMDD").fromNow();
                }
            },
            {
                data: "deadline",
                render: function (data) {
                    return moment.utc(data).format("DD-MMM-YYYY");
                }
            },
            {
                data: "positionAvailable",
                render: function (data) {
                    return data + "p";
                }
            },
            {
                data: "contractType"
            },
            {
                data: "salary",
                render: function (data) {
                    return (data == "") ? "N/A" : "$" + data;
                }
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' data-bs-toggle='modal' data-bs-target='#jobDetail' onclick='Detail(" + data + ");' class='btn btn-primary btn-sm'><i class='fa fa-eye'></i> Detail</a>";
                }
            }
        ],
        destroy: true,
        "order": [[0, "desc"]]
    });
    RemoveLoadingScreen();
}