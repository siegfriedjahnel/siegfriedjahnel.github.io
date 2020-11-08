//---------------Service worker-------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .catch(err => 'SW registration failed'));
}
//----------------------------------------------------------

var offlineIcon = `<img src = "icons/offline-72.png" alt="status" height="36" width="36">`;
var onlineIcon = `<img src = "icons/online-72.png" alt="status" height="36" width="36">`;
window.addEventListener("load", function (e) {
const onlineStatus = document.getElementById('onlineStatus');

  if (!navigator.onLine) onlineStatus.innerHTML = offlineIcon;
  if (navigator.onLine) onlineStatus.innerHTML = onlineIcon;

});
window.addEventListener("offline", function (e) { onlineStatus.innerHTML = offlineIcon; });

window.addEventListener("online", function (e) { onlineStatus.innerHTML = onlineIcon; });

//-----------------add a method to Date-Class---------------------------------
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}//-------------------------------------------

//---------------------------Settings-----------------------------------------------------------------

//not used
const ids = {
  "bl1": { "opta_id": "22", "competition_id": "95" },
  "bl2": { "opta_id": "87", "competition_id": "96" },
  "bl3": { "opta_id": "374", "competition_id": "100" },

}
//-------------

let allMatchdays = [];
let currentMatchDay;
let selectedMatchday;
let competitionId;
const opta_ids = { "bl1": "22", "bl2": "87", "bl3": "374", "el": "6", "dfb": "231", "cl": "5" };

const url = `https://www.t-online.de/api/sdc/graphql/query`;
const extensionToday = `&extensions={"persistedQuery":{"version":1,"sha256Hash":"6d0844602164ce610ff064656c31c0529a9921d68e459ad612570244baf222b1"}}`;
const extensionMatchday = `&extensions={"persistedQuery":{"version":1,"sha256Hash":"e4a29441acab60e379a9f1dcdc67a7811a4ea82935c33b2d0b3e5d2e0616c0c1"}}`;
const extensionStandings = `&extensions={"persistedQuery":{"version":1,"sha256Hash":"b34f22dc370ea5f2dcf6b948b3432d9574c1b2005f387174b20ca1538f42d827"}}`;
const extensionsResults = `&extensions={"persistedQuery":{"version":1,"sha256Hash":"3a1436272f122c47529b2b53a8dd78ef235880102df7260c5957ff61d52a52da"}}`;
const contentTop = document.getElementById("contentTop");
const contentBottom = document.getElementById("contentBottom");


const matchdayContainer = document.getElementById('matchdayContainer');
const minusButton = document.getElementById('minusButton');
const plusButton = document.getElementById('plusButton');

const divFupa = document.getElementById("divFupa");
const refreshButton = document.getElementById('refreshButton');


document.getElementById("bl1").addEventListener("click", function () {
  competitionName = this.innerHTML;
  show(opta_ids.bl1);
});
document.getElementById("bl2").addEventListener("click", function () {
  competitionName = this.innerHTML;
  show(opta_ids.bl2);
});
document.getElementById("bl3").addEventListener("click", function () {
  competitionName = this.innerHTML;
  show(opta_ids.bl3);
});
document.getElementById("cl").addEventListener("click", function () {
  competitionName = this.innerHTML;
  show(opta_ids.cl);
});
document.getElementById("el").addEventListener("click", function () {
  competitionName = this.innerHTML;
  show(opta_ids.el);
});
document.getElementById("dfb").addEventListener("click", function () {
  competitionName = this.innerHTML;
  show(opta_ids.dfb);
});

document.getElementById("today").addEventListener("click", function () {
  competitionName = this.innerHTML;
  getToday();

});
document.getElementById("llso").addEventListener("click", function () {
  competitionName = this.innerHTML;
  getFupaData('73842');
});

document.getElementById("kl").addEventListener("click", function () {
  competitionName = this.innerHTML;
  getFupaData('74939');
});
document.getElementById("rlb").addEventListener("click", function () {
  competitionName = this.innerHTML;
  getFupaData('73836');
});

