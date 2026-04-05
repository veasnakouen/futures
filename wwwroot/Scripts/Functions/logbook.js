$(document).ready(function () {
    GetLogbook();
    $('#LookbookModal').on('show.bs.modal', function () {
        ControlLogbook(true);
        ClearLogbook();
        document.getElementById('btnLogBookAction').innerText = "Add New";
    });
   
});

var LogbookTables = [];

function GetLogbook() {

    LogbookTables = $('#LogbookTable').DataTable({
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        ajax: {
            url: "/api/LogBooks",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: "gender"
            },
            {
                data: "phone"
            },
            {
                data: "note"
            },
          {
              data: "jobinformation",
              render: function (data) {
                  var jobinformation = data;
                  if (jobinformation == true) {
                      return "<span style='color:#18bc9c;'> Need <i class='fa fa-check'></i></span>";
                  } else {
                      return "<span style='color:red;'>No Need <i class='fa fa-xmark'></i></span>";
                  };

              }
          },
           {
               data: "library",
               render: function (data) {
                   var jobinformation = data;
                   if (jobinformation == true) {
                       return "<span style='color:#18bc9c;'> Need <i class='fa fa-check'></i></span>";
                   } else {
                       return "<span style='color:red;'>No Need <i class='fa fa-xmark'></i></span>";
                   };

               }
           },
            {
                data: "usingComputer",
                render: function (data) {
                    var jobinformation = data;
                    if (jobinformation == true) {
                        return "<span style='color:#18bc9c;'> Need <i class='fa fa-check'></i></span>";
                    } else {
                        return "<span style='color:red;'>No Need <i class='fa fa-xmark'></i></span>";
                    };

                }
            },
              {
                  data: "futureService",
                  render: function (data) {
                      var jobinformation = data;
                      if (jobinformation == true) {
                          return "<span style='color:#18bc9c;'> Need <i class='fa fa-check'></i></span>";
                      } else {
                          return "<span style='color:red;'>No Need <i class='fa fa-xmark'></i></span>";
                      };

                  }
              },
                {
                    data: "shortTraining",
                    render: function (data) {
                        var jobinformation = data;
                        if (jobinformation == true) {
                            return "<span style='color:#18bc9c;'> Need <i class='fa fa-check'></i></span>";
                        } else {
                            return "<span style='color:red;'>No Need <i class='fa fa-xmark'></i></span>";
                        };
                       
                    }
                },
            {
                data: "user"
            },
            {
                data: "enrollDate",
                render: function (data) {
                    return moment(data, "YYYYMMDD hh:mm:ss tt").fromNow();
                }
            },
            {
                data: "id",
                render: function (data) {
                    return "<a href='#' onclick='LogbookEdit(" + data + ");'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='#' onclick='LogbookDelete(" + data + ")'><i class='fa fa-pen-to-square'></i> Delete</a>";
                }
            }
        ],
        responsive: true,
        destroy: true,
        "order": [[0, "desc"]]
    });

}

function LogBookAction() {
    var action = '';
    action = document.getElementById('btnLogBookAction').innerText;
    if (action === "Save changes") {
        if ($('#gender').val().trim() === "") {
            $('#gender').css('border-color', 'red');
            $('#gender').focus();
        }


        var JobInformationLogCheck = false;
        if ($('#JobInformationLog').prop('checked') === true) {
            JobInformationLogCheck = true;
        }

        var LibraryLog = false;
        if ($('#LibraryLog').prop('checked') === true) {
            LibraryLog = true;
        }

        var ComputerLog = false;
        if ($('#ComputerLog').prop('checked') === true) {
            ComputerLog = true;
        }

        var FutureServicesLog = false;
        if ($('#FutureServicesLog').prop('checked') === true) {
            FutureServicesLog = true;
        }

        var InterviewTechic = false;
        if ($('#InterviewTechic').prop('checked') === true) {
            InterviewTechic = true;
        }

        var ShortTraining = false;
        if ($('#ShortTraining').prop('checked') === true) {
            ShortTraining = true;
        }
                var data = {
                    Gender: $('#gender').val(),
                    Phone: $('#LogbookPhone').val(),
                    Note: $('#LogbookNote').val(),
                    Jobinformation: JobInformationLogCheck,
                    Library: LibraryLog,
                    UsingComputer: ComputerLog,
                    FutureService: FutureServicesLog,
                    InterviewTechic: InterviewTechic,
                    ShortTraining: ShortTraining
                };

                $.ajax({
                    url: "/api/LogBooks",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success("Log book has been saved to database.", "Server Response");
                        LogbookTables.ajax.reload();
                        ControlLogbook(true);
                        document.getElementById('btnLogBookAction').innerText = "Add New";
                        ClearLogbook();
                        $('#LookbookModal').modal('hide');
                    },
                    error: function (errormessage) {
                        toastr.error("This Log book cannot saved!", "Server Response");
                        ControlLogbook(false);
                        document.getElementById('btnLogBookAction').innerText = "Save changes";
                        ClearLogbook();
                    }
                });
    }
    else if (action === "Add New") {
        ControlLogbook(false);
        document.getElementById('btnLogBookAction').innerText = "Save changes";
        ClearLogbook();
        $('#gender').focus();
    }
    else if (action === "Update") {
        if ($('#gender').val().trim() === "") {
            $('#gender').css('border-color', 'red');
            $('#gender').focus();
        }


        var JobInformationLogCheck = false;
        if ($('#JobInformationLog').prop('checked') === true) {
            JobInformationLogCheck = true;
        }

        var LibraryLog = false;
        if ($('#LibraryLog').prop('checked') === true) {
            LibraryLog = true;
        }

        var ComputerLog = false;
        if ($('#ComputerLog').prop('checked') === true) {
            ComputerLog = true;
        }

        var FutureServicesLog = false;
        if ($('#FutureServicesLog').prop('checked') === true) {
            FutureServicesLog = true;
        }

        var InterviewTechic = false;
        if ($('#InterviewTechic').prop('checked') === true) {
            InterviewTechic = true;
        }

        var ShortTraining = false;
        if ($('#ShortTraining').prop('checked') === true) {
            ShortTraining = true;
        }
        var data = {
            Id: $('#LogbookId').val(),
            Gender: $('#gender').val(),
            Phone: $('#LogbookPhone').val(),
            Note: $('#LogbookNote').val(),
            Jobinformation: JobInformationLogCheck,
            Library: LibraryLog,
            UsingComputer: ComputerLog,
            FutureService: FutureServicesLog,
            InterviewTechic: InterviewTechic,
            ShortTraining: ShortTraining
        };

        $.ajax({
            url: "/api/LogBooks",
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Log book has been updated to database.", "Server Response");
                LogbookTables.ajax.reload();
                ControlLogbook(true);
                document.getElementById('btnLogBookAction').innerText = "Add New";
                ClearLogbook();
                $('#LookbookModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This Log book cannot update!", "Server Response");
                ControlLogbook(false);
                document.getElementById('btnLogBookAction').innerText = "Update";
                ClearLogbook();
            }
        });
    }
}

