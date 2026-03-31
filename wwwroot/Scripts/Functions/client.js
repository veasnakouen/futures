var table = [];

// GET Client From Api

function GetClients() {

    table = $('#clients').DataTable({
        rowReorder: {
            selector: 'td:nth-child(2)'
        },

        ajax: {
            url: "/api/clients",
            dataSrc: ""
        },
        columns: [
            {
                data: "id"
            },
            {
                data: function (data) {
                    return data.clientCode + "" + data.id;
                }
            },
            {
                data: function (data) {
                    return data.lastName + " " + data.firstName;
                }
            },
            {
                data: "gender"
            },
            {
                data: "dateOfBirth",
                render: function (data) {
                    var currentDate = new Date();
                    var year = new Date(data);
                    var age = currentDate.getFullYear() - year.getFullYear();
                    return Number(age) + ' years old';
                }
            },
            {
                data: "contactPhone"
            },
            {
                data: "province"
            },
            {
                //data: { RegisterDate: "registerDate", enrollDate: "enrollDate" },
                data: { RegisterDate: "registerDate", enrollDate: "enrollDate", RegisterDateNd: "RegisterDateNd", RegisterDateRd: "RegisterDateRd" },
                render: function (data) {
                    var date = new Date(data.registerDate);
                    var month = date.getMonth() + 1;
                    return (month.length > 1 ? month : month) + "-" + date.getDate() + "-" + date.getFullYear() + " ( " + moment(data.enrollDate, "YYYYMMDD hh:mm:ss tt").fromNow() + ' )';
                }
            },
            {
                data: "id",
                render: function (data) {
                    return "  <button type='button'  onclick='GenerateCV(" + data + ");' class='btn-xs btn-success'>  <span class='glyphicon glyphicon-list-alt'></span> CV​ </button>" + " | " + "<button type='button' class='btn-xs btn-warning'  onclick='Edit(" + data + ");'><span class='glyphicon glyphicon-edit'></span> Edit​ </button>" + " | " + "<button type='button' class='btn-xs btn-danger'  onclick='Delete(" + data + ")'><span class='glyphicon glyphicon-trash'></span> Delete​ </button>";
                }
            }
        ],
        responsive: true,
        destroy: true,
        "order": [[0, "desc"]]
    });

}

function GenerateCV(Id) {
    var dialog = bootbox.dialog({
        title: 'Image Idition',
        message: "<p>Note: Please image to show image when </p>",
        size: 'large',
        buttons: {

            AddMoreImage: {
                label: "CV with Image",
                className: 'btn-warning',
                callback: function () {
                    var url = "/clients/curriculum-vitae-by-cliend-Id-Report/cvtype=Image/clientId=" + Id + "/Applyfor=no";
                    window.open(window.location.assign = url);
                }
            },
            ViewImage: {
                label: "CV without image",
                className: 'btn-info',
                callback: function () {
                    var url = "/clients/curriculum-vitae-by-cliend-Id-Report/cvtype=NoImage/clientId=" + Id + "/Applyfor=no";
                    window.open(window.location.assign = url);
                }
            },

            AddMoreImageAndApplyfor: {
                label: "Image And Apply for",
                className: 'btn-success',
                callback: function () {
                    var url = "/clients/curriculum-vitae-by-cliend-Id-Report/cvtype=Image/clientId=" + Id + "/Applyfor=yes";
                    window.open(window.location.assign = url);
                }
            },
            NoImageAndApplyfor: {
                label: "No Image And Apply for",
                className: 'btn-primary',
                callback: function () {
                    var url = "/clients/curriculum-vitae-by-cliend-Id-Report/cvtype=NoImage/clientId=" + Id + "/Applyfor=yes";
                    window.open(window.location.assign = url);
                }
            },

            //cancel: {
            //    label: "Cancel",
            //    className: 'btn-danger',
            //    callback: function () {
            //        //console.log('Custom cancel clicked');
            //    }
            //}
        }
    });
}

// Create New Client

