'use strict';
$(document).ready(function() {
  const username = $.cookie('userName');
  if (username == null) {
    location.href = '/';
    return;
  }
  const channel = $.cookie('channel');
  if (parseInt(channel) != 2) {
    location.href = '/';
    return;
  }
  let list = [];
  const items_per_page = 10;
  const getInfo = function(index) {
    const data = list[index];
    $('#pagination-modal').pagination(data.content.handphones.length, {
      current_page: 0,
      num_display_entries: 5,
      callback(page_id) {
        $('.message').html('');
        for (let i = 0; i < items_per_page; i++) {
          let index = parseInt(page_id * items_per_page) + parseInt(i);
          if (index >= data.content.handphones.length) {
            break;
          }
          let tel = data.content.handphones[index];
          let html = '<tr>';
          html += '<td>' + tel + '</td>';
          html += '</tr>';
          $('.message').append(html);
        }
      },
      load_first_page: true,
      prev_text: '«',
      next_text: '»',
    });

    $('#message-modal').modal();
  };

  var setData = function(page, data) {
    $('#pagination').pagination(data.count, {
      current_page: page,
      num_display_entries: 5,
      callback(page_id) {
        loadData(page_id, function(data) {
          setData(page_id, data);
          setList(page_id, data.items);
        });
      },
      load_first_page: false,
      prev_text: '«',
      next_text: '»',
    });
  };

  var setList = function(page_id, data) {
    list = data;
    $('.list').html('');
    for (let i = 0; i < data.length; i++) {
      const sms = data[i];
      let html = '<tr>';
      html += '<td>' + sms.content.senddate + '</td>';
      html += '<td>' + sms.content.producename + '</td>';
      html += '<td>' + sms.content.smsbody + '</td>';
      html += '<td>' + sms.content.senduser + '</td>';
      html += "<td><a class='action' href='#' data-id='" + i + "'>查看发送手机列表</a></td>";
      html += '</tr>';
      $('.list').append(html);
    }
    if (data.length == 0) {
      $('.list').html("<div class='text-center'>暂无结果</div>");
    }
    $('.action').off('click');
    $('.action').on('click', function(e) {
      e.preventDefault();
      const i = $(e.currentTarget).attr('data-id');
      getInfo(i);
    });
  };

  var loadData = function(page, callback) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      url: 'http://' + location.host + '/record' + getSignature() + '&page=' + page,
      complete(jqXHR, textStatus) {
        $.loading.hide();
        switch (jqXHR.status) {
          case 200:
            if (callback) {
              callback(jqXHR.responseJSON);
            }
            break;
          case 403:
          case 401:
            location.href = '/';
            break;
          default:
            alert('错误: ' + jqXHR.responseText);
            break;
        }
      },
    });
  };

  loadData(0, function(data) {
    setData(0, data);
    setList(0, data.items);
  });

});
