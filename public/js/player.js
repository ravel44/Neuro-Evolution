function Player(x, y, img, dna) { //dna is an array
	this.x = x;
	this.y = y;
	this.img = img;
		
	if(dna){
		this.brain = new NeuralNetwork(6, 40, 5, dna); // dna is an array
	}else{
		this.brain = new NeuralNetwork(6, 40, 5); 
	}
	
	this.score = 0; // Score is how many frames it's been alive
	this.fitness = 0;// Fitness is normalized version of score
	this.countSoftmaxOutput=0;
	this.pickedIndex= 0; // output of softmax
	//detect tiles
	this.inputTileTop=0;
	this.inputTileDown=0;
	this.inputTileLeft=0;
	this.inputTileRight=0;	
	//detect enemy
	this.inputKTop=0;
	this.inputKDown=0;
	this.inputKRight=0;
	this.inputKLeft=0;
//=====================================================================
  this.show = function() {
    image(this.img, this.x, this.y);
  };

// BUMPING INTO THINGS---------------------------------------------------
  this.bumpinto = function(other) {
    if (this.x === other.x && this.y === other.y) {
      return true;
    } else {
      return false;
    }
  };

  this.bumpIntoUpWall = function(wall) {
    if (this.x === wall.x && this.y - scl === wall.y) {
      return true;
    } else {
      return false;
    }
  };

  this.bumpIntoDownWall = function(downwall) {
    if (this.x === downwall.x && this.y + scl === downwall.y) {
      return true;
    } else {
      return false;
    }
  };

  this.bumpIntoRightWall = function(rightwall) {
    if (this.x + scl === rightwall.x && this.y === rightwall.y) {
      return true;
    } else {
      return false;
    }
  };

  this.bumpIntoLeftWall = function(leftwall) {
    if (this.x - scl === leftwall.x && this.y === leftwall.y) {
      return true;
    } else {
      return false;
    }
  };
		
	this.copy=function() {
		return new Player(this.brain);
	};

//=================================================================================
	this.up = function(){
		if(this.inputTileTop==1){
			this.y=this.y;
		}else{
			this.y=this.y-scl;
		}
	};
    this.down= function(){
		if(this.inputTileDown==1){
			this.y=this.y;
		}else{
			this.y=this.y+scl;
		}
	};
	this.left=function(){
	   if(this.inputTileLeft==1){
		   this.x=this.x;
	   }else{
		   this.x=this.x-scl;
	   }
	};
	this.right=function(){
	   if(this.inputTileRight==1){
		   this.x=this.x;
	   }else{
		   this.x=this.x+scl;
	   }
	};
	this.dontMove=function(){
		this.x=this.x;
		this.y=this.y;
	};
	//SOFTMAX===================================================================================
	
	this.softmax=function(arr){ // gives probabilites BUT still need to pick the highest only 90% of the time
		const C = Math.max(...arr);
		const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
		return arr.map((value, index) => { 
			return Math.exp(value - C) / d;
    	});
	};
	
	this.indexOfHighestValue=function(arr){
		var max = arr[0];
		var maxIndex = 0;

		for (var i = 1; i < arr.length; i++) {
			if (arr[i] > max) {
				maxIndex = i;
				max = arr[i];
			}
		}
		return maxIndex;
	};
	
	//detect tile==============================================================
	this.detectTile=function(){
		//top
		var arrayOfTiles=[];
		for (var i = 0; i < tiles.length; i++) {
			if(this.x==tiles[i].x && this.y-scl==tiles[i].y){
				arrayOfTiles[i]='true';
			  }else{
				arrayOfTiles[i]='false';
			  }
			if(arrayOfTiles.includes('true')){
				this.inputTileTop=1;
			}else{
				this.inputTileTop=0;
				}
		}
		//down
		var arrayOfTilesD= [];
		  for (var i = 0; i < tiles.length; i++) {
			if (this.x==tiles[i].x && this.y+scl == tiles[i].y) {
				arrayOfTilesD[i]='true';
			}else{
				arrayOfTilesD[i]='false';
			}
		  }
			if (arrayOfTilesD.includes('true')){
				this.inputTileDown=1;
			}else{
				this.inputTileDown=0;
			}
		//left
		var arrayOfTilesL= [];
	  for (var i = 0; i < tiles.length; i++) {
		if (this.x-scl == tiles[i].x && this.y==tiles[i].y) {
			arrayOfTilesL[i]='true';
		}else{
			arrayOfTilesL[i]='false';
		}
	  }
		if (arrayOfTilesL.includes('true')){
			this.inputTileLeft=1;
		}else{
			this.inputTileLeft=0;
		}
		//right
		var arrayOfTilesR= [];
	  for (var i = 0; i < tiles.length; i++) {
		if (this.x+scl == tiles[i].x && this.y==tiles[i].y) {
			arrayOfTilesR[i]='true';
		}else{
			arrayOfTilesR[i]='false';
		}
	  }
		if (arrayOfTilesR.includes('true')){
			this.inputTileRight=1;
		}else{
			this.inputTileRight=0;
		}
	};

//DEFINITION OF INPUTS OF NEURAL NETWORK AND ACTIONS DECIDED==========================================================================	
	this.think=function(){
		let inputs=[];
		inputs[0]=this.x/width; // player x
		inputs[1]=this.y/width; // player y

			//incase detect tiles
			if (this.inputTileTop==1){ 
				inputs[2]=1;
			}else{
				inputs[2]=0;
			}
			if (this.inputTileDown==1){ 
				inputs[3]=1;
			}else{
				inputs[3]=0;
			}
			if (this.inputTileLeft==1){ 
				inputs[4]=1;
			}else{
				inputs[4]=0;
			}
			if (this.inputTileRight==1){ 
				inputs[5]=1;
			}else{
				inputs[5]=0;
			}
						
		var output = this.brain.predict(inputs);
		var softmax = this.softmax(output);

		this.countSoftmaxOutput++;
		if (this.countSoftmaxOutput ==10){ // loop to get 10% of OTHER choice than max value
			this.countSoftmaxOutput=0;
		}
		if(this.countSoftmaxOutput !=9 && this.countSoftmaxOutput !=8  ){ //takes random decision 20% of time && this.countSoftmaxOutput !=8
			this.pickedIndex=this.indexOfHighestValue(softmax);
		}else{
			var a=Math.floor(Math.random()*5); 
			this.pickedIndex=a;
		}

		//actions decided
		if (this.pickedIndex==0){
			this.up();
		}else if (this.pickedIndex ==1){
			this.down();
		}else if (this.pickedIndex ==2){
			this.left();
		}else if (this.pickedIndex ==3){
			this.right();
		}else if (this.pickedIndex ==4){
			this.dontMove();
		}
	};
	
	this.calcFitness=function(){
		var d= dist(this.x, this.y, targetX, targetY); 
		if(this.x==targetX && this.y==targetY){
			this.fitness=1;
			// console.log('reached');
		}else{
		 this.fitness=1/d;
		}
	};

}
