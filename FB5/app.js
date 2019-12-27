//---------------Service worker-------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .catch(err => 'SW registration failed'));
}
//----------------------------------------------------------

var offlineText = "Achtung! Sie sind offline. Die Daten können veraltet sein!";
window.addEventListener("load", function (e) {
  if (!navigator.onLine) onlinestatus.innerHTML = offlineText;
});
window.addEventListener("offline", function (e) { onlinestatus.innerHTML = offlineText; });

window.addEventListener("online", function (e) { onlinestatus.innerHTML = ""; });

//-----------------add a method to Date-Class---------------------------------
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}//-------------------------------------------

//---------------------------Settings-----------------------------------------------------------------
var seasonId = "2019";
var competitionId = "22";
var competitionName = "";
var teamNames = [];
var matches = [];
var table = [];
var teamNamesForCompetions = [];
var teamNamesForLigas = [];
var actuelMatchDay;
var matchDay;

//------------DOM-Settings-----------------------------------------------------------------------------

const matchdayContainer = document.getElementById('matchdayContainer');
const resultsTableBody = document.getElementById('resultsTableBody');
const tableTableBody = document.getElementById('tableTableBody');
const minusButton = document.getElementById('minusButton');
const plusButton = document.getElementById('plusButton');
const onlinestatus = document.getElementById('onlinestatus');

const divFupa = document.getElementById("divFupa");
const competitionButtons = document.getElementsByClassName('competitionButtons');
const refreshButton = document.getElementById('refreshButton');


document.getElementById("bl1").addEventListener("click", function () {
  competitionName = this.innerHTML;
  competitionId = "22";
  getMatchData();
});
document.getElementById("bl2").addEventListener("click", function () {
  competitionName = this.innerHTML;
  competitionId = "87";
  getMatchData();
});
document.getElementById("bl3").addEventListener("click", function () {
  competitionName = this.innerHTML;
  competitionId = "374";
  getMatchData();
});
document.getElementById("cl").addEventListener("click", function () {
  competitionName = this.innerHTML;
  competitionId = "5";
  getMatchData();
});
document.getElementById("el").addEventListener("click", function () {
  competitionName = this.innerHTML;
  competitionId = "6";
  getMatchData();
});
document.getElementById("dfb").addEventListener("click", function () {
  competitionName = this.innerHTML;
  competitionId = "231";
  getMatchData();

});
document.getElementById("live").addEventListener("click", function () {
  competitionName = this.innerHTML;
  getLiveData();

});
document.getElementById("today").addEventListener("click", function () {
  competitionName = this.innerHTML;
  getTodayData();

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
  matchDay--;
  drawLigaResults();
});

plusButton.addEventListener('click', function () {
  matchDay++;
  drawLigaResults();
});

refreshButton.addEventListener('click', function () {
  getMatchData();
});



//--------------End of DOM-Settings-----------------------------------------------


function getMatchData() {
  resultsTableBody.innerHTML = "loading!";
  matchdayContainer.innerHTML = "";
  tableTableHead.innerHTML = "";
  tableTableBody.innerHTML = "";
  divFupa.innerHTML = "";
  //-----------------get matchday-----------------------------------------------------
  const route2 = "https://liveticker.stroeerdp.de/rest/widget/result/competition/" + competitionId + "/matchday/";
  fetch(route2)
    .then(function (response) {
      if (response.ok)
        return response.json();
      else
        throw new Error('Fehler beim laden');
    })
    .then(function (json) {
      matchDay = json.config.currentMatchday;

    })//----------------------------------------------------------------------------------------------

  const route = "https://dts.stroeerdp.de/rest/getdata/?id=1&competitionId=" + competitionId + "&seasonId=" + seasonId;
  fetch(route)
    .then(function (response) {
      if (response.ok)
        return response.json();
      else
        throw new Error('Fehler beim laden');
    })
    .then(function (json) {
      teamNames = json.data.SoccerFeed.Team;
      matches = json.data.SoccerFeed.MatchData;
      teamNames.forEach(team => teamNamesForCompetions[team.uID] = team.Name);
      console.log(teamNamesForCompetions);
      drawLigaResults();

    })
  const route3 = "https://dts.stroeerdp.de/rest/getdata/?id=2&competitionId=" + competitionId + "&seasonId=" + seasonId;
  fetch(route3)
    .then(function (response) {
      if (response.ok)
        return response.json();
      else
        throw new Error('Fehler beim laden');

    })
    .then(function (json) {
      table = json.data.SoccerFeed.Competition.TeamStandings.TeamRecord;
      if (table.length > 0) {

        json.data.SoccerFeed.Team.forEach(team => teamNamesForLigas[team.uID] = team.Name);
        drawTable();
        tableTableHead.innerHTML = `<th>&nbsp;</th><th>Verein</th><th>Sp</th><th>Pu</th><th>TV</th>`;
        console.log(table);
      }
    })


}//--------------End of function getMatchData--------------------------------------------------


