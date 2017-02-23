var data={
direction:{
x:"down",
y:"down"
},
start:{
x:0,
y:0
},
end:{
x:0,
y:0
},
now:0,
last:0, 
page:{
up:{
last:"moveULast",
now:"moveUNow",
},
down:{
last:"moveDLast",
now:"moveDNow",
},
},
pageLength:$(".page").length,
isMoving:false
};
//$(".page").css({"width":document.documentElement.clientWidth+"px","height":document.documentElement.clientHeight+"px"})
document.addEventListener("touchstart",function(ev){
var touch = ev.targetTouches[0];
data.start.x = touch.clientX;
data.start.y = touch.clientY;
},false);
document.addEventListener("touchmove",function(ev){
ev.preventDefault();
var touch = ev.targetTouches[0];
data.end.x = touch.clientX;
data.end.y = touch.clientY;
},false);
document.addEventListener("touchend",function(ev){
data.direction.x = (data.end.x - data.start.x) > 0 ? "down" : (data.end.x - data.start.x) < 0 ? "up" : "down";
data.direction.y = (data.end.y - data.start.y) > 0 ? "down" : (data.end.y - data.start.y) < 0 ? "up" : "down";
if(!data.isMoving){
data.isMoving = true;
pageMove();
}
},false);
function pageMove(){;
data.last = data.now;
var od = "down";
if(data.direction.y == "up"){
data.now++;
}else{
data.now--;
od = "up";
}
if(data.now >= data.pageLength){
data.now = 0;
}
if(data.now <= -1){
data.now = data.pageLength - 1;
}
$(".page").removeClass(data.page[data.direction.y].now+" "+data.page[data.direction.y].last +" "+data.page[od].now+" "+data.page[od].last + " pageCurrent").addClass("hide");
$(".page"+data.now).removeClass("hide").addClass(data.page[data.direction.y].now+" pageCurrent");
$(".page"+data.last).removeClass("hide").addClass(data.page[data.direction.y].last);
setTimeout(function(){
$(".page").removeClass(data.page[data.direction.y].now+" "+data.page[data.direction.y].last +" "+data.page[od].now+" "+data.page[od].last);
$(".page"+data.last).addClass("hide")
data.isMoving = false;
},500);
};
