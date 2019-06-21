'use strict';

$(document).ready(function(){

    $.ajax({
        type 		: "GET",
        dataType 	: "json",
        contentType : "application/json",
        url  		: "http://"+location.host+"/cusad"+getSignature(),
        complete 	: function(jqXHR,textStatus){
            switch(jqXHR.status){
                case 200:
                    var images = jqXHR.responseJSON;
                    $(".i4").attr("src","http://"+location.host+images.a4);
                    $(".i56").attr("src","http://"+location.host+images.a5);
                    $(".i6p").attr("src","http://"+location.host+images.a6p);
                    break;
                default:
                    alert("错误: "+jqXHR.responseText);
                    break;
            }
        }
    });

    $(".b4").on("click",function(e){
        e.preventDefault();
        var img = $('input.f4').val();
        if(!img){
            alert("请选择图片");
            return;
        }
        var fileExtension = img.split('.').pop().toLowerCase();
        if(fileExtension != "jpg" && fileExtension != "jepg" && fileExtension != "png"){
            alert("请选择JPG/PNG类型的图片");
            return;
        }
        $.loading.show("上传中...");
        var formData = new FormData($( ".f4" )[0]);
        $.ajax({
            url:  "http://"+location.host+"/upload4"+getSignature(),
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
                $.loading.hide();
                $(".i4").attr("src","http://"+location.host+returndata.src);
                $('input.f4').val("");
                alert("上传成功");
            },
            error: function (returndata) {
                $.loading.hide();
                alert(returndata.responseJSON.error);
            }
        });
    });

    $(".b56").on("click",function(e){
        e.preventDefault();
        var img = $('input.f56').val();
        if(!img){
            alert("请选择图片");
            return;
        }
        var fileExtension = img.split('.').pop().toLowerCase();
        if(fileExtension != "jpg" && fileExtension != "jepg" && fileExtension != "png"){
            alert("请选择JPG/PNG类型的图片");
            return;
        }
        $.loading.show("上传中...");

        var formData = new FormData($( ".f56" )[0]);
        $.ajax({
            url:  "http://"+location.host+"/upload56"+getSignature(),
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
                $.loading.hide();
                $(".i56").attr("src","http://"+location.host+returndata.src);
                $('input.f56').val("");
                alert("上传成功");
            },
            error: function (returndata) {
                $.loading.hide();
                alert(returndata.responseJSON.error);
            }
        });
    });

    $(".b6p").on("click",function(e){
        e.preventDefault();
        var img = $('input.f6p').val();
        if(!img){
            alert("请选择图片");
            return;
        }
        var fileExtension = img.split('.').pop().toLowerCase();
        if(fileExtension != "jpg" && fileExtension != "jepg" && fileExtension != "png"){
            alert("请选择JPG/PNG类型的图片");
            return;
        }
        $.loading.show("上传中...");
        var formData = new FormData($( ".f6p" )[0]);
        $.ajax({
            url:  "http://"+location.host+"/upload6p"+getSignature(),
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
                $.loading.hide();
                $(".i6p").attr("src","http://"+location.host+returndata.src);
                $('input.f6p').val("");
                alert("上传成功");
            },
            error: function (returndata) {
                $.loading.hide();
                alert(returndata.responseJSON.error);
            }
        });
    });
});