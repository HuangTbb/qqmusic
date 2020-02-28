$(function() {
	//0.自定义滚动条
	$('.musicList').mCustomScrollbar();

	var $audio = $('audio');
	var player = new Player($audio);
	var progress;
	var voice;
    var lynic;
	//1.加载歌曲列表
	getPlaylist();
	function getPlaylist() {
		$.ajax({
			url: "./source/musiclist.json",
			dataType: "json",
			success: function(data) {
				player.musicList = data;
				//遍历获取到的数据,创建每一条音乐
				var $musiclist = $('.musicList ul');
				$.each(data, function(index, ele) {
					var $item = createMusicItem(index, ele);
					$musiclist.append($item);
				});

				//切换歌曲信息
				toggerMusicInfo(data[0]);
				initMusicLynic(data[0]);
			},
			error: function(error) {
				console.log(error)
			}
		});
	}
	//切换歌曲信息函数
	function toggerMusicInfo(data) {
		//获取元素
		var $musicimg = $('.music_info_pic img');
		var $musicname = $('.music_name a');
		var $musicsinger = $('.music_singer a');
		var $musicalbum = $('.music_album a');
		var $musicprogressname = $('.music_progress_topname');
		var $musicprogresstime = $('.music_progress_toptime');
		var $musicbg = $('.bgImg');

		//修改元素信息
		$musicimg.attr('src', data.cover);
		$musicname.text(data.name);
		$musicsinger.text(data.singer);
		$musicalbum.text(data.album);
		$musicprogressname.text(data.name + '/' + data.singer);
		$musicprogresstime.text('00:00 / ' + data.time);
		$musicbg.css('backgroundImage', 'url("' + data.cover + '")')
	}
	
	//初始化歌词信息
	function initMusicLynic(music) {
		lynic = new Lynic(music.link_lrc);
		var $lyricContainer = $('.music_lyric');
		//清空上一首音乐的歌词
		$lyricContainer.html('');
		lynic.loadLynic(function() {
			//创建歌词列表
			$.each(lynic.lynics, function(index, ele) {
				var $item = $('<li>'+ele+'</li>');
				$lyricContainer.append($item);
			});
		});
	}
	
	//初始化进度条
	initProgress();
	function initProgress() {
		var $music_progress_bar = $('.music_progress_bar');
		var $music_progress_barline = $('.music_progress_barline');
		var $music_progress_bardot = $('.music_progress_bardot');
		progress = Progress($music_progress_bar, $music_progress_barline, $music_progress_bardot);
		progress.progressClick(function(scale) {
			player.setMusictime(scale);
		});
		progress.progressDrag(function(scale) {
			player.setMusictime(scale);
		});
		
		var $music_voice_bar = $('.music_voice_bar');
		var $music_voice_barline = $('.music_voice_barline');
		var $music_voice_bardot = $('.music_voice_bardot');
		voice = Progress($music_voice_bar, $music_voice_barline, $music_voice_bardot);
		voice.progressClick(function(scale) {
			player.musicVoice(scale);
		});
		voice.progressDrag(function(scale) {
			player.musicVoice(scale);
		});
	}
	
	//2.初始化事件监听
	initEvent();

	function initEvent() {
		//1.监听列表图标的显示隐藏
		$('.musicList').delegate('.list_music', 'mouseenter', function() {
			//显示图标
			$(this).find('.list_menu').stop().fadeIn(100);
			$(this).find('.list_time a').stop().fadeIn(0);
			//隐藏时间
			$(this).find('.list_time span').stop().fadeOut(0);
		});
		$('.musicList').delegate('.list_music', 'mouseleave', function() {
			//隐藏图标
			$(this).find('.list_menu').stop().fadeOut(100);
			$(this).find('.list_time a').stop().fadeOut(0);
			//显示时间
			$(this).find('.list_time span').stop().fadeIn(0);
		});

		//监听播放按钮事件
		var $mm;
		$('.musicList').delegate('.list_play', 'click', function() {
			$mm = $(this).parents('.list_music');
			$(this).toggleClass('list_play2');
			$mm.siblings().find('.list_play').removeClass('list_play2');
			if ($(this).attr('class') == 'list_play list_play2') {
				$('.music_play').addClass('music_play2');
				//让文字高亮
				$mm.find('div').css('color', '#fff');
				$mm.siblings().find('div').css('color', 'rgba(255,255,255,.5)');
			} else {
				$('.music_play').removeClass('music_play2');
				//让文字不高亮
				$mm.find('div').css('color', 'rgba(255,255,255,.5)');
			}
			//音频跳动图标的切换
			$mm.find('.list_number').toggleClass('list_number2');
			$mm.siblings().find('.list_number').removeClass('list_number2');

			//播放音乐
			player.playMusic($mm.get(0).index, $mm.get(0).music);

			//切换歌曲信息
			toggerMusicInfo($mm.get(0).music);
			//切换歌词信息
			initMusicLynic($mm.get(0).music);
		})

		//监听复选框的点击事件
		$('.musicList').delegate('.list_check', 'click', function() {
			if($(this)[0] == $('.list_title .list_check')[0]) {
				$(this).toggleClass('list_checked');
				$('.list_check').toggleClass('list_checked');
			}
			$(this).toggleClass('list_checked');
		});
		
		// //监听全部选中复选框事件
		// $('.list_title .list_check').click(function() {
			
		// })
		
		//监听底部播放/上一首/下一首的点击事件
		$('.music_play').click(function() {
			if (player.currentIndex == -1) {
				$('.list_music').eq(0).find('.list_play').trigger('click');
			} else {
				$('.list_music').eq(player.currentIndex).find('.list_play').trigger('click');
			}
		})
		$('.music_pre').click(function() {
			$('.list_music').eq(player.preplay()).find('.list_play').trigger('click');
		})
		$('.music_next').click(function() {
			$('.list_music').eq(player.nextPlay()).find('.list_play').trigger('click');
		})

		//监听列表删除按钮点击事件
		$('.musicList').delegate('.list_delete', 'click', function() {
			var $deleItem = $(this).parents('.list_music');

			player.delchangeMusicList($deleItem.get(0).index,$deleItem);
		})
		//监听顶部删除按钮点击事件
		$('.topdelete').click(function() {
			//找到选中复选框的条目
			var $item = $('.list_checked').parents('.list_music');
			if($item.get(0) == undefined) {
				$('.warming').css('display', 'block');
				setTimeout(function() {
					$('.warming').css('display', 'none');
				}, 2000)
			}else {
				player.delchangeMusicList($item.get(0).index, $item);
			}	
		})
		
		//监听纯净模式
		$('.music_only').click(function() {
			$(this).toggleClass('music_only2');
			if($(this).attr('class').indexOf('music_only2') != -1) {
				$('.content_left').css('display', 'none');
				$('.content_right').css('display', 'none');
				$('.pureMode').css('display', 'block');
			}else {
				$('.content_left').css('display', 'block');
				$('.content_right').css('display', 'block');
				$('.pureMode').css('display', 'none');
			}
		})
		//监听播放进度
		player.musicTimeUpdate(function($duration, $currentTime, formattime) {
			//同步时间
			$('.music_progress_toptime').text(formattime);

			//同步进度条
			var scale = $currentTime / $duration * 100;
			progress.setPorgressLen(scale);
			
			//实现歌词同步
			var index = lynic.currentIndex($currentTime);
			var $item = $('.music_lyric li').eq(index);
			$item.addClass('cur');
			$item.siblings().removeClass('cur');
			
			if(index <=1) return;
			if($('.pureMode').css('display') == 'none') {
				$('.music_lyric').css({
					marginTop: (-index + 1) * 45
				})
			}else {
				var $item = $('.pureMode .music_lyric li').eq(index);
				$item.addClass('cur');
				$item.siblings().removeClass('cur');
				$('.music_lyric').css({
					marginTop: (-index + 3) * 58
				})
			}
			
			
		});

		

		//监听声音按钮点击
		$('.music_voice_icon').click(function() {
			//图标切换
			$(this).toggleClass('music_voice_icon2');
			//声音切换
			if ($(this).attr('class').indexOf('music_voice_icon2') != -1) {
				player.musicVoice(0);
			} else {
				player.musicVoice(1);
			}
		});
		
		

	}




	//定义一个方法创建一条音乐
	function createMusicItem(index, music) {
		var $item = $('<li class="list_music">\n' +
			'<div class="list_check"><i></i></div>\n' +
			'<div class="list_number">' + (index + 1) + '</div>\n' +
			'<div class="list_name">' + music.name + '\n' +
			'<div class="list_menu">\n' +
			'<a href="javascript:;" title="播放" class="list_play"></a>\n' +
			'<a href="javascript:;" title="添加到歌单"></a>\n' +
			'<a href="javascript:;" title="下载"></a>\n' +
			'<a href="javascript:;" title="分享"></a>\n' +

			'</div>\n' +
			'</div>\n' +
			'<div class="list_singer">' + music.singer + '</div>\n' +
			'<div class="list_time">\n' +
			'<span>' + music.time + '</span>\n' +
			'<a href="javascript:;" title="删除" class="list_delete"></a>\n' +
			'</div>\n' +
			'</li>');

		$item.get(0).index = index;
		$item.get(0).music = music;
		return $item;
	}
});
