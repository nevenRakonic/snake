window.onload = function() {
  //snake should be a stack with parts that are pushed/poped every key event (direction change)
  //shim layer with setTimeout fallback
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
  App.frame = 0;

  /* Snake object is used to describe the snake */
  var Snake = {};
  //Snake.posA = 0;
  //Snake.posB = 0;
  Snake.length = 30;
  Snake.height = 20;
  Snake.parts = [[0,0],[30,0]];

  var canvas = document.getElementById("snake");
  var c = canvas.getContext("2d");
  //c.fillStyle = "rgb(200,0,0)";
  //c.fillRect(Snake.posA, Snake.posB, 55, 20);
  /*
  function drawPartial() {
    tempPos = Snake.posA + Snake.length - canvas.width;
    c.fillRect(0, Snake.posB, tempPos, 20);

  }*/
  App.animate = function(){
    c.clearRect(0, 0,canvas.width, canvas.height);
    //foreach loop could be better
    for (var i = 0; i < Snake.parts.length; i++){
      c.fillRect(Snake.parts[i][0], Snake.parts[i][1], Snake.length, Snake.height);
    }

    Snake.parts.shift();
    Snake.parts.push([Snake.parts[0][0] + Snake.length, 0, Snake.length, Snake.height]);
    App.frame += 1;
  }

  App.loop = function() {
    if (App.run) {
      //game loop
      window.requestAnimFrame(App.loop);

      //lowers animation speed
      if (App.frame % 10 === 0) {
        App.animate();
      }
      else  {
        App.frame += 1;
      }
    }
  }

  App.loop();
  window.onclick = function (){ App.run = !App.run; App.loop(); }

}




