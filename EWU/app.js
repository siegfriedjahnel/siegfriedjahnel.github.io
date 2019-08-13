
window.addEventListener('load', function () {
    window.history.pushState({}, '')
    aktuell(0);
})

window.addEventListener('popstate', function () {
    window.history.pushState({}, '')
})
//----------------------------------------------------------

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
        navigator.serviceWorker.register('sw.js')
            .catch(err => 'SW registration failed'));
}

//----------------------------------------------------------
var parentId = 0;
var back2Aktuell = "";
const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
const patternHolder = document.getElementById("patternHolder");
const listView = document.getElementById("listView");
const statustext = document.getElementById("statustext");
const footline = document.getElementById("footline");
const leftImageholder = document.getElementById("leftImageholder");

//const back2Zeitplan = `<button class='backButton' onclick=zeitplan(${turnierNr})><img src='icons//back-24-trans-black.png'></botton>`;
const loaderGif = "<img src='icons/ajax-loader.gif'>";

const authKey = "Uar4nTRTqLip22l33u1wsvOqJw2LTfwe1q2ua88le1q2ua88l";
const apiProxy = "https://sj-sam.de/apps/ewu-app/proxy2.php";
//----------------------------------start ---------------------------
//--------------------------------------------------------------------
function aktuell(turnierNr) {
   
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    leftImageholder.innerHTML = "";
   
    var uri = apiProxy + "?a=Turniere/Aktuell";
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            listView.innerHTML = "";
            statustext.innerHTML = "Alle Turniere";

            var turniere = myJson.turnierLightList;
            turniere.sort(function (a, b) {
                return b.anfang.localeCompare(a.anfang);
            });
            turniere.forEach(turnier => {
                var turnierbeginn = new Date(turnier.anfang);
                var nennschluss = new Date(turnier.nennschluss);
                var turnierNr = turnier.turnierNr;
                var name = turnier.name;
                var ort = turnier.ort;
                var anfang = turnierbeginn.toLocaleDateString('de-DE', options);
                var nennschluss = nennschluss.toLocaleDateString('de-DE', options);
                var listItem = document.createElement('li');
                listItem.setAttribute("id", turnierNr);
                listItem.innerHTML = `
        <b>${name}</b><br>
        <b>${anfang}</b><br>${ort}, Nennschluss: ${nennschluss}<br>
        <button class="linkButton" onclick="zeitplan(${turnierNr},0)">Zeitplan</botton>
        <button class="linkButton" onclick="news(${turnierNr}, 0)">News</botton>
        <button class="linkButton" onclick="kontakt(${turnierNr}, 0)">Kontakt</botton>
         `;
                listView.appendChild(listItem);

            });
            if(turnierNr != 0){
                document.getElementById(turnierNr).scrollIntoView();
            }
        })
        .catch(function (e) {

            listView.innerHTML = "keine daten vorhanden";
            statustext.innerHTML = "";
        });
}//------------------------------------------------------------------------------

function zeitplan(turnierNr, pruefungsNr) {//----------------------------------------------------
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Zeitplan/" + turnierNr;
  
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = `${myJson.tunierbezeichnung}`;
            
            var pruefungen = myJson.zeitplan;
            pruefungen.forEach(pruefung => {
                var pruefungsNr = pruefung.id;
                var eintrag = pruefung.eintrag;
                var reitplatz = pruefung.reitplatz;
                var tagDatum = new Date(pruefung.tagDatum);
                var startZeit = pruefung.startZeit.substring(0, 5);
                tagDatum = tagDatum.toLocaleDateString('de-DE', options);
                var wochenTag = tagDatum.substring(0, 2);
                var anzahlNennungen = pruefung.anzahlNennungen;
                var listItem = document.createElement('li');
                listItem.setAttribute("id", pruefungsNr);
                listItem.innerHTML = `
        <b>${wochenTag}, ${startZeit} ${eintrag}</b><br>
        <b>${reitplatz}</b>,  Nennungen: ${anzahlNennungen}<br>
        <button class="linkButton" onclick="startliste(${pruefungsNr},${turnierNr})">Startliste</botton>
        <button class="linkButton" onclick="pattern(${pruefungsNr},${turnierNr})">Pattern</botton>
        <button class="linkButton" onclick="ergebnis(${pruefungsNr},${turnierNr})">Ergebnis</botton>
        `;
                listView.appendChild(listItem);
            });
            if(pruefungsNr != 0){
                document.getElementById(pruefungsNr).scrollIntoView();
            }

        })
        .catch(function (e) {
            listView.innerHTML = "keine daten vorhanden";
            statustext.innerHTML = "";
        });
        leftImageholder.innerHTML = `<button class='backButton' onclick="aktuell(${turnierNr})"><b> << </b></button>`;
}//---------------------------------------------------------------------------------------------


