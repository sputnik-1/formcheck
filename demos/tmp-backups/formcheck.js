// formcheck.js

// Copyright Keith Roberts ~ keith@karsites.net
// See BSD-LICENSE file for full details

// start of form-control validation routines

var DEBUG_FORM = false;

// counters for all different form controls
var allTextControls = null;
var stringClassControls = null;
var emailClassControls = null;
var dateClassControls = null;
var phoneClassControls = null;
var intClassControls = null;
var realClassControls = null;

var allPasswordControls = null;

var allRadioControls = null;
var checkedRadioControls = '';

var allCheckboxControls = null;
var checkedCheckboxControls = '';

var allTextAreaControls = null;

var allSingleSelectControls = null;
var allMultiSelectControls = null;

var allButtonControls = null;
var allResetControls = null;

// arrays to hold style values
var borderDefs = new Array();
var fontSizeDefs = new Array();
var backgroundDefs = new Array();

// set the default style of form controls
var borderVal = "solid blue 1px";
var fontSizeVal = "small";
var backgroundVal = "green";

// used to build the POST data string
var alert_post_data = '';
var alert_clean_post_data = '';
var post_data = '';
var clean_post_data = '';
var encoded_post_data = '';

// form checking error flags - need to default to true
var noStringErrors = true;
var noEmailErrors = true;
var noDateErrors = true;
var noPhoneErrors = true;
var noIntErrors = true;
var noRealErrors = true;
var noPasswordErrors = true;
var noTextAreaErrors = true;
var noSingleSelectErrors = true;
var noMultiSelectErrors = true;

