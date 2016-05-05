gameModule
	.factory('ChipSelectManager', [function() {
		var maxNum = 5; //最多只能选择5个筹码
		var oldtotalchips = null;
		var totalchips = null;
		var chipCount = [1,5,10,20,50,100,500,1000,5000,10000, 20000, 50000,100000, 200000, 500000,1000000,2000000, 5000000,10000000, 20000000,50000000,100000000]
		var server = {
			Init: Init,
			SelectChips: SelectChips,
			GetTotalChips: GetTotalChips,
			GetChipSelect: GetChipSelect,
			GetSelectChips: GetSelectChips,
			GetOldTotalChips: GetOldTotalChips,
			ChipGoLeft:ChipGoLeft,
			ChipGoRight:ChipGoRight,
			Destory: Destory
		}
		return server;

		function Init() {
			oldtotalchips = null;
			var len = chipCount.length;
			for (var i = 0; i < len; i++) {
				var chip = {
					src: '',
					count: 0,
					selected: false
				}
				chip.src = 'img/game/chipSelect/' + chipCount[i]+ '.png';
				chip.count = chipCount[i];
				if (totalchips == null) {
					totalchips = new Array();
				}
				totalchips.push(chip);
			}

		}
		//从所有筹码中选出5个筹码
		function SelectChips(index) {
			if (maxNum >= 5) {
				if (totalchips[index].selected) {
					maxNum--;
					totalchips[index].selected = !totalchips[index].selected
				} else {
					return null;
				}
			} else {
				if (totalchips[index].selected) {
					maxNum--;
					totalchips[index].selected = !totalchips[index].selected
				} else {
					maxNum++;
					totalchips[index].selected = !totalchips[index].selected
				}
			}
			return totalchips;
		}

		function GetTotalChips() {
			oldtotalchips = totalchips;
			return totalchips;
		}

		function GetOldTotalChips() {
			totalchips = oldtotalchips;
			return totalchips;
		}
		//根据限额获取筹码
		function GetChipSelect(limitpos) {
			if(limitpos==null || limitpos.length<=0){
				return;
			}
			var maxlimit = limitpos[1];
			var index = 0;
			var arr = [];
			var len = totalchips.length
			for (var key = 0; key < len; key++) {
				if (totalchips[key].count <= maxlimit && totalchips[key + 1].count > maxlimit) {
					index = key;
					break;
				}
			}
			if (index >= 4) {
				for (var i = index - 4; i <= index; i++) {
					totalchips[i].selected = true;
					arr.push(totalchips[i]);
				}
			} else {
				for (var j = 0; j < 5; j++) {
					totalchips[j].selected = true;
					arr.push(totalchips[j]);
				}
			}
			return arr;
		}
		//选择筹码
		function GetSelectChips() {
			var len = totalchips.length;
			var arr = [];
			for (var i = 0; i < len; i++) {
				if (totalchips[i].selected == true) {
					arr.push(totalchips[i]);
				}
			}
			return arr;
		}
		//点击左移按钮
		function ChipGoLeft(){
			if(totalchips && totalchips[0].selected){
				return null;
			}
			var len = totalchips.length;
			var arr = [];
			for (var i = 1; i < len; i++) {
				if (totalchips[i].selected && totalchips[i-1].selected==false) {
					totalchips[i-1].selected=true;
					totalchips[i+4].selected=false;
				}
				if(totalchips[i-1].selected){
					arr.push(totalchips[i-1]);
				}
			}
			return arr;
		}
		//点击右移按钮
		function ChipGoRight(){
			if(totalchips && totalchips[totalchips.length-1].selected){
				return null;
			}
			var len = totalchips.length;
			var arr = [];
			for (var i = len-2; i >=0; i--) {
				if (totalchips[i].selected && totalchips[i+1].selected==false) {
					totalchips[i+1].selected=true;
					totalchips[i-4].selected=false;
				}
				if(totalchips[i+1].selected){
					arr.unshift(totalchips[i+1]);
				}
			}
			return arr;
		}
		function Destory() {
			oldtotalchips = null;
			totalchips = null;
		}
	}])