let cell=[];



$(".stone").draggable({
  snap: ".cell",
  start: function (event, ui) {
    let cellId = cell.indexOf(this.id);
    //var cellId = cell.findIndex(cell => cell.occupied == "1");
    cell[cellId] = "";
    //console.log("coming from " + cellId);
  }
});

$(".cell").droppable({
  over:function(event,ui){
    let cellId = $(this).attr("id");
    let stoneId = ui.draggable.attr('id');
    if($( "#"+cellId ).data('uiDroppable')){

      $("#status").html("wrong");
    }
  },
  drop: function (event, ui) {
    let cellId = $(this).attr("id");
    let stoneId = ui.draggable.attr('id');
    cell[cellId] = stoneId;
    $("#"+cellId).droppable({drop:false}) //set actuall cell to droppable = false
    console.table(cell);
    //console.log("cellId: " + cellId + ",ballId: " + stoneId);
  }
});