var monthArr = new Array("", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");


function resetControlCount()
/**
called at the start of checkForm() to reset form control counters
**/
  {
  allTextControls = null;
  stringClassControls = null;
  emailClassControls = null;
  dateClassControls = null;
  phoneClassControls = null;
  intClassControls = null;
  realClassControls = null;
  allPasswordControls = null;
  allRadioControls = null;
  checkedRadioControls = '';
  allCheckboxControls = null;
  checkedCheckboxControls = '';
  allTextAreaControls = null;
  allSingleSelectControls = null;
  allMultiSelectControls = null;
  allButtonControls = null;
  allResetControls = null;
  }


/****************************************************/
// used to debug the POST string building process

function showAlertPostData()
  {
  alert("alert_post_data string contains:\n" + alert_post_data);
  }


function showAlertCleanPostData()
  {
  alert("alert_clean_post_data string contains:\n" + alert_clean_post_data);
  }


function showEncodedPostData()
  {
  alert("encoded_post_data string contains:\n" + encoded_post_data);
  }

/****************************************************/


function getPostData(form, showControls)
/**
after checkForm() validates all form fields are OK, this function does
another iteration of the form elements, to build the POST data string
of name/value pairs, for the POST send() method.
**/
  {
  alert_post_data = 'method=POST&' +'\n' 
  // + 'DEBUG_POST=' + DEBUG_POST +'&' +'\n';
  post_data = 'method=POST&' 
  // + 'DEBUG_POST=' + DEBUG_POST +'&';

  formLength = form.elements.length;
  for(gpd = 0; gpd < formLength; gpd++)
    {
    elem = form.elements[gpd];

    switch(elem.type)
      {
      case "text": 
      switch(elem.className)
        {
        case "string": processElement(elem); break;
        case "email": processElement(elem); break;
        case "date": processElement(elem); break;
        case "phone": processElement(elem); break;
        case "int": processElement(elem); break;
        case "real": processElement(elem); break;
        }; break;

      case "password": processElement(elem); break;
      case "radio": processRadioCheckbox(elem); break;
      case "checkbox": processRadioCheckbox(elem); break;
      case "textarea": processElement(elem); break;
      case "select-one": processElement(elem); break;
      case "select-multiple": processMultiSelect(elem); break;
      case "hidden": processElement(elem); break;

      // may not be needed as there is no user input to process!
      case "button": processButton(elem); break;
      case "reset": processReset(elem); break;
      }
    } // endfor
  }


function processElement(elem)
/**
add a valid non-empty field name/value pair 
of class 'string' 'email' 'date' 'phone' 'int' or 'real'
(or any other class of input type="text" field you care to define)
to the post data string.  Also works for type="select-one" elements,
and type="hidden" fields.
**/
  {
  if (elem.value != '')
    {
    post_data += elem.name + '=' + elem.value + '&';
    alert_post_data += elem.name + '=' + elem.value + '&' + '\n';
    }
  }


function processRadioCheckbox(elem)
/**
add a checked Checkbox or checked Radio button name/value pair
to the post data string
**/
  {
  if (elem.checked == true)
    {
    post_data += elem.name + '=' + elem.value + '&';
    alert_post_data += elem.name + '=' + elem.value + '&' + '\n';
    }
  }


function processMultiSelect(elem)
/**
add a name/value pair for each selected option
in a type="select-multiple" select object
to the post_data string
**/
  {
  idx = 0;
  optLength = elem.length;
  for(pms = 0; pms < optLength; pms++)
    {
    optElem = elem.options[pms];

    if (optElem.selected == true)
      {
      if (optElem.value != "nothing_selected")
        {
        post_data += elem.name + '[' + idx + ']' + '=' + optElem.value + '&';
        alert_post_data += elem.name + '[' + idx + ']' + '=' + optElem.value + '&' + '\n';
        idx++;
        }
      }  
    }
  }


function tidyPostData()
/**
removes the last '&' sign from post_data string
and encodes the string ready for sending to the server
**/
  {
  end = post_data.length-1;
  a_end = alert_post_data.length-2;
  
  clean_post_data = post_data.substr(0, end);
  alert_clean_post_data = alert_post_data.substr(0, a_end);

  // make post_data URI friendly
  encoded_post_data = encodeURIComponent(clean_post_data);

  // output some debug info
  if (DEBUG_FORM)
    {
    showAlertPostData();
    showAlertCleanPostData();
    showEncodedPostData();
    }
  }


function showError(elem, msg)
/**
hightlights a field with invalid input
**/
  {
  elem.style.border = 'solid white 2px';
  elem.style.fontSize = 'x-large';
  elem.style.background = "red";
  alert(msg);
  elem.focus();
  elem.select();
  }


function showSingleSelectError(elem)
/**
hightlights a select-one control with no selected input
**/
  {
  elem.style.border = 'solid white 2px';
  elem.style.background = "red";
  msg = "Please select an option from the\n"
    + elem.name + " selection list";
  alert(msg);
  elem.focus();
  }


function showMultiSelectError(elem)
/**
hightlights a select-multiple control with no selected input
**/
  {
  elem.style.border = 'solid white 2px';
  elem.style.background = "red";
  msg = "Please select at least one valid option from the\n"
    + elem.name + " selection list"
    + "\n\n To choose a continous range of options,"
    + "\n hold down the Shift key and left click"
    + "\n to highlight the range."
    + "\n\n To choose muliple unconnected options"
    + "\n hold down the Ctrl key"
    + " and left click those options."
    + "";

  alert(msg);
  elem.focus();
  }


function setFormDefs(form)
/* set the initial style values for all form controls */
  {
  formLength = form.elements.length;
  for(sfd = 0; sfd < formLength; sfd++)
    {
    elem = form.elements[sfd];

    borderDefs[sfd] = borderVal;
    elem.style.border = borderDefs[sfd];

    fontSizeDefs[sfd] = fontSizeVal;
    elem.style.fontSize = fontSizeDefs[sfd];

    backgroundDefs[sfd] = backgroundVal;
    elem.style.background = backgroundDefs[sfd];
    }
  }


function restoreElemDefs(elem)
/**
after the user corrects a form input error,
reset the element's style to default values.
**/
  {
  elem.style.border = borderVal;
  elem.style.fontSize = fontSizeVal;
  elem.style.background = backgroundVal;
  }


/****************************************************/
// form element validating functions

function checkString(elem)
/**
checks and validates type="text" class="string" input fields
**/
  {
  noStringErrors = false;
  stringClassControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /[^a-zA-Z0-9\s\_\-\.,:@]/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid input for this field is:"
    + "\n lowercase letters a-z"
    + "\n uppercase letters A-Z"
    + "\n digits 0-9"
    + "\n space character"
    + "\n _ underscore character"
    + "\n - hyphen character"
    + "\n . full stop"
    + "\n , comma"
    + "\n : colon"
    + "\n @ sign"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noStringErrors = true;
    }
  }


