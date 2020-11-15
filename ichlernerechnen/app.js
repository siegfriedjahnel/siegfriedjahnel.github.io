navigator.serviceWorker.register('sw.js');

let tasten = document.getElementsByClassName("taste");
let operatoren = document.getElementsByClassName("operator");

let btn10 = document.getElementById("btn10");
let btn20 = document.getElementById("btn20");
let btn50 = document.getElementById("btn50");

let ergebnisFeld = document.getElementById("ergebnisFeld");
let operatorFeld = document.getElementById("operatorFeld");
let term1Feld = document.getElementById("term1Feld");
let term2Feld = document.getElementById("term2Feld");
let istgleichFeld = document.getElementById("istgleichFeld");
let emojiFeld = document.getElementById("emoji");
let term1;
let term2;
let operator;
let ergebnis;
let max = 10; //die maximalen Zahlen
btn10.style.backgroundColor = "lime";

//-----------------------------------------
btn10.addEventListener("click", function(){
    max = this.value;
    btn10.style.backgroundColor = "lime";
    btn20.style.backgroundColor = "white";
    btn50.style.backgroundColor = "white";
})

btn20.addEventListener("click", function(){
    max = this.value;
    btn20.style.backgroundColor = "lime";
    btn10.style.backgroundColor = "white";
    btn50.style.backgroundColor = "white";
})

btn50.addEventListener("click", function(){
    max = this.value;
    btn50.style.backgroundColor = "lime";
    btn20.style.backgroundColor = "white";
    btn10.style.backgroundColor = "white";
})

//-----------------------
//------------------ Tastatur------------------------
Array.prototype.filter.call(tasten, function(element){
    element.addEventListener("click", function(){
        if(this.value =="clear"){
            ergebnisFeld.innerHTML="";
        }else if(this.value=="enter"){
                check(ergebnisFeld.innerHTML)
        }else{
            ergebnisFeld.innerHTML += this.value;
        }
    })
});
//------------------------------------------------------

//--------------- Steuerung-------------------------------
Array.prototype.filter.call(operatoren, function(element){
    element.addEventListener("click", function(){
        emojiFeld.innerHTML=`<img src="images/question-trans.png">`;
        ergebnisFeld.innerHTML="";
        istgleichFeld.innerHTML="=";

        if(this.value == "+"){
            operatorFeld.innerHTML="+";
            ergebnisFeld.innerHTML="";
            console.log("plusaufgabe");
            term1 = getRandomInt(max);
            term2 = getRandomInt(max);
            ergebnis = term1+term2;
            term1Feld.innerHTML=term1;
            term2Feld.innerHTML=term2;
        }
        if(this.value == "-"){
            operatorFeld.innerHTML="-";
            console.log("minusaufgabe");
            term1 = getRandomInt(max);
            term2 = getRandomInt(max);
            if(term1>term2){
                ergebnis = term1-term2;
                term1Feld.innerHTML=term1;
                term2Feld.innerHTML=term2;
            }else{
                ergebnis = term2-term1;
                term1Feld.innerHTML=term2;
                term2Feld.innerHTML=term1;
            }
        }
        if(this.value == "x"){
            operatorFeld.innerHTML="x";
            term1 = getRandomInt(max);
            term2 = getRandomInt(max);
            ergebnis = term1 * term2;
            term1Feld.innerHTML=term1;
            term2Feld.innerHTML=term2;
        }
        if(this.value == "/"){
            operatorFeld.innerHTML="/";
            term1 = getRandomInt(max);
            term2 = getRandomInt(max);
            let mult = term1*term2;
            term1Feld.innerHTML = mult;
            term2Feld.innerHTML = term1;
            ergebnis = term2;
            

        }
    });
});
//------------------------------------------------------


function check(vorschlag){
    if(ergebnis==vorschlag){
        console.log("Richtig");
        emojiFeld.innerHTML=`<img src="images/happy-trans.png">`;

        //PlaySound("good");
    }else{
        //PlaySound("bad");
        ergebnisFeld.innerHTML="";
        emojiFeld.innerHTML=`<img src="images/sad-trans.png">`;

    }

}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))+1;
  }

  