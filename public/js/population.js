function Population(){
	this.players=[];
	this.popSize=100;
	this.matingPool=[];

	for (i=0; i<this.popSize; i++ ){
		this.players[i]=new Player(playerInitialX, playerInitialY, playerimage);
	}
		
	this.run=function(){
		for (var i=this.players.length-1; i>=0; i-- ){
			this.players[i].show();
			this.players[i].detectTile();
			this.players[i].think();
		}
	};
	
	this.evaluate=function(){
		var maxFit=0;
		for (var i=this.players.length-1; i>=0; i-- ){
			this.players[i].calcFitness();
			if(this.players[i].fitness>maxFit){
				maxFit = this.players[i].fitness;
			}
		}
		console.log('maxFit: '+ maxFit);
		
		for (var j=this.players.length-1; j>=0; j-- ){
			this.players[j].fitness /=maxFit; // normalize
		}
		
		this.matingPool=[]; 
		
		for (var m=this.players.length-1; m>=0; m-- ){
			var n= this.players[m].fitness*100;
			for (var k=0; k<n; k++ ){
				this.matingPool.push(this.players[m]);
			}
		}
	};
	
	this.selection=function(){
		var newPlayers=[];
			for ( var i=0;i<this.popSize;i++){	
				var parentAgenes=random(this.matingPool).brain.dna; //returns array
				var parentBgenes=random(this.matingPool).brain.dna;
				var dna = crossover(parentAgenes, parentBgenes);
				// var dnaMutated=mutate(dna);
				newPlayers[i]=new Player(playerInitialX, playerInitialY, playerimage, dna);
			}
		this.players=newPlayers;
	};
}