function checkEmail(elem)
/**
checks and validates type="text" class="email" input fields
**/
  {
  noEmailErrors = false;
  emailClassControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /^[a-zA-Z0-9]+[a-zA-Z0-9_\-]*(\.[a-zA-Z0-9_\-]+)*@[a-zA-Z0-9_\-]+(\.[a-zA-Z0-9_\-]+)*(\.[a-zA-Z0-9]+)$/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (!regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid input for this field is:"
    + "\n lowercase letters a-z"
    + "\n uppercase letters A-Z"
    + "\n digits 0-9"
    + "\n _ underscore character"
    + "\n - hyphen character"
    + "\n . period (full stop)"
    + "\n @ sign (required)"
    + "\n\n Valid email format is:"
    + "\n name@somehost.somewhere"
    + "\n firstname.lastname@somehost.whatever"
    + "\n Spaces are not allowed anywhere in the email address field!"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noEmailErrors = true;
    }
  }


function checkDate(elem)
/**
checks and validates type="text" class="date" input fields
**/
  {
  noDateErrors = false;
  dateClassControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (!regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid input for this field is:"
    + "\n digits 0-9"
    + "\n - hyphen character"
    + "\n\n Valid date format is:"
    + "\n YYYY-MM-DD"
    + "\n Spaces are not allowed anywhere in the date field!"
    + "");
    }
  else
    {
    res = checkDateRange(elem);
    if (res)
      {
      restoreElemDefs(elem);
      noDateErrors = true;
      }
    }
  }


function checkDateRange(elem)
/**
checks for out of bounds or invalid date ranges.
**/
  {
  // seperate date string into YYYY, MM, DD components
  dateArr = elem.value.split("-");
  year = parseInt(dateArr[0], 10);
  month = parseInt(dateArr[1], 10);
  day = parseInt(dateArr[2], 10);

  if (DEBUG_FORM)
  {
    alert(elem.name + " field contains the following:"
    + "\n Year: " + year
    + "\n Month: " + month
    + "\n Day: " + day
    + "");
  }

  // check month range values
  if (month < 1 || month > 12)
    {
    showError(elem, elem.name + " has invalid month value!"
    + "\n Valid input for this field is:"
    + "\n 01..12"
    + "");
    return false;
    }

  // check day lower range value
  if (day < 1)
    {
    showError(elem, elem.name + " field has invalid day value!");
    return false;
    }

  // check for months with 31 days
  if ((month == 1 && day > 31) || (month ==  3 && day > 31)
      || (month == 5 && day > 31) || (month == 7 && day > 31)
      || (month == 8 && day > 31) || (month == 10 && day > 31)
      || (month == 12 && day > 31))
    {
    showError(elem, "There are only 31 days "
    + "in the month of " + monthArr[month] + "."
    + "\n Please correct the error!");
    return false;
    }

  // check for months with 30 days
  if ((month == 4 && day > 30)
       || (month == 6 && day > 30)
       || (month == 9 && day > 30)
       || (month == 11 && day > 30))
    {
    showError(elem, "There are only 30 days "
    + "in the month of " + monthArr[month] + "."
    + "\n Please correct the error!");
    return false;
    }

  // check for month February + leap years
  if ((year % 4 != 0) && (month == 2) && (day > 29))
    {
    showError(elem, "There are only 29 days in February this year."
    + "\n Please correct the error!");
    return false;
    }
  else if ((year % 4 == 0) && (month == 2) && (day > 28))
    {
    showError(elem, "February " + year + " is a leap year."
    + "\n There are only 28 days in February this year!"
    + "\n Please correct the error!");
    return false;
    }
  return true;
  }


function checkPhone(elem)
/**
checks and validates type="text" class="phone" input fields
**/
  {
  noPhoneErrors = false;
  phoneClassControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /^(\+[0-9]{2})?([\- ]*\( *0 *\))?[0-9\- ]+([0-9]\s*){1}$/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (!regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid input for this field is:"
    + "\n digits 0..9"
    + "\n + sign"
    + "\n () left and right parantheses"
    + "\n - hyphen character"
    + "\n\n Valid phone number formats are:"
    + "\n +44 (0) 123 456 789"
    + "\n +44 123 456 789"
    + "\n 0123 456 789"
    + "\n Spaces are allowed in the phone numbers"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noPhoneErrors = true;
    }
  }