function drawLigaRow(match) {

  if (typeof match.MatchInfo.Date === "string") {
    var dateString = match.MatchInfo.Date;
  } else {
    var dateString = match.MatchInfo.Date._;
  }


  var date = new Date(dateString).addHours(1).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });



  if (match.TeamData[0].Score) {
    var result = match.TeamData[0].Score + ":" + match.TeamData[1].Score;
  } else {
    var result = "-:-";
  }
  if (match.MatchInfo.MatchDay == matchDay) {
    return `<tr>
    <td>${date}</td>
    <td>${teamNamesForCompetions[match.TeamData[0].TeamRef]}<br>${teamNamesForCompetions[match.TeamData[1].TeamRef]}</td>
    <td>${result}</td>
    </tr>`;
  }
}

function drawLigaResults() {
  matchdayContainer.innerHTML = competitionName + "<br>" + matchDay;
  resultsTableBody.innerHTML = matches.map(drawLigaRow).join('\n');

}

function getLiveData() {
  resultsTableBody.innerHTML = "loading!";
  matchdayContainer.innerHTML = "";
  tableTableHead.innerHTML = "";
  tableTableBody.innerHTML = "";
  divFupa.innerHTML = "";
  const route = "https://liveticker.stroeerdp.de/rest/livematches/desktop/";
  fetch(route)
    .then(function (response) {
      if (response.ok)
        return response.json();
      else
        throw new Error('Fehler beim laden');
    })
    .then(function (json) {
      if (json.length > 0) {
        matches = json;
        drawLiveResults();
      } else {
        resultsTableBody.innerHTML = "<tr><td colspan=3>keine Live-Spiele</td></tr>";
      }


    })//----------------------------------------------------------------------------------------------
}

function drawLiveRow(match) {
  if (match.period == "Live") {
    var c = "live";
  } else {
    var c = "notlive";
  }
  return `<tr><td class='${c}'>${match.time}</td><td>${match.homeName.Name}<br>${match.awayName.Name}</td><td>${match.homeScore}:${match.awayScore}</td></tr>`;
}

function drawLiveResults() {
  resultsTableBody.innerHTML = matches.map(drawLiveRow).join('\n');
}

function getTodayData() {
  resultsTableBody.innerHTML = "loading!";
  matchdayContainer.innerHTML = "";
  tableTableHead.innerHTML = "";
  tableTableBody.innerHTML = "";
  divFupa.innerHTML = "";
  const route = "https://liveticker.stroeerdp.de/rest/widget/result/competition/0/matchday/";
  fetch(route)
    .then(function (response) {
      if (response.ok)
        return response.json();
      else
        throw new Error('Fehler beim laden');
    })
    .then(function (json) {

      if (json.matches.length > 0) {
        matches = json.matches;
        drawTodayResults();
      } else {
        resultsTableBody.innerHTML = "<tr><td colspan=3>keine Live-Spiele</td></tr>";
      }
    })//----------------------------------------------------------------------------------------------
}

function drawTodayRow(match) {
  if (match.period == "Live") {
    var c = "live";
  } else {
    var c = "notlive";
  }
  if (match.header) {
    return `<tr><td colspan=3>${match.header}</td></tr>`;
  } else {
    return `<tr><td class='${c}'c>${match.time}</td><td>${match.homeTeamName}<br>${match.awayTeamName}</td><td>${match.homeScore}:${match.awayScore}</td></tr>`;
  }
}

function drawTodayResults() {
  resultsTableBody.innerHTML = matches.map(drawTodayRow).join('\n');
}


function drawTable() {
  tableTableBody.innerHTML = table.map(drawTableRow).join('\n');
}

function drawTableRow(t) {
  var tv = parseInt(t.Standing.For) - parseInt(t.Standing.Against);
  return `<tr>
    <td>${t.Standing.Position}</td>
    <td>${teamNamesForLigas[t.TeamRef]}</td>
    <td>${t.Standing.Played}</td>
    <td>${t.Standing.Points}</td>
    <td>${tv}</td>
    </tr>`;


}

function getFupaData(w) {
  resultsTableBody.innerHTML = "";
  matchdayContainer.innerHTML = "";
  tableTableHead.innerHTML = "";
  tableTableBody.innerHTML = "";
  divFupa.innerHTML = "loading!";
  var uri = "https://sj-sam.de/apps/fb5/proxy2.php?w="+w;
  fetch(uri)
    .then(function (response) {
      console.log(response);
      return response.text();
    })
    .then(function (data) {
      divFupa.innerHTML = data;
    })

}
// function getFupaSpielplan() {
//   resultsTableBody.innerHTML = "";
//   matchdayContainer.innerHTML = "";
//   tableTableHead.innerHTML = "";
//   tableTableBody.innerHTML = "";
//   divSpielplan.innerHTML = "loading!";
//   divTabelle.innerHTML = "";
//   var uri = "https://sj-sam.de/apps/fb5/proxy2.php?w=spielplan";
//   fetch(uri)
//     .then(function (response) {
//       console.log(response);
//       return response.text();
//     })
//     .then(function (data) {
//       divSpielplan.innerHTML = data;
//     })

// }

