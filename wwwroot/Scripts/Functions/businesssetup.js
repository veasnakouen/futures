$(document).ready(function () {
    $('#businessSetUpModal').on('show.bs.modal', function () {
        document.getElementById('btnBusinessSetup').innerText = "Add New";
        FormBuninessSetup(true);
        resetBuninessSetup();
    });
});


function GetCategory(SelectedValue) {
    var data = {};
    $.ajax({
        url: "/api/businesscategories",
        data: JSON.stringify(data),
        type: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (rusult) {
            $("#business-setupcateogryId").empty();
            $("#business-setupcateogryId").prepend("<option value=''>Select Category</option>");
            for (var i = 0; i < rusult.length; i++) {                   
                $("#business-setupcateogryId").append('<option value="' + rusult[i].id + '">' + rusult[i].busCategoryName + '</option>');      
            }
            $("select option[value='" + SelectedValue + "']").attr('selected', 'selected');;
            $.ajax(data);
        },
        error: function (errormessage) {
            toastr.error("Something goes wrong!!", "Server Response");
        }
    });
}

// Reset Form
function resetBuninessSetup() {
    document.getElementById("business-setupcateogryId").selectedIndex = "0";
    $('#businessType').val('');
    $('#income').val('');
    $('#expense').val('');
    $('#startbusinessdate').val('');
    document.getElementById("CountTime").selectedIndex = "0";
    document.getElementById("placeby").selectedIndex = "0";
}

// control Form
function FormBuninessSetup(bool) {
    document.getElementById('CountTime').disabled = bool;
    document.getElementById('startbusinessdate').disabled = bool;
    document.getElementById('business-setupcateogryId').disabled = bool;   
    document.getElementById('businessType').disabled = bool;
    document.getElementById('income').disabled = bool;
    document.getElementById('expense').disabled = bool;
    document.getElementById('placeby').disabled = bool;
}

function Validation(){
    var isvalid = true;
    if ($('#CountTime').val().trim() === "") {
        $('#CountTime').css('border-color', 'red');
        $('#CountTime').focus();
        isvalid = false;
    }
    else {
        $('#CountTime').css('border-color', '#cccccc');
        if ($('#business-setupcateogryId').val().trim() === "") {
            $('#business-setupcateogryId').css('border-color', 'red');
            $('#business-setupcateogryId').focus();
        }
        else {
            $('#business-setupcateogryId').css('border-color', '#cccccc');
            if ($('#businessType').val().trim() === "") {
                $('#businessType').css('border-color', 'red');
                $('#businessType').focus();
                isvalid = false;
            }
            else {
                $('#businessType').css('border-color', '#cccccc');
                if ($('#income').val().trim() === "") {
                    $('#income').css('border-color', 'red');
                    $('#income').focus();
                    isvalid = false;
                }
                else {
                    $('#income').css('border-color', '#cccccc');
                    if ($('#expense').val().trim() === "") {
                        $('#expense').css('border-color', 'red');
                        $('#expense').focus();
                        isvalid = false;
                    }
                    else {
                        $('#expense').css('border-color', '#cccccc');
                        if ($('#placeby').val().trim() === "") {
                            $('#placeby').css('border-color', 'red');
                            $('#placeby').focus();
                            isvalid = false;
                        }
                        else {
                            $('#placeby').css('border-color', '#cccccc'); 
                        }
                    }
                }
            }
        }     
    }
    return isvalid
}
    

var tableBusinessSetUps = [];

function RefreshBusinessSetupsByClient() {
    var clientId = $('#id').val();
    if (clientId && $('#tableBusinessSetup').length) {
        GetBusinessSetUpByClientId(clientId);
    }
}

function GetBusinessSetUpByClientId(id) {
    tableBusinessSetUps = $('#tableBusinessSetup').DataTable({
        ajax: {
            url: "/api/BusinessSetups?clientId=" + id,
            dataSrc: ""
        },
        columns: [
           {
               data: "id"
           },
           {
               data: function (data) {
                   return data.businessSetUpCategory.busCategoryName;
               }
           },
           {
               data: "businessType"
           },
           {
               data: "income"
           },
           {
               data: "expense"
           },
           {
               data: "jobPlaceBy"
           },
            {
                data: "id",
                render: function (data) {
                    return "<a href='javascript:void(0);' onclick='BusinessSetupEdit(" + data + "); return false;'><i class='fa fa-pen-to-square'></i> Edit</a>" + " | " + "<a href='javascript:void(0);' onclick='BusinessSetupDelete(" + data + "); return false;'><i class='fa fa-trash'></i> Delete</a>";
                },
                "width": "130px"
            }
        ],
        
        destroy: true,
        "order": [[0, "desc"]]
    });
}

