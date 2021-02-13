

//aoe= 09171 -- 226
//mue= 09183 -- 238
//const landkreis="09183";
//const landkreis="09171";

const landkreise = [
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

// const uri_new_cases = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=(NeuerFall%20IN(1%2C%20-1))%20AND%20(IdLandkreis%3D%27${landkreisId}%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlFall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true`;
// const uri_new_death_cases =`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=(NeuerTodesfall%20IN(1%2C%20-1))%20AND%20(IdLandkreis%3D%27${landkreisId}%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlTodesfall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true`;

landkreise.forEach(function (element, i) {
  var name = element.name;
  promises.push(getName(element));
  promises.push(getAllCases(element.objektId, i));
  promises.push(getNewCases(element.landkreisId, i));
  promises.push(getAllDeath(element.objektId, i));
  promises.push(getInzidenz7(element.objektId, i));

})

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

//lastUpdate.innerHTML="<img src='icons/loader.gif'></img>";
lastUpdateSpan.innerHTML = "loading Data....";

Promise.all(promises)
.then(function (result) {
  console.log(result);
  loader.style.display='none';
  drawTable(result);
})
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
