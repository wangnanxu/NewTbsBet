gameModule
	.factory('GameSendServ', ['$state', '$rootScope', 'CommFun', 'SendServ', 'VideoServ',
		function($state, $rootScope, CommFun, SendServ, VideoServ) {
			var parmas;
			var juNo;
			var chairID;
			var server = {
				ConnectVideo: ConnectVideo,
				SendSitDown: SendSitDown, //发送坐下命令
				SetChairID: SetChairID,
				SetJuNo: SetJuNo,
				SendConfirmBetForBacc: SendConfirmBetForBacc,
				SendConfirmBetForRoul: SendConfirmBetForRoul,
				SendConfirmBet: SendConfirmBet, //发送确认投注命令
				SendStandUp: SendStandUp, //发送站起命令
				SendSetPassword: SendSetPassword, //发送更改桌台密码命令
				SendChangeChair: SendChangeChair, //发送更改椅子命令
				SendChangeDealer: SendChangeDealer, //发送更改荷官命令
				SendChangeBoot: SendChangeBoot, //发送更改牌靴命令
				Destory: Destory
			}
			return server;

			function ConnectVideo(data) {
				if (data == null || $rootScope.videoInfo == null) {
					return;
				}
				/*视频*/
				parmas = data;
				var url;
				var len = $rootScope.videoInfo.length;
				for (var i = 0; i < len; i++) {
					if ($rootScope.videoInfo[i].tableID == parmas.table.TableID) {
						url = $rootScope.videoInfo[i].url;
						break;
					}
				}
				VideoServ.ConnectVideo(url);
			}
			//发送坐下，用户ID+用户密码+桌子ID+限额编号+是否旁观+是否包桌+桌子密码
			function SendSitDown(table, limit, userId) {
				if ($rootScope.userInfo && table && limit && userId) {
					var data = {
						memID: $rootScope.userInfo.memID,
						LoginCode: $rootScope.userInfo.LoginCode, //用户密码
						TableID: table.TableID,
						blID: limit[0], //限额编号
						Host: false, //是否包桌
						LookOn: false, //是否旁观
						SitPassword: "" //桌子密码
					};
					var str = CommFun.JsonToString(data);
					var sitdata = {
						UserID: userId,
						Data: str,
						port: table.ServerPort
					}
					SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForMember.SitDown, JSON.stringify(sitdata));
				}
			}

			function SetChairID(chairid) {
				chairID = chairid;
			}

			function SetJuNo(juno) {
				juNo = juno;
			}
			//百家乐，龙虎确认投注
			function SendConfirmBetForBacc(betArr, confirmBet, maxbetlimit, minbetlimit) {
				var betpostion = new Array();
				var betmoney = new Array();
				var len = betArr.length;
				var totalmoney = 0;
				for (var i = 0; i < len; i++) {
					var money = betArr[i] - confirmBet[i];
					if (money > 0) {
						if (betArr[i] > maxbetlimit[i]) {
							//CommFun.ShowMessage();
							console.log('投注大于位置限额');
							return false;
						}
						if (betArr[i] < minbetlimit[i]) {
							//console.log('投注小于位置限额');
							return false;
						}
						betpostion.push(i + 1);
						betmoney.push(money);
						totalmoney += money;
					}
				}
				if (totalmoney > $rootScope.topdata.blance) {
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 1);
					//console.log('余额不足');
					return false;
				}
				var data = {
					memID: $rootScope.userInfo.memID,
					TableID: parmas.table.TableID,
					Chair: chairID,
					GameRoundNo: juNo,
					BetPosition: betpostion.join("|"),
					BetAmount: betmoney.join("|")
				}
				var betmessage = CommFun.JsonToString(data)
				var betdata = {
					UserID: parmas.infodata.acc,
					Data: betmessage
				}
				SendConfirmBet(JSON.stringify(betdata));
				return true;
			}

			function SendConfirmBetForRoul(betArr, confirmBet, maxbetlimit, minbetlimit) {
				var betpostion = new Array();
				var betmoney = new Array();
				var len = betArr.length;
				var totalmoney = 0;
				for (var i = 0; i < len; i++) {
					var money = betArr[i] - confirmBet[i];
					if (money > 0) {
						betmoney.push(money);
						betpostion.push(i + 1);
						totalmoney += money;
					}
				}
				if (totalmoney > $rootScope.topdata.blance) {
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 1);
					//console.log('余额不足');
					return false;
				}
				var data = {
					memID: $rootScope.userInfo.memID,
					TableID: parmas.table.TableID,
					Chair: chairID,
					GameRoundNo: juNo,
					BetPosition: betpostion.join("|"),
					BetAmount: betmoney.join("|")
				}
				var betmessage = CommFun.JsonToString(data)
				var betdata = {
					UserID: parmas.infodata.acc,
					Data: betmessage
				}
				SendConfirmBet(JSON.stringify(betdata));
				return true;
			}
			//发送确认投注，用户ID+桌台ID+椅子号+游戏局号+投注位置+投注金额
			function SendConfirmBet(betmessage) {
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForMember.Bet, betmessage); //发送投注信息
			}
			//发送站起,用户ID+椅子ID
			function SendStandUp(userID) {
				//发送站起
				var data = {
					memID: $rootScope.userInfo.memID,
					Chair: chairID
				}
				var str = CommFun.JsonToString(data);
				var standUp = {
					UserID: userID,
					Data: str
				}
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForMember.StandUp, JSON.stringify(standUp));
				$state.go('tab.lobby');
			}
			//设置桌子密码,桌台ID+密码
			function SendSetPassword(pwddata) {
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForMember.SetPassword, pwddata)
			}
			//变更椅子,桌台ID+变更后的椅子ID
			function SendChangeChair(changedata) {
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForMember.ChangeChair, changedata)
			}
			//更换荷官
			function SendChangeDealer() {
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForBaccarat.ChangeDealer, "");
			}
			//更换牌靴
			function SendChangeBoot() {
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForBaccarat.ChangeBoot, "");
			}
			//关闭游戏scoket，虚拟命令
			function SendCloseGameScoket(data) {
				SendServ.SendMessage($rootScope.MainCommand.GameServerForMember, $rootScope.GameForMember.CloseScoke, data);
			}

			function Destory() {
				VideoServ.CloseVideo();
				parmas = null;
				juNo = null;
				chairID = null;
			}
		}
	])