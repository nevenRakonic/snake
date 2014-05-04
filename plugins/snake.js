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
  var App = {};
  App.run = true;
  App.frame = 0;

  /* Snake object is used to describe the snake */
  var Snake = {};
  Snake.part_length = 20;
  Snake.height = 20;
  Snake.parts = [];
  Snake.bearing = "e";
  Snake.initialize_parts = function(snake_size){
    for (var i = 0; i < snake_size; i++){
      Snake.parts.push([i*20, 200])
    }
  }

  var canvas = document.getElementById("snake");
  var c = canvas.getContext("2d");
  /*
  function drawPartial() {
    tempPos = Snake.posA + Snake.part_length - canvas.width;
    c.fillRect(0, Snake.posB, tempPos, 20);

  }*/
  Snake.checkBoundaries = function() {

  }

  Snake.recreate = function(){
    var size = Snake.parts.length;
    var tail = Snake.parts[0];
    var head = Snake.parts[size - 1];

    if (head[0] > canvas.width - Snake.part_length*size){
      Snake.parts.shift();
      Snake.parts.push([0, head[1]]);
    }
    else {
      Snake.parts.shift();
      Snake.parts.push([head[0] + Snake.part_length, head[1]]);
    }
  }

  App.animate = function(){
    c.clearRect(0, 0,canvas.width, canvas.height);
    //foreach loop might be better
    for (var i = 0; i < Snake.parts.length; i++){
      c.fillRect(Snake.parts[i][0], Snake.parts[i][1], Snake.part_length, Snake.height);
    }
  }

  App.keyEvent = function(event){
    console.log(event.keyCode);
    if (event.keyCode === 87){
      Snake.bearing = "n";
    }
    else if (event.keyCode === 68){
      Snake.bearing = "e";
    }

  }

  App.loop = function() {
    if (App.run) {
      //game loop
      window.requestAnimFrame(App.loop);

      //lowers animation speed
      if (App.frame % 10 === 0) {
        App.animate();
        //Snake.checkBoundaries();
        Snake.recreate();
      }
      App.frame += 1;

    }
  }

  /* pre loop calls */
  // determines the initial size of the snake
  Snake.initialize_parts(8)

  /* main loop */
  App.loop();

  /* event handlers */
  window.onclick = function (){ App.run = !App.run; App.loop(); }
  window.onkeydown = App.keyEvent;

}