function Save() {

    var res = validate();

    if (res == false) {
        return false;
    }

    ShowLoadingScreen();

    var data = new FormData();

    var files = $("#file").get(0).files;

    if (files.length > 0) {
        data.append("UploadedFile", files[0]);
    }

    var fileIdCard = $("#fileIdCard").get(0).files;

    if (fileIdCard.length > 0) {
        data.append("UploadedFileIdCard", fileIdCard[0]);
    }

    data.append("ClientCode", $("#clientCode").val());
    data.append("FirstName", $("#firstName").val());
    data.append("LastName", $("#lastName").val());
    data.append("Gender", $("#gender").val());
    data.append("DateOfBirth", $("#dateOfBirth").val());
    data.append("ContactPhone", $("#contactPhone").val());
    data.append("RelativePhone", $("#relativePhone").val());
    data.append("MaritalStatus", $("#maritalStatus").val());
    data.append("Email", $("#email").val());
    data.append("Address", $("#address").val());
    data.append("Province", $("#province").val());
    data.append("CurrentSituation", $("#currentSituation").val());
    data.append("HearBy", $("#hearBy").val());
    data.append("ExpectedSupport", $("#expextedsupport").val());
    data.append("RegisterDate", $("#registerdateClient").val());

    //Edit
    if ($("#registerdateClientnd").val() === "")
    {
        $("#registerdateClientnd").val('01/01/1970');
    }
    data.append("RegisterDateNd", $("#registerdateClientnd").val());

    if ($("#registerdateClientrd").val() === "") {
        $("#registerdateClientrd").val('01/01/1970');
    }
    data.append("RegisterDateRd", $("#registerdateClientrd").val());


    //data.append("RegisterDateNd", $('').val());
    //data.append("RegisterDateNd", $('').val());
    //if ($("#registerdateClientnd").val() === "") {
    //    $("#registerdateClientnd").val('01/01/1970');
    //}

    //Edit

   
    data.append("PlaceOfBirth", $("#clientplaceOfBirth").val());
    data.append("Nationality", $("#clientNationality").val());
    data.append("Citizenship", $("#clientCitizenship").val());
    data.append("Height", $("#clientHeights").val());
    data.append("Weight", $("#clientWeights").val());

    if ($('#furtherEducation').is(':checked')) {
        data.append("FurtherEducation", true);
    } else {
        data.append("FurtherEducation", false);
    };

    if ($('#placement').is(':checked')) {
        data.append("Placement", true);
    } else {
        data.append("Placement", false);
    };

    if ($('#futuresTraining').is(':checked')) {
        data.append("TrainingFromFutures", true);
    } else {
        data.append("TrainingFromFutures", false);
    };

    if ($('#socialSupport').is(':checked')) {
        data.append("SocialSupportRequired", true);
    } else {
        data.append("SocialSupportRequired", false);
    };

    data.append("SocialSupportProblem", $('input[name=HaveProblemCase]:checked').val());
    data.append("IdpoorStatus", $('input[name=clientidpoorStatus]:checked').val());
    if ($("#ClientIdpoorvalidDate").val() === "") {
        $("#ClientIdpoorvalidDate").val('01/01/1970');
    }

    data.append("IdpoorValiddate", $("#ClientIdpoorvalidDate").val());
    data.append("IdpoorLevel", $("#clientIdpoorlevel").val());
    data.append("IdpoorAccountNumber", $("#ClientIdpooraccountnumber").val());

    var ajaxRequest = $.ajax({
        type: "POST",
        url: "/api/clients",
        contentType: false,
        processData: false,
        data: data,
        async: false,
        success: function (result) {
            toastr.success("Client has been added to database.");
            table.ajax.reload();
            RemoveLoadingScreen();
            $('#id').val(result.id);
            $('#clientModal').modal('hide');
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#firstName').focus();
                toastr.error("This client is already exists in database.");
            }

        }
    });
}

// Edit Client

