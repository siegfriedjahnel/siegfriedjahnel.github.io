
var offlineText = "Achtung! Sie sind offline. Die Daten können veraltet sein!";
window.addEventListener("load", function(e) {
  if(!navigator.onLine) onlinestatus.innerHTML = offlineText;
});
window.addEventListener("offline", function(e) { onlinestatus.innerHTML = offlineText; });

window.addEventListener("online", function(e) { onlinestatus.innerHTML = ""; });




const competitions = [
  {"name":"BL1", "competitionId":"22", "seasonId":"2019"},
  {"name":"BL2", "competitionId":"87", "seasonId":"2019"},
  {"name":"BL3", "competitionId":"374", "seasonId":"2019"},
  {"name":"CL", "competitionId":"5", "seasonId":"2019"},
  {"name":"EL", "competitionId":"6", "seasonId":"2019"},
  {"name":"DFB", "competitionId":"231", "seasonId":"2019"}
];
var seasonId = "2019";
var competitionId = "22";

var teamNames = [];
var matches = [];
var array = [];
var actuelMatchDay;
var matchDay;

Dva = "";//liga or cup

const ligaUrl = "https://bfv.de/rest/competitioncontroller";
//const cupUrl = "https://www.openligadb.de/api/getmatchdata";
const cupUrl = "https://dts.stroeerdp.de/rest/getdata/?id=1&";

const matchdayContainer = document.getElementById('matchdayContainer');
const resultsTableBody = document.getElementById( 'resultsTableBody');
const tableTableBody = document.getElementById( 'tableTableBody');
const minusButton = document.getElementById('minusButton');
const plusButton = document. getElementById('plusButton');
const onlinestatus = document.getElementById('onlinestatus');

const competitionButtons = document.getElementsByClassName('competitionButtons');
const refreshButton = document.getElementById('refreshButton');

for (var i = 0; i < competitionButtons.length; i++) {
    competitionButtons[i].addEventListener('click', function(){
    	competitionId = competitions[this.value].competitionId;
      
    	getMatchData(competitionId);

    });
}



        



minusButton.addEventListener('click', function(){
  matchDay--;
  drawLigaResults();
  });

plusButton.addEventListener('click', function(){
  matchDay++;
  drawLigaResults();
  });

refreshButton.addEventListener('click', function(){
  getMatchData(competitionId, seasonId, matchDay);
});

//----------------------------------------------------------
if ('serviceWorker' in navigator) { 
  window.addEventListener('load', () => 
    navigator.serviceWorker.register('sw.js') 
      .catch(err => 'SW registration failed')); 
 } 

//----------------------------------------------------------

//-------------------------------------------------------------


function getMatchData(){
  resultsTableBody.innerHTML = "loading!";
    tableTableBody.innerHTML = "";

   const route2="https://liveticker.stroeerdp.de/rest/widget/result/competition/"+competitionId+"/matchday/";
   fetch(route2)
   .then(function(response) {
    if (response.ok)
    	return response.json();
    else
      throw new Error('Fehler beim laden');
   })
   .then(function(json) {
     matchDay = json.config.currentMatchday;
     matchdayContainer.innerHTML=matchDay;
   })
   


   const route = "https://dts.stroeerdp.de/rest/getdata/?id=1&competitionId="+competitionId+"&seasonId="+seasonId;
   
    fetch(route)
    .then(function(response) {
    if (response.ok)
    	return response.json();
    else
      throw new Error('Fehler beim laden');
   })	
    .then(function(json) {
      teamNames = json.data.SoccerFeed.Team;
      matches = json.data.SoccerFeed.MatchData;
     
      teamNames.forEach(team => array[team.uID] = team.Name);
      
     	resultsTableBody.innerHTML = json.data.SoccerFeed.MatchData.map(drawLigaRow).join('\n');
    	// tableTableHead.innerHTML = `<th>&nbsp;</th><th>Verein</th><th>Sp</th><th>Pu</th><th>TV</th>` ;
    	// tableTableBody.innerHTML = json.data.tabelle.map(drawLigaTable).join('\n');
})
}
//----------------------------------------------------------------

function drawLigaRow(match){
   if(match.MatchInfo.Date){
    var tag = match.MatchInfo.Date.toString().substring(8,10);
    var monat = match.MatchInfo.Date.toString().substring(5, 7);
  }
  
  if(match.TeamData[0].Score){
    var result = match.TeamData[0].Score+ ":" + match.TeamData[1].Score;
  }else{
    var result = "-:-";
  }
  if(match.MatchInfo.MatchDay == matchDay){
    
    console.log(typeof match.MatchInfo.Date);
    return `<tr>
    <td>${tag}.${monat}</td>
    <td>${array[match.TeamData[0].TeamRef]}<br>${array[match.TeamData[1].TeamRef]}</td>
    <td>${result}</td>
    </tr>`;
  }
}

function drawLigaResults(){
  matchdayContainer.innerHTML=matchDay;
  resultsTableBody.innerHTML = matches.map(drawLigaRow).join('\n');

}
getMatchData();
drawLigaResults();