<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>

<title>Javascript formcheck demo 1</title>

<link type="text/css" rel="stylesheet" href="./formcheck.css" />

<script type="text/javascript"
 src="./formcheck.js">
</script>

</head>

<body onload="setFormDefs(document.form1)">

<div class="box">
<pre id="x5">

<form name="form1" onsubmit="return false"> 

<h2 class="center">Validating form input fields using formcheck.js</h2>

<button onclick="validateForm(this.form, false)">Click to Validate</button>

<div class="control_box">
<h3 class="center">Text type input fields</h3>
<label>string1:<input type="text" class="string" name="string1" value="hello world" onchange="checkString(this)" /></label> 
<label>email1:&nbsp;<input type="text" class="email" name="email1" value="me@myhost.net" onchange="checkEmail(this)" /></label> 
<label>date1:&nbsp;&nbsp;<input type="text" class="date" name="date1" value="2001-01-01" onchange="checkDate(this)" /></label> 
<label>phone1:&nbsp;<input type="text" class="phone" name="phone1" value="0845-123456" onchange="checkPhone(this)" /></label> 
<label>int1:&nbsp;&nbsp;&nbsp;<input type="text" class="int" name="int1" value="12345" onchange="checkInt(this)" /></label>
<label>real1:&nbsp;&nbsp;<input type="text" class="real" name="real1" value="177.245" onchange="checkReal(this)" /></label> 
</div>

<div class="control_box">
<h3 class="center">Password type input field</h3>
<label>password1:&nbsp;&nbsp;
<input type="password" name="password1"
 value="aSecretPassword" onchange="checkPassword(this)" /></label> 
</div>

<div class="control_box">
<h3 class="center">Radio buttons Group1</h3>
<label>button1:<input type="radio" name="group1" value="button1" checked /></label>
<label>button2:<input type="radio" name="group1" value="button2" /></label>
<label>button3:<input type="radio" name="group1" value="button3" /></label>
</div>

<div class="control_box">
<h3 class="center">Radio buttons Group2</h3>
<label>button4:<input type="radio" name="group2" value="button4" checked /></label>
<label>button5:<input type="radio" name="group2" value="button5" /></label>
<label>button6:<input type="radio" name="group2" value="button6" /></label>
</div>

<div class="control_box">
<h3 class="center">Checkbox controls</h3>
<label>checkbox1:<input type="checkbox" name="checkbox1" value="TRUE" /></label>
<label>checkbox2:<input type="checkbox" name="checkbox2" value="TRUE" checked /></label>
<label>checkbox3:<input type="checkbox" name="checkbox3" value="TRUE" /></label>
</div>

<div class="control_box">
<h3 class="center">Textarea input field</h3>
<textarea name="textarea1" onchange="checkTextArea(this)" rows="5" cols="40">
First line of initial text.
Second line of initial text.
</textarea>
</div>

<div class="control_box">
<h3 class="center">Single Selection List</h3>
<select name="single_select1" onchange="checkSingleSelect(this)">
  <option value="nothing_selected" selected>nothing selected - please choose</option>
  <option value="sng1_opt1" selected>sng1_opt1</option>
  <option value="sng1_opt2">sng1_opt2</option>
  <option value="sng1_opt3">sng1_opt3</option>
  <option value="sng1_opt4">sng1_opt4</option>
  <option value="sng1_opt5">sng1_opt5</option>
</select>
</div>

<div class="control_box">
<h3 class="center">Multiple Selection List</h3>
<select multiple name="multi_select1" onchange="checkMultiSelect(this)">
  <option value="nothing_selected" selected>nothing selected - please choose</option>
  <option value="mult1_opt1">mult1_opt1</option>
  <option value="mult1_opt2">mult1_opt2</option>
  <option value="mult1_opt3" selected>mult1_opt3</option>
  <option value="mult1_opt4">mult1_opt4</option>
  <option value="mult1_opt5">mult1_opt5</option>
</select>
</div>

</form>
</pre>
</div>

</body>
</html>
