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
	var userList = [];
	var currentPage = 0;
	var username = $.cookie('userName');
	if(username == null){
		location.href = '/';
		return;
	}
	var channel = $.cookie('channel');
	if(parseInt(channel) != 2){
		location.href = '/';
		return;
	}

	$(".clear").hide();
	$(".clear").off("click");
	$(".clear").on("click",function(e){
		e.preventDefault();
		$(".clear").hide();
		$(".search").val(null);
		loadData(0,function(data){
			setData(0,data);
			setList(0,data.items);
		});
	});

	$(".search").off("keyup");
	$(".search").on("keyup",function(){
		var searchTerms = $(".search").val();
		if (searchTerms) $(".clear").show();
		else $(".clear").hide();
	});

	var isLoadData = true;

	var getInfo = function(id){
		$(".deleteMessage").off('click');
		$(".deleteMessage").on("click",function(e){
			e.preventDefault();
			if(window.confirm('你确定要删除用户消息吗？')){
				$.ajax({
					type 		: "POST",
					dataType 	: "json",
					contentType : "application/json",
					url  		: "http://"+location.host+"/user/"+id+"/delete-message"+getSignature(),
					complete 	: function(jqXHR,textStatus){
						$.loading.hide();
						switch(jqXHR.status){
							case 200:
								$("#message-modal").modal("hide");
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
				return true;
			}else{
				return false;
			}
		});
		$.ajax({
			type 		: "GET",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/users/"+id+"/history"+getSignature(),
			complete 	: function(jqXHR,textStatus){
				$.loading.hide();
				switch(jqXHR.status){
					case 200:
						var data = jqXHR.responseJSON.newsHistory;
						$(".userinfo").text("用户手机号:"+jqXHR.responseJSON.tel);
						$("#pagination-modal").pagination(data.length, {
							current_page : 0,
							num_display_entries : 5,
							callback : function(page_id){
								$('.message').html('');
								for(var i = 0; i < 10; i++){
									var index = parseInt(page_id * 10)+parseInt(i);
									if(index >= data.length){
										break;
									}
									var sms = data[index];
									var html = "<tr>";
									html+="<td>"+sms.content.senddate+"</td>";
									html+="<td>"+sms.content.producename+"</td>";
									html+="<td>"+sms.content.smsbody+"</td>";
									html+="<td>"+sms.content.senduser+"</td>";
									if(sms.isReceived == true){
										html+="<td>已接收</td>";
									}else{
										html+="<td>未接收</td>";
									}
									html+="</tr>"
									$('.message').append(html);
								}
							},
							load_first_page : true,
							prev_text : '«',
							next_text : '»'
						});

						$("#message-modal").modal();
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

	var setList = function(page_id,data){
		$('.list').html('');
		userList = data;
		currentPage = page_id;
		for(var i = 0; i < data.length; i++){
			var index = parseInt(i);
			var user = data[index];
			var html = "<tr>";
			html+="<td>"+user._id+"</td>";
			html+="<td>"+user.tel+"</td>";
			if(user.device.uuids.length == 1){
				html+="<td>"+user.device.uuids[user.device.uuids.length-1]+"</td>";
				html+="<td>"+"无修改"+"</td>";
				html+="<td><a class='unbind' href='#' data-id='"+user._id+"'>解除绑定</a></td>";
			}else if(user.device.uuids.length > 1){
				html+="<td>"+user.device.uuids[0]+"</td>";
				html+="<td>"+"修改"+"</td>";
				html+="<td><a class='unbind' href='#' data-id='"+user._id+"'>解除绑定</a></td>";
			}
			else{
				html+="<td>"+"暂无"+"</td>";
				html+="<td>"+"已解绑"+"</td>";
				html+="<td>无操作</td>";
			}
			if(typeof user.device.logDate == "undefined")
			{
				user.device.logDate = [];
			}
			if(user.device.logDate.length > 0){
				var time = new Date(user.device.logDate[user.device.logDate.length-1].timestamp).Format("yyyy-MM-dd hh:mm");
				html+="<td>"+time+"</td>";
			}
			else{
				html+="<td>"+"暂无"+"</td>";
			}
			html+="<td><a class='action' href='#' data-id='"+user._id+"'>查看发送记录</a></td>";
			html+="<td><a class='delete-user' href='#' data-id='"+user._id+"'>删除用户</a></td>"
			html+="</tr>"
			$('.list').append(html);
		}
		if(data.length == 0){
			$('.list').html("<div class='text-center'>暂无结果</div>");
		}

		$(".delete-user").off("click");
		$(".delete-user").on("click",function(e){
			e.preventDefault();
			deleteUser($(e.currentTarget).attr("data-id"));
		});

		$(".action").off("click");
		$(".action").on("click",function(e){
			e.preventDefault();
			var i = $(e.currentTarget).attr("data-id");
			getInfo(i);
		});
		$(".unbind").off("click");
		$(".unbind").on("click",function(e){
			e.preventDefault();
			var i = $(e.currentTarget).attr("data-id");
			unbind(i);
		});
	}

	var deleteUser = function(id){
		if(window.confirm('你确定要删除用户吗？')){
			$.ajax({
				type 		: "DELETE",
				dataType 	: "json",
				contentType : "application/json",
				url  		: "http://"+location.host+"/user/"+id+getSignature(),
				complete 	: function(jqXHR,textStatus){
					$.loading.hide();
					switch(jqXHR.status){
						case 200:
							var selector = "[data-id="+id+"]"
							$(selector).parent().parent().remove()
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
			return true;
		}else{
			return false;
		}
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

	var unbind = function(id){
		$.ajax({
			type 		: "POST",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/"+id+"/unbind"+getSignature(),
			complete 	: function(jqXHR,textStatus){
				$.loading.hide();
				switch(jqXHR.status){
					case 200:
						loadData(currentPage,function(data){
							setData(currentPage,data);
							setList(currentPage,data.items);
						});
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
	}

	var loadData = function(page,callback){
		$.ajax({
			type 		: "GET",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/users"+getSignature()+"&page="+page,
			complete 	: function(jqXHR,textStatus){
				$.loading.hide();
				switch(jqXHR.status){
					case 200:
						isLoadData = true;
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

	loadData(0,function(data){
		setData(0,data);
		setList(0,data.items);
	});

	$(".btn_search").off("click");
	$(".btn_search").on("click",function(){
		var tel = $(".search").val();
		if(tel == null || tel == ""){
			if(isLoadData == true){
				alert("请输入要搜索的手机号");
			}
			else{
				loadData(0,function(data){
					setData(0,data);
					setList(0,data.items);
				});
			}
		}
		else{
			$.ajax({
				type 		: "GET",
				dataType 	: "json",
				contentType : "application/json",
				url  		: "http://"+location.host+"/users/"+tel+getSignature(),
				complete 	: function(jqXHR,textStatus){
					$.loading.hide();
					switch(jqXHR.status){
						case 200:
							isLoadData = false;
							var data = jqXHR.responseJSON;
							var newData = {
								count:1,
								items:[data]
							}
							setData(0,newData);
							setList(0,[data]);
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
		}
	});
});