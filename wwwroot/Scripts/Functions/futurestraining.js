$(document).ready(function () {
    $('#FuturestrainingModal').on('show.bs.modal', function () {
        document.getElementById('btnFuturestrainingAction').innerText = "Add New";
        ControlFuturestraining(true);
        ClearFuturestraining();
        /*Add code more*/
    });
});

function GetSubjectOption(SelectedValue) {
    var data = {};
    $.ajax({
        url: "/api/subjects",
        data: JSON.stringify(data),
        type: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (rusult) {
            $("#subjectId-Name").empty();
            $("#subjectId-Name").prepend("<option value=''>Please select subject</option>");
            for (var i = 0; i < rusult.length; i++) {
                $("#subjectId-Name").append('<option value="' + rusult[i].id + '">' + rusult[i].subjectName + '</option>');
            }
            $("select option[value='" + SelectedValue + "']").attr('selected', 'selected');
            $.ajax(data);
        },
        error: function (errormessage) {
            toastr.error("Something goes wrong!!", "Server Response");
        },
    });
}

function ClearFuturestraining() { 
    $('#futurestrainingNote').val('');
}

function ControlFuturestraining(bool) {
    document.getElementById('openDateFuturesTraining').disabled = bool;
    document.getElementById('closeDateFuturesTraining').disabled = bool;
    document.getElementById('futurestrainingStatus').disabled = bool;
    document.getElementById('futurestrainingNote').disabled = bool;
    document.getElementById('subjectId-Name').disabled = bool;
}

    var tableFuturesTraining = [];

    function GetFuturesTrainingsByClientId(id) {
        tableFuturesTraining = $('#futures').DataTable({
            ajax: {
                url: "/api/futurestrainings?clientId=" + id,
                dataSrc: ""
            },

            columns: [
                {
                    data: "id"
                },
                {
                    data: function (data) {
                        return data.subject.subjectName;
                    
                    }
                },
                {
                    data: "openDate",
                    render: function (data) {
                        var date = new Date(data);
                        var month = date.getMonth() + 1;
                        return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                    }
                },
                {
                    data: "closeDate",
                    render: function (data) {
                        var date = new Date(data);
                        var month = date.getMonth() + 1;
                        return date.getFullYear() == '1970' ? '' : (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear();
                    }
                },
                {
                    data: "note"
                },
                {
                    data: "id",
                    render: function (data) {

                        return "<a href='#' onclick='FuturesTrainingEdit(" + data + ");'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + " | " + "<a href='#' onclick='FuturesTrainingsDelete(" + data + ")'><span class='glyphicon glyphicon-edit'></span> Delete</a>";
                    
                    }
                }
            ],
        
            destroy: true,
            "order": [[0, "desc"]]
        });
    }

    function FuturesTrainingEdit(id) {   
        $('#openDateFuturesTraining').css('border-color', '#cccccc');
        $('#closeDateFuturesTraining').val();
        $('#futurestrainingStatus').val();
        $('#futurestrainingNote').val();

        $.ajax({
            url: "/api/FuturesTrainings/" + id,
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                $('#FuturestrainingModal').modal('show');
                $('#futuresTrainingId').val(result.id);
                $('#subjectId').val(result.subjectId);
                GetSubjectOption(result.subjectId);
                $('#openDateFuturesTraining').val(result.openDate);
                $('#closeDateFuturesTraining').val(result.closeDate);
                $('#futurestrainingStatus').val(result.status);
                $('#futurestrainingNote').val(result.note);
            
                var openDate = new Date(result.openDate);
                var dd = openDate.getDate();
                var mm = openDate.getMonth() + 1; //January is 0!
                var yyyy = openDate.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                openDate = mm + '/' + dd + '/' + yyyy;
                $('#openDateFuturesTraining').val(openDate);

                var closeDate = new Date(result.closeDate);
                var dd = closeDate.getDate();
                var mm = closeDate.getMonth() + 1; //January is 0!
                var yyyy = closeDate.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                closeDate = mm + '/' + dd + '/' + yyyy;
                $('#closeDateFuturesTraining').val(closeDate);
                document.getElementById('btnFuturestrainingAction').innerText = "Update";
                ControlFuturestraining(false);
            },
            error: function (errormessage) {
                toastr.error("Something unexpected happen.", "Server Response");
            }
  
        });
        return false;
    }

    function FuturestrainingAction() {
        var action = '';
        action = document.getElementById('btnFuturestrainingAction').innerText;
        if (action === "Save changes") {
            if ($('#openDateFuturesTraining').val().trim() === "") {
                $('#openDateFuturesTraining').css('border-color', 'red');
                $('#openDateFuturesTraining').focus();
            }
            else {
                $('#openDateFuturesTraining').css('border-color', '#cccccc');

                    var data = {
                        ClientId: $('#id').val(),
                        SubjectId: $('#subjectId-Name').val(),
                        OpenDate: $('#openDateFuturesTraining').val(),
                        CloseDate: $('#closeDateFuturesTraining').val(),
                        Status: $('#futurestrainingStatus').val(),
                        Note: $('#futurestrainingNote').val()
                    };

                    $.ajax({
                        url: "/api/FuturesTrainings",
                        data: JSON.stringify(data),
                        type: "POST",
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            toastr.success("New FuturesTraining has been saved to database.", "Server Response");
                            tableFuturesTraining.ajax.reload();
                            document.getElementById('btnFuturestrainingAction').innerText = "Add New";
                            $('#FuturestrainingModal').modal('hide');
                        },
                        error: function (errormessage) {
                            toastr.error("This FuturesTraining is already exists.", "Server Response");

                            document.getElementById('btnFuturestrainingAction').innerText = "Add New";

                        }
                    });
            }
        }
        else if (action === "Add New") {
            GetSubjectOption("");
            ClearFuturestraining();
            document.getElementById('btnFuturestrainingAction').innerText = "Save changes";
            ControlFuturestraining(false);
        }
        else if (action === "Update") {
            $('#subjectId-Name').css('border-color', '#cccccc');
            $('#openDateFuturesTraining').css('border-color', '#cccccc');
            $('#closeDateFuturesTraining').val();
            $('#futurestrainingStatus').val();
            $('#futurestrainingNote').val();

            var data = {
                Id: $('#futuresTrainingId').val(),
                ClientId: $('#id').val(),
                SubjectId: $('#subjectId-Name').val(),
                OpenDate: $('#openDateFuturesTraining').val(),
                CloseDate: $('#closeDateFuturesTraining').val(),
                Status: $('#futurestrainingStatus').val(),
                Note: $('#futurestrainingNote').val()
            };
            $.ajax({
                url: "/api/FuturesTrainings/" + data.Id,
                data: JSON.stringify(data),
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    toastr.success("FuturesTraining has been updated.", "Server Response");
                    tableFuturesTraining.ajax.reload();
                    document.getElementById('btnFuturestrainingAction').innerText = "Add New";  
                    $('#FuturestrainingModal').modal('hide');
                },
                error: function (errormessage) {
                    toastr.error("This FuturesTraining is already exists.", "Server Response");

                    document.getElementById('btnFuturestrainingAction').innerText = "Add New";

                }
            });
        }
    }
       
    function FuturesTrainingsDelete(id) {
        bootbox.confirm("Are you sure you want to delete this FuturesTraining?", function (result) {
            if (result) {
                $.ajax({
                    url: "/api/FuturesTrainings/" + id,
                    method: "DELETE",
                    success: function () {
                        tableFuturesTraining.ajax.reload();
                        toastr.success("Deleted successfully.", "Server Response");
                    },
                    error: function () {
                        toastr.error("This FuturesTrainings is being used.", "Server Response");
                    }
                });
            }
        });
    }






