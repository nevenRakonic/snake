window.onload = function() {
  //Snake namespace
  var Snake = {};


  Snake.posA = 0;
  Snake.posB = 0;

  Snake.canvas = document.getElementById("snake");
  Snake.main = document.getElementById("main");
  Snake.context = Snake.canvas.getContext("2d");
  //Snake.context.fillRect(0,0,10,10);


  for (var x = 0.5; x < 500; x += 10) {
    Snake.context.moveTo(x, 0);
    Snake.context.lineTo(x, 375);
  }
  for (var y = 0.5; y < 375; y += 10) {
    Snake.context.moveTo(0, y);
    Snake.context.lineTo(500, y);
  }

  Snake.context.strokeStyle = "#eee";
  Snake.context.stroke();

  /*
  Snake.animate = function(){
    Snake.posA += 10;
    Snake.posB += 10;
  }
  function start() {
    setInterval(Snake.animate, 1000);
  }
  */


}




