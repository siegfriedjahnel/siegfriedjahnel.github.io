
var offlineText = "Achtung! Sie sind offline. Die Daten können veraltet sein!";
window.addEventListener("load", function(e) {
  if(!navigator.onLine) onlinestatus.innerHTML = offlineText;
});
window.addEventListener("offline", function(e) { onlinestatus.innerHTML = offlineText; });

window.addEventListener("online", function(e) { onlinestatus.innerHTML = ""; });


const ligaCompetitions = [
  {"name":"BL1", "id":"023UT1TN0000001IVS54898DVVG1IBJM-G"},
  {"name":"BL2", "id":"023UT27QC400001KVS54898DVVG1IBJM-G"},
  {"name":"BL3", "id":"023V9I211C00000NVS54898DVVG1IBJM-G"},
  {"name":"RLB", "id":"023KPUIJ90000002VS54898EVV49UB8O-G"},
  {"name":"LLSO", "id":"023DI4HOUG000000VS54898EVTNSI1CG-G"},
  {"name":"KLIS", "id":"023NDK2ECS00000AVS54898EVV49UB8O-G"}
];

const cupCompetitions = [
  {"name":"CL", "id":"cl1819", "season":"2018"},
  {"name":"EL", "id":"el1819", "season":"2018"},
  {"name":"DFB", "id":"dfb2018", "season":"2018"}
];
var season = "2018";

var matchday = 0;
var selMatchday;
var competitionId = ligaCompetitions[0].id;
var type = "";//liga or cup
const ligaUrl = "https://bfv.de/rest/competitioncontroller";
const cupUrl = "https://www.openligadb.de/api/getmatchdata";

const matchdayContainer = document.getElementById('matchdayContainer');
const resultsTableBody = document.getElementById( 'resultsTableBody');
const tableTableBody = document.getElementById( 'tableTableBody');
const minusButton = document.getElementById('minusButton');
const plusButton = document. getElementById('plusButton');
const onlinestatus = document.getElementById('onlinestatus');
const ligaButtons = document.getElementsByClassName('ligaButtons');
const cupButtons = document.getElementsByClassName('cupButtons');
const refreshButton = document.getElementById('refreshButton');

for (var i = 0; i < ligaButtons.length; i++) {
    ligaButtons[i].addEventListener('click', function(){
    	competitionId = ligaCompetitions[this.value].id;
    	matchday = 0;
        type = "liga";
    	getMatchData(competitionId, matchday, type);

    });
}

for (var i = 0; i < cupButtons.length; i++) {
    cupButtons[i].addEventListener('click', function(){
      competitionId = cupCompetitions[this.value].id;
      season = cupCompetitions[this.value].season;
      matchday = 0;
      type = "cup";
      getMatchData(competitionId, matchday, type);

    });
}



$(document).on("pagecreate","#page1",function() {
  $("#maincontent").on("swipeleft", increaseMatchday);
  $("#maincontent").on("swiperight",decreaseMatchday);
  });

        
function decreaseMatchday(){
  selMatchday--;
  getMatchData(competitionId, selMatchday, type);
}

function increaseMatchday(){
  selMatchday++;
  getMatchData(competitionId, selMatchday, type);
}

minusButton.addEventListener('click', decreaseMatchday);


plusButton.addEventListener('click', function(){
  selMatchday++;
  getMatchData(competitionId, selMatchday, type);
});

refreshButton.addEventListener('click', function(){
  getMatchData(competitionId, selMatchday, type);
});

//----------------------------------------------------------
if ('serviceWorker' in navigator) { 
  window.addEventListener('load', () => 
    navigator.serviceWorker.register('sw.js') 
      .catch(err => 'SW registration failed')); 
 } 

//----------------------------------------------------------

//-------------------------------------------------------------
function getMatchData(competitionId , matchday, type){
    if(type == "liga") var route = ligaUrl + "/competition/id/" + competitionId + "/matchday/" + matchday;

    if(type == "cup"){
      if(matchday == 0){
      	var route = cupUrl + "/" + competitionId; 
        }else{
      	var route = cupUrl + "/" + competitionId + "/" + season + "/" +matchday; 
        }
      }
    resultsTableBody.innerHTML = "loading!";
    tableTableBody.innerHTML = "";
    fetch(route)
    .then(function(response) {
    if (response.ok)
    	return response.json();
    else
      throw new Error('Fehler beim laden');
   })	
    .then(function(json) {
    if(type == "liga"){
    	var actualMatchDay = json.data.actualMatchDay;
    	var staffelname = json.data.staffelname;
    	var matchDayName = json.data.selSpieltag + ". ST";

    	resultsTableBody.innerHTML = json.data.matches.map(drawLigaResults).join('\n');
    	tableTableHead.innerHTML = `<th>&nbsp;</th><th>Verein</th><th>Sp</th><th>Pu</th><th>TV</th>` ;
    	tableTableBody.innerHTML = json.data.tabelle.map(drawLigaTable).join('\n');

    } 
    if(type == "cup"){
    	var actualMatchDay = json[0].Group.GroupOrderID;
    	var groupName = json[0].Group.GroupName;
    	var staffelname = json[0].LeagueName;
    	var matchDayName = json[0].Group.GroupName;

    	resultsTableBody.innerHTML = json.map(drawCupResults).join('\n');
    	tableTableHead.innerHTML = "";
    	tableTableBody.innerHTML = "";
    } 
    
    if(matchday == 0) selMatchday = actualMatchDay;
    matchdayContainer.innerHTML = staffelname + " , " + matchDayName;
    //console.log(json);
  
})
.catch(function(err) {
   // Hier Fehlerbehandlung
});
};
//----------------------------------------------------------------

function drawLigaResults(match){
  return `<tr>
    <td>${match.kickoffDate.substring(0,5)}<br>
      ${match.kickoffTime}</td>
      <td>${match.homeTeamName.substring(0,24)}<br>
          ${match.guestTeamName.substring(0,24)}</td>
      <td>${match.result}</td>
    </tr>`;
}

function drawLigaTable(match){
  return `<tr>
    <td>${match.rang}</td>
    <td>${match.teamname.substring(0,24)}</td>
    <td>${match.anzspiele}</td>
    <td>${match.punkte}</td>
    <td>${match.tordiff}</td>
    </tr>`;
}

function drawCupResults(match){
	var res = "";
	for(var i=0; i < match.MatchResults.length; i++){
		if(match.MatchResults[i].ResultName == "Endergebnis"){
			var res = match.MatchResults[i].PointsTeam1 + ":" + match.MatchResults[i].PointsTeam2;
		}
	}
	var date = new Date(match.MatchDateTime);
	var day = ("0"+date.getDate()).slice(-2);
	var month = ("0"+(date.getMonth()+1)).slice(-2);
	var hour = ("0"+date.getHours()).slice(-2);
	var minute = ("0"+date.getMinutes()).slice(-2);
	var matchDate = day + "." + month;
	var matchTime = hour + ":" + minute;
	
    return `<tr>
      <td>${matchDate}<br>
    	  ${matchTime}</td>
      <td>${match.Team1.TeamName.substring(0,24)}<br>
          ${match.Team2.TeamName.substring(0,24)}</td>
      <td>${res}</td>
    </tr>`;
}
