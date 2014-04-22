window.onload = function() {
  //Snake namespace
  var Snake =  {};

  Snake.canvas = document.getElementById("snake");
  Snake.context = Snake.canvas.getContext("2d");
  Snake.context.fillRect(50,25,150,100);
}


