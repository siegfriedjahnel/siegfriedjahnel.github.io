
var offlineText = "Achtung! Sie sind offline. Die Daten können veraltet sein!";
window.addEventListener("load", function(e) {
  if(!navigator.onLine) onlinestatus.innerHTML = offlineText;
});
window.addEventListener("offline", function(e) { onlinestatus.innerHTML = offlineText; });

window.addEventListener("online", function(e) { onlinestatus.innerHTML = ""; });


const ligaCompetitions = [
  {"name":"BL1", "competitionId":"023UT1TN0000001IVS54898DVVG1IBJM-G", "seasonId":"2018"},
  {"name":"BL2", "competitionId":"023UT27QC400001KVS54898DVVG1IBJM-G", "seasonId":"2018"},
  {"name":"BL3", "competitionId":"023V9I211C00000NVS54898DVVG1IBJM-G", "seasonId":"2018"},
  {"name":"RLB", "competitionId":"023KPUIJ90000002VS54898EVV49UB8O-G", "seasonId":"2018"},
  {"name":"LLSO", "competitionId":"023DI4HOUG000000VS54898EVTNSI1CG-G", "seasonId":"2018"},
  {"name":"KLIS", "competitionId":"023NDK2ECS00000AVS54898EVV49UB8O-G", "seasonId":"2018"}
];

const cupCompetitions = [
  {"name":"CL", "competitionId":"5", "seasonId":"2018"},
  {"name":"EL", "competitionId":"6", "seasonId":"2018"},
  {"name":"DFB", "competitionId":"231", "seasonId":"2018"}
];
var season = "2018";
var teamNames;

var matchday = 0;
var selMatchday;
var type = "";//liga or cup
const ligaUrl = "https://bfv.de/rest/competitioncontroller";
//const cupUrl = "https://www.openligadb.de/api/getmatchdata";
const cupUrl = "https://dts.stroeerdp.de/rest/getdata/?id=1&";

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
    	competitionId = ligaCompetitions[this.value].competitionId;
      seasonId = ligaCompetitions[this.value].seasonId;
    	matchday = 0;
      type = "liga";
    	getMatchData(competitionId, seasonId, matchday, type);

    });
}

for (var i = 0; i < cupButtons.length; i++) {
    cupButtons[i].addEventListener('click', function(){
      competitionId = cupCompetitions[this.value].competitionId;
      seasonId = cupCompetitions[this.value].seasonId;
      matchday = 0;
      type = "cup";
      getMatchData(competitionId, seasonId, matchday, type);

    });
}





        
function decreaseMatchday(){
  selMatchday--;
  getMatchData(competitionId, selMatchday, type);
}

function increaseMatchday(){
  selMatchday++;
  getMatchData(competitionId, selMatchday, type);
}

//minusButton.addEventListener('click', decreaseMatchday);
minusButton.addEventListener('click', function(){
  selMatchday--;
  getMatchData(competitionId, seasonId, selMatchday, type);
});

plusButton.addEventListener('click', function(){
  selMatchday++;
  getMatchData(competitionId, seasonId, selMatchday, type);
});

refreshButton.addEventListener('click', function(){
  getMatchData(competitionId, seasonId, selMatchday, type);
});

//----------------------------------------------------------
if ('serviceWorker' in navigator) { 
  window.addEventListener('load', () => 
    navigator.serviceWorker.register('sw.js') 
      .catch(err => 'SW registration failed')); 
 } 

//----------------------------------------------------------

//-------------------------------------------------------------
function getMatchData(competitionId, seasonId , matchday, type){
  resultsTableBody.innerHTML = "loading!";
    tableTableBody.innerHTML = "";
    if(type == "liga") var route = ligaUrl + "/competition/id/" + competitionId + "/matchday/" + matchday;

    if(type == "cup"){//------------------------------------------------------
     var route = cupUrl + "competitionId=" + competitionId + "&seasonId=" + seasonId;
     var url2 = "https://liveticker.stroeerdp.de/rest/soccer/teams/competition/" + competitionId;
     fetch(url2)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      teamNames = myJson;
      })
   }//------------------------------------------------------------------------
    
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
      var actualMatchDay = "";
    	var groupName = json.data.SoccerFeed.meta.competitionName
    	var staffelname = json.data.SoccerFeed.meta.competitionName;
    	var matchDayName = "";
      resultsTableBody.innerHTML = json.data.SoccerFeed.MatchData.map(drawCupResults).join('\n');
    	tableTableHead.innerHTML = "";
    	tableTableBody.innerHTML = "";
    } 
    
    if(matchday == 0) selMatchday = actualMatchDay;
    matchdayContainer.innerHTML = staffelname + " , " + matchDayName;
})

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
  var teamId1 = match.TeamData[0].TeamRef;
  var teamId2 = match.TeamData[1].TeamRef;
  var scoreTeam1 = match.TeamData[0].Score;
  var scoreTeam2 = match.TeamData[1].Score;
  var nameTeam1 = teamNames.teams[teamId1].Name;
  var nameTeam2 = teamNames.teams[teamId2].Name;
  if(scoreTeam1){
    var result = scoreTeam1 + ":" + scoreTeam2; 
    }else{
    var result = "-:-";
   }

  try{
  	var matchDate = match.MatchInfo.Date;
  	var year = matchDate.substring(2, 4);
  	var month = matchDate.substring(5, 7);
  	var day = matchDate.substring(8, 10);
  	var time = matchDate.substring(11, 16);
  	var date = day + "."+ month + "." + year + "<br>" + time;
  	var matchDay = match.MatchInfo.MatchDay;
  } catch(e) {
  	var date = "----";
  }
  
  if(match.MatchInfo.GroupName){
    var group = match.MatchInfo.GroupName;
  }else{
    var group ="";
  }
  
	//var matchTime = hour + ":" + minute;
	
    return `<tr>
      <td>${date}</td>
      <td>${nameTeam1}<br>${nameTeam2}</td>
      <td>${group}<br>${matchDay}</td>
      <td>${result}</td>
    </tr>`;
}