minusButton.addEventListener('click', function () {
  changeMatchday(-1);
});

plusButton.addEventListener('click', function () {
  changeMatchday(1);
});


//--------------End of DOM-Settings-----------------------------------------------


//---------------------------------swipe-EventListener----------hammer.js-------------------
var hammertime = new Hammer(contentTop);
hammertime.on('swipe', function (ev) {
  if (ev.direction == 2) {
    changeMatchday(1);
  }
  if (ev.direction == 4) {
    changeMatchday(-1);
  }
});

//-----------------------------------------------------------------------------------

//---------------------------- increase or decrease matchday---------
function changeMatchday(direction) {
  let maxIndex = allMatchdays.length - 1;
  matchdayIndex = parseInt(matchdayNumber) - 1;//allMatchdays.indexOf('')
  matchdayIndex = matchdayIndex + direction;
  console.log("dir= " + direction + " matchdayIndex= " + matchdayIndex);
  if (matchdayIndex >= 0 && matchdayIndex <= maxIndex) {
    let matchDayId = allMatchdays[matchdayIndex].id;
    getResults(matchDayId);
  }
}
//-----------------------------------------------------------------------------------------


//--------------- displays results and standings of an opta--------------------------------
async function show(opta_id) {
  let opta_var = `?operationName=CurrentCompetition&variables={"competitionsFilter":{"idType":"OPTA_ID","id":"${opta_id}"}}`;
  let route = url + opta_var + extensionsResults;
  const response = await (fetch(route));
  const json = await (response.json());
  allMatchdays = json.data.competitions[0].matchdays.all;
  currentMatchDayId = json.data.competitions[0].matchdays.current.id;
  getResults(currentMatchDayId)
    .then(function () {
      getStandings(competitionId);
    })
}
//------------------------------------------------------------------------------------------------

