var table = document.getElementById("table");
var days = ["So","Mo","Di","Mi","Do","Fr","Sa"];
var out = document.getElementById("out");
var d = new Date();
var unixTime = d.getTime();
var f = 24*60*60*1000;
var unixToday = Math.floor(unixTime/f);
var apiUrl = "https://sj-sam.de/api/leo/leo.php";
var ridingDays = [];
//register service-worker------------------------------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  })
  .catch(function(error) {
    });
}
//-------------------------------------------------------------------------------
function dayAsString(unixDay){
	d.setTime(unixDay*f);
	var day = d.toLocaleDateString(); 
	var dayNumber = d.getDay();
	var dayName = days[dayNumber];
	var dayString = dayName + ", "+day;
	return dayString;
}
//------
fetch(apiUrl)
.then(function(response) {
	return response.json();
})
.then(function(json) {
	ridingDays = json;
	var numberOfEntries = ridingDays.length;
	

//---------------------Create Table -----------------------   
for(var i = -5 ; i < 100; i++){
	var unixDay = unixToday + i;

	var tr = document.createElement("tr");
	var td1 = document.createElement("td");
	var td2 = document.createElement("td");

	td1.appendChild(document.createTextNode(dayAsString(unixDay) ));
	td1.setAttribute("class", "c1");
	td2.setAttribute("class", "c2");
	td2.setAttribute("unixDay", unixDay);
	td2.setAttribute("day", dayAsString(unixDay));
	td2.setAttribute("id", i);
	table.appendChild(tr);
	tr.appendChild(td1);
	tr.appendChild(td2);
	if(unixToday == unixDay){
		tr.setAttribute("class", "today");
	}
	for(var j = 0; j < numberOfEntries; j++){
		var ridingDay = ridingDays[j].day;
		if(ridingDay == unixDay){
			document.getElementById(i).innerHTML = ridingDays[j].person;
		}
	}    

	document.getElementById(i).addEventListener("click", edit);
}
//---------------------------------------------------------------
});  

function pop() {
    var popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
}

function edit() {
   //this.setAttribute("class", "selected")
   var selectedDay = this.getAttribute("day");
   var selectedPerson = this.innerHTML;
   var person = prompt(selectedDay, selectedPerson);
   if(person != null){
   	var unixDay = this.getAttribute("unixDay");
   	if(selectedPerson == ""){
   		var action = "insert";
   	}else{
   		var action = "update";
   	}
   	this.innerHTML = person;
   	var route = apiUrl+"?action="+action+"&day="+unixDay+"&person="+person;
   	fetch(route);
   	
   }
   
}