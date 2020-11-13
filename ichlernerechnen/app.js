let tasten = document.getElementsByClassName("taste");
let operatoren = document.getElementsByClassName("operator");

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
let max = 20;
Array.prototype.filter.call(tasten, function(element){
    //console.log(element);
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

Array.prototype.filter.call(operatoren, function(element){
    element.addEventListener("click", function(){
        emojiFeld.innerHTML=`<img src="images/question-trans.png">`;

        ergebnisFeld.innerHTML="";
        istgleichFeld.innerHTML="=";
        if(this.id=="+"){
            operatorFeld.innerHTML="+";
            ergebnisFeld.innerHTML="";
            console.log("plusaufgabe");
            term1 = getRandomInt(max);
            term2 = getRandomInt(max);
            ergebnis = term1+term2;
            term1Feld.innerHTML=term1;
            term2Feld.innerHTML=term2;
        }
        if(this.id=="-"){
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

    });
});



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
    return Math.floor(Math.random() * Math.floor(max));
  }

  