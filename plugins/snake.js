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
  App.score = 0;

  /* Snake object is used to describe the snake */
  var Snake = {};
  Snake.part_length = 20;
  Snake.height = 20;
  //each part of the snake is a member od of parts array that shows X,Y position of that part
  Snake.parts = [];
  Snake.direction = 'e';

  /* food object */
  var Food = {};
  Food.position = [];
  Food.length = 20;
  Food.height = 20;
  Food.exist = false;


  var canvas = document.getElementById("snake");
  var c = canvas.getContext("2d");
  /*
  function drawPartial() {
    tempPos = Snake.posA + Snake.part_length - canvas.width;
    c.fillRect(0, Snake.posB, tempPos, 20);

  }*/
  Snake.checkIfMunch = function(head) {
    if(head[0] === Food.position[0] && head[1] === Food.position[1]){
      Food.exist = false;
      App.score += 1;
    }

  }

  Snake.initializeParts = function(snake_size){
    for (var i = 0; i < snake_size; i++){
      Snake.parts.push([i*20, 200])
    }
  }

  Snake.borderDetect = function(head){

    var border_crossed = false;

    //bunch of duplication here, needs to be refactored
    if (head[0] > canvas.width - Snake.part_length){
      Snake.parts.push([0, head[1]]);
      border_crossed = true;
    }
    else if (head[0] < 0){
      Snake.parts.push([canvas.width - Snake.part_length, head[1]]);
      border_crossed = true;
    }
    else if (head[1] < 0 ){
      Snake.parts.push([head[0], canvas.height - Snake.part_length]);
      border_crossed = true;
    }
    else if (head[1] > canvas.height - Snake.part_length){
      Snake.parts.push([head[0], 0]);
      border_crossed = true;
    }

    return border_crossed;

  }

  Snake.checkCollision = function(head){

    //Snake.parts - 1 means we check the whole length of the snake except
    //the last one which is the head of the snake.
    for (var i = 0; i < Snake.parts.length -1 ; i++){
      if(Snake.parts[i][0] === head[0] && Snake.parts[i][1] === head[1])
        App.run = false;
    }
  }

  Snake.move = function(head) {
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

    //snake always loose a part atm
    Snake.parts.shift()
    Snake.checkCollision(head);

    Snake.checkIfMunch(head);
    //borderdetect checks if the snake got out of boundaries and needs to be
    //redrawn on the site, if not it's a regular move
    if(!Snake.borderDetect(head))
      Snake.move(head);

  }

  App.generateRandomXYPosition = function(){
    var XYPositions = [0,0]
    XYPositions = XYPositions.map(function() { return Math.floor(Math.random()*32)*20; });
    return XYPositions;
  }


  App.draw = function(){
    c.clearRect(0, 0,canvas.width, canvas.height);
    //foreach loop might be better, draws snake
    for (var i = 0; i < Snake.parts.length; i++){
      c.fillRect(Snake.parts[i][0], Snake.parts[i][1], Snake.part_length, Snake.height);
    }

    //takes care of food
    if (!Food.exist){
      console.log(App.score);
      Food.position = App.generateRandomXYPosition();
      Food.exist = true;
    }
    c.fillRect(Food.position[0], Food.position[1], Food.length, Food.height);
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




