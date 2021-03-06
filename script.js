const main = document.getElementById('main');
var showCanvas = true;

/**
 * 
 * @param {number} atom define the width and the height of an atom
 * @param {number} xnum  define x-axis based on how many atoms 
 * @param {number} ynum  define y-axis based on how many atoms 
 * @constructor
 */
// map object 
function Map(atom, xnum, ynum) {
    this.atom = atom;
    this.xnum = xnum;
    this.ynum = ynum;

    this.canvas = null;

    //the method to create the canvas 
    this.create = function() {
        this.canvas = document.createElement('div');
        this.canvas.style.cssText = "position: relative; top: 40px; border:1px solid darkred; background: #fafafa";
        this.canvas.style.width = this.atom * this.xnum + 'px';
        this.canvas.style.height = this.atom * this.ynum + 'px';
        main.appendChild(this.canvas);

        if (showCanvas) {
            for (let y = 0; y < ynum; y++) {
                for (let x = 0; x < xnum; x++) {
                    var a = document.createElement('div');
                    a.style.cssText = "border: 1px solid yellow";
                    a.style.width = this.atom + 'px';
                    a.style.height = this.atom + 'px';
                    a.style.backgroundColor = "lightgrey";
                    this.canvas.appendChild(a);
                    a.style.position = "absolute";
                    a.style.left = x * this.atom + 'px';
                    a.style.top = y * this.atom + 'px';
                }
            }
        }
    }
}

/**
 * 
 * @param {Map} map 
 * @constructor
 */

function Food(map) {
    this.width = map.atom;
    this.height = map.atom;
    this.bgColor = "rgb(" + Math.floor(Math.random() * 250) + ", " + Math.floor(Math.random() * 250) + ", " + Math.floor(Math.random() * 250) + ")"; //generate random colors for the food 
    
    // generate random numbers to set x-axis and y-asix for food 
    this.x = Math.floor(Math.random() * map.xnum);
    this.y = Math.floor(Math.random() * map.ynum); 

    this.flag = document.createElement('div');
    this.flag.style.width = this.width + 'px';
    this.flag.style.height = this.height + 'px';

    this.flag.style.backgroundColor = this.bgColor;
    this.flag.style.borderRadius = '50%';
    this.flag.style.position = 'absolute';
    this.flag.style.left = this.x * this.width + 'px';
    this.flag.style.top = this.y * this.height + 'px';

    map.canvas.appendChild(this.flag);
}

function Snake(map) {
    // set the width and the height for Snake 
    this.width = map.atom;
    this.height = map.atom;
    //default direction 
    this.direction = 'right';

    this.body = [
        {x: 2, y: 0},   // head part 
        {x: 1, y: 0},   // middle part 
        {x: 0, y: 0}    // tail part 
    ];
    
    // a method to display the snake
    this.display = function() {
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].x != null) { // when snake eats the food, x === null, 
                var s = document.createElement('div');
                this.body[i].flag = s;
                
                // define the style of the snake 
                s.style.width = this.width + 'px';
                s.style.height = this.height + 'px';

                s.style.backgroundColor = "rgb(" + Math.floor(Math.random() * 240) + ", " + Math.floor(Math.random() * 240) + ", " + Math.floor(Math.random() * 240) + ")";

                // set the position 
                s.style.position = 'absolute';
                s.style.left = this.body[i].x * this.width + 'px';
                s.style.top = this.body[i].y * this.height + 'px';

                // append the element to the map 
                map.canvas.appendChild(s);
            }
        }
    }

    // a method to make the snake to move 
    this.move = function() {
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // direction: right, left, up, down
        switch (this.direction) {
            case 'left': this.body[0].x -= 1; break
            case 'right': this.body[0].x += 1; break
            case 'up': this.body[0].y -= 1; break
            case 'down': this.body[0].y += 1; break
        }

        // check if the snake eats the food 
        if (this.body[0].x === food.x && this.body[0].y === food.y) {
            //snake is added by one more atom for the tail
            this.body.push({x: null, y: null, flag: null});
            map.canvas.removeChild(food.flag);
            food = new Food(map);
        } 

        // check if the snake hits the border of the canvas 
        if (this.body[0].x < 0 || this.body[0].x > map.xmum - 1 || this.body[0].y < 0 || this.body[0].y > map.ynum - 1) {
            clearInterval(timer); // clear the timer 
            alert('GAME OVER');

            restart(map, this);
            return false;
        }

        // check if the snake reverse or the snake hits its body 
        for (let i = 4; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y){
                clearInterval(timer);
                alert('GAME OVER');

                restart(map, this);
                return false;
            }
        }

        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].flag != null) { // when snake eats the food, flag equals to null, and cannot be deleted
                map.canvas.removeChild(this.body[i].flag);
            }
        }

        this.display();
    }
}

// re-start the game 
function restart(map, snake) {
    for (var i = 0; i < snake.body.length; i++) {
        map.canvas.removeChild(snake.body[i].flag);
    }

    snake.body = [
        {x: 2, y: 0},
        {x: 1, y: 0},
        {x: 0, y: 0}
    ];

    snake.direction = 'right';
    snake.display();

    map.canvas.removeChild(food.flag);
    food = new Food(map);
}

// create the instance of Map
var map = new Map(20, 40, 20);
map.create(); // show the map

// create the instance of Fodd 
var food = new Food(map);

// create a snake
var snake = new Snake(map);
// display the snake
snake.display();

// keyboard event 
window.onkeydown = function(e) {
    var event = e || window.event;

    switch (event.keyCode) {
        case 38: 
            if (snake.direction != 'down') {
                snake.direction = 'up';
            }
            break;
        case 40:
            if (snake.direction != 'up') {
                snake.direction = 'down';
            }
            break;
        case 37:
            if (snake.direction != 'right') {
                snake.direction = 'left';
            }
            break;
        case 39: 
            if (snake.direction != 'left') {
                snake.direction = 'right';
            }
            break;
    }
}

var timer; 

document.querySelector('.btn-start').onclick = function() {
    clearInterval(timer);
    timer = setInterval(function(){
        snake.move();
    }, 300);

}

document.querySelector('.btn-stop').onclick = function() {
    clearInterval(timer);
}