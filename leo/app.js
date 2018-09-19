var table = document.getElementById("table");
var days = ["So","Mo","Di","Mi","Do","Fr","Sa"];
var out = document.getElementById("out");
var d = new Date();
var unixToday = d.getTime();
var unixDay;
//---------------------Create Table -----------------------   
for(var i = 1 ; i < 150; i++){
   var unixDay = unixToday + (i-15) * 24*60*60*1000;
   d.setTime(unixDay);
   var day = d.toLocaleDateString(); 
   var dayNumber = d.getDay();
   var dayName = days[dayNumber];
   var dayString = dayName + ", "+day;
   var tr = document.createElement("tr");
   var td1 = document.createElement("td");
   var td2 = document.createElement("td");
      
   td1.appendChild(document.createTextNode(dayString ));
   td1.setAttribute("class", "c1");
   td2.setAttribute("class", "c2");
   td2.setAttribute("unixDay", unixDay);
   td2.setAttribute("day", dayString);
   td2.setAttribute("id", i);
   if(unixToday == unixDay){
      tr.setAttribute("class", "today");
   }
       
 
   table.appendChild(tr);
   tr.appendChild(td1);
   tr.appendChild(td2);
      
   document.getElementById(i).addEventListener("click", edit);
     
}
//---------------------------------------------------------------
   
   

function edit() {
   this.setAttribute("class", "selected")
   var selectedDay = this.getAttribute("day");
   var person = prompt(selectedDay, this.innerHTML);
   this.innerHTML = person;
   console.log(this.getAttribute("unixDay") + person);
   
}