function Edit(id) {

    clearForm();
    document.getElementById('NohaveProblemCase').disabled = false;
    document.getElementById('HaveProblemCase').disabled = false;

    $.ajax({
        url: "/api/clients/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {

            $('#id').val(result.id);
            $('#clientCode').val(result.clientCode);
            $('#firstName').val(result.firstName);
            $('#lastName').val(result.lastName);
            $('#gender').val(result.gender);
            $('#clientplaceOfBirth').val(result.placeOfBirth);
            $('#clientNationality').val(result.nationality);
            $('#clientCitizenship').val(result.citizenship);
            $("#clientHeights").val(result.height);
            $("#clientWeights").val(result.weight);

            var dateOfBirth = new Date(result.dateOfBirth);
            var dd = dateOfBirth.getDate();
            var mm = dateOfBirth.getMonth() + 1; //January is 0!
            var yyyy = dateOfBirth.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            dateOfBirth = mm + '/' + dd + '/' + yyyy;
            $('#dateOfBirth').val(dateOfBirth);

            var registerDate = new Date(result.registerDate);
            var dd = registerDate.getDate();
            var mm = registerDate.getMonth() + 1; //January is 0!
            var yyyy = registerDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            registerDate = mm + '/' + dd + '/' + yyyy;
            $('#registerdateClient').val(registerDate);



            //************************************************* */
            //Edit
            var registerDateNd = new Date(result.registerDateNd);
            var dd = registerDateNd.getDate();
            var mm = registerDateNd.getMonth() + 1; //January is 0!
            var yyyy = registerDateNd.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            registerDateNd = mm + '/' + dd + '/' + yyyy;
            if (registerDateNd === '01/01/1970') {
                registerDateNd = '';
            }
            $('#registerdateClientnd').val(registerDateNd);

            var registerDateRd = new Date(result.registerDateRd);
            var dd = registerDateRd.getDate();
            var mm = registerDateRd.getMonth() + 1; //January is 0!
            var yyyy = registerDateRd.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            registerDateRd = mm + '/' + dd + '/' + yyyy;
            if (registerDateRd === '01/01/1970') {
                registerDateRd = '';
            }
            $('#registerdateClientrd').val(registerDateRd);

            //Edit

            $('#contactPhone').val(result.contactPhone);
            $('#relativePhone').val(result.relativePhone);
            $('#maritalStatus').val(result.maritalStatus);
            $('#email').val(result.email);
            $('#address').val(result.address);
            $('#province').val(result.province);
            $('#currentSituation').val(result.currentSituation);
            $('#hearBy').val(result.hearBy);
            $('#expextedsupport').val(result.expectedSupport);


            if (result.furtherEducation == true) {
                $('#furtherEducation').prop('checked', true);
                $('#furtherEducationTab').show();
            }
            else {
                $('#furtherEducation').prop('checked', false);
                $('#furtherEducationTab').hide();
            }

            if (result.placement == true) {
                $('#placement').prop('checked', true);
                $('#placementTab').show();
                $('#jobSpecificationTab').show();
                $('#beneficiaryTab').show();
            }
            else {
                $('#placement').prop('checked', false);
                $('#placementTab').hide();
                $('#jobSpecificationTab').hide();
                $('#beneficiaryTab').hide();
            }

            if (result.trainingFromFutures == true) {
                $('#futuresTraining').prop('checked', true);
                $('#futuresTrainingTab').show();
            }
            else {
                $('#futuresTraining').prop('checked', false);
                $('#futuresTrainingTab').hide();
            }

            if (result.socialSupportRequired == true) {
                $('#socialSupport').prop('checked', true);
                $('#socialSupportTab').show();
            }
            else {
                $('#socialSupport').prop('checked', false);
                $('#socialSupportTab').hide();
            }

            if (result.socialSupportProblem == "HaveProblem") {
                $("#HaveProblemCase").prop("checked", true);
            }
            else {
                $("#NohaveProblemCase").prop("checked", true);
            }

            if (result.idpoorStatus == "Expired") {
                $("#ClientidpoorStatusExpired").prop("checked", true);
            }
            else if (result.idpoorStatus == "IsValid") {
                $("#ClientidpoorStatusIsValid").prop("checked", true);
            }
            else {
                $("#ClientidpoorStatusNohave").prop("checked", true);
            }

            $('#clientIdpoorlevel').val(result.idpoorLevel);
            $('#ClientIdpooraccountnumber').val(result.idpoorAccountNumber);

            var clientIdpoorvalidDate = new Date(result.idpoorValiddate);
            var dd = clientIdpoorvalidDate.getDate();
            var mm = clientIdpoorvalidDate.getMonth() + 1; //January is 0!

            var yyyy = clientIdpoorvalidDate.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            clientIdpoorvalidDate = mm + '/' + dd + '/' + yyyy;
            if (clientIdpoorvalidDate === '01/01/1970') {
                clientIdpoorvalidDate = ''
            }
            $('#ClientIdpoorvalidDate').val(clientIdpoorvalidDate);

            var currentDate = new Date();
            var year = new Date($('#dateOfBirth').val());
            var age = currentDate.getFullYear() - year.getFullYear();
            var value = Number(age) + ' years old';
            $('#age').val(value);

            if (result.photo == "") {
                $('#photo').attr('src', '../Images/blank_profile.png');
            }
            else {
                $('#photo').attr('src', '../Images/' + result.photo)
            }

            if (result.IdCard == "") {
                $('#fileIdCard').attr('src', '../Images/' + result.IdCard)
            }

            document.getElementById("titleClient").innerHTML = " Assessed Date: " + moment(result.enrollDate).format('MMM/DD/YYYY');

            $('#clientModal').modal('show');
            $('#btnUpdate').show();
            $('#btnSave').hide();
        },
        statusCode: {
            400: function () {
                RemoveLoadingScreen();
                $('#firstName').focus();
                toastr.error("This client is already exists in database.");
            }

        }
    });
    return false;

}

