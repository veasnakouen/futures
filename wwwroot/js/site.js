// Bootstrap 5 nested modal stacking fix.
// nth-of-type CSS selectors are unreliable for modals; use JS instead.
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1055 + (10 * ($('.modal.show').length + 1));
    $(this).css('z-index', zIndex);
    setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').last()
            .css('z-index', zIndex - 1)
            .addClass('modal-stack');
    }, 0);
});
$(document).on('hidden.bs.modal', '.modal', function () {
    $(this).css('z-index', '');
    // Bootstrap 5 removes modal-open when any modal hides; restore it if another is still open
    if ($('.modal.show').length > 0) {
        $('body').addClass('modal-open');
    }
    // NOTE: do NOT remove .modal-stack from surviving backdrops.
    // Bootstrap already removes the closing modal's backdrop from the DOM.
    // Removing .modal-stack from the parent modal's backdrop would cause
    // the layout's show.bs.modal handler to overwrite its z-index on the
    // next child modal open, leaving the parent backdrop above the parent
    // modal and blocking all clicks.
});

// Global DataTables defaults for wide tables in modals/panels.
if ($.fn && $.fn.dataTable) {
    $.extend(true, $.fn.dataTable.defaults, {
        scrollX: true,
        autoWidth: false
    });
}

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
