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
  //is used to bind keyevents to the direction of snake,
  //n = north, e = east etc.
  App.eventDict = {87: 'n', 68: 'e', 65: 'w', 83: 's'}

  /* Snake object is used to describe the snake */
  var Snake = {};
  Snake.part_length = 20;
  Snake.height = 20;
  Snake.parts = [];
  Snake.direction = 'e';


  var canvas = document.getElementById("snake");
  var c = canvas.getContext("2d");
  /*
  function drawPartial() {
    tempPos = Snake.posA + Snake.part_length - canvas.width;
    c.fillRect(0, Snake.posB, tempPos, 20);

  }*/
  Snake.checkBoundaries = function() {

  }

  Snake.initializeParts = function(snake_size){
    for (var i = 0; i < snake_size; i++){
      Snake.parts.push([i*20, 200])
    }
  }

  Snake.borderDetect = function(head, size){

    if (head[0] > canvas.width - Snake.part_length*size){
      Snake.parts.shift();
      Snake.parts.push([0, head[1]]);
    }

  }

  Snake.move = function(head, size) {

    Snake.parts.shift();
    switch(Snake.direction){
      case 'e':
        Snake.parts.push([head[0] + Snake.part_length, head[1]]);
        break;
      case 'w':
        Snake.parts.push([head[0] - Snake.part_length, head[1]]);
        break;
      case 'n':
        Snake.parts.push([head[0], head[1] - Snake.part_length]);
        break;
      case 's':
        Snake.parts.push([head[0], head[1] + Snake.part_length]);
        break;

    }



  }

  Snake.recreate = function(){
    var size = Snake.parts.length;
    var tail = Snake.parts[0];
    var head = Snake.parts[size - 1];

    //Snake.borderDetect(head, size);
    Snake.move(head, size);

  }



  App.draw = function(){
    c.clearRect(0, 0,canvas.width, canvas.height);
    //foreach loop might be better
    for (var i = 0; i < Snake.parts.length; i++){
      c.fillRect(Snake.parts[i][0], Snake.parts[i][1], Snake.part_length, Snake.height);
    }
  }

  App.keyEvent = function(event){
    var possible_direction = App.eventDict[event.keyCode];
    if (possible_direction !== undefined)
      Snake.direction = possible_direction; console.log(Snake.direction);
  }

  App.loop = function() {
    if (App.run) {
      //game loop
      window.requestAnimFrame(App.loop);

      //lowers animation speed
      if (App.frame % 8 === 0) {
        App.draw();
        //Snake.checkBoundaries();
        Snake.recreate();
      }
      App.frame += 1;

    }
  }

  /* pre loop calls */
  // determines the initial size of the snake
  Snake.initializeParts(8)

  /* main loop */
  App.loop();

  /* event handlers */
  window.onclick = function (){ App.run = !App.run; App.loop(); }
  window.onkeydown = App.keyEvent;

}




