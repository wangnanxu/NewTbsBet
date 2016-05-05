gameModule
	.factory('RoulServ', ['$state', 'GameSendServ', 'GameCommFun', 'ChipSelectManager', 'RoulRoad', '$rootScope', '$timeout', 'CommFun', 'CommandServ', 'LimitServ',
		function($state, GameSendServ, GameCommFun, ChipSelectManager, RoulRoad, $rootScope, $timeout, CommFun, CommandServ, LimitServ) {
			var currentTable = null; //当前桌台
			var currentLimit = null; //当前限额
			var userID = null; //用户ID acc
			var isBet = false; //是否可以投注
			var maxbetlimit = null; //投注位置最大限额数组
			var minbetlimit = null; //投注位置最小限额数组
			var isFirst;
			var confirmBet = CommFun.InitArray(156, 0); //确认投注数组
			var lastBetArr =null; //上一局投注
			var betlist = new Array(); //下注历史记录
			var chairID = 0; //当前椅子号
			var rightele;
			var leftele;
			var winstr="";
			var m_SubmitStatus=false;//提交中. true: 正在提交,还没有返回; false: 允许现在提交
			var serverdata = {
				totalResult: CommFun.InitArray(9, 0), //路子统计个数，庄、闲、和
				roads: [], ////路子统计大、小、单、双、红、黑、零
				table: null,
				isShowChips:false,
				isShowPane:false,
				selectchip:{
					index:0
				},
				totalChips: null, //所有筹码
				chips: null, //选中5个筹码
				resultNum: 0, //结果数字

				winBetpos: [], //贏的投注位置閃爍
				posSet: {
					repeat: false, //重复投注是否可用
					back: false, //返回投注
					confirm: false, //确认投注是否可用
					cancel: false //取消投注是否可用
				},
				bet: CommFun.InitArray(156, 0), //投注筹码
				totalbet: 0, //当前总投注
				unconfirmbet:0//未确定总投注

			}
			var server = {
				InitView: InitView,
				TragetPane:TragetPane,
				TargetShowChips:TargetShowChips,
				GetServerData: GetServerData,
				ChangeSelect:ChangeSelect,
				ChipGoLeft: ChipGoLeft,
				ChipGoRight: ChipGoRight,
				OnBet: OnBet,
				BackBet: BackBet,
				CancelBet: CancelBet,
				RepeatBet: RepeatBet,
				RoadGoLeft: RoadGoLeft,
				RoadGoRight: RoadGoRight,
				
				TagVolume:TagVolume,

				SubGameSubCmd: SubGameSubCmd,
				SetChairID: SetChairID,
				OnMemberBetBack: OnMemberBetBack,
				OnMemberPositionTotalBet: OnMemberPositionTotalBet,
				OnMemberPositionWinLose: OnMemberPositionWinLose,
				SetTableStatus: SetTableStatus,
				SetTablePositionBet: SetTablePositionBet,
				SetTablePositionMembers: SetTablePositionMembers,
				SetTableHisRoad: SetTableHisRoad,
				SetTableDealer: SetTableDealer,

				SendConfirmBet: SendConfirmBet,
				SendStandUp: SendStandUp,
				SendChangeDealer: SendChangeDealer,
				SendChangeBoot: SendChangeBoot,

				Destory: Destory
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化游戏
			function InitView(parmas) {
				isFirst = true;
				currentTable = parmas.table;
				currentLimit = parmas.limit; //
				userID = parmas.infodata.acc; //

				serverdata.table = GameCommFun.GetCommServerData().table;
				serverdata.positionBet = GameCommFun.GetCommServerData().positionBet; //已投注金额
				serverdata.positionMember = GameCommFun.GetCommServerData().positionMember; //已投注人数
				
				GameCommFun.InitView(parmas);

				ResetData();
				ChipSelectManager.Init();
				StringSplit(currentTable.HisRoad);
				serverdata.chips = ChipSelectManager.GetChipSelect(LimitServ.GetLimit());
				serverdata.totalChips = ChipSelectManager.GetTotalChips();
				var arr=LimitServ.GetRoulBetLimit();
				if(arr){
					maxbetlimit = arr[0];
					minbetlimit = arr[1];
				}
				if($rootScope.Sound){
					if($rootScope.lang && $rootScope.lang.lang=="CH" && $rootScope.Sound.Roul_ch){
						GameCommFun.InitSound("Sound/Roul.xml",$rootScope.Sound.Roul_ch);
					}else if($rootScope.Sound.Roul_en){
						GameCommFun.InitSound("Sound/Roul.xml",$rootScope.Sound.Roul_en);
					}
				}
				//获取最大最小限额（未实现）
				CommFun.DoRefresh(serverdata);
			}
			//变换声音
			function TagVolume(){
				GameCommFun.TagVolume();
			}
			function TragetPane(show){
				
				if(show==0){
					serverdata.isShowPane=false;
				}else if(show==1){
					serverdata.isShowPane=true;
				}else{
					serverdata.isShowPane=!serverdata.isShowPane;
				}
				$timeout(function() {
					GameCommFun.TragetPane(serverdata.isShowPane);
					CommFun.DoRefresh(serverdata);
				},1000)
			}
			function TargetShowChips(){
				serverdata.isShowChips=!serverdata.isShowChips
				CommFun.DoRefresh(serverdata);
			}
			function ChipGoLeft() {
				var arr = ChipSelectManager.ChipGoLeft();
				if (arr) {
					serverdata.chips = arr;
					CommFun.DoRefresh(serverdata);
				}

			}

			function ChipGoRight() {
				var arr = ChipSelectManager.ChipGoRight();
				if (arr) {
					serverdata.chips = arr;
					CommFun.DoRefresh(serverdata);
				}
			}


			function ChangeSelect(index) {
				serverdata.selectchip.index = index;
				TargetShowChips();
			}
			
			//路子
			function StringSplit(rolstr) {
				serverdata.roads = RoulRoad.StringSplit(rolstr);
				CommFun.DoRefresh(serverdata);
			}

			function RoadGoLeft() {
				var arr = RoulRoad.GoLeft();
				if (arr) {
					serverdata.roads = arr;
					CommFun.DoRefresh(serverdata);
				}
			}

			function RoadGoRight() {
				var arr = RoulRoad.GoRight();
				if (arr) {
					serverdata.roads = arr;
					CommFun.DoRefresh(serverdata);
				}
			}
		
			//轮盘投注显示
			function OnBet(index) {
				//未完成
				if (isBet == false) {
					//无法投注
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 6);
					return;
				}
				if (serverdata.bet[index] >= maxbetlimit[index]) {
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 4); //位置已达最大投注
					return;
				}
				if ($rootScope.topdata.blance <= 0) {
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 7); //显示余额不足
					return;
				}
				var lastbet = serverdata.bet[index];
				var betcount = serverdata.chips[serverdata.selectchip.index].count;
				if (betcount > $rootScope.topdata.blance) {
					betcount = $rootScope.topdata.blance;
				}
				var betmoney = parseInt(serverdata.bet[index]) + betcount;
				serverdata.bet[index] = betmoney;
				//投注大于最大限额
				if (betmoney > maxbetlimit[index]) {
					serverdata.bet[index] = maxbetlimit[index];
				}
				//投注小于最小限额,大于余额
				if (betmoney < minbetlimit[index]) {
					if (serverdata.bet[index] - lastbet >= ($rootScope.topdata.blance-serverdata.unconfirmbet)) {
						CommFun.ShowMessage($rootScope.MessageType.BetMessage, 7); //显示余额不足
						//播放余额不足
						GameCommFun.PlayAudio($rootScope.Sound.LackBalance,null);
						
						return;
					}
					serverdata.bet[index] = minbetlimit[index];
				}
				var arr = [index, serverdata.bet[index] - lastbet];
				if (betlist == null) {
					betlist = new Array();
				}
				betlist.push(arr);
				serverdata.unconfirmbet=parseInt(serverdata.unconfirmbet) + parseInt(arr[1]);
				serverdata.totalbet = parseInt(serverdata.totalbet) + parseInt(arr[1]);
				//$rootScope.topdata.blance = parseInt($rootScope.topdata.blance) - parseInt(arr[1]);
				serverdata.posSet.repeat = false;
				serverdata.posSet.back = true;
				serverdata.posSet.confirm = true;
				serverdata.posSet.cancel = true;
				lastBetArr = null;
				CommFun.DoRefresh(serverdata);
			}
			//返回投注
			function BackBet() {
				if (serverdata.posSet.back && betlist && betlist.length > 0) {
					var arr = betlist[betlist.length - 1];
					serverdata.totalbet = parseInt(serverdata.totalbet) - parseInt(arr[1]);
					serverdata.unconfirmbet=parseInt(serverdata.unconfirmbet) - parseInt(arr[1]);
					serverdata.bet[arr[0]] = serverdata.bet[arr[0]] - arr[1];
					//$rootScope.topdata.blance = parseInt($rootScope.topdata.blance) + parseInt(arr[1]);
					if (betlist.length > 1) {
						betlist.splice(betlist.length - 1, 1);
					} else {
						betlist = null;
						serverdata.posSet.repeat = false;
						serverdata.posSet.back = false;
						serverdata.posSet.confirm = false;
						serverdata.posSet.cancel = false;
					}
					CommFun.DoRefresh(serverdata);
				}
			}
			//取消投注
			function CancelBet() {
				if (serverdata.posSet.cancel) {
					ChangeBet();
					betlist == null;
					serverdata.unconfirmbet=0;
					serverdata.posSet.back = false;
					serverdata.posSet.confirm = false;
					serverdata.posSet.cancel = false;
				}
			}
			//重复上局投注
			function RepeatBet() {
				if (serverdata.posSet.repeat && lastBetArr && lastBetArr.length>0) {
					serverdata.totalbet = 0;
					var len=lastBetArr.length;
					for (var i = 0; i < len; i++) {
						serverdata.totalbet = parseInt(serverdata.totalbet) + parseInt(lastBetArr[i]);
						serverdata.unconfirmbet =parseInt(serverdata.unconfirmbet) + parseInt(lastBetArr[i]);
						serverdata.bet[i] = lastBetArr[i];
					}
					//$rootScope.topdata.blance = parseInt($rootScope.topdata.blance) - parseInt(serverdata.totalbet );
					serverdata.posSet.repeat = false;
					serverdata.posSet.back = false;
					serverdata.posSet.confirm = true;
					serverdata.posSet.cancel = true;
					lastBetArr = null;
					CommFun.DoRefresh(serverdata);
				}
			}

			function SendConfirmBet(data) {
				if (serverdata.posSet.confirm) {
					if(m_SubmitStatus){
						CommFun.ShowMessage($rootScope.MessageType.BetMessage,3);
						return;
					}
					
					var bool = GameSendServ.SendConfirmBetForRoul(serverdata.bet, confirmBet, maxbetlimit, minbetlimit);
					m_SubmitStatus=bool
					if (bool) {
						betlist = null;
						serverdata.posSet.repeat = false;
						serverdata.posSet.confirm = false;
						serverdata.posSet.cancel = false;
						serverdata.posSet.back = false;
					}
				}
			}

			function ChangeBet() {
				if(confirmBet==null){
					return;
				}
				serverdata.totalbet = 0;
				if (serverdata.bet==null) {
					serverdata.bet=CommFun.InitArray(156, 0);
				}
				var len = serverdata.bet.length;
				for (var i = 0; i < len; i++) {
					serverdata.bet[i] = confirmBet[i];
					serverdata.totalbet = parseInt(serverdata.totalbet) + parseInt(confirmBet[i]);
						
				}
				serverdata.unconfirmbet=0;
				CommFun.DoRefresh(serverdata);
			}
			//命令数据
			function SubGameSubCmd(wSubCmdID, pData) {
				switch (wSubCmdID) {
					case $rootScope.GameForRoulette.StartBet: //开始下注
						var startBet = pData.split(",");
						isBet = true; //可以投注
						TragetPane(1);
						if (isFirst == false && startBet[1] == '1') {
							ResetData(); //重置数据
						}
						serverdata.table.status = 2;
						GameCommFun.InitTimer(parseInt(startBet[0])); //显示时间
						
						CommFun.ShowMessage($rootScope.MessageType.GameStatus, 0); //提示开局
							//播放开始
							GameCommFun.PlayAudio($rootScope.Sound.StartBet,null);
						
						break;
					case $rootScope.GameForRoulette.StopBet: //等待开奖
						isBet = false; //停止投注
						TragetPane(0);
						serverdata.table.status = 3;
						if(lastBetArr==null && 	serverdata.totalbet>0){
							
							var len=serverdata.bet.length;
							lastBetArr=CommFun.InitArray(len, 0);
							for(var i=0;i<len;i++){
								lastBetArr[i]=serverdata.bet[i];
							}
						}
						ChangeBet(); //清理投注还没有确认筹码
						serverdata.posSet.repeat = false;
						serverdata.posSet.confirm = false;
						serverdata.posSet.cancel = false;
						serverdata.posSet.back = false;
						CommFun.ShowMessage($rootScope.MessageType.GameStatus, 1); //提示停止投注

						//显示停止投注提示框
						//播放停止
						GameCommFun.PlayAudio($rootScope.Sound.StopBet,null);
						
						break;
					case $rootScope.GameForRoulette.BallNum: //开结果

						break;
					case $rootScope.GameForRoulette.RouletteResult: //等待结算
					var result= CommandServ.cmdRouletteResult(pData);
						serverdata.table.status = 4;
						
						isFirst = false;
						//播放结果
						GameCommFun.PlayAudio($rootScope.Sound.GameResoult,result.BallNum);
						break;
					case $rootScope.GameForRoulette.EndResult: //结算完成
						serverdata.table.status = 5;
						isFirst = false;
						break;
				}
				serverdata.table.statusText = $rootScope.language.Status[serverdata.table.status];
				CommFun.DoRefresh(serverdata);
				return true;
			}
			//重置页面数据
			function ResetData() {
				//按钮是否可点击
				if (serverdata.bet) {
					serverdata.bet = null;
				}
				if (confirmBet) {
					confirmBet = null;
				}
				if (serverdata.winBetpos) {
					serverdata.winBetpos = null;
				}
				if (betlist) {
					betlist = null;
				}

				serverdata.totalbet = 0;
				serverdata.bet = CommFun.InitArray(156, 0);
				//已确认投注
				confirmBet = CommFun.InitArray(156, 0);
				serverdata.positionBet = CommFun.InitArray(156, 0);
				serverdata.positionMember = CommFun.InitArray(156, 0);
				serverdata.winBetpos = CommFun.InitArray(156, false);
				winstr="";
				serverdata.win=0;
				//按钮是否可点击
				serverdata.posSet = {
					repeat:false,
					back: false,
					confirm: false,
					cancel: false
				};
				if(lastBetArr && lastBetArr.length>0){
					serverdata.posSet.repeat=true;
				}else{
					serverdata.posSet.repeat=false;
				}
				m_SubmitStatus=false;
				CommFun.DoRefresh(serverdata);
			}

			function SetChairID(sitResult) {
				chairID = sitResult.Chair;
				GameSendServ.SetChairID(chairID);
			}

			function OnMemberBetBack(memBetBack) {
				if (memBetBack.Chair == chairID && memBetBack.err != 0) {
					confirmBet[memBetBack.BetPosition] = memBetBack.BetAmount;
					serverdata.bet[memBetBack.BetPosition] = memBetBack.BetAmount;
				}
			}

			function OnMemberPositionTotalBet(totalBet) {
				if(totalBet==null){
					return;
				}
				if (totalBet.Chair == chairID && totalBet.memID == $rootScope.userInfo.memID) {
					m_SubmitStatus=false;
					serverdata.unconfirmbet=0;
					CommFun.ShowMessage($rootScope.MessageType.BetMessage,0);
					//播放投注成功
					GameCommFun.PlayAudio($rootScope.Sound.BetSuccess,null);
					
					var arr = totalBet.TotalBet.split("|");
					for (var key in arr) {
						if (arr[key]) {
							confirmBet[key] = arr[key];
						}
					}
					ChangeBet();
				}
			}

			function OnMemberPositionWinLose(totalWin) {
				if(totalWin==null){
					return;
				}
				if(winstr==totalWin.TotalWin){
					return;
				}
				winstr=totalWin.TotalWin;
				if (totalWin.Chair == chairID && totalWin.memID == $rootScope.userInfo.memID) {
					var winlist=winstr.split("|");
					var len=serverdata.bet.length;
					var totalmoney=0;
					for(var i=0;i<len;i++){
						if(winlist[i] && winlist[i]!=""){
							totalmoney+=parseInt(winlist[i]);
						}
					}
					serverdata.win=parseInt(serverdata.win)+parseInt(totalmoney);
					CommFun.DoRefresh(serverdata);
				}
			}

			function SetTableStatus(tableStatus) {
				GameCommFun.SetTableStatus(tableStatus);
			}
			//大厅命令
			function SetTablePositionBet(betPos) {
				GameCommFun.SetTablePositionBet(betPos);
			}

			function SetTablePositionMembers(memPos) {
				GameCommFun.SetTablePositionMembers(memPos);
			}

			function SetTableHisRoad(hisRoad) {
				if (hisRoad == null) {
					return;
				}
				StringSplit(hisRoad.HisRoad)
			}

			function SetTableDealer(dealer) {

			}
			//顯示赢投注位置
			function ShowWin(result) {
				if (((result == null) || result == "")) {
					return;
				}
				var pbWin = result.substr(0, 1);
				switch (pbWin) {
					case "0":
						serverdata.winBetpos[2] = true;
						break;
					case "1":
						serverdata.winBetpos[1] = true;
						break;
					case "2":
						serverdata.winBetpos[0] = true;
						break;
				}
				if (result.substr(1, 1) == "1") {
					serverdata.winBetpos[4] = true;
				}
				if (result.substr(2, 1) == "1") {
					serverdata.winBetpos[3] = true;
				}
				if (result.substr(3, 1) == "1") {

				}
				CommFun.DoRefresh(serverdata);
			}

			function SendStandUp() {
				GameSendServ.SendStandUp(userID);
			}

			function SendChangeDealer() {
				GameSendServ.SendChangeDealer();
			}

			function SendChangeBoot() {
				GameSendServ.SendChangeBoot();
			}

			function Destory() {
				serverdata.bet = null; //总投注庄、闲、和、庄对、闲对
				confirmBet = null; //确认投注
				lastBetArr=null;//
				serverdata.positionBet = null;
				serverdata.positionMember = null;
				serverdata.totalResult = null;
				serverdata.roads = null;
				//按钮是否可点击
				serverdata.posSet = null;
				serverdata.totalChip = null;
				serverdata.winBetpos = null;
				serverdata.chips = null;
				maxbetlimit = null; //投注位置最大限额数组
				minbetlimit = null; //投注位置最小限额数组

				currentTable = null;
				currentLimit = null; //
				userID = null; //

				rightele = null;
				leftele = null;
				betlist = null;
				winstr="";
				GameCommFun.Destory();
				GameSendServ.Destory();
				RoulRoad.Destory();
				ChipSelectManager.Destory();
				LimitServ.DestoryGame();

			}

		}
	])