function BusinessSetupAction() {
    var action = '';
    action = document.getElementById('btnBusinessSetup').innerText;
    if (action === "Save") {
        

        var ResM = Validation();
        if (ResM === false) {
            return false;
        }

        var data = {
            clientId: parseInt($('#id').val()),
            StartBusinessSetUpDate: $('#startbusinessdate').val(),
            businessSetUpCategoryId: parseInt($('#business-setupcateogryId').val()),
            businessType: $('#businessType').val(),
            income: $('#income').val(),
            expense: $('#expense').val(),
            jobPlaceBy: $('#placeby').val(),
            countTime:  $('#CountTime').val()
        };
 
        $.ajax({
            url: "/api/BusinessSetups",
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Business set up has been saved to database.", "Server Response");
                RefreshBusinessSetupsByClient();
                document.getElementById('business-setupcateogryId').disabled = true;
                document.getElementById('btnBusinessSetup').innerText = "Add New";
                resetBuninessSetup();
                FormBuninessSetup(true);
            },
            error: function (errormessage) {
                toastr.error("This business set up is already exists.", "Server Response");
                document.getElementById('btnBusinessSetup').innerText = "Save";
                $('#business-setupcateogryId').val('');
            }
        });
    }
    else if (action === "Add New") {
        resetBuninessSetup();
        FormBuninessSetup(false);
        GetCategory("");
        document.getElementById("business-setupcateogryId").selectedIndex = "-1";
        document.getElementById('btnBusinessSetup').innerText = "Save";
        $('#business-setupcateogryId').focus();
    }
    else if (action === "Update") {
        Validation();
        var data = {
            Id: parseInt($('#bussuinessSetUpId').val()),
            StartBusinessSetUpDate: $('#startbusinessdate').val(),
            clientId: parseInt($('#id').val()),
            businessSetUpCategoryId: parseInt($('#business-setupcateogryId').val()),
            businessType: $('#businessType').val(),
            income: $('#income').val(),
            expense: $('#expense').val(),
            jobPlaceBy: $('#placeby').val(),
            countTime:  $('#CountTime').val()
        };
        console.log(data);
        $.ajax({
            url: "/api/BusinessSetups/" + data.Id,
            data: JSON.stringify(data),
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success("Business set up has been updated.", "Server Response");
                RefreshBusinessSetupsByClient();
                document.getElementById('business-setupcateogryId').disabled = true;
                document.getElementById('btnBusinessSetup').innerText = "Add New";
                resetBuninessSetup();
                $('#businessSetUpModal').modal('hide');
            },
            error: function (errormessage) {
                toastr.error("This business setup is already exists.", "Server Response");
                document.getElementById('btnBusinessSetup').innerText = "Add New";
                //$('#jobPositionName').val('');
                $("div#divLoadingModal").removeClass('show');
            }
        });
    }
}

function BusinessSetupEdit(id) {

        $('#business-setupcateogryId').css('border-color', '#cccccc');
        $('#businessSetUpModal').modal('show');
        
        $.ajax({
            url: "/api/BusinessSetups/" + id,
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                $('#bussuinessSetUpId').val(result.id);
                $('#id').val(result.clientId);
                var Startbusinessdate = new Date(result.startBusinessSetUpDate);
                var dd = Startbusinessdate.getDate();
                var mm = Startbusinessdate.getMonth() + 1; //January is 0!
                var yyyy = Startbusinessdate.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                Startbusinessdate = mm + '/' + dd + '/' + yyyy;
                $('#startbusinessdate').val(Startbusinessdate);
                GetCategory(result.businessSetUpCategory.id);
                $('#businessType').val(result.businessType);
                $('#income').val(result.income);
                $('#expense').val(result.expense);
                $('#placeby').val(result.jobPlaceBy);
                $('#CountTime').val(result.countTime);
                document.getElementById('btnBusinessSetup').innerText = "Update";
                $('#business-setupcateogryId').focus();
                FormBuninessSetup(false);
            },
            error: function (errormessage) {
                toastr.error("Something unexpected happen.", "Server Response");
            }
        });
        return false;
    }


function BusinessSetupDelete(id) {
        bootbox.confirm("Are you sure you want to delete this?", function (result) {
            if (result) {
                $.ajax({
                    url: "/api/BusinessSetups/" + id,
                    method: "DELETE",
                    success: function () {
                        RefreshBusinessSetupsByClient();
                        toastr.success("Deleted successfully.", "Server Response");
                    },
                    error: function () {
                        toastr.error("This business set up is being used.", "Server Response");
                    }
              });
          }
    });
}
