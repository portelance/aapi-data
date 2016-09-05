var abs = Math.abs;

const ATTRACTION = 0.12;
const DAMPING = 0.3;

function SoftFloat(value, damping, attraction) {
  this.value = 0;
  this.acceleration = 0;
  this.velocity = 0;
  if (value != undefined){
    this.value = value;
  }
  this.target = this.value;
}

SoftFloat.prototype.set = function(v) {
  this.value = v;
  this.target = v;
  this.targeting = false;
}

SoftFloat.prototype.get = function() {
  return this.value;
}

SoftFloat.prototype.update = function() {
   if(this.targeting){
    this.acceleration += ATTRACTION * (this.target - this.value);
    this.velocity = (this.velocity + this.acceleration) * DAMPING;
    this.value += this.velocity;
    this.acceleration = 0;
    if(abs(this.velocity) > 0.0001){
      return true;
    }
    this.value = this.target;
    this.targeting = false;
  }
  return this.value;
}

SoftFloat.prototype.setTarget = function(t){
  this.targeting = true;
  this.target = t;
}

SoftFloat.prototype.atTarget = function(){
  if(!this.targeting){
    return true;
  }
  return abs(this.value - this.target) < 0.01;
}

SoftFloat.prototype.isTargeting = function(){
  return this.targeting;
}

SoftFloat.prototype.noTarget = function(){
  this.targeting = false;
}

SoftFloat.prototype.get = function(){
  return this.value;
}

SoftFloat.prototype.getTarget = function(){
  return this.target;
}