function checkInt(elem)
/**
checks and validates type="text" class="int" numeric input fields
**/
  {
  noIntErrors = false;
  intClassControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /^([0-9])+$/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (!regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid characters are:"
    + "\n digits 0..9"
    + "\n Spaces are not allowed anywhere in the number"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noIntErrors = true;
    }
  }


function checkReal(elem)
/**
checks and validates type="text" class="real" numeric input fields
**/
  {
  noRealErrors = false;
  realClassControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  // regex = /^([\+\-][^$ \.])?([0-9])*(\.)?([0-9])*$/;
  regex = /^([\+\-][^$ \.])?([0-9])*(\.)?([0-9])*$/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (elem.value == ".")
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n\n A decimal point on it's own is not a valid real number."
    + "\n Valid real number formats are:"
    + "\n 0.000"
    + "\n+0.000"
    + "\n-0.000"
    + "\n\n Please enter a valid real number with a decimal point."
    + "");
    }

  else if (!regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid characters are:"
    + "\n digits 0..9"
    + "\n . decimal point (optional)"
    + "\n + or - sign at start of number"
    + "\n\n Valid real number formats are:"
    + "\n 0.000"
    + "\n+0.000"
    + "\n-0.000"
    + "\n Spaces are not allowed anywhere in the numeric string!"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noRealErrors = true;
    }
  }


function checkPassword(elem)
/**
checks and validates type="password" input fields
**/
  {
  noPasswordErrors = false;
  allPasswordControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /^[0-9a-zA-Z]{8,}$/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (!regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid characters are:"
    + "\n digits 0-9"
    + "\n a-z lowecase letters"
    + "\n A-Z uppercase letters"
    + "\n Spaces are not allowed anywhere in the password string!"
    + "\n Minimum password length is 8 characters!"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noPasswordErrors = true;
    }
  }


function checkRadio(elem)
  {
  allRadioControls += 1;
  if (elem.checked == true)
    {
    checkedRadioControls 
    += '\n name="' + elem.name + '"' 
    + ' value="' + elem.value + '"';
    }
  }


function checkCheckbox()
  {
  allCheckboxControls += 1;
  if (elem.checked == true)
    {
    checkedCheckboxControls 
    += '\n name="' + elem.name + '"' 
    + ' value="' + elem.value + '"';
    }
  }


function checkTextArea(elem)
/**
checks and validates type="textarea" input fields
**/
  {
  noTextAreaErrors = false;
  allTextAreaControls += 1;

  // anything NOT included in the regex below is invalid input.
  // only characters listed in the regex are valid input for this field.
  regex = /[^a-zA-Z0-9\s\_\-\.,:@]/;

  if (elem.value == "")
    {
    showError(elem, elem.name + " is a required field and is empty!");
    }
  else if (regex.test(elem.value)) 
    {
    showError(elem, elem.name + " field has invalid input!"
    + "\n Valid input for this field is:"
    + "\n lowercase letters a-z"
    + "\n uppercase letters A-Z"
    + "\n digits 0-9"
    + "\n space character"
    + "\n _ underscore character"
    + "\n - hyphen character"
    + "\n . full stop"
    + "\n , comma"
    + "\n : colon"
    + "\n @ sign"
    + "");
    }
  else
    {
    restoreElemDefs(elem);
    noTextAreaErrors = true;
    }
  }


function checkSingleSelect(elem)
/* checks and validates type="select-one" select objects */
  {
  noSingleSelectErrors = false;
  allSingleSelectControls += 1;

  if (elem.value == "nothing_selected")
    {
    showSingleSelectError(elem);
    }
  else
    {
    restoreElemDefs(elem);
    noSingleSelectErrors = true;
    }
  }


function checkMultiSelect(elem)
/* checks and validates type="select-multiple" select objects */
  {
  noMultiSelectErrors = false;
  allMultiSelectControls += 1;

  optLength = elem.length;
  for(cms = 0; cms < optLength; cms++)
    {
    optElem = elem.options[cms];

    if (optElem.selected == true && optElem.value != "nothing_selected")
      {
      // yes - found a user selected option
      // de-select the 'please choose' element
      elem.options[0].selected = false;
      restoreElemDefs(elem);
      noMultiSelectErrors = true;
      }
    }// endfor

    if (noMultiSelectErrors == false)
      {
      showMultiSelectError(elem);
      } 
  }


function checkButton()
  {
  allButtonControls += 1;
  }


function checkReset()
  {
  allResetControls += 1;
  }


