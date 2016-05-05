gameModule
	.factory("SoundServ", ['$http', '$rootScope', '$q', 'CommFun', function($http, $rootScope, $q, CommFun) {
		var sounddata; //声音数据
		var server = {
			GetSoundData: GetSoundData,
			LoadXml: LoadXml,
			PlayAudio: PlayAudio,
			Destroy: Destroy
		}
		return server;

		function GetSoundData() {
			$rootScope.isStopPlay = true;
			$rootScope.isFirstPlay = true;
			$rootScope.Sound = {
				Bacc_en: "Bacc_en", // 百家乐(english)
				Bacc_zh: "Bacc_zh", // 百家乐(中文)
				Roul_en: "Rou_en", // 轮盘(english)
				Roul_ch: "Rou_ch", // 轮盘(中文)
				Dran_en: "Dt_en", // 龙虎(english)
				Dran_ch: "Dt_ch", // 龙虎(中文)
				//gameStatus游戏状态
				EnterGame: "enter", // 进入游戏GameBaseClass.CreateGameClient
				StartBet: "betstart", // 开始投注GameClass.SubGameSubCmd
				BetSuccess: "betsuccess", // 投注成功GameBaseClass.BetReturnMessage
				StopBet: "betstop", // 停止投注GameClass.SubGameSubCmd
				GameWin: "win", // 游戏输赢PKShowBaseManager.ShowResultBg
				GameResoult: "resoult", // 结果点数,PKShowBaseManager.ShowResultBg
				ChangeBoot: "changeboot", // 更换牌靴,GameClass.SubGameSubCmd
				ChangeTable: "changetable", // 更换桌台
				LackBalance: "balance", // 余额不足GameBaseClass.OnSendBet
				Thank: "thanks", // 感谢小费
				NoBet: "nobet", // 没有下注GameBaseClass.SaveRepeatBetList
				SitDown: "sitdown", // 坐下GameBaseClass.InitGameClass
				//gameWin游戏输赢；第1位:0和,1庄赢,2闲赢； 第2位:0无,1庄对；第3位:0无,1闲对
				Banker: "100", // 庄赢
				BankerP: "101", // 庄赢闲对
				BankerB: "110", // 庄赢庄对
				BankerBP: "111", // 庄赢庄对闲对
				Tie: "000", // 和
				TieP: "001", // 和闲对
				TieB: "010", // 和庄对
				TieBP: "011", // 和庄对闲对
				Player: "200", // 闲赢
				PlayerP: "201", // 闲赢闲对
				PlayerB: "210", // 闲赢庄对
				PlayerBP: "211", // 闲赢庄对闲对

				DragDragon: "1", //龙赢
				DragTie: "0", //和
				DragTiger: "2", //虎赢
				//gameResoult游戏结果点数/sitDown座位号
				//轮盘:0-36
				//百家乐:10-19表示庄点数.20-29表示闲点数。第1位表示庄,闲,第2位表示点数
				//龙虎:11-19,1a-1d表示龙点数21-29,2a-2d表示虎点数。第1位表示龙,虎,第2位表示点数
				Zero: "0", // 0点
				One: "1", // 1点/座位1
				Two: "2", // 2点/座位2
				Three: "3", // 3点/座位3
				Four: "4", // 4点
				Five: "5", // 5点/座位5
				Six: "6", // 6点/座位6
				Seven: "7", // 7点/座位7
				Eight: "8", // 8点/座位8
				Nine: "9", // 9点
				Ten: "10", // 10点/庄0点
				Eleven: "11", // 11点/庄1点/龙1点
				Twelve: "12", // 12点/庄2点/龙2点
				Thirteen: "13", // 13点/庄3点/龙3点
				Fourteen: "14", // 14点/庄4点/龙4点
				Fifteen: "15", // 15点/庄5点/龙5点
				Sixteen: "16", // 16点/庄6点/龙6点
				Seventeen: "17", // 17点/庄7点/龙7点
				Eightteen: "18", // 18点/庄8点/龙8点
				Nineteen: "19", // 19点/庄9点/龙9点
				Twenty: "20", // 20点/闲0点
				TwentyOne: "21", // 21点/闲1点/虎1点
				TwentyTwo: "22", // 22点/闲2点/虎2点
				TwentyThree: "23", // 23点/闲3点/虎3点
				TwentyFour: "24", //24点/闲4点/虎4点
				TwentyFive: "25", // 25点/闲5点/虎5点
				TwentySix: "26", // 26点/闲6点/虎6点
				TwentySeven: "27", // 27点/闲7点/虎7点
				TwentyEight: "28", // 28点/闲8点/虎8点
				TwentyNine: "29", // 29点/闲9点/虎9点
				Thirty: "30", // 30点
				ThirtyOne: "31", // 31点
				ThirtyTwo: "32", // 32点
				ThirtyThree: "33", // 33点
				ThirtyFour: "34", // 34点
				ThirtyFive: "35", // 35点
				ThirtySix: "36", // 36点

				DranTen: "110", // 龙10点
				DranEleven: "111", // 龙J
				DranTwelve: "112", // 龙Q
				DranThirteen: "113", // 龙K
				TigeTen: "210", // 虎10点
				TigeEleven: "211", // 虎J
				TigeTwelve: "212", // 虎Q
				TigeThirteen: "213" // 虎K
			}
		}
		//加载xml文件
		function LoadXml(url, name,callback) {
			CommFun.LoadXml(url).then(function(response){
				if (response.hasOwnProperty("music") && response.music.hasOwnProperty("song")) {
						sounddata = GetObject(response.music.song, name);
						if(typeof(callback)=="function"){
							callback();
						}
					}
			})
		}
		//加载声音
		function PlayAudio(soundType, soundParam) {
			if (sounddata) {
				var m_url;
				if (soundType == "win" || soundType == "resoult" || soundType == "sitdown") {
					if (sounddata.hasOwnProperty("mu")) {
						var list = GetObject(sounddata.mu, soundType);
						if (list.hasOwnProperty("add")) {
							m_url = GetObject(list.add, soundParam);
						}
					}
				} else {
					if (sounddata.hasOwnProperty("mu")) {
						m_url = GetObject(sounddata.mu, soundType);
					}
				}
				if (m_url.hasOwnProperty("__text")) {
					return {
						url: m_url.__text,
						date: new Date()
					};
				}
			}
			return null;
		}
		//获取数组中对应属性对象
		function GetObject(arr, name) {
			if (arr) {
				var len = arr.length;
				for (var i = 0; i < len; i++) {
					if (arr[i]._name == name) {
						return arr[i];
					}
				}
			}
		}
		//销毁
		function Destroy() {
			if (sounddata) {
				sounddata = null;
			}
			if ($rootScope.browser && $rootScope.browser.ios) {
				$rootScope.isStopPlay = true;
				$rootScope.isFirstPlay = true;
			}
		}

	}])