// Update Client

function Update() {

    var res = validate();

    if (res === false) {
        return false;
    }

    ShowLoadingScreen();

    var data = new FormData();
    var files = $("#file").get(0).files;

    if (files.length > 0) {
        data.append("UploadedFile", files[0]);
    }

    var fileIdCard = $("#fileIdCard").get(0).files;

    if (fileIdCard.length > 0) {
        data.append("UploadedFileIdCard", fileIdCard[0]);
    }

    data.append("Id", $("#id").val());
    data.append("ClientCode", $("#clientCode").val());
    data.append("FirstName", $("#firstName").val());
    data.append("LastName", $("#lastName").val());
    data.append("Gender", $("#gender").val());
    data.append("DateOfBirth", $("#dateOfBirth").val());
    data.append("ContactPhone", $("#contactPhone").val());
    data.append("RelativePhone", $("#relativePhone").val());
    data.append("MaritalStatus", $("#maritalStatus").val());
    data.append("Email", $("#email").val());
    data.append("Address", $("#address").val());
    data.append("Province", $("#province").val());
    data.append("CurrentSituation", $("#currentSituation").val());
    data.append("HearBy", $("#hearBy").val());
    data.append("ExpectedSupport", $("#expextedsupport").val());


    data.append("RegisterDate", $("#registerdateClient").val());
    if ($("#registerdateClientnd").val() === "") {
        $("#registerdateClientnd").val('01/01/1970');
    }
    data.append("RegisterDateNd", $("#registerdateClientnd").val());

    if ($("#registerdateClientrd").val() === "") {
        $("#registerdateClientrd").val('01/01/1970');
    }
    data.append("RegisterDateRd", $("#registerdateClientrd").val());

    data.append("PlaceOfBirth", $("#clientplaceOfBirth").val());
    data.append("Nationality", $("#clientNationality").val());
    data.append("Citizenship", $("#clientCitizenship").val());
    data.append("Height", $("#clientHeights").val());
    data.append("Weight", $("#clientWeights").val());

    if ($('#furtherEducation').is(':checked')) {
        data.append("FurtherEducation", true);
    } else {
        data.append("FurtherEducation", false);
    };

    if ($('#placement').is(':checked')) {
        data.append("Placement", true);
    } else {
        data.append("Placement", false);
    };

    if ($('#futuresTraining').is(':checked')) {
        data.append("TrainingFromFutures", true);
    } else {
        data.append("TrainingFromFutures", false);
    };

    if ($('#socialSupport').is(':checked')) {
        data.append("SocialSupportRequired", true);
    } else {
        data.append("SocialSupportRequired", false);
    };

    data.append("SocialSupportProblem", $('input[name=HaveProblemCase]:checked').val());
    data.append("IdpoorStatus", $('input[name=clientidpoorStatus]:checked').val());

    if ($("#ClientIdpoorvalidDate").val() === "") {
        $("#ClientIdpoorvalidDate").val('01/01/1970');
    }
    data.append("IdpoorValiddate", $("#ClientIdpoorvalidDate").val());

    data.append("IdpoorLevel", $("#clientIdpoorlevel").val());
    data.append("IdpoorAccountNumber", $("#ClientIdpooraccountnumber").val());

    var ajaxRequest = $.ajax({
        type: "PUT",
        url: "/api/clients/" + $("#id").val(),
        contentType: false,
        processData: false,
        data: data,
        async: false,
        success: function (result) {
            toastr.success("Clients has been updated.");
            table.ajax.reload();
            $('#clientModal').modal('hide');
            RemoveLoadingScreen();
        },
        error: function (errormessage) {
            RemoveLoadingScreen();
            toastr.error("Something unexpected happen.");
        }
    });

}

// Delete Client

function Delete(id) {

    bootbox.confirm("Are you sure you want to delete this client?", function (result) {
        if (result) {
            $.ajax({
                url: "/api/clients/" + id,
                method: "DELETE",
                success: function () {
                    table.ajax.reload();
                    toastr.success("Client has been deleted successfully.");
                },
                error: function () {
                    toastr.error("Cannot delete this client.");
                }
            })
        }
    });

}
// Clear Input Form

