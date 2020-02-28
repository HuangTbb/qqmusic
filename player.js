(function(window) {
	function Player($audio) {
		return new Player.prototype.init($audio);
	}
	Player.prototype = {
		constructor : Player,
		musicList : [],
		init: function($audio) {
			this.$audio = $audio;
			this.audio = $audio.get(0);
		},
		currentIndex: -1,
		playMusic: function(index, music) {
			//判断是否是同一首音乐
			if(this.currentIndex == index) {
				//同一首音乐
				if(this.audio.paused) {
					this.audio.play();
				}else {
					this.audio.pause();
				}
			}else {
				//不是同一首
				this.$audio.attr('src', music.link_url);
				this.audio.play();
				this.currentIndex = index;
			}
			
		},
		preplay: function() {
			var $index = this.currentIndex -1;
			console.log(this.currentIndex)
			if($index < 0) {
				$index = this.musicList.length - 1;
			}
			return $index;
		},
		nextPlay: function() {
			var $index = this.currentIndex +1;
			console.log(this.currentIndex);
			if($index > this.musicList.length - 1) {
				$index = 0;
			}
			return $index;
		},
		delchangeMusicList: function(index, deleitem) {
			// 判断删除的是不是正在播放的歌曲
			if (deleitem.get(0).index == this.currentIndex) {
				//如果是正在播放的歌曲,播放下一首
				$('.music_next').trigger('click');
			}
			deleitem.remove();
			//删除对应的数据
			this.musicList.splice(index, 1);
			
			//判断当前删除的是否是正在播放音乐的前面的音乐
			if(index < this.currentIndex) {
				this.currentIndex = this.currentIndex -1;
			}
			
			//重新排序
			$('.list_music').each(function(index, ele) {
				ele.index = index;
				$(ele).find('.list_number').text(index + 1);
			})
			
			
			
		},
		musicTimeUpdate: function(callback) {
			var $this = this;
			this.$audio.on('timeupdate', function() {
				var $duration = $this.audio.duration || '0';
				var $currentTime = $this.audio.currentTime;
			    var formattime = $this.formatTime($duration, $currentTime);
				$('.music_progress_toptime').text(formattime);
				callback($duration, $currentTime, formattime);
			})
		},
		formatTime : function($duration, $currentTime) {        //格式化时间
			var $durMin = parseInt($duration / 60);
			var $durSec = parseInt($duration % 60);
			if($durMin < 10) {
				$durMin = '0' + $durMin;
			}
			if($durSec < 10) {
				$durSec = '0' + $durSec;
			}
			
			var $curMin = parseInt($currentTime / 60);
			var $curSec = parseInt($currentTime % 60);
			if($curMin < 10) {
				$curMin = '0' + $curMin;
			}
			if($curSec < 10) {
				$curSec = '0' + $curSec;
			}
			return $curMin + ':' + $curSec + ' / ' + $durMin + ':' + $durSec;
		},
		setMusictime: function(scale) {
			if(isNaN(scale)) return;
			this.audio.currentTime = this.audio.duration * scale;
		},
		musicVoice: function(value) {
			if(isNaN(value)) return;
			if(value <0 || value > 1) return;
			//0~1
			this.audio.volume = value;
		},
	
	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;	
}(window));