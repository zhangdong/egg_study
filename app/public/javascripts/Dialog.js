
/**
 * 对话框组件
 * @author Saiya
 * @email evecalm@live.com
 *
 * 依赖文件
 *  1. zepto.js, jquery.js
 *  2. dialog.css
 *  3. css/images/loading-white.gif
 *
 * 该组件包含三部分
 *   $.dialog   对话框
 *   $.popup    弹出框(过一段时间自动消失)
 *   $.loading  加载浮层
 * 使用方法分别如下
 * 1. $.dialog
 *   //直接调用, 调用完即显示
 *   $.dialog({
 *      title: '提示', //对话框标题, 可选, 默认为"提示"
 *      content: '无提示内容', //对话框内容, 不填即为"无提示内容"
 *      cancel: '取消',//取消按钮文字, 默认为"取消", 想要不显示则给其赋值 false
 *      ok: '确认',//确认按钮文字, 可选, 默认为"确认"
 *      cancelCB: null,//取消按钮的回调函数,可选
 *      okCB: null//确认按钮的回调函数, 可选
 *   });
 *
 *   对话框显示后, 可调用 $.dialog.hide() 隐藏, 调用 $.dialog.show() 显示
 *   想要修改dialog显示的内容, 再次调用$.dialog({...})即可
 *
 * 2. $.popup
 *   //直接调用, 传递内容即可, 调用完即显示
 *   $.popup('更新成功');
 *   //popup默认2s后消失, 若想修改显示时间则可以给其传递额外参数
 *   $.popup({
 *     content: '更新成功', //显示的内容
 *     time: 3000 //显示时间, 单位为毫秒
 *   });
 *
 * 3. $.loading
 *   //直接调用, 调用完即显示一个加载的转圈圈动画
 *   $.loading();
 *   //若想给动画下添加文字, 传递内容即可
 *   $.loading('拼命加载中...');
 *
 *  加载蒙层显示后, 调用 $.loading.hide() 隐藏, 调用 $.loading.show() 显示
 *  想要修改loading显示的内容, 再次调用$.loading(...)即可
 */

(function ($) {
	var defaultConfigs = {
			title: '提示',
			content: '无提示内容',
			cancel: '取消',
			ok: '确认',
			cancelCB: null,
			okCB: null
		},
		dialogTpl = '<table class="m-dlg"><tr><th class="m-title" colspan="2">{title}</th></tr><tr><td colspan="2" class="m-content">{content}</td></tr><tr class="m-btns"><td class="cancel">{cancel}</td><td class="confirm">{ok}</td></tr></table>',
		dialog = function (configs) {
			dialog.init($.extend({},defaultConfigs,configs));
		},
		popup = function (configs) {
			if (typeof configs !== 'object') {
				configs = {
					content: configs || '无提示内容'
				};
			}
			popup.init(configs);
		},
		loading = function (text) {
			loading.init(text);
		};
	notice = function (text) {
		notice.init(text);
	};
	dialog.init = function (configs) {
		var me = this;
		if (!this._wrapper || !$('.m-dlg-wp').length) {
			this._wrapper = $('<div />');
			this._wrapper.html(dialogTpl);
			this._wrapper.addClass('m-dlg-wp');
			this._title = this._wrapper.find('.m-title');
			this._content = this._wrapper.find('.m-content');
			this._okBtn = this._wrapper.find('.confirm');
			this._cancelBtn = this._wrapper.find('.cancel');
			this._wrapper.on('touchstart','.m-btns td',function () {
				this.classList.add('active');
			});
			this._wrapper.on('touchend touchmove','.m-btns td',function () {
				this.classList.remove('active');
			});
			this._wrapper.appendTo(document.body);
		}
		this._title.text(configs.title);
		this._content.text(configs.content);
		this._content.text(configs.content);
		this._okBtn.text(configs.ok);
		this._cancelBtn.off('click');
		if (configs.cancel !== false) {
			this._cancelBtn.text(configs.cancel).show();
			this._okBtn.addClass('border');
			this._cancelBtn.on('click',function (e) {
				me._wrapper.removeClass('show');
				configs.cancelCB && configs.cancelCB.call(null, e);
			});
		} else {
			this._okBtn.removeClass('border');
			this._cancelBtn.hide();
		}
		this._okBtn.off('click');
		this._okBtn.on('click',function (e) {
			me._wrapper.removeClass('show');
			configs.okCB && configs.okCB.call(null, e);
		});
		setTimeout(function() {me._wrapper.addClass('show');}, 10);
	};
	popup.init = function (configs) {
		var me = this;
		if (!this._wrapper || !$('.m-popup-wp').length) {
			this._wrapper = $('<div />');
			this._wrapper.addClass('m-popup-wp');
			this._wrapper.html('<div class="m-content"></div>');
			this._content = this._wrapper.find('.m-content');
			this._wrapper.appendTo(document.body);
		}
		this._content.text(configs.content);
		configs.time = + configs.time;
		configs.time = isNaN(configs.time) || configs.time < 0 ? 2000 : configs.time;
		setTimeout(function() {me._wrapper.addClass('show');}, 10);
		clearTimeout(this.timer);
		this.timer = setTimeout(function () {
			me._wrapper.removeClass('show');
		}, configs.time);
	};
	loading.init = function (text) {
		var me = this;
		if (!this._wrapper || !$('.m-ldg-wp').length) {
			this._wrapper = $('<div />');
			this._wrapper.addClass('m-ldg-wp');
			this._wrapper.html(' <div class="m-content"><div class="m-inner"><div class="m-text"></div></div></div>');
			this._text = this._wrapper.find('.m-text');
			this._wrapper.appendTo(document.body);
		}
		this._text.text( text || '');
		setTimeout(function() {me._wrapper.addClass('show');}, 10);
	};
	notice.init = function (text) {
		var me = this;
		if (!this._wrapper || !$('.m-ldg-wp').length) {
			this._wrapper = $('<div />');
			this._wrapper.addClass('m-ldg-wp');
			this._wrapper.html('<div class="share-notice"><img src="images/notice.png" width="320" height="480"></div>');
			this._text = this._wrapper.find('.m-text');
			this._wrapper.appendTo($('.content_main'));
		}
		this._text.text( text || '');
		setTimeout(function() {if(typeof me._wrapper != null){me._wrapper.addClass('show');}}, 10);


	};
	dialog.show = function () {
		if (this._wrapper && $('.m-dlg-wp').length) {
			this._wrapper.addClass('show');
		}
	};
	dialog.hide = function () {
		if (this._wrapper && $('.m-dlg-wp').length) {
			this._wrapper.removeClass('show');
		}
	};
	loading.show = function () {
		if (this._wrapper && $('.m-ldg-wp').length) {
			this._wrapper.addClass('show');
		}
	};
	notice.show = function () {
		if (this._wrapper && $('.m-ldg-wp').length) {
			this._wrapper.addClass('show');
		}

	};
	loading.hide = function () {
		if (this._wrapper && $('.m-ldg-wp').length) {
			this._wrapper.removeClass('show');
		}
	};
	notice.hide = function () {
		if (this._wrapper && $('.m-ldg-wp').length) {
			this._wrapper.removeClass('show');
		}
	};
	$.dialog = dialog;
	$.popup = popup;
	$.loading = loading;
	$.notice = notice;
})($);