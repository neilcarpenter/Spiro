// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik MÃƒÂ¶ller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var CANVASINGZ = {

	options: {
		maxSize: 500,
		lineWidth: 0.5,
		speed: 5,
		hue: 0,
		mirrors: 2,
		bgColor: 0,
		rainbowfy: 0
	},

	animation: null,

	canvas: null,
	context: null,

	winWidth: window.innerWidth,
	winHeight: window.innerHeight,

	mouse: { x: -1000, y: -1000, down: false },
	mousePrev: { x: -1000, y: -1000 },

	degrees: 45,

	init: function () {
		this.canvas = document.getElementById( 'canvas' );
		this.context = canvas.getContext( '2d' );
		this.canvas.width = this.winWidth;
		this.canvas.height = this.winHeight;

		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mouseout', this.mouseOut, false);
		this.canvas.addEventListener('dblclick', this.mouseDbl, false);

		this.draw();

		window.onresize = function () {
			CANVASINGZ.winWidth = window.innerWidth;
			CANVASINGZ.winHeight = window.innerHeight;
			CANVASINGZ.canvas.width = CANVASINGZ.winWidth;
			CANVASINGZ.canvas.height = CANVASINGZ.winHeight;
		};
	},

	drawLines: function () {
		if (!this.mouse.down) {
			return;
		}

		var distance = Math.sqrt(Math.pow(this.mousePrev.x - this.mouse.x, 2) + Math.pow(this.mousePrev.y - this.mouse.y, 2)),
			r = ((distance / this.winWidth) * 1000) + this.options.maxSize,
			alpha = ((distance / this.winWidth) * 10) + 0.1,
			radians = this.degrees * (Math.PI/180),
			radians2 = (this.degrees + 180) * (Math.PI/180);

		var x1, y1, x2, y2, x3, y3, x4, y4;

		x1 = this.mouse.x + (Math.sin(radians) * r);
		y1 = this.mouse.y + (Math.cos(radians) * r);
		x2 = this.mouse.x + (Math.sin(radians2) * r);
		y2 = this.mouse.y + (Math.cos(radians2) * r);

		x3 = this.winWidth - x1;
		y3 = this.winHeight - y1;
		x4 = this.winWidth - x2;
		y4 = this.winHeight - y2;

		this.context.strokeStyle = 'hsla(' + this.options.hue + ', 100%, 50%, ' + alpha + ')';
		this.context.lineWidth = this.options.lineWidth;
		this.context.beginPath();

        this.context.moveTo(x1,y1);
        this.context.lineTo(x2,y2);

        if (this.options.mirrors > 0) {
			this.context.moveTo(x3,y1);
			this.context.lineTo(x4,y2);

			if (this.options.mirrors > 1) {
				this.context.moveTo(x1,y3);
				this.context.lineTo(x2,y4);

				this.context.moveTo(x3,y3);
				this.context.lineTo(x4,y4);
			}
        }

        this.context.stroke();

		this.degrees += this.options.speed;
		
		// rainbow
		if (this.options.rainbowfy > 0) {
			this.options.hue += 10;
			if (this.options.hue > 360) {
				this.options.hue = 0;
			}
		}

	},

	draw: function () {
		this.animation = requestAnimationFrame( function(){ CANVASINGZ.draw(); } );

		this.drawLines();

		this.mousePrev.x = this.mouse.x;
		this.mousePrev.y = this.mouse.y;
	},

	clear: function() {
		CANVASINGZ.canvas.width = CANVASINGZ.canvas.width;
	},

	save: function() {
		if (CANVASINGZ.options.bgColor === 1) {
			CANVASINGZ.context.globalCompositeOperation = "destination-over";
			CANVASINGZ.context.fillStyle = "#000";
			CANVASINGZ.context.fillRect(0, 0, CANVASINGZ.winWidth, CANVASINGZ.winHeight);
		}

		var i = CANVASINGZ.canvas.toDataURL('image/jpg');
		window.open(i, '_blank');
		window.focus();
	},

	mouseMove: function (e) {
		CANVASINGZ.mouse.x = e.offsetX || (e.layerX - CANVASINGZ.canvas.offsetLeft);
		CANVASINGZ.mouse.y = e.offsetY || (e.layerY - CANVASINGZ.canvas.offsetTop);
	},

	mouseDown: function () {
		CANVASINGZ.mouse.down = true;
	},

	mouseUp: function () {
		CANVASINGZ.mouse.down = false;
	},

	mouseOut: function () {
		CANVASINGZ.mouse.down = false;
	},

	mouseDbl: function () {
		CANVASINGZ.clear();
	}

};

function eventListenerz() {
	var inputs = document.getElementsByClassName('controller'),
		colorSpan = document.getElementById('color-indicator'),
		resetBtn = document.getElementById('reset'),
		saveBtn = document.getElementById('save');

	colorSpan.style.backgroundColor = 'hsl(' + CANVASINGZ.options.hue + ', 100%, 50%)';

	function onChange() {
		var name = this.name,
			value = this.value,
			max = this.getAttribute('max');

		value = +value;

		if (value > max) {
			value = max;
			this.value = max;
		}

		CANVASINGZ.options[name] = value;

		if (this.name === 'hue') {
			colorSpan.style.backgroundColor = 'hsl(' + CANVASINGZ.options.hue + ', 100%, 50%)';
		}

		if (this.name === 'rainbowfy' && this.value > 0) {
			colorSpan.style.display = 'none';
		}
		else if (this.name === 'rainbowfy' && this.value < 1) {
			colorSpan.style.display = 'block';
		}

	}

	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('change', onChange, false);
	}

	var controlToggles = document.getElementsByClassName('toggle-controls'),
		controls = document.getElementById('controls');

	function toggleControls(e) {
		e.preventDefault();
		controls.className = controls.className === 'closed' ? '' : 'closed';
	}

	for (var j = 0; j < 2; j++) {
		controlToggles[j].addEventListener('click', toggleControls, false);
	}

	var bgToggle = document.getElementsByClassName('bg-slider')[0];
		bgToggle.addEventListener('change', changeBG, false);

	function changeBG() {
		var value = this.value;

		document.body.style.backgroundColor = 'rgba(0, 0, 0, ' + value + ')';
	}

	resetBtn.addEventListener('click', CANVASINGZ.clear, false);

	saveBtn.addEventListener('click', CANVASINGZ.save, false);

}

window.onload = function() {

	CANVASINGZ.init();

	eventListenerz();

}