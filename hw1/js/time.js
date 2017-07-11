//change the format of time
function two_char(n){
	return n >= 10 ? n : "0" + n;
}

function get_time(){
	var sec=0;
	setInterval(function(){
		sec++;
		var date = new Date(0,0);
		date.setSeconds(sec);
		var h = date.getHours();
		var m =date.getMinutes();
		var s =date.getSeconds();
		document.getElementById("mytime").innerText = two_char(h) + ":" + two_char(m) + ":" + two_char(s);},
	1000);
}