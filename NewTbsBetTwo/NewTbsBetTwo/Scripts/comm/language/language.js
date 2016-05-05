commModule
	.factory('LanguageServ', [function() {
		var server = {
			LanguageData: LanguageData
		}
		return server;
		function LanguageData(lang) {
			var data = null;
			switch (lang) {
				case 'CH':
					data = LanguageCH();
					return data;
				case 'EN':
					data = LanguageEN();
					return data;
				case 'TW':
					data = LanguageTW();
					return data;
			}
			return data;
		}
		function LanguageCH() {
			var data = {
				Login: {
					UserName: '用户名称',
					Password: '用户密码',
					LoginBtn: '登入'
				},
				Status:["暂停", "等待开始", "投注中", "等待开奖", "等待结算", "完成结算", "更换牌靴", "更换荷官"],
				Game:['局号','路子','重投','取消','全取消','确定','余额','投注','赢','庄','闲','龙','虎'],
				Message:{
					ExitLogin:['是否退出游戏?'],
					GameStatus:["已开局,请投注","停止投注","闲保险,请投注","庄保险,请投注","重新结算",'游戏已断开,请重新进入.','坐下失败,请重新进入.'],
					OutNet:['网络已断开,请重新连接?'],
					BetMessage:["投注成功","投注失败","不在投注状态","上次提交还没有返回","该位置已达最大投注","筹码小于该位置最小投注","开牌中,请下一局投注","余额不足"]
					}
			}
			return data;
		}

		function LanguageEN() {
			var data = {
				Login: {
					UserName: 'UserName',
					Password: 'Password',
					LoginBtn: 'Login'
				},
				Status:["Paused","Waitting","Betting","Openning","Caculating","Finished","ChangingShoe"],
				Game:['GameNo','Road','Repeat','Back','Cancel','Confirm','Balance','Bet','Win','Banker','Player','Dragon','Tiger'],
				Message:{
					ExitLogin:['Whether to quit the game?'],
					GameStatus:["Start Bet","Stop Bet","Player Insurance,Please Bet","Banker Insurance,Please Bet","Caculating again","The game is broken, please re-enter.",
					"Sit down failed,please re-enter."],
					OutNet:['Network disconnected,Please reconnect.'],
					BetMessage:["Bet Successfully","Bet Failt","Status Error","Last bet not back","Over MaxBet","Under MinBet","Open the card, please a bet","Insufficient balance"]
					}
			}
			return data;
		}

		function LanguageTW() {
			var data = {
				Login: {
					UserName: '用戶名稱',
					Password: '用戶密碼',
					LoginBtn: '登入'
				},
				Status:["暫停","等待開始","投注中","等待開獎","等待結算","完成結算","更換牌靴"],
				Game:['局號','路子','重投','取消','全取消','確定','餘額','投注','贏','莊','閑','龍','虎'],
				Message:{
					ExitLogin:['是否退出遊戲?'],
					GameStatus:["已開局,請投注","停止投注","閒保險,請投注","莊保險,請投注","重新結算","遊戲已斷開,請重新進入.","坐下失敗,請重新進入."],
					OutNet:['網絡已斷開,請重新連接?'],
					BetMessage:["投注成功","投注失敗","不在投注狀態","上次提交還沒有返回","該位置已達最大投注","籌碼小於該位置最小投注","開牌中,請下一局投注","餘額不足"]
					}
			}
			return data;
		}

	}])