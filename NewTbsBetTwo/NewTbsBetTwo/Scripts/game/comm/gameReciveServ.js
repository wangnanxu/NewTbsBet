/*
 * 公用游戏service，只接收大厅和服务器传递数据，不能发送数据到服务器
 */
gameModule
	.factory('GameReciveServ', ['$rootScope', 'BaccServ','InBaccServ', 'RoulServ', 'DragonServ', 'CommandServ', '$state','CommFun',
		function($rootScope, BaccServ,InBaccServ, RoulServ, DragonServ, CommandServ, $state,CommFun) {
			var gameServ = null;
			var currentTable=null;//当前桌台
			var server = {
				AnalysisData: AnalysisData,
				SetCurrentTable:SetCurrentTable,
				SetTableStatus: SetTableStatus,
				SetTablePositionBet: SetTablePositionBet,
				SetTablePositionMembers: SetTablePositionMembers,
				SetTableHisRoad: SetTableHisRoad,
				SetTableDealer: SetTableDealer,
				ExitGame: ExitGame
			}
			return server;

			//分析服务器数据
			function AnalysisData(mainCmd, proCmd, pData) {
				if (mainCmd == $rootScope.MainCommand.GameServerForMember) {
					switch (proCmd) {
						case $rootScope.GameForMember.SitDown: //坐下返回
							var sitResult = CommandServ.cmdMemberSitResult(pData);
							if (sitResult.errID == 0) {
								var chairID = sitResult.Chair;
								GetCurrentServ();
								//坐下成功. 显示游戏界面
							} else {
								//提示错误消息
								//离开游戏;
								CommFun.ShowMessage($rootScope.MessageType.GameStatus, 6);//提示坐下失败
							}
							return SetChairID(sitResult);
						case $rootScope.GameForMember.StandUp: //站起返回
							//离开游戏
							var standUp = CommandServ.cmdMemberStandUp(pData);
							if (standUp) {
								//删除用户
								if (standUp.memID == $rootScope.userInfo.memID) { //用户本人
									//发送
									CommFun.ShowMessage($rootScope.MessageType.GameStatus, 5);//提示游戏断开
									ExitGame();
								}
							}
							return true;
						case $rootScope.GameForMember.MemberInfo: //会员信息
							var memInfo = CommandServ.cmdMemberInfo(pData);
							//增加用户
							return ActiveUserItem(memInfo);
						case $rootScope.GameForMember.MemberBalace: //会员余额
							var memBalance = CommandServ.cmdMemberBalance(pData);
							//通知余额改变
							OnEventBalanceChang(memBalance);
							return true;
						case $rootScope.GameForMember.Bet: //下注返回
							//trace("GameForMember.Bet "+pData);
							var memBetBack = CommandServ.cmdMemberBetBack(pData);
							OnMemberBetBack(memBetBack);
							return true;
						case $rootScope.GameForMember.PositionTotalBet: //投注位置总投注
							//通知显示筹码
							var totalBet = CommandServ.cmdMemberPositionTotalBet(pData);
							return OnMemberPositionTotalBet(totalBet);
						case $rootScope.GameForMember.PositionWin: //投注输赢
							var totalWin = CommandServ.cmdMemberPositionWin(pData);
							return OnMemberPositionWinLose(totalWin);
						case $rootScope.GameForMember.ChangeChair: //变更座位返回
							var changResult = CommandServ.cmdMemberChangeChairBack(pData);
							return true;
						case $rootScope.GameForMember.CloseScoke: //服务器意外关闭gamescoket，虚拟命令
							CommFun.ShowMessage($rootScope.MessageType.GameStatus, 5);//提示游戏断开
							ExitGame();
							return true;
					}
					if (gameServ) {
						return gameServ.SubGameSubCmd(proCmd, pData);
					}
				}
				return false;
			}
			function SetCurrentTable(table){
				if(table){
					currentTable=table;
				}
			}
			//设置当前游戏页面服务
			function GetCurrentServ() {
				if (currentTable == null) {
					return;
				}
				switch (currentTable.GameKind) {
					case $rootScope.GameKindEnum.Baccarat:
						gameServ = BaccServ;
						break;
					case $rootScope.GameKindEnum.InsuranceBaccarat:
						gameServ = InBaccServ;
						break;
					case $rootScope.GameKindEnum.Roulette:
						gameServ = RoulServ;
						break;
					case $rootScope.GameKindEnum.DragonTiger:
						gameServ = DragonServ;
						break;
					default:
						break;
				}
			}
			//增加用户;
			function ActiveUserItem(pActiveUserData) {

				return false;
			}

			function SetChairID(sitResult) {
				if (sitResult == null) {
					return false;
				}
				if (gameServ) {
					gameServ.SetChairID(sitResult);
				}
				return true;
			}
			//余额改变
			function OnEventBalanceChang(memBalance) {
				if ($rootScope.userInfo.memID== memBalance.memID) {
					$rootScope.topdata.blance = memBalance.Balance;
				}
				return true;
			}

			function OnMemberBetBack(memBetBack) {
				if (memBetBack == null) {
					return false;
				}
				if (gameServ) {
					gameServ.OnMemberBetBack(memBetBack);
				}
				return true;
			}
			//投注位置;
			function OnMemberPositionTotalBet(totalBet) {
				//计算位置投注人数和总额
				if (totalBet == null) {
					return false;
				}
				if (gameServ) {
					gameServ.OnMemberPositionTotalBet(totalBet);
				}
				return true;
			}

			function OnMemberPositionWinLose(totalWin) {
				if (totalWin == null) {
					return false;
				}
				if (gameServ) {
					gameServ.OnMemberPositionWinLose(totalWin);
				}
				return true;
			}

			function SetTableStatus(tableStatus) {
				if (tableStatus == null) {
					return false;
				}
				if (gameServ) {
					gameServ.SetTableStatus(tableStatus);
				}
				return true;
			}

			function SetTablePositionBet(betPos) {
				if (betPos == null) {
					return false;
				}
				if (gameServ) {
					gameServ.SetTablePositionBet(betPos);
				}
				return true;
			}

			function SetTablePositionMembers(memPos) {
				if (memPos == null) {
					return false;
				}
				if (gameServ) {
					gameServ.SetTablePositionMembers(memPos);
				}
				return true;
			}

			function SetTableHisRoad(hisRoad) {
				if (hisRoad == null) {
					return false;
				}
				if (gameServ) {
					gameServ.SetTableHisRoad(hisRoad);
				}
				return true;
			}

			function SetTableDealer(dealer) {
				if (dealer == null) {
					return false;
				}
				if (gameServ) {
					gameServ.SetTableDealer(dealer);
				}
				return true;
			}

			function ExitGame() {
				$state.go('tab.lobby');
				gameServ=null;
			}

		}
	])