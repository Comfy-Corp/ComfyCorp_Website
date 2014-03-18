function startstream() {
console.log("infunction");
var newStreamName = document.getElementById('streamselect').value;
var newStreamRadioID = getCookie("radioID");
$.ajax({
url: '/cgi-bin/api.php?q=genconfig&name=' + newStreamName + '&id=' + newStreamRadioID,
dataType: 'json',
success: function(response) {
json = response;
console.log(json)
if (json.result == 'success') 
{
	bootstrap_alert.success('Success: Stream started');
	window.setTimeout(closealert,5000);
}
else
{
	bootstrap_alert.warning('Error: Er is een fout opgetreden (Error code: 402)');
	window.setTimeout(closealert,5000);
}
}
})
}
function deletecookie()
{
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
};

function closealert()
{
$('#alertmssg').alert('close');
}
function saveStream() {
var newStreamName = document.getElementById('newStreamName').value;
var newStreamURL = document.getElementById('newStreamURL').value;
var newStreamRadioID = getCookie("radioID");
$.ajax({
url: '/cgi-bin/api.php?q=addstream&name=' + newStreamName + '&url=' + newStreamURL + '&id=' + newStreamRadioID,
dataType: 'json',
success: function(response) {
json = response;
$('#myModal').modal('hide');
getJsonFile();
populateSavedStreams(document.getElementById('streamselect'), json.streams);
}
})
}
function getCookie(cname) {
var name = cname + "=";
var ca = document.cookie.split(';');
for (var i = 0; i < ca.length; i++) {
var c = ca[i].trim();
if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
}
return "";
}
function checkCookie() {
var user = getCookie("radioName");
if (user != "") {
return;
} else {
window.location = 'login.html';
}
}
function load() {
checkCookie();
getJsonFile();
}
function getJsonFile() {
var json
$.ajax({
url: '/cgi-bin/api.php',
dataType: 'json',
success: function(response) {
json = response;
populateSavedStreams(document.getElementById('streamselect'), json.streams);
populateSavedStreams(document.getElementById('streamselect2'), json.streams);
populateSavedAlarms(document.getElementById('alarmselect'), json.alarms);
populateHeader(document.getElementById('header'));
}
})
}
bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
$('#alert_placeholder').html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>' + message + '</span></div>')
}
bootstrap_alert.success = function(message) {
$('#alert_placeholder').html('</br><div class="alert alert-success alert-dismissable" id="alertmssg"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>' + message + '</span></div>')
}