/*
 * 游戏命令
 */
commModule
	.factory('CommandServ', ['$rootScope', function($rootScope) {
		//在iis中无法获取json文件，暂用serveice代替
		var server = {
			GetCommandData: GetCommandData,
			cmdMemberLoginToMember: cmdMemberLoginToMember,
			cmdMemberBalance: cmdMemberBalance,
			cmdMemberTableInfo: cmdMemberTableInfo,
			cmdMemberTableStatus: cmdMemberTableStatus,
			cmdMemberTablePositionBet: cmdMemberTablePositionBet,
			cmdMemberTablePositionMembers: cmdMemberTablePositionMembers,
			cmdMemberTableHisRoad: cmdMemberTableHisRoad,
			cmdMemberTableDealer: cmdMemberTableDealer,
			cmdMemberSitResult: cmdMemberSitResult,
			cmdMemberStandUp: cmdMemberStandUp,
			cmdMemberInfo: cmdMemberInfo,
			cmdMemberBetBack: cmdMemberBetBack,
			cmdMemberPositionTotalBet: cmdMemberPositionTotalBet,
			cmdMemberPositionWin: cmdMemberPositionWin,
			cmdMemberChangeChairBack: cmdMemberChangeChairBack,
			cmdBaccStartBetToMember: cmdBaccStartBetToMember,
			cmdBaccCardInfo: cmdBaccCardInfo,
			cmdDragonCardInfo:cmdDragonCardInfo,
			cmdBaccResult:cmdBaccResult,
			cmdDragonResult:cmdDragonResult,
			cmdRouletteResult:cmdRouletteResult
		}
		return server;

		function GetCommandData() {
			$rootScope.MainCommand = {
				LobbyForMember: 2,
				GameServerForMember: 4
			}
			$rootScope.LobbyForMember = {
				Login: 1,
				LogOut: 2,
				Balance: 3,
				TableInfo: 4,
				TableStatus: 5,
				TablePositionBet: 6,
				TablePositionMembers: 7,
				HisRoad: 8,
				Dealer: 9,
				OnlineMembers: 10,
				SendTableEnd: 11,
				CloseScoke:12//虚拟命令，服务器主动断开，服务器无命令返回
			}
			$rootScope.TableStatus = {
				PausedTable: 0,
				WaitingGame: 1,
				BettingGame: 2,
				OpenningResult: 3,
				CalculatingWinLose: 4,
				EndGame: 5,
				ChangingBoot: 6
			}
			$rootScope.GameForMember = {
				SitDown: 1,
				StandUp: 2,
				MemberInfo: 3,
				MemberBalace: 4,
				Bet: 5,
				PositionTotalBet: 6,
				PositionWin: 7,
				SetPassword: 8,
				ChangeChair: 9,
				CloseScoke:10//虚拟命令，服务器主动断开，服务器无命令返回
			}
			$rootScope.GameKindEnum = {
				Baccarat: 1,
				Roulette: 2,
				SicBo: 3,
				DragonTiger: 4,
				Fantan: 5,
				InsuranceBaccarat: 6,
				BlackJack: 7,
				VipBaccarat: 8,
				ShareLookBaccarat: 9
			}
			$rootScope.GameForBaccarat = {
				StartBet: 100,
				StopBet: 101,
				NextRound: 102,
				CardInfo: 103,
				OpenResult: 104,
				BaccResult: 105,
				EndResult: 106,
				LookCard: 107,
				ChangeBoot: 108,
				ChangeDealer: 109,
				RoadInfo: 110
			}
			$rootScope.GameForDragon = {
				StartBet: 100,
				StopBet: 101,
				CardInfo: 102,
				DragonResult: 103,
				EndResult: 104,
				ChangeBoot: 105,
				ChangeDealer: 106,
				RoadInfo: 107,
				CancelRound: 111
			}
			$rootScope.GameForRoulette = {
				StartBet: 100,
				StopBet: 101,
				BallNum: 102,
				RouletteResult: 103,
				EndResult: 104
			}
			$rootScope.SitDownError = {
				SitSuccess: 0,
				SystemError: 1,
				VIPMoreThreeNotBet: 2,
				SeatError: 3,
				NotVIP: 4,
				Insufficient: 5,
				ChairNumError: 6,
				NoChairForHost: 7,
				AlreadyHaveHostMember: 8,
				NoHostMember: 9,
				TablePasswordError: 10,
				NoEmptyChair: 11,
				SeatErrorForHaveBet: 12
			}
			$rootScope.StandUpError = {
				NetClose: 1,
				NotVIP: 2,
				Insufficient: 3,
				NotBetMoreFive: 4,
				NoHostMember: 5,
				VIPTimeOut: 6
			}
			//提示信息类型
			$rootScope.MessageType = {
				ExitLogin: "exitLogin",
				GameStatus: "gameStatus",
				BetMessage:"betMessage",
				OutNet: 'outNet'
			}
		}

		function cmdMemberLoginToMember(datas) {
			var _result = {
				errID: 0,
				memID: 0,
				Account: '',
				ShowName: '',
				CasinoVIP: false,
				LoginCode: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.errID = parseInt(list[0]);
				_result.memID = parseInt(list[1]);
				_result.Account = list[2];
				_result.ShowName = list[3];
				_result.CasinoVIP = StringToBoolean(list[4]);
				_result.LoginCode = list[5];
			}

			return _result;
		}

		function cmdMemberBalance(datas) {
			var _result = {
				memID: 0,
				Balance: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.memID = parseInt(list[0]);
				_result.Balance = parseFloat(list[1]);
			}

			return _result;
		}

		function cmdMemberTableInfo(datas) {
			var _result = {
				TableID: 0,
				TableName: '',
				TablePhone: '',
				RoomID: 0,
				GameKind: 0,
				ServerIP: '',
				ServerPort: 0,
				LiveVideo1: '',
				LiveVideo2: '',
				LiveVideo3: '',
				LiveVideo4: '',
				LimitType: 0,
				Dealer: '',
				Status: 0,
				GameRoundNo: '',
				BetTime: 0,
				DiffTime: 0,
				SortNum: 0,
				OnlineMembers: 0,
				TotalCredit: 0,
				HostMember: 0,
				NeedPassword: false,
				PrivateTable: false,
				PositionMembers: '',
				PositionTotalBet: '',
				HisRoad: '',
				ControlMode: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.TableID = parseInt(list[0]);
				_result.TableName = list[1];
				_result.TablePhone = list[2];
				_result.RoomID = parseInt(list[3]);
				_result.GameKind = parseInt(list[4]);
				_result.ServerIP = list[5];
				_result.ServerPort = parseInt(list[6]);
				_result.LiveVideo1 = list[7];
				_result.LiveVideo2 = list[8];
				_result.LiveVideo3 = list[9];
				_result.LiveVideo4 = list[10];
				_result.LimitType = parseInt(list[11]);
				_result.Dealer = list[12];
				_result.Status = parseInt(list[13]);
				_result.GameRoundNo = list[14];
				_result.BetTime = parseInt(list[15]);
				_result.DiffTime = parseInt(list[16]);
				_result.SortNum = parseInt(list[17]);
				_result.OnlineMembers = parseInt(list[18]);
				_result.TotalCredit = parseFloat(list[19]);
				_result.HostMember = parseInt(list[20]);
				_result.NeedPassword = StringToBoolean(list[21]);
				_result.PrivateTable = StringToBoolean(list[22]);
				_result.PositionMembers = list[23];
				_result.PositionTotalBet = list[24];
				_result.HisRoad = list[25];
				_result.ControlMode = parseInt(list[26]);
			}

			return _result;
		}

		function cmdMemberTableStatus(datas) {
			var _result = {
				TableID: 0,
				Status: 0,
				GameRoundNo: '',
				DiffTime: 0,
				OnlineMembers: 0,
				TotalCredit: 0,
				HostMember: 0,
				NeedPassword: false,
				PrivateTable: false
			};
			if (datas) {
				var list = datas.split(',');
				_result.TableID = parseInt(list[0]);
				_result.Status = parseInt(list[1]);
				_result.GameRoundNo = list[2];
				_result.DiffTime = parseInt(list[3]);
				_result.OnlineMembers = parseInt(list[4]);
				_result.TotalCredit = parseFloat(list[5]);
				_result.HostMember = parseInt(list[6]);
				_result.NeedPassword = StringToBoolean(list[7]);
				_result.PrivateTable = StringToBoolean(list[8]);
			}
			return _result;
		}

		function cmdMemberTablePositionBet(datas) {
			var _result = {
				TableID: 0,
				PositionBet: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.TableID = parseInt(list[0]);
				_result.PositionBet = list[1];
			}
			return _result;
		}

		function cmdMemberTablePositionMembers(datas) {

			var _result = {
				TableID: 0,
				PositionMembers: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.TableID = parseInt(list[0]);
				_result.PositionMembers = list[1];
			}

			return _result;
		}

		function cmdMemberTableHisRoad(datas) {
			var _result = {
				TableID: 0,
				HisRoad: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.TableID = parseInt(list[0]);
				_result.HisRoad = list[1];
			}

			return _result;
		}

		function cmdMemberTableDealer(datas) {
			var _result = {
				TableID: 0,
				Dealer: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.TableID = parseInt(list[0]);
				_result.Dealer = list[1];
			}

			return _result;
		}


		//游戏
		function cmdMemberSitResult(datas) {
			var _result = {
				errID: 0,
				Chair: 0,
				LookOn: false
			};
			if (datas) {
				var list = datas.split(',');
				_result.errID = parseInt(list[0]);
				_result.Chair = parseInt(list[1]);
				_result.LookOn = StringToBoolean(list[2]);
			}

			return _result;
		}

		function cmdMemberStandUp(datas) {
			var _result = {
				memID: 0,
				Chair: 0,
				errID: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.memID = parseInt(list[0]);
				_result.Chair = parseInt(list[1]);
				_result.errID = parseInt(list[2]);
			}

			return _result;
		}

		function cmdMemberInfo(datas) {
			var _result = {
				memID: 0,
				Chair: 0,
				MoneyID: 0,
				ShowName: '',
				Balance: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.memID = parseInt(list[0]);
				_result.Chair = parseInt(list[1]);
				_result.MoneyID = parseInt(list[2]);
				_result.ShowName = parseInt[3];
				_result.Balance = parseFloat(list[4]);
			}

			return _result;
		}

		function cmdMemberBetBack(datas) {
			var _result = {
				memID: 0,
				Chair: 0,
				BetPosition: 0,
				err: 0,
				BetAmount: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.memID = parseInt(list[0]);
				_result.Chair = parseInt(list[1]);
				_result.BetPosition = parseInt(list[2]);
				_result.err = parseInt(list[3]);
				_result.BetAmount = parseFloat(list[4]);
			}

			return _result;
		}

		function cmdMemberPositionTotalBet(datas) {
			var _result = {
				memID: 0,
				Chair: 0,
				TotalBet: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.memID = parseInt(list[0]);
				_result.Chair = parseInt(list[1]);
				_result.TotalBet = list[2];
			}

			return _result;
		}

		function cmdMemberPositionWin(datas) {
			var _result = {
				memID: 0,
				Chair: 0,
				TotalWin: ''
			};
			if (datas) {
				var list = datas.split(',');
				_result.memID = parseInt(list[0]);
				_result.Chair = parseInt(list[1]);
				_result.TotalWin = list[2];
			}

			return _result;
		}

		function cmdMemberChangeChairBack(datas) {
			var _result = {
				err: 0,
				OldChair: 0,
				NewChair: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.err = parseInt(list[0]);
				_result.OldChair = parseInt(list[1]);
				_result.NewChair = parseInt(list[2]);
			}

			return _result;
		}

		function cmdBaccStartBetToMember(datas) {
			var _result = {
				GameRoundNo: '',
				BetTime: 0,
				DiffTime: 0,
				Reset: false,
				Insurance: 0,
				MaxBetRate: 0,
				Odds: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.GameRoundNo = list[0];
				_result.BetTime = parseInt(list[1]);
				_result.DiffTime = parseInt(list[2]);
				_result.Reset = StringToBoolean(list[3]);
				_result.Insurance = parseInt(list[4]);
				_result.MaxBetRate = parseFloat(list[5]);
				_result.Odds = parseFloat(list[6]);
			}
			return _result;
		}

		function cmdBaccCardInfo(datas) {
			var _result = {
				GameRoundNo: '',
				Position: 0,
				Index: 0,
				CardNum: 0,
				IsLookCard: false
			};
			if (datas) {
				var list = datas.split(',');
				_result.GameRoundNo = list[0];
				_result.Position = parseInt(list[1]);
				_result.Index = parseInt(list[2]);
				_result.CardNum = parseInt(list[3]);
				_result.IsLookCard = StringToBoolean(list[4]);
			}
			return _result;
		}
		function cmdDragonCardInfo(datas){
			var _result = {
				GameRoundNo: '',
				Position: 0,
				CardNum: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.GameRoundNo = list[0];
				_result.Position = parseInt(list[1]);
				_result.CardNum = parseInt(list[2]);
			}
			return _result;
		}
		function cmdBaccResult(datas){
			var _result = {
				GameRoundNo: '',
				PlayerNumber: 0,
				BankerNumber: 0,
				RoadInfo:''
			};
			if (datas) {
				var list = datas.split(',');
				_result.GameRoundNo = list[0];
				_result.PlayerNumber = parseInt(list[1]);
				_result.BankerNumber = parseInt(list[2]);
				_result.RoadInfo=list[3];
			}
			return _result;
		}
		function cmdDragonResult(datas){
			var _result = {
				GameRoundNo: '',
				Result: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.GameRoundNo = list[0];
				_result.Result = parseInt(list[1]);
			}
			return _result;
		}
		
		function cmdRouletteResult(datas){
			var _result = {
				GameRoundNo: '',
				BallNum: 0
			};
			if (datas) {
				var list = datas.split(',');
				_result.GameRoundNo = list[0];
				_result.BallNum = list[1];
			}
			return _result;
		}

		function StringToBoolean(str) {
			var bool;
			switch (str) {
				case "true":
					bool = true;
					break;
				case "false":
					bool = false;
					break;
				default:
					bool = false;
					break;
			}
			return bool;
		}

	}])