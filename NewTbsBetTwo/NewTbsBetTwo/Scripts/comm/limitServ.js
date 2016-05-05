/*
 * 解析限额
 */
commModule
	.factory('LimitServ', ['$rootScope', function($rootScope) {
		var gamekindlimit=null;//对应游戏限额
		var memBetLimit=null;//游戏限额索引
		var lcBetLimit=null;//默认限额
		var lcBetLimitByPos=null;//游戏限额
		var parmas=null;//当前桌台信息
		var BetPosMultiple = {
			Player: 1, // 闲、虎
			Banker: 1, // 庄、龙
			Tie: 0.1, // 和
			PlayerPair: 0.1, // 闲对
			BankerPair: 0.1, // 装对
			Big: 1, // 大
			Small: 1, // 小

			//最大
			One: 1, // 单注
			Two: 2, // 双注
			Three: 3, // 三注
			Four: 4, // 角注
			Six: 6, // 线注
			Dozen: 10 / 4, // 打
			Column: 10 / 4, // 列
			RedOrBack: 10, // 红黑
			BigOrSmall: 10, // 大小
			SingleOrDouble: 10, // 单双
			//最小
			minbet: 10 / 50,
		}
		var server = {
			//大厅
			GetParmaLimit: GetParmaLimit, //解析限额
			SetLimitArray:SetLimitArray,//分析限额
			DestoryLobby:DestoryLobby,
			
			SetCurrentParmas:SetCurrentParmas,//获取当前桌台
			GetLimit:GetLimit,
			GetBaccMaxLimit: GetBaccMaxLimit,
			GetBaccMinLimit: GetBaccMinLimit,
			GetRoulBetLimit:GetRoulBetLimit,
			DestoryGame:DestoryGame
		}
		return server
		//解析登陆获取限额
		function GetParmaLimit(data) {
			if(data==null){
				return;
			}
			//解析游戏限额索引
			var limitarr=data.UserLimit.split(';');
			var limitlen=limitarr.length;
			for(var i=0;i<limitlen;i++){
				if(gamekindlimit==null){
					gamekindlimit=new Array();
				}
				var arrlimit=limitarr[i].split('#');
				gamekindlimit.push(arrlimit);
			}
			//解析游戏具体限额
			var index = 0;
			var ulimit = data.SystemLimit.split(';');
			var ulen = ulimit.length;
			while ((index < ulen)) {
				var limit = ulimit[index].split('#');
				if (limit.length == 3) {
					if (lcBetLimit == null) {
						lcBetLimit = new Array();
					}
					if (lcBetLimitByPos == null) {
						lcBetLimitByPos = new Array();
					}
					lcBetLimit[parseInt(limit[0])] = limit[1].split('|');
					lcBetLimitByPos[parseInt(limit[0])] = limit[2].split('|');
					var arr = lcBetLimitByPos[parseInt(limit[0])];
					var ind = 0;
					var len = arr.length;
					for (ind; ind < len; ind++) {
						if (arr[ind] == "" || arr[ind] == null) {
							arr[ind] = lcBetLimit[parseInt(limit[0])];
						} else {
							arr[ind] = arr[ind].split(",");
						}
					}
					lcBetLimitByPos[parseInt(limit[0])] = arr;
				}
				index++;
			}
		}
		//解析桌台限额数据
		function SetLimitArray(limittype, table) {
			var index = 0;
			var limitList = new Array;
			if(gamekindlimit==null){
				return;
			}
			var len=gamekindlimit.length;
			for(var k=0;k<len;k++){
				if(parseInt(gamekindlimit[k][0])==table.GameKind){
					var arrlimit=new Array();
						arrlimit.push(gamekindlimit[k][1]);
						arrlimit.push(gamekindlimit[k][2]);
						memBetLimit=arrlimit;
					break;
				}
			}
			if ((((memBetLimit == null) || limittype <= 0) || limittype > memBetLimit.length)) {
				return limitList;
			}
			var limit = memBetLimit[limittype - 1].split("|");
			if ((limit && limit.length > 0)) {
				while ((index < limit.length)) {
					var limitID = limit[index];
					var arr = lcBetLimitByPos[limitID];
					if ((arr && table.GameKind <= arr.length)) {
						var list = arr[table.GameKind - 1];
						if (list) {
							limitList.push([limitID, list.join("-")]);
							var i = limitList.length - 1
							for (i; i > 0; i--) {
								for (var j = 0; j < i; j++) {
									if (limitList[j][1] == limitList[i][1]) {
										limitList.pop();
									}
								}
							}
						}
					}
					index++;
				}
			}
			return limitList;
		}
		function SetCurrentParmas(data){
			if(data!=null){
				parmas=data
			}
		}
		function GetLimit() {
			if (lcBetLimitByPos && parmas && parmas.limit && parmas.table) {
				var list = lcBetLimitByPos[parmas.limit[0]];
				var limitByPos = list[parmas.table.GameKind - 1];
			}
			return limitByPos;
		}
		//百家乐投注位置最大限额
		function GetBaccMaxLimit() {
			var limitByPos = GetLimit();
			if (limitByPos == null) {
				return;
			}
			var maxLimit = limitByPos[1];
			var maxlimit = [maxLimit * BetPosMultiple.Player, maxLimit * BetPosMultiple.Banker, maxLimit * BetPosMultiple.Tie, maxLimit * BetPosMultiple.PlayerPair, maxLimit * BetPosMultiple.BankerPair, maxLimit, maxLimit, maxLimit, maxLimit];
			return maxlimit;
		}
		//百家乐投注位置最小限额
		function GetBaccMinLimit() {
			var limitByPos = GetLimit();
			if (limitByPos == null) {
				return;
			}
			var minLimit = limitByPos[0]
			var minlimit = [minLimit * BetPosMultiple.Player, minLimit * BetPosMultiple.Banker, minLimit * BetPosMultiple.Tie, minLimit * BetPosMultiple.PlayerPair, minLimit * BetPosMultiple.BankerPair, minLimit, minLimit, 0, 0]
			return minlimit;
		}
		//轮盘投注位置最大限额
		function GetRoulBetLimit() {
			var limitByPos = GetLimit();
			if (limitByPos == null) {
				return;
			}
			var maxlimit = limitByPos[1];
			var minLimit = limitByPos[0]
			var maxLimitArr=new Array();
			var minLimitArr=new Array();
			var index=0
			//一连37个
			for(index=0;index<37;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.One;
				minLimitArr[index]=minLimit;
			}
			//二连60个
			for(index;index<97;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.Two;
				minLimitArr[index]=minLimit;
			}
			//三连14个
			for(index;index<111;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.Three;
				minLimitArr[index]=minLimit;
			}
			//四连22个
			for(index;index<133;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.Four;
				minLimitArr[index]=minLimit;
			}
			//六连11个
			for(index;index<144;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.Four;
				minLimitArr[index]=minLimit;
			}
			//other6个
			for(index;index<150;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.BigOrSmall;
				minLimitArr[index]=maxlimit*BetPosMultiple.minbet;
			}
			//打，列6个
			for(index;index<156;index++){
				maxLimitArr[index]=maxlimit*BetPosMultiple.Dozen;
				minLimitArr[index]=maxlimit*BetPosMultiple.minbet;
			}
			//未完成，组装轮盘位置投注限额
			return [maxLimitArr,minLimitArr];
		}
		//轮盘投注位置最小限额
		function GetRoulMinLimit() {
			//未完成
			return minlimit;
		}
		function DestoryGame(){
			parmas=null;
		}
		function DestoryLobby(){
			parmas=null;
			gamekindlimit=null;//对应游戏限额
			memBetLimit=null;//游戏限额索引
			lcBetLimit=null;//默认限额
			lcBetLimitByPos=null;//游戏限额
		}
	}])