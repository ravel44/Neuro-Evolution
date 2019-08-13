var scl = 15; //scale
var game;
var tiles = [];//walls

var playerimage;
var playerInitialX = 2 * scl;
var playerInitialY = 43 * scl;
var targetX= 44*scl;
var targetY= 1*scl;

var population; 
var lifespan = 250;
var frameCount =0;
var generationNumber=0;
var g; // generation number
var count=0; // counting frames, when + lifepsan, a new generation is created with new genes

var start; //button
var stop; //button
var trainingBool = 'off';

function preload() {
  playerimage = loadImage('images/player.png');
}

function setup() {
	createCanvas(700, 700);
	frameRate(50);
	frameRate(60);
	loadWalls();
	
	population=new Population();
	population.evaluate(); // fitness function + building mating pool
	g = select('#generationnumber');
	
	start=select('#start');
	start.mousePressed(startPushed);
	stop=select('#stop');
	stop.mousePressed(stoppingAnimation);
 }


function draw() {	  	  
    background(0);
    showWalls();
	startAndTarget();	
	 
	if (trainingBool=='on'){
		population.run();
		count++; //framecount
		if (count==lifespan){
		  population.evaluate();
		  population.selection();
		  count=0;
		  treached=0;
		  generationNumber++;
		  g.html(generationNumber);
			g.style('color', '#00FF00');
		}
	}
}

function startPushed(){ // button
	loop();
	trainingBool = 'on';
	population=new Population();
	count=0;
	g.html('0');
	generationNumber=0;
}

function stoppingAnimation(){ //button
	noLoop();
}

function loadWalls(){
  //MAIN WALLS---------------------------------------------------
  fill(255);
  for (var i = 0; i < 46; i++) {
    var x = i * scl;
    tiles[i] = new Tile(x, 0); 
  }
  for (var i = 0; i < 46; i++) {
    var x = i * scl;
    tiles.push(new Tile(x, 45 * scl)); 
  }
  for (var i = 0; i < 44; i++) {
    var y = scl + i * scl;
    tiles.push(new Tile(0, y)); 
  }
  for (var i = 0; i < 44; i++) {
    var y = scl + i * scl;
    tiles.push(new Tile(45 * scl, y)); 
  }
	
 // obstacles
  for (var i = 0; i < 10; i++) {
    var y = scl + i * scl;
    tiles.push(new Tile(20*scl, y)); 
  }
  for (var i = 0; i < 12; i++) {
    var y = scl + i * scl;
    tiles.push(new Tile(19*scl, y)); 
  }
	
  for (var i = 0; i < 2; i++) {
    var y = 15*scl + i * scl;
    tiles.push(new Tile(24*scl, y)); 
  }
  for (var i = 0; i < 4; i++) {
    var y = 22*scl + i * scl;
    tiles.push(new Tile(24*scl, y)); 
  }
  for (var i = 0; i < 10; i++) {
    var y = 20*scl + i * scl;
    tiles.push(new Tile(17*scl, y)); 
  }
  for (var i = 0; i < 3; i++) {
    var y = 4*scl + i * scl;
    tiles.push(new Tile(37*scl, y)); 
  }
  for (var i = 0; i < 6; i++) {
    var y = 8*scl + i * scl;
    tiles.push(new Tile(37*scl, y)); 
  }
  for (var i = 0; i < 6; i++) {
    var y = 1*scl + i * scl;
    tiles.push(new Tile(28*scl, y)); 
  }
  for (var i = 0; i < 13; i++) {
    var y = 5*scl + i * scl;
    tiles.push(new Tile(35*scl, y)); 
  }
	
  for (var i = 0; i < 12; i++) {
    var x = 33*scl+ i * scl;
    tiles.push(new Tile(x, 20 * scl)); 
  }
  for (var i = 0; i < 10; i++) {
    var x = 35*scl+ i * scl;
    tiles.push(new Tile(x, 21 * scl)); 
  }
  for (var i = 0; i < 10; i++) {
    var x = 23*scl+ i * scl;
    tiles.push(new Tile(x, 32 * scl)); 
  }
  for (var i = 0; i < 7; i++) {
    var x = 5*scl+ i * scl;
    tiles.push(new Tile(x, 25 * scl)); 
  }
	//couloir
  for (var i = 0; i < 8; i++) {
    var x = 30*scl+ i * scl;
    tiles.push(new Tile(x, 3 * scl)); 
  }
  for (var i = 0; i < 8; i++) {
    var x = 37*scl+ i * scl;
    tiles.push(new Tile(x, 15 * scl)); 
  }
}

function showWalls(){
	    for (var i = 0; i < tiles.length; i++) {
      tiles[i].show(); // WALLS
    }
}

function crossover(partnerAdna, partnerBdna){ // making digital babies
		var newgenes=[];
		var mid= floor(random(partnerAdna.length)); 
		for (var i=0; i<partnerAdna.length;i++){
			if (i>mid){
				newgenes[i]=partnerAdna[i];
			}else{
				newgenes[i]=partnerBdna[i];				
			}
		}
	return newgenes; //array
}

function fillMatrix(matrix, rows, cols, arr){ // to transform a long array in a matrix
	for (var j=0;j<rows;j++){ 
		for ( var i=0; i<cols;i++){ 
			matrix.data[j][i]=arr[i+j*cols];
		}
	}
}

function mutate(dna) { 
	for(var i=0;i<dna.length;i++){
	  if (random(1) < 0.05) {
		let offset = randomGaussian() * 0.5;
		 dna[i] = dna[i] + offset;
	  } else {
		dna[i]=dna[i];
	  }
	}
	return dna;
}

function startAndTarget(){
	fill(255, 0, 0);
	textSize(25);
	text('TARGET', 38*scl, 3*scl);
	fill(0, 255, 0);
	textSize(25);
	text('START', 2*scl, 43*scl);
}