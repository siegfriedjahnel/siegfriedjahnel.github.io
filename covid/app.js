



const alle = [
  { "name": "D", "AdminUnitId": "0", "BundeslandId": "0" },
  { "name": "Bay", "AdminUnitId": "9", "BundeslandId": "9" },
  { "name": "AÖ", "AdminUnitId": "9171", "BundeslandId": "9" },
  { "name": "MÜ", "AdminUnitId": "9183", "BundeslandId": "9" },
  { "name": "TS", "AdminUnitId": "9189", "BundeslandId": "9" },
  { "name": "RO", "AdminUnitId": "9187", "BundeslandId": "9" },
  { "name": "Rottal", "AdminUnitId": "9277", "BundeslandId": "9" },

];const landkreise = [
  { "name": "AÖ", "landkreisId": "09171", "objektId": "226" },
  { "name": "MÜ", "landkreisId": "09183", "objektId": "238" },
  { "name": "TS", "landkreisId": "09189", "objektId": "244" },
  { "name": "RO", "landkreisId": "09187", "objektId": "242" },
  { "name": "Rottal", "landkreisId": "09277", "objektId": "255" },

];



const lastUpdateSpan = document.getElementById("lastUpdate");
const loader = document.getElementById("loader");
var row = [];
var table = [];
var promises = [];

//https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_key_data_v/FeatureServer/0/query?f=json
//&where=(BundeslandId=${BundeslandId}) AND (AdmUnitId=${AdminUnitId})
//&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=AdmUnitId asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true
//
//features[0].attributes.AnzFall
//features[0].attributes.AnzFallNeu
//features[0].attributes.AnzTodesfall
//features[0].attributes.AnzTodesfallNeu
//features[0].attributes.Inz7T


landkreise.forEach(function (element, i) {
  var name = element.name;
  promises.push(getName(element));
  promises.push(getAllCases(element.objektId, i));
  promises.push(getNewCases(element.landkreisId, i));
  promises.push(getAllDeath(element.objektId, i));
  promises.push(getInzidenz7(element.objektId, i));

})

alle.forEach(function(element){
  getAllData(element.name, element.BundeslandId,element.AdminUnitId);
  // console.log("element: "+element.AdminUnitId);
})
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

//lastUpdate.innerHTML="<img src='icons/loader.gif'></img>";
lastUpdateSpan.innerHTML = "loading Data....";

Promise.all(promises)
.then(function (result) {
  //console.log(result);
  loader.style.display='none';
  drawTable(result);
})
//---------------
function getAllData(Name, BundeslandId, AdminUnitId){
  let uri = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_key_data_v/FeatureServer/0/query?f=json&where=(BundeslandId=${BundeslandId})%20AND%20(AdmUnitId=${AdminUnitId})%20&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=AdmUnitId%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true`;
  fetch(uri)
  .then(response => response.json())
  .then(data => {
    let attr = data.features[0].attributes;
    console.log(Name + "-" + attr.AnzFall + "-" + attr.AnzFallNeu+ "-" + attr.AnzTodesfall + "-" + attr.AnzTodesfallNeu+ "-" + attr.Inz7T);
  })

  //.then(data => console.log(Name +": " +data.features[0].attributes.AnzFall+"-"+data.features[0].attributes.AnzFallNeu));
}



//----------------------------
getLastUpdate();
function getLastUpdate() {
  const uri = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0?f=json";
  fetch(uri, { method: 'HEAD' })
    .then(function (response) {
      let lastUpdate = new Date(response.headers.get("last-modified"));
      console.log(lastUpdate.toLocaleDateString('de-DE', options));
      lastUpdateSpan.innerHTML = lastUpdate.toLocaleDateString('de-DE', options);
    })
}
function getName(element) {
  let promise = new Promise(function (resolve, reject) {
    let name = element.name;
    resolve(name);
  })
  return promise;

}

async function getAllCases(objektId, i) {
  const uri_all_cases = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=OBJECTID%3D${objektId}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22cases%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true`;
  let response = await fetch(uri_all_cases);
  let data = await response.json();
  return data.features[0].attributes.value;
}

async function getInzidenz7(objektId, i) {
  const uri_all_cases = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=OBJECTID%3D${objektId}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=county%20asc&outSR=102100&resultOffset=0&resultRecordCount=500&resultType=standard&cacheHint=true`;
  let response = await fetch(uri_all_cases);
  let data = await response.json();
  //return data.features[0].attributes.value;
  return data.features[0].attributes.cases7_per_100k_txt;
}


async function getNewCases(landkreisId, i) {
  const uri_new_cases = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=(NeuerFall%20IN(1%2C%20-1))%20AND%20(IdLandkreis%3D%27${landkreisId}%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlFall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true`;

  let response = await fetch(uri_new_cases);
  let data = await response.json();
  if ((data.features[0].attributes.value === null)) {
    return "-";
  } else {
    return data.features[0].attributes.value;
  }
}

async function getNewDeath(landkreisId, i) {
  const uri_new_death = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=(NeuerTodesfall%20IN(1%2C%20-1))%20AND%20(IdLandkreis%3D%27${landkreisId}%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlTodesfall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true`;

  let response = await fetch(uri_new_death);
  let data = await response.json();
  if ((data.features[0].attributes.value === null)) {
    return "-";
  } else {
    return data.features[0].attributes.value;
  }
}

async function getAllDeath(objektId, i) {
  const uri_all_death = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=OBJECTID%3D${objektId}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22deaths%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true`;
  
  let response = await fetch(uri_all_death);
  let data = await response.json();
  if ((data.features[0].attributes.value === null)) {
    return "-";
  } else {
    return data.features[0].attributes.value;
  }
}

function drawTable(result) {
  landkreise.forEach(function (element, i) {
    let row = `<tr><td>${result[0 + i * 4 + i]}</td><td>${result[1 + i * 4 + i]}</td><td>${result[2 + i * 4 + i]}</td><td>${result[3 + i * 4 + i]}</td><td>${result[4 + i * 4 + i]}</td></tr>`;
    let table = document.getElementById("newTable");
    var newRow = document.createElement('tr');
    newRow.innerHTML = row;
    table.appendChild(newRow);
  })
}
//-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