function clearForm() {

    $('#id').val('');
    $('#clientCode').val('');
    $('#firstName').val('');
    $('#lastName').val('');
    $('#dateOfBirth').val('');
    $('#age').val('');
    $('#contactPhone').val('');
    $('#relativePhone').val('');
    $('#email').val('');
    $('#address').val('');
    $('#expextedsupport').val('');
    $('#registerdateClient').val('');
    $('#registerdateClientnd').val('');
    $('#registerdateClientrd').val('');
    $('#clientplaceOfBirth').val('');
    $('#clientNationality').val('');
    $('#clientCitizenship').val('');
    $('#clientHeights').val('');
    $('#clientWeights').val('');
    $('#file').val('');
    $('#fileIdCard').val('');
    $("#NohaveProblemCase").prop("checked", true);
    $("#ClientidpoorStatusNohave").prop("checked", true);
    $('#photo').attr('src', '../Images/blank_profile.png');
    $('#furtherEducation').prop('checked', false);
    $('#placement').prop('checked', false);
    $('#futuresTraining').prop('checked', false);
    $('#socialSupport').prop('checked', false);
    $('#btnUpdate').hide();
    $('#btnSave').show();
    $('#firstName').css('border-color', '#cccccc');
    $('#lastName').css('border-color', '#cccccc');
    $('#firstName').focus();
    $('#furtherEducationTab').hide();
    $('#placementTab').hide();
    $('#futuresTrainingTab').hide();
    $('#socialSupportTab').hide();
    $('#jobSpecificationTab').hide();
    $('#beneficiaryTab').hide();
    document.getElementById("titleClient").innerHTML = ""
}

// Validate

function validate() {

    var isValid = true;
    if ($('#clientCode').val().trim() == "") {
        $('#clientCode').css('border-color', 'red');
        $('#clientCode').focus();
        isValid = false;
    } else {
        $('#clientCode').css('border-color', '#cccccc');
        if ($('#firstName').val().trim() == "") {
            $('#firstName').css('border-color', 'red');
            $('#firstName').focus();
            isValid = false;
        } else {
            $('#firstName').css('border-color', '#cccccc');
            if ($('#lastName').val().trim() == "") {
                $('#lastName').css('border-color', 'red');
                $('#lastName').focus();
                isValid = false;
            } else {
                $('#lastName').css('border-color', '#cccccc');
                if ($('#dateOfBirth').val().trim() == "") {
                    $('#dateOfBirth').css('border-color', 'red');
                    $('#dateOfBirth').focus();
                    isValid = false;
                } else {
                    $('#dateOfBirth').css('border-color', '#cccccc');
                    if ($('#expextedsupport').val().trim() == "") {
                        $('#expextedsupport').css('border-color', 'red');
                        $('#expextedsupport').focus();
                        isValid = false;
                    } else {
                        $('#expextedsupport').css('border-color', '#cccccc');
                        if ($('#registerdateClient').val().trim() == "") {
                            $('#registerdateClient').css('border-color', 'red');
                            $('#registerdateClient').focus();
                            isValid = false;
                        }
                        else {
                            $('#registerdateClient').css('border-color', '#cccccc');
                        }

                        ////registerdateClientnd

                        //if ($('#registerdateClientnd').val().trim() == "") {
                        //    $('#registerdateClientnd').css('border-color', 'red');
                        //    $('#registerdateClientnd').focus();
                        //    isValid = false;
                        //}
                        //else {
                        //    $('#registerdateClientnd').css('border-color', '#cccccc');
                        //}

                        ////registerdateCleentrd

                        //if ($('#registerdateClientrd').val().trim() == "") {
                        //    $('#registerdateClientrd').css('border-color', 'red');
                        //    $('#registerdateClientrd').focus();
                        //    isValid = false;
                        //}
                        //else {
                        //    $('#registerdateClientrd').css('border-color', '#cccccc');
                        //}

                    }

                }
            }
        }
    }
    return isValid;

}

// SET: Photo

function readURL(input) {
    if (input.files[0] && input.files[0].size <= 12699202) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#photo').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    } else {
        toastr.error("Please upload image smaller then 12 Mb ");
    }
}

// SET:IdCard Photo

function readURLIdCard(input) {
    if (input.files[0] && input.files[0].size <= 12699202) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#fileIdCard').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    } else {
        toastr.error("Please upload image smaller then 12 Mb ");
    }
}

// Date Picker

$(function () {
    $(".js-date").datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1950:2100'
    });
});