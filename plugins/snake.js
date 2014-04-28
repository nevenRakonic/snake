window.onload = function() {

  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  /* App object is related to general running */
  var App = {}
  App.run = true;

  /* Snake object is used to describe the snake */
  var Snake = {};
  Snake.posA = 0;
  Snake.posB = 0;
  Snake.length = 55;
  Snake.height = 20;

  var canvas = document.getElementById("snake");
  var c = canvas.getContext("2d");
  //c.fillStyle = "rgb(200,0,0)";
  //c.fillRect(Snake.posA, Snake.posB, 55, 20);
  function drawPartial() {
    tempPos = Snake.posA + Snake.length - canvas.width;
    c.clearRect(0, Snake.posB, tempPos, 20);
    c.fillRect(0, Snake.posB, tempPos, 20);

  }

  App.loop = function() {
    if (App.run) {
    window.requestAnimFrame(App.loop);
    c.clearRect(Snake.posA, Snake.posB, Snake.length, Snake.height);

    if (Snake.posA  > canvas.width){
      Snake.posA = 0;
    }
    else if ((Snake.posA + Snake.length) > canvas.width){
      drawPartial();
      Snake.posA += 3;
    }
    else {
      Snake.posA += 3;
    }

    //c.fillStyle = "rgb(200,0,0)";
    c.fillRect(Snake.posA, Snake.posB, Snake.length, Snake.height);

    }
  }

  App.loop();
  window.onclick = function (){ App.run = !App.run; App.loop();}

}




