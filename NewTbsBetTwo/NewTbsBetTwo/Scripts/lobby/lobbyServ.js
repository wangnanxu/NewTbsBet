lobbyModule
	.directive('tableInfo', [ 'LobbyHisToryManager', 'RoulHisToryManagerForLobby', '$timeout', 'CommFun','$rootScope',function(LobbyHisToryManager, RoulHisToryManagerForLobby, $timeout, CommFun,$rootScope) {
		return {
			restrict: 'E',
			templateUrl: "page/dirtective/table.html",
			scope: {
				param: "=data"
			},
			link: function($scope, $element,$attrs) {
				
				$element.bind("$destroy", function() {
					if(timer){
						$timeout.cancel(timer);
					}
					Destory();
				})
				var timer;
				var totaltime;
				var rightEle;
				var leftEle;
				var isFirst=true;
				$scope.table = $scope.param;
				$scope.$watch('table.hisroad',function(){
					if(isFirst==false){
					if($scope.table.table.GameKind==$rootScope.GameKindEnum.Roulette){
							if($scope.table.hisroad){
								RoulHisToryManagerForLobby.StringSplit($scope.table.hisroad);
							}
					}else{
						if ($scope.table.hisroad) {
								LobbyHisToryManager.SetViewId($scope.table.game,$scope.table.tableName);
								LobbyHisToryManager.StringSplit($scope.table.hisroad);
							}
						}
					}
				})
				$scope.$watch('table.tablestatus',function(){
					if(isFirst==false){
						if(timer){
							$timeout.cancel(timer);
						}
						$scope.statusText = CommFun.GetStatusText($scope.table.tablestatus);
						if ($scope.table.tablestatus == 2 && $scope.table.difftime > 0) {
							InitTimer();
							SetTime($scope.table.difftime);
						}
					}
				})
				$timeout(function() {
					if ($scope.table) {
						if($scope.table.table.GameKind==$rootScope.GameKindEnum.Roulette){
							RoulHisToryManagerForLobby.RoulHistoryResultManger("lobby", $scope.table.table.TableID, $scope.table.table.TableName);
								if($scope.table.hisroad){
									RoulHisToryManagerForLobby.StringSplit($scope.table.hisroad);
								}
						}
						else{
							LobbyHisToryManager.BaccaratHistoryResultManger($scope.table.tableID);
						
							if ($scope.table.hisroad) {
									LobbyHisToryManager.SetViewId( $scope.table.game,$scope.table.tableName);
									LobbyHisToryManager.StringSplit($scope.table.hisroad);
							}
						}
						
						if ($scope.table.tablestatus == 2 && $scope.table.difftime > 0) {
							InitTimer();
						}
					}
					isFirst=false;
				}, 200)
				$scope.tablename=CommFun.GetTableName($scope.table.tableName);
				$scope.statusText = CommFun.GetStatusText($scope.table.tablestatus);
				function SetTime(time) {
					timer=$timeout(function() {
						time--;
						$scope.time = time;
						RangeDiv(time);
						if ($scope.time >= 0) {
							SetTime($scope.time);
						}
					}, 1000)
				}
				totaltime = $scope.table.bettime;
				function InitTimer() {
					$scope.time = $scope.table.difftime;
					if(rightEle==null || leftEle==null){
						var leftid = "left" + $scope.table.tableID;
						var rightid = "right" + $scope.table.tableID;
						rightEle = document.getElementById(rightid);
						leftEle = document.getElementById(leftid);
					}
					SetRange(leftEle, 45);
					SetRange(rightEle, 45);
					leftEle.style.borderBottomColor = "#FFFF00";
					leftEle.style.borderLeftColor = "#FFFF00";
					if($scope.time>0){
						SetTime($scope.time);
					}
				}
				function RangeDiv(difftime) {
					if (difftime > totaltime) {
						return;
					}
					if (leftEle == null || rightEle == null) {
						return;
					}
					var range = 360 * difftime / totaltime;
					if (range > 180) {
						range = 360 - range + 45;
						SetRange(rightEle, range);

					} else {
						range = 180 - range + 45;
						SetRange(rightEle, 225);
						SetRange(leftEle, range);
					}
					if (difftime <= 5) {
						leftEle.style.borderBottomColor = "#FF3B30";
						leftEle.style.borderLeftColor = "#FF3B30";
					}
				}

				function SetRange(ele, range) {
					if(ele){
						ele.style.transform = "rotate(" + range + "deg)";
						ele.style.webkitTransform = "rotate(" + range + "deg)";
						ele.style.MozTransform = "rotate(" + range + "deg)";
					}
				}
				
				function Destory() {
					$scope.table = null;
					$scope.statusText = null;
					$scope.time = 0;
					LobbyHisToryManager.Destory();
					RoulHisToryManagerForLobby.Destory();
				}
			}
		}
	}])
	.factory('LobbyServ', ['$state', '$rootScope', 'CommandServ', 'LimitServ', 'CommFun', 'GameReciveServ','$timeout','GameCommFun',
	function($state, $rootScope, CommandServ, LimitServ, CommFun, GameReciveServ,$timeout,GameCommFun) {
		$rootScope.topdata = { //头部信息
			name: '', //账号名称
			blance: 0 //账号余额
		};
		var infodata = null; //登陆传入数据
		var currentTable = null; //当前进入桌台



		var tableSort = null; //桌子ID数组
		var tableList = null; //桌子信息数组cmdMemberTableInfo

		var tableStatusList = null; //桌子状态数组
		var dealerList = null; //桌子荷官数组
		var hisRoadList = null; //桌子历史路子数组
		var memPosList = null; //桌子投注人数数组
		var betPosList = null; //桌子投注金额数组

		var serverdata = {
			tablearr: null //桌子排列位置数组
		}
		var server = {
			AnalysisData: AnalysisData, //分析服务器传回数据
			GetServerData: GetServerData, //将数据传回页面
			TagVolume:TagVolume,
			GetTableName: GetTableName,
			GetParmaLimit: GetParmaLimit,
			GetVideoLine:GetVideoLine,
			EnterGame: EnterGame,
			ConfirmMessage: ConfirmMessage,
			CloseMessage: CloseMessage,
			ExitToLogin: ExitToLogin, //退回到登录页面
			Destory: Destory

		}
		return server;
		//初始化数据绑定
		function GetServerData() {
			return serverdata;
		}
		function GetParmaLimit(data) {
			infodata = data;
			LimitServ.GetParmaLimit(data);
		}
		function GetVideoLine(){
			CommFun.LoadXml("../VideoLines.xml").then(function(reponse){
				if(reponse.hasOwnProperty("VideoLine") && reponse.VideoLine.hasOwnProperty("option")){
					$rootScope.videoInfo =reponse.VideoLine.option;
				}
			})
		}
		function TagVolume(){
			GameCommFun.TagVolume();
		}
		//分析服务器回传数据
		function AnalysisData(mainCmd, proCmd, pData) {
			if ((mainCmd == $rootScope.MainCommand.LobbyForMember)) {
				
				switch (proCmd) {
					case $rootScope.LobbyForMember.Login: //登录返回结果
						var member = CommandServ.cmdMemberLoginToMember(pData);
						if ((member == null)) {
							console.log(("member == null" + new Date));
							return false;
						}
						if (member.errID == 0) {
							//显示大厅;
							//InitVisible (false);
							$rootScope.userInfo = member;
							$rootScope.topdata.name = member.ShowName; //设置头部名字
						} else {
							LoginError(member.errID);
						}
						CommFun.DoRefresh(serverdata);
						member = null;
						return true;
					case $rootScope.LobbyForMember.LogOut: //退出登陆
						ExitLogin();
						break;
					case $rootScope.LobbyForMember.Balance: //余额
						var balance = CommandServ.cmdMemberBalance(pData);
						if ((balance == null)) {
							return false;
						}
						if ($rootScope.userInfo && (balance.memID == $rootScope.userInfo.memID)) {
							$rootScope.topdata.blance = balance.Balance;
						}
						CommFun.DoRefresh(serverdata);
						balance = null;
						return true;
					case $rootScope.LobbyForMember.TableInfo: //桌子信息
						var table = CommandServ.cmdMemberTableInfo(pData);
						if ((table == null)) {
							return false;
						}
						if ((tableSort == null)) {
							tableSort = new Array();
						}
						if (tableList == null) {
							tableList = new Array();
						}
						if (tableSort.indexOf(table.TableID) == -1) {
							tableSort.push(table.TableID);
						}
						tableList[table.TableID] = table;
						CommFun.DoRefresh(serverdata);
						table = null;
						return true;
					case $rootScope.LobbyForMember.TableStatus: //桌子状态
						var tableStatus = CommandServ.cmdMemberTableStatus(pData);
						if (tableStatus == null) {
							return false;
						}
						SetTableStatus(tableStatus)
						tableStatus = null;
						return true;

					case $rootScope.LobbyForMember.TablePositionBet: //下注位置
						var betPos = CommandServ.cmdMemberTablePositionBet(pData);
						if (betPos == null) {
							return false;
						}
						SetTablePositionBet(betPos)
						betPos = null;
						return true;

					case $rootScope.LobbyForMember.TablePositionMembers: //会员位置
						var memPos = CommandServ.cmdMemberTablePositionMembers(pData);
						if (memPos == null) {
							return false;
						}
						SetTablePositionMembers(memPos);
						memPos = null;
						return true;

					case $rootScope.LobbyForMember.HisRoad: //历史结果
						var hisRoad = CommandServ.cmdMemberTableHisRoad(pData);
						if (hisRoad == null) {
							return false;
						}
						SetTableHisRoad(hisRoad);
						hisRoad = null;
						return true;

					case $rootScope.LobbyForMember.Dealer: //桌主
						var dealer = CommandServ.cmdMemberTableDealer(pData);
						if ((dealer == null)) {
							return false;
						}
						SetTableDealer(dealer);
						dealer = null;
						return true;
					case $rootScope.LobbyForMember.OnlineMembers: //在线会员
						return true;
					case $rootScope.LobbyForMember.SendTableEnd: //发送桌子结束
						ShowTable(tableList);
						return true;
					case $rootScope.LobbyForMember.CloseScoke: //服务器意外关闭lobbyscoket，虚拟命令
						ExitLogin();
						return true;
				}
			}
			return false;
		}
		//登陆失败
		function LoginError(errid) {
			ExitLogin();
		}
		//桌台状态
		function SetTableStatus(tableStatus) {
			if ((tableStatus == null)) {
				return;
			}
			if (((tableList == null) || tableList[tableStatus.TableID] == null)) {
				return;
			}

			var table = tableList[tableStatus.TableID];
			if ((table == null)) {
				return;
			}

			table.Status = tableStatus.Status;
			table.GameRoundNo = tableStatus.GameRoundNo;
			table.DiffTime = tableStatus.DiffTime;
			table.OnlineMembers = tableStatus.OnlineMembers;
			table.TotalCredit = tableStatus.TotalCredit;
			table.HostMember = tableStatus.HostMember;
			table.NeedPassword = tableStatus.NeedPassword;
			table.PrivateTable = tableStatus.PrivateTable;

			tableList[tableStatus.TableID] = table;
			ChangeStatus(table);
			if (tableStatusList == null) {
				tableStatusList = new Array();
			}
			tableStatusList[tableStatus.TableID] = tableStatus;
			if (currentTable != null && tableStatus.TableID == currentTable.TableID) {
				GameReciveServ.SetTableStatus(tableStatus);
			}
		}
		//桌台投注金额
		function SetTablePositionBet(betPos) {
			if ((betPos == null)) {
				return;
			}
			if (((tableList == null) || tableList[betPos.TableID] == null)) {
				return;
			}

			var table = tableList[betPos.TableID];
			if ((table == null)) {
				return;
			}
			table.PositionTotalBet = betPos.PositionBet;
			tableList[betPos.TableID] = table;
			//ChangeTable(table);
			if (betPosList == null) {
				betPosList = new Array();
			}
			betPosList[betPos.TableID] = betPos;
			if (currentTable != null && betPos.TableID == currentTable.TableID) {
				GameReciveServ.SetTablePositionBet(betPos);
			}
		}
		//桌台投注人数
		function SetTablePositionMembers(memPos) {
			if ((memPos == null)) {
				return;
			}
			if (((tableList == null) || tableList[memPos.TableID] == null)) {
				return;
			}
			var table = tableList[memPos.TableID];
			if ((table == null)) {
				return;
			}
			table.PositionMembers = memPos.PositionMembers;
			tableList[memPos.TableID] = table;
			//ChangeTable(table);
			if (memPosList == null) {
				memPosList = new Array();
			}
			memPosList[memPos.TableID] = memPos;
			if (currentTable != null && memPos.TableID == currentTable.TableID) {
				GameReciveServ.SetTablePositionMembers(memPos);
			}
		}
		//桌台历史结果(路子)
		function SetTableHisRoad(hisRoad) {
			if ((hisRoad == null)) {
				return;
			}
			if (((tableList == null) || tableList[hisRoad.TableID] == null)) {
				return;
			}

			var table = tableList[hisRoad.TableID];
			if ((table == null)) {
				return;
			}
			table.HisRoad = hisRoad.HisRoad;
			tableList[hisRoad.TableID] = table;
			ChangeHisRoad(table);
			if (hisRoadList == null) {
				hisRoadList = new Array();
			}
			hisRoadList[hisRoad.TableID] = hisRoad;
			if (currentTable != null && hisRoad.TableID == currentTable.TableID) {
				GameReciveServ.SetTableHisRoad(hisRoad);
			}
		}
		//桌台荷官
		function SetTableDealer(dealer) {
			if ((dealer == null)) {
				return;
			}
			if (((tableList == null) || tableList[dealer.TableID] == null)) {
				return;
			}

			var table = tableList[dealer.TableID];
			if ((table == null)) {
				return;
			}
			table.Dealer = dealer.Dealer;
			tableList[dealer.TableID] = table;
			//ChangeTable(table);
			if (dealerList == null) {
				dealerList = new Array();
			}
			dealerList[dealer.TableID] = dealer;
			if (currentTable != null && dealer.TableID == currentTable.TableID) {
				GameReciveServ.SetTableDealer(dealer);
			}
		}
		//发送桌子结束,显示桌子
		function ShowTable(tablelist) {
			var arr = new Array();
			serverdata.tablearr = null;
			for (var key = 0; key < tableSort.length; key++) {
				var table = tablelist[key];
				if (table && table.RoomID == 1) {
					arr.push(table);
				}
			}
			//排列桌子
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				var arrthree = {
					tableID: 0,
					tableName:'',
					game: 'bacc',
					limit: new Array(),
					table: 0,
					hisroad:'',
					tablestatus:0,
					bettime:0,
					difftime:0
					
				};
				var table = arr[i];
				var arrlimit = LimitServ.SetLimitArray(arr[i].LimitType, arr[i]);
				arrthree.limit = arrlimit;
				arrthree.table = arr[i];
				arrthree.tableID = arr[i].TableID;
				arrthree.tableName = arr[i].TableName;
				arrthree.hisroad=arr[i].HisRoad;
				arrthree.tablestatus=arr[i].Status;
				arrthree.bettime=arr[i].BetTime;
				arrthree.difftime=arr[i].DiffTime;
				switch (arrthree.table.GameKind) {
					case $rootScope.GameKindEnum.Baccarat:
					case $rootScope.GameKindEnum.InsuranceBaccarat:
						arrthree.game = 'bacc';
						break;
					case $rootScope.GameKindEnum.Roulette:
						arrthree.game = 'roul';
						break;
					case $rootScope.GameKindEnum.DragonTiger:
						arrthree.game = 'dragon';
						break;
					default:
						break;
				}
				if (serverdata.tablearr == null) {
					serverdata.tablearr = new Array();
				}
				serverdata.tablearr.push(arrthree);
			}
			serverdata.tablearr = CommFun.AssmbleArray(serverdata.tablearr, 6);
			//刷新页面
			CommFun.DoRefresh(serverdata);
		}
		function ChangeHisRoad(table){
			if (table == null) {
				return;
			}
			var len = serverdata.tablearr.length;
			for (var i = 0; i < len; i++) {
				var length = serverdata.tablearr[i].length;
				for (var j = 0; j < length; j++) {
					if (serverdata.tablearr[i][j] && serverdata.tablearr[i][j].table.TableID == table.TableID) {
						serverdata.tablearr[i][j].hisroad = table.HisRoad;
						CommFun.DoRefresh(serverdata);
						return;
					}
				}
			}
		}
		function ChangeStatus(table){
			if (table == null) {
				return;
			}
			var len = serverdata.tablearr.length;
			for (var i = 0; i < len; i++) {
				var length = serverdata.tablearr[i].length;
				for (var j = 0; j < length; j++) {
					if (serverdata.tablearr[i][j] && serverdata.tablearr[i][j].table.TableID == table.TableID) {
						serverdata.tablearr[i][j].tablestatus=table.Status;
						serverdata.tablearr[i][j].bettime=table.BetTime;
						serverdata.tablearr[i][j].difftime=table.DiffTime;
						CommFun.DoRefresh(serverdata);
						return;
					}
				}
			}
		}
		/*function ChangeTable(table) {
			if (table == null) {
				return;
			}
			var len = serverdata.tablearr.length;
			for (var i = 0; i < len; i++) {
				var length = serverdata.tablearr[i].length;
				for (var j = 0; j < length; j++) {
					if (serverdata.tablearr[i][j] && serverdata.tablearr[i][j].table.TableID == table.TableID) {
						serverdata.tablearr[i][j] = null;
						var arrthree = {
							tableID: 0,
							game: 'bacc',
							limit: new Array(),
							table: 0,
							hisroad:''
						};
						var arrlimit = LimitServ.SetLimitArray(table.LimitType, table);
						arrthree.limit = arrlimit;
						arrthree.table = table;
						arrthree.tableID = table.TableID;
						arrthree.hisroad=arr[i].HisRoad;
						switch (arrthree.table.GameKind) {
							case $rootScope.GameKindEnum.Baccarat:
							case $rootScope.GameKindEnum.InsuranceBaccarat:
								arrthree.game = 'bacc';
								break;
							case $rootScope.GameKindEnum.Roulette:
								arrthree.game = 'roul';
								break;
							case $rootScope.GameKindEnum.DragonTiger:
								arrthree.game = 'dragon';
								break;
							default:
								break;
						}
						serverdata.tablearr[i][j] =arrthree;
						CommFun.DoRefresh(serverdata);
						return;
					}
				}
			}
		}*/
		//获取桌子号
		function GetTableName(tablenames) {
			return CommFun.GetTableName(tablenames);
		}
		//进入游戏限额
		function EnterGame(_limit, tableId) {
			if (tableList && tableList[tableId]) {
				currentTable = tableList[tableId];
				GameReciveServ.SetCurrentTable(currentTable);
				if (tableStatusList && tableStatusList[tableId]) {
					GameReciveServ.SetTableStatus(tableStatusList[tableId]);
				}
				var type = currentTable.GameKind;
				//未完成，进入游戏需细分
				var page = 'bacc';
				switch (type) {
					case $rootScope.GameKindEnum.Baccarat:
						page = 'bacc';
						break;
					case $rootScope.GameKindEnum.InsuranceBaccarat:
						page = 'inbacc';
						break;
					case $rootScope.GameKindEnum.Roulette:
						page = 'roul';
						break;
					case $rootScope.GameKindEnum.DragonTiger:
						page = 'dragon';
						break;
					default:
						break;
				}
				var data = {
					table: currentTable,
					limit: _limit,
					infodata: infodata
				}
				CommFun.ShowLoading(3000);//显示3秒加载页面
				$timeout(function(){
					$state.go(page, {
						data: JSON.stringify(data)
					});
				},1000)
				
			}
		}
		//关闭提示框
		function CloseMessage() {
			CommFun.CloseMessage();
		}

		function ConfirmMessage() {
			CommFun.ConfirmMessage();
		}
		//退回到登陆页面
		function ExitToLogin() {
			CommFun.ShowMessage($rootScope.MessageType.ExitLogin, 0, ExitLogin);
		}

		function ExitLogin() {
			CommFun.ExitLogin();
		}

		function Destory() {
			serverdata = {
				tablearr: null, //桌子排列位置数组
			};
			tableList = null; //桌子信息数组cmdMemberTableInfo
			tableSort = null; //桌子ID数组
			$rootScope.topdata = { //头部信息
				name: '', //账号名称
				blance: 0 //账号余额
			};
			dealerList = null; //桌子荷官数组
			hisRoadList = null; //桌子历史路子数组
			memPosList = null; //桌子投注人数数组
			betPosList = null; //桌子投注金额数组
			tableStatusList = null;
			infodata = null;
			currentTable = null;
		}

	}])