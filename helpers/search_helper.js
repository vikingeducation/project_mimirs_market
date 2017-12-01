var SearchHelper = {};

// https://stackoverflow.com/questions/26066768/how-to-set-the-selected-item-in-a-radio-button-group-in-handlebars-template
SearchHelper.setChecked = function (value, currentValue) {
    if ( value == currentValue ) {
       return "checked"
    } else {
       return "";
    }
 };

// https://stackoverflow.com/questions/13046401/how-to-set-selected-select-option-in-handlebars-template
 SearchHelper.setSelect = function( selected, options ) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
};

module.exports = SearchHelper;
