let cell=[];
let stone=[];
let drawConter = 0;
let color = 1;
let color1 ="red";
let color2 ="blue";
let actColor = color1; //Start color


$("#color").css("color", actColor);

$(".stone").draggable({
  snap: ".cell",
  start: function (event, ui) {
  
    //check color of moved stone
    let colorMoved = $(this).attr("color");
    if (colorMoved != color){
      alert("wrong colorMoved!");
    }
    //console.log("moving:" +color);
    let cellId = stone[this.id];
    //var cellId = cell.findIndex(cell => cell.occupied == "1");
    cell[cellId] = ""; // cell is empty now
    //console.log("coming from " + cellId);
  }
});

$(".cell").droppable({
  over:function(event,ui){
    let cellId = $(this).attr("id");
    let stoneId = ui.draggable.attr('id');
    
  },
  drop: function (event, ui) {
    let cellId = $(this).attr("id");
    let stoneId = ui.draggable.attr('id');
    stone[stoneId] = cellId;
    cell[cellId] = actColor;
    check(actColor);
    drawConter++;
    toggleColor();
    $("#status").html(drawConter);
    console.log(cell);
    
  }
});

function toggleColor(){
  if(actColor == color1){
    actColor=color2;
    color = 2;
  }else{
    actColor=color1;
    color=1;
  }
  //console.log(actColor);
  $("#color").css("color", actColor);
}

function check(color){
  for(i=0; i<=24; i++ ){
    if(cell[i]=="red"&&cell[i+1]==color&&cell[i+2]==color &&cell[i+3]==color){
      alert("winner");
    }


  }
}