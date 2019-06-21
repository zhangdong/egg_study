
$(document).ready(function(){

	$(".handphones").val("18601294107,18610353005");
	$(".producename").val("烧碱");
	$(".produceclass").val("河北集团");
	$(".smsbody").val("烧碱,河北集团出品,4444元/吨");
	$(".senddate").val("上午11:24");
	$(".senduser").val("zyxz");

	$(".send").off("click");
	$(".send").on("click",function(e){
		e.preventDefault();
		var handphones = $(".handphones").val();
		var producename = $(".producename").val();
		var produceclass = $(".produceclass").val();
		var smsbody = $(".smsbody").val();
		var senddate = $(".senddate").val();
		var senduser = $(".senduser").val();
		var senduser = $(".senduser").val();
		var type = $(".type").val();
		var adlink = $(".adlink").val();

		var testcount = 1;
		if(parseInt(handphones) == 0){
			testcount = 666;
		}

		var test = [];
		for(var i = 1 ; i < testcount;i++){
			test.push(i);
		}

		var payload = {
			handphones:handphones.split(",").concat(test),
			producename:producename,
			produceclass:produceclass,
			smsbody:smsbody,
			senddate:senddate,
			senduser:senduser,
			adlink:adlink,
			type:type
		}

		$(".send").text("发送中...");
		$(".send").attr("disabled","disabled");

		$.ajax({
			type 		: "POST",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/post-message",
			data 		: JSON.stringify(payload),
			complete 	: function(jqXHR,textStatus){
				$(".send").text("发送");
				$(".send").removeAttr("disabled");
				switch(jqXHR.status){
					case 200:
						alert("发送成功");
						break;
					default:
						alert("error: "+jqXHR.responseText);
						break;
				}
			}
		});
	});
});