function startliste(pruefungsNr, turnierNr) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Startliste/" + pruefungsNr;
    
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = `${myJson.pruefungKurz}`;
                        
            var reiters = myJson.reiterList;
            reiters.forEach(reiter => {
                var position = reiter.position;
                var startNr = reiter.startNr;
                var reiterName = reiter.reiter;
                var pferdeName = reiter.pferd;
                var listItem = document.createElement('li');
                listItem.innerHTML = `
        <b>${position} |  ${reiterName} (${startNr})</b> ${pferdeName} `;
                listView.appendChild(listItem);
            });
        })
        .catch(function (e) {
            statustext.innerHTML = "";
            listView.innerHTML = "keine Startliste vorhanden";
        });
        leftImageholder.innerHTML = `<button class='backButton' onclick="zeitplan(${turnierNr},${pruefungsNr})"><b> << </b></button>`;
}//---------------------------------------------------------------------------------------------

function ergebnis(pruefungsNr, turnierNr) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var richterNr = 1;
    
    var uri = apiProxy + "?a=Turniere/Ergebnis/" + pruefungsNr + "/" +richterNr;
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = `${myJson.pruefungKurz}`;
           
            var reiters = myJson.reiterList;
            var richter = myJson.richter;
            var listHead = document.createElement('li');
            listHead.innerHTML = `<h3>Richter: ${richter}</h3>`;
            listView.appendChild(listHead);
            reiters.sort(function (a, b) {
                return a.position - b.position;
            });
            reiters.forEach(reiter => {
                var position = reiter.position;
                var score = reiter.score;
                var reiterName = reiter.reiter;
                var pferdeName = reiter.pferd;
                var listItem = document.createElement('li');
                listItem.innerHTML = `
        <b>${position} |  ${reiterName} </b> ${pferdeName}(${score}) `;
                listView.appendChild(listItem);
            });
        })
        .catch(function (e) {
            listView.innerHTML = "keine daten vorhanden";
            statustext.innerHTML = "";
        });
        leftImageholder.innerHTML = `<button class='backButton' onclick="zeitplan(${turnierNr}, ${pruefungsNr})"><b> << </b></button>`;
}//---------------------------------------------------------------------------------------------

function pattern(pruefungsNr, turnierNr) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Pattern/" + pruefungsNr;
   
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = "Pattern";
            var i64 = myJson.patternImage;
            patternHolder.innerHTML=`<img src="data:image/jpg;base64, ${i64}" width=100%>`;
            
        })
        .catch(function (e) {
            patternHolder.innerHTML="";
            listView.innerHTML = "keine Pattern vorhanden";
            statustext.innerHTML = "";
        });
        leftImageholder.innerHTML = `<button class='backButton' onclick="zeitplan(${turnierNr},${pruefungsNr})"><b> << </b></button>`;
}//---------------------------------------------------------------------------------------------

function news(turnierNr,dir) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/News/" + turnierNr;
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = "News";
            var newsList = myJson.newsList;
            newsList.forEach(news => {
                var plainText = news.plainText;
                var datum = new Date(news.timestamp);
                datum = datum.toLocaleDateString('de-DE', options);
                var listItem = document.createElement('li');
                listItem.innerHTML = `${datum} |  ${plainText}`;
                listView.appendChild(listItem);
            });
        })
        .catch(function (e) {
            listView.innerHTML = "keine daten vorhanden";
            statustext.innerHTML = "";
        });
        leftImageholder.innerHTML = `<button class='backButton' onclick="aktuell(${turnierNr},'back')"><b> << </b></button>`;
}//---------------------------------------------------------------------------------------------

function kontakt(turnierNr, dir) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Kontakt/" + turnierNr;
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = "Kontakte";
            var contactList = myJson.contactList;
            contactList.forEach(contact => {
                var name = contact.name;
                var funktion = contact.function;
                var mobile = contact.mobile;
                
                var listItem = document.createElement('li');
                listItem.innerHTML = `${name} |  ${funktion} | ${mobile}`;
                listView.appendChild(listItem);
            });
        })
        .catch(function (e) {
            listView.innerHTML = "keine daten vorhanden";
            statustext.innerHTML = "";
        });
        leftImageholder.innerHTML = `<button class='backButton' onclick="aktuell(${turnierNr},'back')"><b> << </b></button>`;
}//---------------------------------------------------------------------------------------------
