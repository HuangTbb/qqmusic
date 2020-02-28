(function(window) {
	function Lynic(path) {
		return new Lynic.prototype.init(path);
	}
	Lynic.prototype = {
		constructor : Lynic,
		init: function(path) {
			this.path = path;
		},
		times:[],
		lynics: [],
		index: -1,
		loadLynic : function(callBack) {
			var $this = this;
			$.ajax({
				url: $this.path,
				dataType: 'text',
				success: function(data) {
					$this.parseLynic(data);
					callBack();
				},
				error: function(e) {
					console.log(e);
				}
			});
		},
		parseLynic : function(data) {
			var $this = this;
			//一定要清空上一首的信息
			$this.times = [];
			$this.lynics = [];
			var array = data.split('\n');
			var reg = /\[(\d*:\d*\.\d*)\]/;
			//遍历每一条歌词
			$.each(array, function(index, ele) {
				//处理歌词
				var lic = ele.split(']')[1];
				if(lic.length == 1) return true;
				$this.lynics.push(lic);
				
				var timeReg = reg.exec(ele);
				if(timeReg == null) return true;
				var timeStr = timeReg[1];
				var res2 = timeStr.split(':');
				var min = parseInt(res2[0]) * 60;
				var sec = parseFloat(res2[1]);
				var time = parseFloat(Number(min + sec).toFixed(2));
				$this.times.push(time);
			})
		},
		currentIndex: function(currentTime) {
			if(currentTime >= this.times[0]){
				this.index++;
				this.times.shift();
			}
			return this.index;
		}
	},
	Lynic.prototype.init.prototype = Lynic.prototype;
	window.Lynic = Lynic;	
}(window));