/* if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function() {
            console.log('Service Worker Registered');
      });
  } */

//-----------------------------------------------------
const apiUrl = 'https://sj-sam.de/apps/hubmuehle/proxy.php';
const temp1Text = document.getElementById('temp1');
const temp2Text = document.getElementById('temp2');
const temp3Text = document.getElementById('temp3');
const datumzeit = document.getElementById('datumzeit');
const exitButton = document.getElementById("navbarleft");
const reloadButton = document.getElementById('navbarright');
//----------------------------------------------------
exitButton.addEventListener('click', exit);
reloadButton.addEventListener('click', reload);

//---------------------------------------------------
function exit(){
  history.back();
}

function reload(){
  location.reload();
}
//---------------------------------------------------
var datum = new Date();

fetch(apiUrl)
.then(function(resp){
    return resp.text();
})
.then(function(data){
    let parser = new DOMParser;
    var xmlDoc = parser.parseFromString(data,'text/xml');

    var temp1 =
parseFloat(xmlDoc.getElementsByTagName('sensor1temp')[0].innerHTML)+0.8;
    var temp2 =
parseFloat(xmlDoc.getElementsByTagName('sensor2temp')[0].innerHTML)+0.8;
    var temp3 =
parseFloat(xmlDoc.getElementsByTagName('sensor3temp')[0].innerHTML)+0.8;

    datumzeit.innerHTML = datum.toLocaleString('de-DE');
    temp1Text.innerHTML = temp1.toFixed(1);
    temp2Text.innerHTML = temp2.toFixed(1);
    temp3Text.innerHTML = temp3.toFixed(1);


})
//---------------------------------------