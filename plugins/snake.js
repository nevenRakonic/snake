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
  //each part of the snake is an array that shows X,Y position of that part
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

  Snake.borderDetect = function(head){

    var border_crossed = false;

    if (head[0] > canvas.width - Snake.part_length){
      Snake.parts.shift();
      Snake.parts.push([0, head[1]]);
      border_crossed = true;
    }
    else if (head[0] < 0){
      Snake.parts.shift();
      Snake.parts.push([canvas.width - Snake.part_length, head[1]]);
      border_crossed = true;
    }
    else if (head[1] < 0 ){
      Snake.parts.shift();
      Snake.parts.push([head[0], canvas.height - Snake.part_length]);
      border_crossed = true;
    }
    else if (head[1] > canvas.height - Snake.part_length){
      Snake.parts.shift();
      Snake.parts.push([head[0], 0]);
      border_crossed = true;
    }

    return border_crossed;

  }

  Snake.move = function(head) {

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

    if(!Snake.borderDetect(head))
      Snake.move(head);

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

    //this is nasty, nasty, nasty! :[
    if (possible_direction === 'n' && Snake.direction === 's')
      return null;
    if (possible_direction === 's' && Snake.direction === 'n')
      return null;
    if (possible_direction === 'w' && Snake.direction === 'e')
      return null;
    if (possible_direction === 'e' && Snake.direction === 'w')
      return null;

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
  Snake.initializeParts(28)

  /* main loop */
  App.loop();

  /* event handlers */
  window.onclick = function (){ App.run = !App.run; App.loop(); }
  window.onkeydown = App.keyEvent;

}