function LogbookEdit(id) {

    $('#gender').css('border-color', '#cccccc');

    $.ajax({
        url: "/api/LogBooks/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            
            $('#LookbookModal').modal('show');

            $('#LogbookId').val(result.id);

            $('#gender').val(result.gender);

            $('#LogbookPhone').val(result.phone);

            $('#LogbookNote').val(result.note);

            if (result.jobinformation == true) {
                $('#JobInformationLog').prop('checked', true);
            }
            else {
                $('#JobInformationLog').prop('checked', false);
            }
            if (result.library == true) {
                $('#LibraryLog').prop('checked', true);
            }
            else {
                $('#LibraryLog').prop('checked', false);
            }
            if (result.usingComputer == true) {
                $('#ComputerLog').prop('checked', true);
            }
            else {
                $('#ComputerLog').prop('checked', false);
            }
            if (result.futureService == true) {
                $('#FutureServicesLog').prop('checked', true);
            }
            else {
                $('#FutureServicesLog').prop('checked', false);
            }
            if (result.interviewTechic == true) {
                $('#InterviewTechic').prop('checked', true);
            }
            else {
                $('#InterviewTechic').prop('checked', false);
            }
            if (result.shortTraining == true) {
                $('#ShortTraining').prop('checked', true);
            }
            else {
                $('#ShortTraining').prop('checked', false);
            }
            document.getElementById('btnLogBookAction').innerText = "Update";
            ControlLogbook(false);
            $('#gender').focus();
        },
        error: function (errormessage) {
            toastr.error("Something unexpected happen.", "Server Response");
        }
    });
    return false;
}

function LogbookDelete(id) {
    bootbox.confirm("Are you sure you want to delete this?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/LogBooks/" + id,
                method: "DELETE",
                success: function () {
                    LogbookTables.ajax.reload();
                    toastr.success("Deleted successfully.", "Server Response");
                },
                error: function () {
                    toastr.error("This log book cannot be deleted.", "Server Response");
                }
            });
        }
    });
}

function ClearLogbook() {
    document.getElementById("gender").selectedIndex = "0";
    $('#LogbookPhone').val('');
    $('#LogbookNote').val('');
    document.getElementById("JobInformationLog").checked = false;
    document.getElementById("LibraryLog").checked = false;
    document.getElementById("ComputerLog").checked = false;
    document.getElementById("FutureServicesLog").checked = false;
    document.getElementById("InterviewTechic").checked = false;
    document.getElementById("ShortTraining").checked = false;
}

function ControlLogbook(bool) {
    document.getElementById('gender').disabled = bool;
    document.getElementById('LogbookPhone').disabled = bool;
    document.getElementById('LogbookNote').disabled = bool;
    document.getElementById('JobInformationLog').disabled = bool;
    document.getElementById('LibraryLog').disabled = bool;
    document.getElementById('ComputerLog').disabled = bool;
    document.getElementById('FutureServicesLog').disabled = bool;
    document.getElementById('ShortTraining').disabled = bool;
}