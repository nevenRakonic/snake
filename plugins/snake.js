(function(){
  window.onload = function() {
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


    /* canvas related variables */
    var canvas = document.getElementById("snake");
    var c = canvas.getContext("2d");
    c.font = '30pt helvetica';

    /*
    function drawPartial() {
      tempPos = Snake.posA + Snake.part_length - canvas.width;
      c.fillRect(0, Snake.posB, tempPos, 20);

    }*/

    /* App object is related to general running */
    var App = {};
    App.run = false;
    App.gameOver = false;
    //determines how fast the snake will move, every xth frame
    App.speed_modulo = 3;

    //is used to bind keyevents to the direction of snake,
    //n = north, e = east etc.
    App.eventDict = {87: 'n', 68: 'e', 65: 'w', 83: 's', 32: 'PAUSE'};

    /* Snake object is used to describe the snake */
    var Snake = {};
    Snake.part_length = 20;
    Snake.height = 20;
    /* this dict is used to prevent player from reversing the snake*/
    Snake.opposite_direction = {'n':'s', 's':'n','w':'e','e':'w'};

    /* food object */
    var Food = {};
    Food.length = 20;
    Food.height = 20;

    Food.recreate = function(){
      if (!Food.exist){
        Food.position = App.generateRandomXYPosition();
        Food.exist = true;
      }
    };


    /* creates the snake at the beginning */
    Snake.initializeParts = function(snake_size){
      for (var i = 0; i < snake_size; i++){
        Snake.parts.push([i*20, 200]);
      }
    };

    /* checks if snake has eaten the food, updates related information */
    Snake.checkIfMunch = function(head) {
      if(head[0] === Food.position[0] && head[1] === Food.position[1]){
        Food.exist = false;
        Snake.toGrow = Food.position;
        App.score += 1;
      }
    };

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

    };

    Snake.checkCollision = function(head){

      //Snake.parts - 1 means we check the whole length of the snake except
      //the last part which is the head of the snake.
      for (var i = 0; i < Snake.parts.length -1 ; i++){
        if(Snake.parts[i][0] === head[0] && Snake.parts[i][1] === head[1]){
          App.gameOver = true;
          App.changeRunning();
        }
      }
    };

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
    };

    Snake.recreate = function(){
      var size = Snake.parts.length;
      var tail = Snake.parts[0];
      var head = Snake.parts[size - 1];


      //if snake ate a part, then it will grow at the tail so it won't be deleted
      if (tail[0] !== Snake.toGrow[0]){
        Snake.parts.shift();
      }
      else {
        Snake.toGrow = [];
      }

      Snake.checkCollision(head);
      Snake.checkIfMunch(head);
      //borderdetect checks if the snake got out of boundaries and needs to be
      //redrawn on the other side, if not it's a regular move
      if(!Snake.borderDetect(head))
        Snake.move(head);
    };

    App.initialize = function(){
      /* stuff that isn't constant has to be reset so parts of objects are initialized here */
      //js uses 64 bit numbers so no fear of overflow, e.g. if the game takes too long
      App.frame = 0;
      App.score = 0;
      //each part of the snake is a member of parts array that shows X,Y position of that part
      Snake.parts = [];
      Snake.direction = 'e';
      // keeps to track of where the snake has eaten the food, it's where it will grow after the tail passes it
      Snake.toGrow = [];
      // determines the initial size of the snake
      Snake.initializeParts(20);

      Food.position = [];
      Food.exist = false;
    };

    App.generateRandomXYPosition = function(){
      //position created is within the maps parameters
      var XYPositions = [0,0];
      XYPositions = XYPositions.map(function() { return Math.floor(Math.random()*32)*20; });
      return XYPositions;
    };

    App.changeRunning = function(){
      App.run = !App.run;
    }


    App.draw = function(){
      c.clearRect(0, 0,canvas.width, canvas.height);
      //foreach loop might be better, draws snake
      c.fillStyle = 'black';
      for (var i = 0; i < Snake.parts.length; i++){
        c.fillRect(Snake.parts[i][0], Snake.parts[i][1], Snake.part_length - 0.5, Snake.height - 0.5);
      }

      //takes care of food
      c.fillStyle = 'grey';
      c.fillRect(Food.position[0], Food.position[1], Food.length, Food.height);
      c.fillStyle = 'red';
      c.fillText('' + App.score, 500, 50);
    };

    App.startNew = function(){
      /* pre loop calls */
      App.initialize();

      /* main loop */
      App.loop();
    }


    App.loop = function() {
      if (App.run) {
        //drawing loop
        window.requestAnimFrame(App.loop);

        //lowers animation speed
        if (App.frame % App.speed_modulo === 0) {
          App.draw();
          Snake.recreate();
          Food.recreate();
          Snake.freeze_direction = false;
        }

        App.frame += 1;


        if (App.gameOver) {
          App.initialize();
          App.gameOver = false;
          //draw game over
        }
      }
    };
    Snake.freeze_direction = false;

    /* main loop */
    App.startNew();

    /* event handlers */
    App.keyEvent = function(event){
      var key = App.eventDict[event.keyCode];
      /*checks if pause key should pause the running game, or restart it if it's over*/
      if (key === 'PAUSE'){
        App.changeRunning();
        if (!App.gameOver){
          App.loop();
        }
        return null;
      }

      //checks if key is one of the controls and also
      if (key !== undefined && Snake.opposite_direction[key] !== Snake.direction && !Snake.freeze_direction){
        Snake.direction = key; console.log(Snake.direction);
        Snake.freeze_direction = true;
      }

    };
    window.onclick = function (){ App.changeRunning(); App.startNew(); };
    window.onkeydown = App.keyEvent;
  };

})();




