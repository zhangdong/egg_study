'use strict';

$(document).ready(function() {
  $('.btn_log').off('click');
  $('.btn_log').on('click', function(e) {
    e.preventDefault();
    let userName = $('input[type=text]').val();
    let password = $('input[type=password]').val();

    if (userName == '' || password == '') {
      alert('账户或者密码不能为空');
      return;
    }
    $('.btn_log').text('登录中...');
    $('.btn_log').attr('disabled', 'disabled');

    let signature = $.param(getSignature());
    //		console.log(signature);
    let payload = { username: userName, password };
    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      url: 'http://' + location.host + '/login' + getSignature(),
      data: JSON.stringify(payload),
      beforeSend(xhr,settings){
				var csrftoken = $.cookie('csrfToken');
				if(csrftoken){
					xhr.setRequestHeader('x-csrf-token', csrftoken);
				}
			},
      complete(jqXHR,textStatus){
				$(".btn_log").text("登录");
				$(".btn_log").removeAttr("disabled");
				switch(jqXHR.status){
					case 200:
						$.cookie('userName',userName);
						var jj = JSON.parse(jqXHR.responseText);
						var user = jqXHR.responseJSON;
						$.cookie('nickname',user.nickname);
						$.cookie('userid',user._id);

						if(typeof user.isChannel != "undefined" && user.isChannel == true){
							$.cookie('channel',"1");
							location.href = "channel";
						}
						else{
							$.cookie('channel',"2");
							location.href = "userlist";
						}
						break;
					default:
						alert("错误: "+jqXHR.responseText);
						break;
				}
			},
    });
  });
});