function checkForm(form, showControls)
/**
main loop for form checking functions.
this can also be used to check standard non-ajax type forms.
**/
  {
  resetControlCount();

  formLength = form.elements.length;
  for(cf = 0; cf < formLength; cf++)
    {
    elem = form.elements[cf];

    switch(elem.type)
      {
      case "text": 
      allTextControls += 1;
      switch(elem.className)
        {
        case "string": checkString(elem); break;
        case "email": checkEmail(elem); break;
        case "date": checkDate(elem); break;
        case "phone": checkPhone(elem); break;
        case "int": checkInt(elem); break;
        case "real": checkReal(elem); break;
        }; break;
        
      case "password": checkPassword(elem); break;
      case "radio": checkRadio(elem); break;
      case "checkbox": checkCheckbox(elem); break;
      case "textarea": checkTextArea(elem); break;
      case "select-one": checkSingleSelect(elem); break;
      case "select-multiple": checkMultiSelect(elem); break;

      case "button": checkButton(elem); break;
      case "reset": checkReset(elem); break;
      }
    } // endfor

    if (showControls)
      {
      alert(form.name + " contains the following controls:"
      + "\n allTextControls: " + allTextControls
      + "\n stringClassControls: " + stringClassControls
      + "\n emailClassControls: " + emailClassControls
      + "\n dateClassControls: " + dateClassControls
      + "\n phoneClassControls: " + phoneClassControls
      + "\n intClassControls: " + intClassControls
      + "\n realClassControls: " + realClassControls
      + "\n allPasswordControls: " + allPasswordControls
      + "\n allRadioControls: " + allRadioControls
      + "\n checkedRadioControls: " + checkedRadioControls
      + "\n allCheckboxControls: " + allCheckboxControls
      + "\n checkedCheckboxControls: " + checkedCheckboxControls
      + "\n allTextAreaControls: " + allTextAreaControls
      + "\n allSingleSelectControls: " + allSingleSelectControls
      + "\n allMultiSelectControls: " + allMultiSelectControls
      + "\n allButtonControls: " + allButtonControls
      + "\n allResetControls: " + allResetControls
      + "");
      }
  }


function noFormErrors()
/**
this function returns true if there are no errors on the form
**/
  {
  if (DEBUG_FORM)
    {
    alert(" noStringErrors: " + noStringErrors
    + "\n noEmailErrors: " + noEmailErrors
    + "\n noDateErrors: " + noDateErrors
    + "\n noPhoneErrors: " + noPhoneErrors
    + "\n noIntErrors: " + noIntErrors
    + "\n noRealErrors: " + noRealErrors
    + "\n noPasswordErrors: " + noPasswordErrors
    + "\n noTextAreaErrors: " + noTextAreaErrors
    + "\n noSingleSelectErrors: " + noSingleSelectErrors
    + "\n noMultiSelectErrors: " + noMultiSelectErrors
    + "");
    }

  if (noStringErrors && noEmailErrors && noDateErrors && noPhoneErrors
      && noIntErrors && noRealErrors && noPasswordErrors
      && noTextAreaErrors && noSingleSelectErrors && noMultiSelectErrors)
    {
    return true;
    }
  else
    {
    return false;
    }
  }


function validateForm(form, showControls)
/**
check the contents of each form control for errors.
do not send the POST request to the server.
**/
  {
  checkForm(form, showControls);

  if (noFormErrors())
    {
    // comment this out when used on a live website
    alert("There are no errors on the form!");
    getPostData(form, showControls);  
    tidyPostData();
    }
  else
    {
    alert("There were errors on the form!\n"
          +"Please fill in the highlighted fields correctly!");
    }
  }


function sendForm(form, url, action, showControls)
/**
check the contents of each form control for errors. if there are no
errors on the form, build the post_data string and send the
XMLHttpRequest to the server. 'form' is the form object to check. 'url'
is the page to request from the server. 'action' is an integer defining
which part of the page to update in processXMLResult(). 'showControls'
is a boolean value to toggle debug code.
**/
  {
  checkForm(form, showControls);

  if (noFormErrors())
    {

    getPostData(form, showControls);  
    tidyPostData();
    xmlPOST(url, action, 0);
    }
  else
    {
    alert("There were errors on the form!\n"
          +"Please fill in the highlighted fields correctly!");
    }
  }

// end of file
