'use strict';
Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
$(document).ready(function(){
	var username = $.cookie('userName');
	if(username == null){
		location.href = '/';
		return;
	}
	var channel = $.cookie('channel');
	if(parseInt(channel) != 1){
		location.href = '/';
		return;
	}
	var list = [];

	var track = function(i){
		var channel = list[i];
		var uid = $.cookie('userid');

		$.ajax({
			type 		: "POST",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/users/"+channel._id+"/track"+getSignature(),
			data        : JSON.stringify({userid:uid}),
			beforeSend(xhr,settings){
				var csrftoken = $.cookie('csrfToken');
				if(csrftoken){
					xhr.setRequestHeader('x-csrf-token', csrftoken);
				}
			},
			complete 	: function(jqXHR,textStatus){
				switch(jqXHR.status){
					case 200:
						var selector = "[data-id='"+i+"']"
						$(selector).remove();
						var selector = "."+i;
						$(selector).text("是");
						var selector = "[data-idn='"+i+"']"
						var nickname = $.cookie('nickname');
						$(selector).text(nickname);
						break;
					case 403:
					case 401:
						location.href = '/';
						break;
					default:
						alert("错误: "+jqXHR.responseText);
						break;
				}
			}
		});
	};

	var loadData = function(page,callback){
		$.ajax({
			type 		: "POST",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/users/channel"+getSignature()+"&page="+page,
			beforeSend(xhr,settings){
				var csrftoken = $.cookie('csrfToken');
				if(csrftoken){
					xhr.setRequestHeader('x-csrf-token', csrftoken);
				}
			},
			complete 	: function(jqXHR,textStatus){
				$.loading.hide();
				switch(jqXHR.status){
					case 200:
						if(callback){
							callback(jqXHR.responseJSON);
						}
						break;
					case 403:
					case 401:
						location.href = '/';
						break;
					default:
						alert("错误: "+jqXHR.responseText);
						break;
				}
			}
		});
	};

	var setData = function(page,data){
		var count = data.count;
		$("#pagination").pagination(count, {
			current_page : page,
			num_display_entries : 5,
			callback : function(page_id){
				loadData(page_id,function(data){
					setData(page_id,data);
					setList(page_id,data.items);
				});
			},
			load_first_page : false,
			prev_text : '«',
			next_text : '»'
		});
	}

	loadData(0,function(data){
		setData(0,data);
		setList(0,data.items);
	});

	var setList = function(page_id,data){
		$('.list').html('');
		list = data;
		for(var i = 0; i < data.length; i++){
			var x = parseInt(i);
			var channel = list[x]
			if(typeof channel == "undefined")
			{
				break;
			}
			var html = "<tr>";
			html+="<td>"+channel.tel+"</td>";
			html+="<td>"+channel.product+"</td>";
			html+="<td>"+new Date(channel.channelTimestamp).Format("yyyy-MM-dd hh:mm")+"</td>";
			var isTrack = channel.isTrack == true ?"是":"否";
			html+="<td class='"+x+"'>"+isTrack+"</td>";

			if(isTrack == "是"){
				if(typeof channel.trackUser == "undefined")
				{
					html+="<td data-idn='"+x+"'>"+"admin1"+"</td>";
				}else
				{
					html+="<td data-idn='"+x+"'>"+channel.trackUser.nickname+"</td>";
				}
				html+="<td></td>";
			}else{
				html+="<td data-idn='"+x+"'>"+""+"</td>";
				html+="<td><button type='button' class='btn btn-default ccc' data-id='"+x+"'>跟踪</button></td>";
			}

			html+="</tr>"
			$('.list').append(html);
		}
		if(list.length == 0){
			$('.list').html("<div class='text-center'>暂无结果</div>");
		}

		$(".ccc").off("click");
		$(".ccc").on("click",function(e){
			var i = $(e.currentTarget).attr("data-id");
			track(i);
		});
	}

});