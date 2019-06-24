/**
 * Created by ccmoving on 14/10/20.
 */

$(document).ready(function(){
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
	var data = [];

	var loadData = function(){
		$.ajax({
			type 		: "GET",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/admin-users"+getSignature(),
			complete 	: function(jqXHR,textStatus){
				switch(jqXHR.status){
					case 200:
						$(".list").html("");
						data = jqXHR.responseJSON;
						for(var i = 0; i < data.length; i++){
							var user = data[i];
							var html = "<tr>";
							html+="<td>"+user.username+"</td>";
							html+="<td>"+user.nickname+"</td>";
							html+="<td><a class='action' href='#' data-id='"+i+"'>更新</a></td>";
							html+="</tr>"
							$('.list').append(html);
						}

						$(".action").off("click");
						$(".action").on("click",function(e){
							e.preventDefault();
							var i = $(e.currentTarget).attr("data-id");
							update(i);
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

	$(".add").off("click");
	$(".add").on("click",function(e){
		e.preventDefault();
		var username = $(".username1").val();
		var nickname = $(".nickname1").val();
		var password = $(".pwd1").val();
		var body = {username:username,
				password:password,
				nickname:nickname,
				isChannel:true};
		if(body.username == "" || body.password == "" || body.nickname == ""){
			alert("不能为空");
			return;
		}
		$.ajax({
			type 		: "POST",
			dataType 	: "json",
			contentType : "application/json",
			url  		: "http://"+location.host+"/admin-user/"+getSignature(),
			beforeSend(xhr,settings){
				var csrftoken = $.cookie('csrfToken');
				if(csrftoken){
					xhr.setRequestHeader('x-csrf-token', csrftoken);
				}
			},
			data        : JSON.stringify(body),
			complete 	: function(jqXHR,textStatus){
				$.loading.hide();
				switch(jqXHR.status){
					case 201:
					case 200:
						alert("添加成功");
						loadData();
						$("#user-add-modal").modal("hide");
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
	});

	$(".addNew").off("click");
	$(".addNew").on("click",function(e){
		$("#user-add-modal").modal();
	});

	loadData();
	var update = function(i){
		var user = data[i];
		$(".deleteUser").off("click");
		$(".deleteUser").on("click",function(e){
			e.preventDefault();
			if(window.confirm('你确定要删除用户吗？')){
				$.ajax({
					type 		: "DELETE",
					dataType 	: "json",
					contentType : "application/json",
					url  		: "http://"+location.host+"/admin-user/"+user._id+getSignature(),
					beforeSend(xhr,settings){
						var csrftoken = $.cookie('csrfToken');
						if(csrftoken){
							xhr.setRequestHeader('x-csrf-token', csrftoken);
						}
					},
					complete 	: function(jqXHR,textStatus){
						switch(jqXHR.status){
							case 200:
								loadData();
								$("#user-modal").modal("hide");
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
		$(".update").off('click');
		$(".update").on("click",function(e){
			e.preventDefault();
			var nickname = $(".nickname").val();
			var password = $(".pwd").val();
			if(nickname == ""){
				alert("姓名不能为空");
				return;
			}
			if(nickname == user.nickname && password == "")
			{
				alert("没有需要更新的项");
				return;
			}
			var body = {};
			if(nickname != "")
				body["nickname"] = nickname;
			if(password != ""){
				body["password"] = password;
			}
			if(window.confirm('你确定要更新用户信息吗？')){
				$.ajax({
					type 		: "PUT",
					dataType 	: "json",
					contentType : "application/json",
					url  		: "http://"+location.host+"/admin-user/"+user._id+getSignature(),
					data        : JSON.stringify(body),
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
								alert("更新成功");
								loadData();
								$("#user-modal").modal("hide");
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
		$(".nickname").val(user.nickname);
		$(".username").val(user.username);
		$("#user-modal").modal();
	};
});