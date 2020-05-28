const main = document.getElementById('main');

/**
 * 
 * @param {number} atom define the width and the height of an atom
 * @param {number} xnum  define x-axis based on how many atoms 
 * @param {number} ynum  define y-axis based on how many atoms 
 * @constructor
 */

function Map(atom, xnum, ynum) {
    this.atom = atom;
    this.xnum = xnum;
    this.ynum = ynum;

    this.canvas = null;

    //the method to create the canvas 
    this.create = function() {
        this.canvas = document.createElement('div');
        main.appendChild(this.canvas);
    }
}

var map = new Map(20, 40, 20);

var timer; 

document.querySelector('btn-start').onclick = function() {
    clearInterval(timer);
    timer = setInterval(function(){

    }, 300);

}

document.querySelector('stop').onclick = function() {
    clearInterval(timer);
}