//-------------begin of function getStandings-------------------------------------------------------------------------------------------------------
async function getStandings(competitionId) {
  let variablesStandings = `?operationName=LiveTable&variables={"filter":{"idType":"COMPETITION","id":"sdc_fs-${competitionId}"}}`;
  let route = url + variablesStandings + extensionStandings;
  const response = await fetch(route);
  const json = await response.json();
  divFupa.innerHTML="";
  contentBottom.innerHTML = "";
  let standings = json.data.competitions[0].standings;
  if (standings) {
    standings.forEach(element => {
      let table = document.createElement("table");
      let headRow = document.createElement("tr");
      table.setAttribute('class', 'tblStandings');
      headRow.setAttribute('class', 'headRow');
      let colgroup = document.createElement("colgroup");
      headRow.innerHTML = `<td class="ten">Pos</td><td class="fifty">Verein</td><td class="ten">Sp</td><td class="ten">Pkt</td><td class="ten">Diff</td>`;
      if (element.group) {
        let headLine = document.createElement("h4");
        headLine.innerHTML = `${element.group.name}`;
        contentBottom.appendChild(headLine);
      }
      table.appendChild(headRow);
      element.standingsCollection.forEach(row => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.position}</td><td>${row.team.name.full}</td><td >${row.played}</td><td>${row.points}</td><td class="">${row.difference}</td>`;
        table.appendChild(tr);
      })
      contentBottom.appendChild(table);

    });
  }
}


//-------------begin of function getResults-------------------------------------------------------------------------------------------------------
async function getResults(matchDayId) {
  divFupa.innerHTML="";
  contentTop.innerHTML = "loading";
  let variablesMatchday = `?operationName=CurrentCompetition&variables={"competitionsFilter":{"idType":"MATCHDAY","id":"${matchDayId}"}}`;
  let route = url + variablesMatchday + extensionMatchday;
  //let route = url+variablesToday+extensionToday;
  const response = await fetch(route);
  const json = await response.json();
  contentTop.innerHTML = "";
  competitionId = json.data.competitions[0].sportEvents[0].competition.id;
  matchdayNumber = json.data.competitions[0].matchdays.selected.dayNumber;
  matchdayContainer.innerHTML = `${json.data.competitions[0].name}<br>${json.data.competitions[0].matchdays.selected.name}`;
  let competitions = json.data.competitions;
  competitions.forEach(element => {
    if (element.__typename == "FootballCompetition") {
      let table = document.createElement("table");
      let headRow = document.createElement("tr");
      table.setAttribute('class', 'tblResults');
      headRow.setAttribute('class', 'headRow');
      headRow.innerHTML = `<td class="twenty">Zeit<td class="fifty">${element.name}</td><td class="ten">Erg</td>`;
      table.appendChild(headRow);
      element.sportEvents.forEach(event => {
        let when = event.weekday.substring(0, 2) + " ," + event.time + "<br>" + event.date;
        let result = `<span class= "">-:-</span>`;
        if (event.latestScore && event.state == "LIVE") result = `<span class="red">${event.latestScore.home} : ${event.latestScore.away}`;
        if (event.latestScore && event.state == "FINISHED") result = `<span class="black">${event.latestScore.home} : ${event.latestScore.away}`;
        if (event.latestScore && event.state == "BREAK") result = `<span class="green">${event.latestScore.home} : ${event.latestScore.away}`;
        let row = document.createElement("tr");
        row.innerHTML = `<td>${when}</td><td>${event.homeTeam.name.full}<br>${event.awayTeam.name.full}</td><td>${result}</td>`;
        table.appendChild(row);
      })
      contentTop.appendChild(table);
    }
  });
}
//---------------------End of function------------------------------------------------------------------------------------------------------

//-------------begin of function getToday-------------------------------------------------------------------------------------------------------
async function getToday() {
  contentTop.innerHTML = "";
  contentBottom.innerHTML = "";
  divFupa.innerHTML="";
  let variablesToday = `?operationName=DayOverview&variables={"eventFilter":{"day":"TODAY"},"dayFilter":"TODAY"}`;
  let route = url + variablesToday + extensionToday;
  const response = await fetch(route);
  const json = await response.json();
  let competitions = json.data.competitions;
  competitions.forEach(element => {
    if (element.__typename == "FootballCompetition") {
      let table = document.createElement("table");
      let headRow = document.createElement("tr");
      table.setAttribute('class', 'tblResults');
      headRow.setAttribute('class', 'headRow');
      headRow.innerHTML = `<td class="twenty">Zeit<td class="fifty">${element.name}</td><td class="ten">Erg</td>`;
      table.appendChild(headRow);
      element.sportEvents.forEach(event => {
        let when = event.weekday.substring(0, 2) + " ," + event.time + "<br>" + event.date;
        let result = `<span class= "">-:-</span>`;
        if (event.latestScore && event.state == "LIVE") result = `<span class="live">${event.latestScore.home} : ${event.latestScore.away}`;
        if (event.latestScore && event.state == "FINISHED") result = `<span class="green">${event.latestScore.home} : ${event.latestScore.away}`;
        if (event.latestScore && event.state == "BREAK") result = `<span class="green">${event.latestScore.home} : ${event.latestScore.away}`;
        let row = document.createElement("tr");
        row.innerHTML = `<td>${when}</td><td>${event.homeTeam.name.full}<br>${event.awayTeam.name.full}</td><td>${result}</td>`;
        table.appendChild(row);
      })
      contentTop.appendChild(table);
    }
  });
}
//---------------------End of function------------------------------------------------------------------------------------------------------



function getFupaData(w) {
  contentTop.innerHTML = "";
  contentBottom.innerHTML="";
  matchdayContainer.innerHTML = "";
  divFupa.innerHTML = "loading!";
  var uri = "https://sj-sam.de/apps/fb5/proxy2.php?w=" + w;
  fetch(uri)
    .then(function (response) {
      console.log(response);
      return response.text();
    })
    .then(function (data) {
      divFupa.innerHTML = data;
    })

}

