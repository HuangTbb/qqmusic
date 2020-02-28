(function(window) {
	function Progress($music_progress_bar, $music_progress_barline, $music_progress_bardot) {
		return new Progress.prototype.init($music_progress_bar, $music_progress_barline, $music_progress_bardot);
	}
	Progress.prototype = {
		constructor: Progress,
		isMove: false,
		init : function($music_progress_bar, $music_progress_barline, $music_progress_bardot) {
			this.$music_progress_bar = $music_progress_bar;
			this.$music_progress_barline = $music_progress_barline;
			this.$music_progress_bardot = $music_progress_bardot;
		},
		progressClick: function(callback) {
			var $this = this;
			this.$music_progress_bar.click(function(event) {
				//获取背景条距窗口的宽度
				var normalLeft = $(this).offset().left;
				//获取点击的位置距窗口的宽度
				var eventLeft = event.pageX;
				//修改前景条的宽度
				$this.$music_progress_barline.css('width',eventLeft - normalLeft);
				$this.$music_progress_bardot.css('left', eventLeft - normalLeft);
				
				//前景进度条与背景进度条的比例
				var scale = (eventLeft - normalLeft) / $(this).width();
				callback(scale);
			});
		},
		progressDrag: function(callback) {
			var $this = this;
			var normalLeft = this.$music_progress_bar.offset().left;
			var barWidth = this.$music_progress_bar.width();
			var eventLeft;
			//监听鼠标的按下事件
			this.$music_progress_bar.mousedown(function(event) {
				$this.isMove = true;
				//监听鼠标的移动事件
				$(document).mousemove(function(event) {
					eventLeft = event.pageX;
					var offset = eventLeft - normalLeft;
					if(offset >=0 && offset <= barWidth) {
						$this.$music_progress_barline.css('width',eventLeft - normalLeft);
						$this.$music_progress_bardot.css('left', eventLeft - normalLeft);
						
					}
					
				});
				
			});
			//监听鼠标的抬起事件
			$(document).mouseup(function(event) {
				$(document).off('mousemove');
				$this.isMove = false;
				//前景进度条与背景进度条的比例
				var scale = (eventLeft - normalLeft) / $this.$music_progress_bar.width();
				callback(scale);
			});
		
		},
		
		setPorgressLen: function(value) {
			if(this.isMove) return;
			if(value < 0 || value > 100) return;
			this.$music_progress_barline.css('width', value+'%');
			this.$music_progress_bardot.css('left', value + '%');
		}
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
	
}(window))