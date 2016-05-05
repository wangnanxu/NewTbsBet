gameModule
//游戏头部信息

	.factory('GameCommFun', ['GameSendServ', 'LimitServ', 'CommFun', '$timeout', '$rootScope', 'SoundServ',
		function(GameSendServ, LimitServ, CommFun, $timeout, $rootScope, SoundServ) {
			var currentTable = null; //当前桌台
			var currentLimit = null; //当前限额
			var userID = null; //用户ID acc
			var timer;
			var a_audio;
			var audiolist = []; //声音列表
			var serverdata = {
				table: {
					juNu: '', //游戏局号
					tableName: '', //
					status: 0, //状态
					statusText: '', //状态
					time: 0, //时间
					sound: ''
				},
				positionBet: [], //各投注位置投注额
				positionMember: [] //各投注位置投注人数
			}

			var server = {
				displayProp: displayProp,
				SetDivHight: SetDivHight,
				SetAnimate: SetAnimate,
				TragetPane: TragetPane,
				GetCommServerData: GetCommServerData, //绑定数据
				CountPk: CountPk, //计算牌点数
				InitView: InitView, //初始化游戏数据
				SetTimeEle: SetTimeEle, //设置总时间
				InitTimer: InitTimer, //开始计时

				SetTableStatus: SetTableStatus, //桌台状态
				SetTablePositionBet: SetTablePositionBet,
				SetTablePositionMembers: SetTablePositionMembers,

				InitSound: InitSound,
				TagVolume: TagVolume,
				PlayAudio: PlayAudio,
				Play: Play,

				Destory: Destory

			}
			return server;

			function GetCommServerData() {
				return serverdata;
			}

			//计算牌点数
			function CountPk(cardNum) {
				var pkResult = 0;
				pkResult = cardNum % 13;
				if ((pkResult >= 10)) {
					pkResult = 0;
				}
				return pkResult;
			}

			function InitView(parmas) {
				if ($rootScope.language == null) {
					return;
				}
				currentTable = parmas.table;
				currentLimit = parmas.limit; //
				userID = parmas.infodata.acc; //
				GameSendServ.ConnectVideo(parmas);

				GameSendServ.SendSitDown(currentTable, currentLimit, userID);
				LimitServ.SetCurrentParmas(parmas);
				serverdata.table.juNu = currentTable.GameRoundNo;
				serverdata.table.tableName = CommFun.GetTableName(currentTable.TableName);
				serverdata.table.status = currentTable.Status;
				serverdata.table.statusText = $rootScope.language.Status[serverdata.table.status];
				GameSendServ.SetJuNo(serverdata.table.juNu);

				serverdata.positionBet = currentTable.PositionTotalBet.split("|"); //已投注金额
				serverdata.positionMember = currentTable.PositionMembers.split("|"); //已投注人数
				SetTimeEle(currentTable.BetTime);
			}

			function InitSound(str, name) {
				SoundServ.LoadXml(str, name, function() {
					PlayAudio($rootScope.Sound.EnterGame, null);
				});
			}
			//播放单个声音
			function PlayAudio(soundType, soundParam) {
				var src = SoundServ.PlayAudio(soundType, soundParam);
				if (src == null) {
					return;
				}
				if (audiolist == null) {
					audiolist = new Array();
				}
				audiolist.push(src);
				CommFun.DoRefresh(serverdata);
				if (audiolist.length <= 1) {
					Play();
				}
			}

			//播放声音
			function Play() {

				if (audiolist == null || audiolist.length <= 0) {
					return;
				}
				serverdata.table.sound = audiolist[0].url;
				CommFun.DoRefresh(serverdata);
				a_audio = document.getElementById("a_Audio");
				if (a_audio) {
					if ($rootScope.isFirstPlay || $rootScope.isStopPlay) {
						a_audio.volume = 0;
					}
					var datea = CommFun.CompareDate(new Date(), audiolist[0].date);
					if (datea > 10) {
						audiolist.shift();
						CommFun.DoRefresh(serverdata);
						Play();
						return;
					}
					a_audio.onloadedmetadata = function() {
							if (this.paused) {
								this.play();
							} else {
								this.pause();
							}
						}
						//console.log(JSON.stringify(audiolist));
					a_audio.addEventListener("ended", function(e) {
						if (audiolist && audiolist.length >= 1) {
							//console.log(e.target.currentSrc)
							var b = e.target.currentSrc;
							var index = b.indexOf("Sound");
							var currenturl = b.substring(index, b.length);
							var len = audiolist.length;
							for (var i = 0; i < len; i++) {
								if (audiolist[i].url == currenturl) {
									audiolist.splice(i, 1);
									Play();
									return;
								}
							}

						}
					})
				}
			}
			//改变音量
			function TagVolume() {
				$rootScope.isStopPlay = !$rootScope.isStopPlay
				var a_audio = document.getElementById("a_Audio");
				if ($rootScope.isFirstPlay) {
					if ($rootScope.browser && $rootScope.browser.ios && a_audio) {
						a_audio.play();
					} else {
						Play();
					}
					$rootScope.isFirstPlay = false;
					if (a_audio) {
						a_audio.volume = 1;
					}
				} else {
					if (a_audio) {
						if (a_audio.volume == 1) {
							a_audio.volume = 0;
						} else {
							a_audio.volume = 1;
						}
					}
				}
			}
			//设置总时间
			function SetTimeEle(totaltime) {
				CommFun.SetTotalTime(totaltime, "TimeRight", "TimeLeft");
			}
			//开始计时
			function InitTimer(time) {
				if (timer) {
					$timeout.cancel(timer);
				}
				CommFun.InitTimer();
				ShowTime(time);
			}
			//显示时间
			function ShowTime(time) {
				if (time < 0) {
					return;
				}
				CommFun.RangeDiv(time);
				serverdata.table.time = parseInt(time);
				timer = $timeout(function() {
					time--;
					ShowTime(time);
				}, 1000)
			}
			//桌台状态
			function SetTableStatus(tableStatus) {
				if (tableStatus == null) {
					return;
				}
				serverdata.table.juNu = tableStatus.GameRoundNo;
				GameSendServ.SetJuNo(serverdata.table.juNu);
				CommFun.DoRefresh(serverdata);
			}
			//桌台位置总投注
			function SetTablePositionBet(betPos) {
				var arr = betPos.PositionBet.split("|");
				serverdata.positionBet = arr;
				CommFun.DoRefresh(serverdata);
			}
			//桌台位置总投注人数
			function SetTablePositionMembers(memPos) {
				var arr = memPos.PositionMembers.split("|");
				serverdata.positionMember = arr;
				CommFun.DoRefresh(serverdata);
			}

			function SetDivHight() {
				var divA = document.getElementById("Game_video");
				var screenWeight = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
				if (divA) {
					var height = screenWeight * 9 / 16 - 48; //48为时间高度
					divA.style.cssText = "height:" + height + "px";
				}

				var canvas = document.getElementById("videoCanvas");
				if (canvas) {
					canvas.style.height = screenWeight * 9 / 16 + "px";
				}

				var scroll = document.getElementById("PaneScroll");
				if (scroll) {
					var screenheight = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
					var scrollheight = screenheight - 20;
					scroll.style.cssText = "height:" + scrollheight + "px";
				}
			}
			//改变滑动页面高度
			function TragetPane(isshow) {
				var divA = document.getElementById("PaneAll");
				var screenheight = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
				var screenwidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
				var divtop = 70 + (9 / 16 + 98 / 454) * screenwidth; //正常位置
				if (currentTable && (currentTable.GameKind == $rootScope.GameKindEnum.Roulette)) {
					divtop = 70 + 9 / 16 * screenwidth + 90; //正常位置
				}
				var top = 0;
				if (isshow) {
					top = screenheight - divA.clientHeight - 23;
					if (top > divtop) {
						top = divtop;
					} else if (top < 10) {
						top = 0;
					}
				} else {
					top = divtop;
				}
				if (divA) {
					divA.style.cssText = "top:" + top + "px";
				}
			}
			//判断对象是否具有该方法
			function isHostMethod(object, property) {
				var t = typeof object[property];
				return t == 'function' || (!!(t == 'object' && object[property])) || t == 'unknown';
			}
			//输出对象的所有属性及方法，主要用于测试
			function displayProp(obj) {
				var names = "";
				for (var name in obj) {
					names += name + ": " + obj[name] + ", ";
				}
				console.log(names);
			}
			//设置动画keyframes参数
			function SetAnimate(index) {
				var divA = document.getElementById("PaneAll");
				var screenwidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
				var screenheight = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
				var hidetop = 70 + (9 / 16 + 98 / 454) * screenwidth; //标题和状态高度+视频高度+牌高度
				if (currentTable && (currentTable.GameKind == $rootScope.GameKindEnum.Roulette)) {
					hidetop = 70 + 9 / 16 * screenwidth + 90; //正常位置
				}
				var rules = getKeyFramse(index);
				var showtop = screenheight - divA.clientHeight - 23;
				if (showtop > hidetop) {
					showtop = hidetop;
				} else if (showtop < 10) {
					showtop = 0;
				}
				//pc端长度为4，移动端长度为2
				try {
					if (rules) {
						if (isHostMethod(rules[0], "appendRule") && rules.length >= 4) {
							rules[0].appendRule("0% { top:" + showtop + "px;}");
							rules[0].appendRule("100% { top: " + hidetop + "px;}");
							rules[1].appendRule("0% { top: " + showtop + "px;}");
							rules[1].appendRule("100% {  top:" + hidetop + "px }");
							rules[2].appendRule("0% { top:" + hidetop + "px}");
							rules[2].appendRule("100% {  top:" + showtop + "px }");
							rules[3].appendRule("0% { top:" + hidetop + "px}");
							rules[3].appendRule("100% {  top:" + showtop + "px }");
						}
						if (isHostMethod(rules[0], "insertRule") && rules.length >= 2) {
							rules[0].insertRule("0% { top:" + showtop + "px;}");
							rules[0].insertRule("100% { top: " + hidetop + "px;}");
							rules[1].insertRule("0% { top:" + hidetop + "px}");
							rules[1].insertRule("100% {  top:" + showtop + "px }");
						}
					}
				} catch (e) {
					console.log(e);
					//TODO handle the exception
				}

			}

			function getKeyFramse(index) {
				//var arr = [];
				//for (var index = 0; index < document.styleSheets.length; index++) {
				var styleSheet = document.styleSheets[index],
					keyframesRule = [];
				[].slice.call(styleSheet.cssRules).forEach(function(item) {
						if (item.type === CSSRule.WEBKIT_KEYFRAMES_RULE) {
							keyframesRule.push(item);
						}
					})
					//arr.push(keyframesRule)
				return keyframesRule;
				/*}
				console.log(arr);*/
			}

			function Destory() {
				if (timer) {
					$timeout.cancel(timer);
					timer = null;
				}
				if (a_audio) {
					a_audio.pause();
					a_audio = null;
				}
				SoundServ.Destroy();
				audiolist = null;
				currentTable = null; //当前桌台
				currentLimit = null; //当前限额
				userID = null; //用户ID acc
				serverdata.positionBet = null;
				serverdata.positionMember = null;
			}
		}
	])
	.directive('gameTitle', [function() {
		return {
			restrict: 'E',
			templateUrl: "page/dirtective/gametitle.html"
		}
	}])
	.directive('selectChips', [function() {
		return {
			restrict: 'E',
			templateUrl: "page/dirtective/selectChips.html"

		}
	}])
	.directive('betposBtn', [function() {
		return {
			restrict: 'E',
			templateUrl: "page/dirtective/betposbtn.html"

		}
	}])
	.directive('infoBottom', [function() {
		return {
			restrict: 'E',
			templateUrl: "page/dirtective/infobottom.html"

		}
	}])