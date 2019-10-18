const selectRelationTpl =
    "<div class='md-form select-wrapper mdb-select my-0 mr-2 ml-lg-auto'>" +
    "<i class='fas fa-user-friends prefix'></i>" +
    "<label class='mdb-main-label'>Relationship</label>" +
    "<span class='caret'>▼</span>" +
    "<input class='select-dropdown form-control' type='text' readonly='true' required='false' value=''>" +
    "<ul class='dropdown-content w-100' style='display: none;'>" +
    "<li><span>Father</span></li>" +
    "<li><span>Mother</span></li>" +
    "<li><span>Son</span></li>" +
    "<li><span>Daughter</span></li>" +
    "<li><span>Brother</span></li>" +
    "<li><span>Sister</span></li>" +
    "<li><span>Uncle</span></li>" +
    "<li><span>Aunt</span></li>" +
    "<li><span>Niece</span></li>" +
    "<li><span>Nephew</span></li>" +
    "<li><span>Cousin</span></li>" +
    "</ul>" +
    "</div>";

const loaderTpl =
    "<div class='d-flex justify-content-center'>" +
    "<div class='spinner-grow my-5' role='status'></div>" +
    "</div>";

function isRelationshipSelected(o) {
    let i = o.parents(".card").find('input');
    let r = i.val();
    if (!r) {
        reportError(i, "Please select a relationship");
    } else {
        return true;
    }
}