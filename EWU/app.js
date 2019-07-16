
window.addEventListener('load', function () {
    window.history.pushState({}, '')
    aktuell();
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
const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
const pdfHolder = document.getElementById("pdfHolder");
const listView = document.getElementById("listView");
const statustext = document.getElementById("statustext");
const footline = document.getElementById("footline");
const leftImageholder = document.getElementById("leftImageholder");
const backButton = document.createElement('img');
const back2Aktuell = `<button class='backButton' onclick=aktuell()><b> << </b></button>`;
//const back2Zeitplan = `<button class='backButton' onclick=zeitplan(${turnierNr})><img src='icons//back-24-trans-black.png'></botton>`;
const loaderGif = "<img src='icons/ajax-loader.gif'>";
backButton.src = 'icons/back-24-trans-black.png';
const authKey = "Uar4nTRTqLip22l33u1wsvOqJw2LTfwe1q2ua88le1q2ua88l";
const apiProxy = "https://sj-sam.de/apps/ewu-app/proxy.php";

//----------------------------------start ---------------------------
//--------------------------------------------------------------------
function aktuell() {
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
                listItem.innerHTML = `
        <b>${name}</b><br>
        <b>${anfang}</b><br>${ort}, Nennschluss: ${nennschluss}<br>
        <button class="linkButton" onclick=zeitplan(${turnierNr})>Zeitplan</botton>
         `;
                listView.appendChild(listItem);

            });
        })
        .catch(function (e) {

            listView.innerHTML = "keine daten vorhanden";
        });
}//------------------------------------------------------------------------------

function zeitplan(turnierNr) {//----------------------------------------------------
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Zeitplan/" + turnierNr;
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = `${myJson.tunierbezeichnung}`;
            leftImageholder.innerHTML = back2Aktuell;

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
                listItem.innerHTML = `
        <b>${wochenTag}, ${startZeit} ${eintrag}</b><br>
        ${reitplatz},  Nennungen: ${anzahlNennungen}<br>
        <button class="linkButton" onclick=startliste(${turnierNr},${pruefungsNr})>Startliste</botton>
        <button class="linkButton" onclick=pattern(${turnierNr},${pruefungsNr})>Pattern</botton>
        <button class="linkButton" onclick=ergebnis(${turnierNr},${pruefungsNr})>Ergebnis</botton>
        `;
                listView.appendChild(listItem);
            });
        })
        .catch(function (e) {
            listView.innerHTML = "keine daten vorhanden";
        });
}//---------------------------------------------------------------------------------------------


function startliste(turnierNr, pruefungsNr) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Startliste/" + pruefungsNr;
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = `${myJson.pruefungKurz}`;
            leftImageholder.innerHTML = `<button class='backButton' onclick=zeitplan(${turnierNr})><b> << </b></button>`;
            
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
            listView.innerHTML = "keine daten vorhanden";
        });
}//---------------------------------------------------------------------------------------------

function ergebnis(turnierNr, pruefungsNr) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Ergebnis/" + pruefungsNr;
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = `${myJson.pruefungKurz}`;
            leftImageholder.innerHTML = `<button class='backButton' onclick=zeitplan(${turnierNr})><b> << </b></button>`;
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
        });
}//---------------------------------------------------------------------------------------------

function pattern(turnierNr, pruefungsNr) {
    listView.innerHTML = "";
    statustext.innerHTML = loaderGif;
    var uri = apiProxy + "?a=Turniere/Pattern/" + pruefungsNr;
   
    fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            statustext.innerHTML = "Pattern";
            leftImageholder.innerHTML = `<button class='backButton' onclick=zeitplan(${turnierNr})><b> << </b></button>`;
            
            pdfHolder.innerHTML="";
            
            var b64 = myJson.patternPdf;
            var obj = document.createElement('object');
            obj.style.width = '100%';
            obj.style.height = '1pt';
            obj.data = '';//empty it
            obj.type = 'application/pdf';
            obj.data = 'data:application/pdf;base64,' + b64;
            pdfHolder.appendChild(obj);

            
        })
        .catch(function (e) {
            listView.innerHTML = "kein Pdf vorhanden";
        });
}//---------------------------------------------------------------------------------------------