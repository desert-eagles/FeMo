const loaderTpl =
    "<div class='d-flex justify-content-center mx-auto'>" +
    "<div class='spinner-grow my-5' role='status'></div>" +
    "</div>";

/**********************************************************************************************************************/
// select relation template

const selectRelationTpl =
    "<div class='md-form my-0 mr-2 ml-lg-auto' data-select-relation=''>" +
    "<i class='fas fa-user-friends prefix'></i>" +
    "<select class='mdb-select md-form my-0' searchable='Search here..'>" +
    "<option value='' disabled selected>Choose relationship</option>" +
    "<option value='Father'>Father</option>" +
    "<option value='Mother'>Mother</option>" +
    "<option value='Son'>Son</option>" +
    "<option value='Daughter'>Daughter</option>" +
    "<option value='Brother'>Brother</option>" +
    "<option value='Sister'>Sister</option>" +
    "<option value='Uncle'>Uncle</option>" +
    "<option value='Aunt'>Aunt</option>" +
    "<option value='Niece'>Niece</option>" +
    "<option value='Nephew'>Nephew</option>" +
    "<option value='Cousin'>Cousin</option>" +
    "</select>" +
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
