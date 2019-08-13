function Tile(x,y){
  this.x=x;
  this.y=y;
  
  this.show = function(){
    fill(255);
    rect(this.x, this.y, scl, scl);
  }
}