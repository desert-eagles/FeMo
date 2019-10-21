const selectMembersTpl =
    "<select class='mdb-select md-form flex-fill' multiple='' searchable='Search here..'>" +
    "<option value='' disabled='disabled' selected='selected'>Select family members</option>" +
    "{{#connections}}" +
    "<option value='{{user_id}}' data-icon='{{user_pic_url}}' class='rounded-circle'>{{user_name}}</option>" +
    "{{/connections}}" +
    "</select>" +
    "<button class='btn-save btn btn-primary btn-sm' type='button'>Confirm</button>";
