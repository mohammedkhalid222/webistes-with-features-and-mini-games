$(document).ready(function(){
    // canvas stuff
    var canvas = $("#viewport")[0];
    var context = canvas.getContext("2d");
    var w = $("#viewport").width();
    var h = $("#viewport").height();
    //declare important stuff
    var cw = 10;
    var food;
    var score;
    var level;
    var d;
    var snakeArray;
    //make the core
    function init() {
        var d = "right";
        create_snake();
        create_food();

        score = 0;
        level = 1;
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 100);
    }
    init();
    function create_snake(){
        var length = 5;
        snakeArray = [];
        for (var i = length-1; i>=0 ; i--) {
            snakeArray.push({x:i, y:0})
        };
    }
    function create_food() {
        food = {
            x: Math.round(Math.random()*(w-cw)/cw),
            y: Math.round(Math.random()*(h-cw)/cw),
        };
    }
//add color
    function  paint() {

        context.fillStyle = "black";
        context.fillRect(0, 0, w, h);
        context.strokeStyle = "yellow";
        context.strokeRect(0, 0, w, h);

        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        if(d == "right") nx++;
        if(d ==  "left") nx--;
        if(d == "up") ny--;
        if(d == "down") ny++;
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snakeArray))
        {
            //restart game
            init();
            //Lets organize the code a bit now.
            return;
        }
        if(nx == food.x && ny == food.y)
        {
            var tail = {x: nx, y: ny};
            score++;

            //Create new food
            create_food();
        }
        else
        {
            var tail = snakeArray.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }
//The snake can now eat the food.

        snakeArray.unshift(tail);
        for(var i = 0; i < snakeArray.length; i++)
        {
            var c = snakeArray[i];
            //Lets paint 10px wide cells
            paint_cell(c.x, c.y, "green");
        }

        //Lets paint the food
        paint_cell(food.x, food.y, "yellow");
        //Lets paint the score
        var score_text = "Score: " + score;
        var level_text = "Level: " + level;
        context.fillText(score_text, 5, h);
        context.fillText(level_text, 60, h);

    }
    function paint_cell(x, y, color)
    {
        context.fillStyle = color;
        context.fillRect(x*cw, y*cw, cw, cw);
        context.strokeStyle = "blue";
        context.strokeRect(x*cw, y*cw, cw, cw);
    }
    function check_collision(x, y, array)
    {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    //Lets add the keyboard controls now
    $(document).keydown(function(e){
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
        //The snake is now keyboard controllable
    })



})
