var fireworks = [];
var gravity;
var frequency;
var particleSize;
var img, ratio

function preload(){
  img = loadImage("usaama.png")
  song = loadSound('fireworks.mp3');//Thanks https://freesound.org/people/bmlake/sounds/251615/
}

function setup() {
	// put setup code here
	createCanvas(window.innerWidth,window.innerHeight);
	strokeWeight(9);
	background(249);
	gravity = createVector(0, 0.05);
    textAlign(CENTER, CENTER)
	frequency = 0.05;
	particleSize = 5;
    imageMode(CENTER)
    ratio = img.width/img.height
  textSize(60)
	
  song.loop();
}

function draw() {

	strokeWeight(particleSize);
	colorMode(RGB);
	background(0,75);
	
  
  
  if (getAudioContext().state !== 'running'){
    fill("#fff")
    text('What day is it?', width/2, height/2);
  } else {
    if (random(1) < frequency) {
      
      
      var theTexts = ["HAPPY","BIRTHDAY","USAAMA", "30th", "May"]
      var i = int(random(0,theTexts.length))
		fireworks.push(new Firework(theTexts[i], random(0,width),height));
	}
	for (var i = 0; i < fireworks.length; i++) {
		fireworks[i].update();
		fireworks[i].draw();
		if (fireworks[i].particles.length == 0 && fireworks[i].exploded == true) {
			fireworks.splice(i, 1);
		}
	}
  }
}


// function touchStarted(){
//    getAudioContext().resume();
//    saveCanvas("Happy Birthday Lily_"+ int(random(0,1000)+".jpg"))

// }

function Particle(theText,x, y, vel, hu, depth, degrades) {
    this.text = theText;
	this.pos = createVector(x,y);
	this.vel = vel;
	this.acc = createVector(0,0);
	this.lifespan = 250;
	this.degrades = degrades;
	this.hu = hu;
	this.depth = depth;
    this.size = int(random(40, 140))

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		if (this.degrades) {
			this.lifespan = this.lifespan - 18;
		}
      this.size = this.size -1
	}

	this.draw = function() {
		colorMode(HSB);
      var tSize = map(this.lifespan, 0, 255, 10, 50)
      textSize(tSize)
		fill(0, 255, 255, this.lifespan/255/2);
        text(this.text, this.pos.x+((this.pos.y-height)/25)-this.depth/2,this.pos.y)
      
		fill(180, 255, 255, this.lifespan/255/2);
        text(this.text, this.pos.x-((this.pos.y-height)/25)+this.depth/2,this.pos.y)
	    fill(222, this.lifespan)
        //push()
        //translate()
        ///rotate(0.1)
        //image(img, this.pos.x-((this.pos.y-height)/25)+ this.depth/2,this.pos.y, this.size, this.size / ratio)
        image(img, this.pos.x-((this.pos.y-height)/25)+this.depth/2,this.pos.y, this.size, this.size / ratio)

      ///pop()
    }
}


function Firework(theText, x, y) {
  this.text = theText
  this.hu = random(255);
  this.depth = random(40)
  var letter = theText.charAt( int(random(0, theText.length-1)))

  this.firework = new Particle(theText,x, y, createVector(0, random(-window.innerHeight/150)-window.innerHeight/120), this.hu, this.depth, false);
  
	this.particles = [];
	this.exploded = false;

	this.update = function() {
		if (!this.exploded) {
			this.firework.applyForce(gravity);
			this.firework.update();
		
			if (this.firework.vel.y >= -5) {
				this.exploded = true;
				this.explode();
			}
		}
		for (var i = this.particles.length-1; i >= 0; i--) {
			this.particles[i].applyForce(gravity);
			this.particles[i].update();
			this.particles[i].vel.mult(0.96);
			if (this.particles[i].lifespan <= 0) {
				this.particles.splice(i, 1);
			}
		}
	}

	this.explode = function() {
		for (var i = 0; i < 20; i++) {
			var vel = p5.Vector.random2D().mult(random(0,10));
			vel.add(createVector(0,-5));
           var letter = this.text.charAt( int(random(0, theText.length-1)))
			this.particles.push(new Particle(letter, this.firework.pos.x, this.firework.pos.y, vel, this.hu, this.depth, true));
		}
	}

	this.draw = function() {
		if (!this.exploded) {
			this.firework.draw();
		}
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].draw();
		}
	}
}