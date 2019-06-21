
function getRandomNum(Min,Max)
{
	var Range = Max - Min;
	var Rand = Math.random();
	return(Min + Math.round(Rand * Range));
}
var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
	var res = "";
	for(var i = 0; i < n ; i ++) {
		var id = Math.ceil(Math.random()*35);
		res += chars[id];
	}
	return res;
}

function getSignature (){
	var timestamp = new Date().getTime()/100;
	var nonce = getRandomNum(19898,7687264);
	var echostr = generateMixed(20);
	var newStr = $.md5(timestamp + echostr + nonce);
	var s = {signature:newStr,timestamp:timestamp,echostr:echostr,nonce:nonce};
	return '?'+$.param(s);
}