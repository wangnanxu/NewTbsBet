gameModule
	.factory('DragonServ', ['$state', 'GameSendServ', 'GameCommFun', 'ChipSelectManager', 'BaccHisToryManager', '$rootScope', '$timeout', 'CommFun', 'CommandServ', 'LimitServ',
		function($state, GameSendServ, GameCommFun, ChipSelectManager, BaccHisToryManager, $rootScope, $timeout, CommFun, CommandServ, LimitServ) {
			//桌台状态
			var currentTable = null; //当前桌台
			var currentLimit = null; //当前限额
			var userID = null; //用户ID acc
			var isBet = false; //是否可以投注
			var pkstr = 'img/game/pk/pk'; //牌默认路径+点数.png
			var maxbetlimit = null; //投注位置最大限额数组
			var minbetlimit = null; //投注位置最小限额数组
			var isFirst;
			var confirmBet = CommFun.InitArray(5, 0); //确认投注数组
			var lastBetArr =null; //上一局投注
			var betlist = new Array(); //下注历史记录
			var chairID = 0; //当前椅子号
			var rightele;
			var leftele;
			var m_SubmitStatus=false;//提交中. true: 正在提交,还没有返回; false: 允许现在提交
			var winstr="";//输赢字符串
			var serverdata = {
				totalResult: CommFun.InitArray(3, 0), //路子统计个数，庄、闲、和
				table:null,
				isShowChips:false,
				isShowPane:false,
				selectchip:{
					index:0
				},
				totalChips: null, //所有筹码
				chips: null, //选中5个筹码
				showpk: false, //是否显示牌
				pkresult: [], //牌结果，闲，庄
				bankerPk: CommFun.InitArray(3, ''), //闲牌
				playerpk: CommFun.InitArray(3, ''), //庄牌
				bankerCount: 0, //庄总点数
				playerCount: 0, //闲总点数
				winBetpos: [], //贏的投注位置閃爍
				win: 1, //输赢，1、庄，2、闲，3、和

				posSet: {
					repeat: false, //重复投注是否可用
					back: false, //返回投注
					confirm: false, //确认投注是否可用
					cancel: false //取消投注是否可用
				},
				bet: [], //投注筹码，闲、庄、和、闲对、庄对、大、小、闲保险、庄保险
				totalbet: 0, //当前总投注
				unconfirmbet:0,//未确定总投注
				positionBet: [], //各投注位置投注额
				positionMember: [] //各投注位置投注人数

			}
			var server = {
				InitView: InitView,
				TragetPane:TragetPane,
				TargetShowChips:TargetShowChips,
				GetServerData: GetServerData,
				ChipGoLeft: ChipGoLeft,
				ChipGoRight: ChipGoRight,
				ChangeSelect: ChangeSelect,
				OnBet: OnBet,
				BackBet: BackBet,
				CancelBet: CancelBet,
				RepeatBet: RepeatBet,

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
				serverdata.chips = ChipSelectManager.GetChipSelect(LimitServ.GetLimit());
				serverdata.totalChips = ChipSelectManager.GetTotalChips();
				
				BaccHisToryManager.BaccaratHistoryResultManger('dragon');
				StringSplit(currentTable.HisRoad);
				maxbetlimit = LimitServ.GetBaccMaxLimit();
				minbetlimit = LimitServ.GetBaccMinLimit();
				if($rootScope.Sound){
					if($rootScope.lang.lang=="CH" && $rootScope.Sound.Dran_ch){
						GameCommFun.InitSound("Sound/Drag.xml",$rootScope.Sound.Dran_ch);
					}else if($rootScope.Sound.Dran_en){
						GameCommFun.InitSound("Sound/Drag.xml",$rootScope.Sound.Dran_en);
					}
				}
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
			//解析路子
			function StringSplit(str) {
				serverdata.totalResult = BaccHisToryManager.StringSplit(str, false);
				CommFun.DoRefresh(serverdata);
			}
			//投注显示
			function OnBet(index) {
				if (isBet == false) {
					//无法投注
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 6);
					return;
				}
				if (serverdata.bet[index] == maxbetlimit[index]) {
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 4); //位置已达最大投注
					return;
				}
				if($rootScope.topdata.blance<=0){
					CommFun.ShowMessage($rootScope.MessageType.BetMessage, 7); //显示余额不足
					return;
				}
				var lastbet = serverdata.bet[index];
				var betcount = serverdata.chips[serverdata.selectchip.index].count;
				if(betcount>$rootScope.topdata.blance){
					betcount=$rootScope.topdata.blance;
				}
				var betmoney = parseInt(serverdata.bet[index]) + betcount;
				serverdata.bet[index] = betmoney;
				
				//投注大于最大限额
				if (betmoney > maxbetlimit[index]) {
					serverdata.bet[index] = maxbetlimit[index];
				}
				//投注小于最小限额
				if (betmoney < minbetlimit[index]) {
					if(serverdata.bet[index]-lastbet>=($rootScope.topdata.blance-serverdata.unconfirmbet)){
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
				CommFun.DoRefresh(serverdata.bet);
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
			//确认投注，组装数据
			function SendConfirmBet() {
				if (serverdata.posSet.confirm) {
					if(m_SubmitStatus){
						CommFun.ShowMessage($rootScope.MessageType.BetMessage,3);
						return;
					}
					var bool = GameSendServ.SendConfirmBetForBacc(serverdata.bet, confirmBet, maxbetlimit, minbetlimit);
					m_SubmitStatus=bool
					if (bool) {
						betlist = null;
						serverdata.posSet.repeat = false;
						serverdata.posSet.back = false;
						serverdata.posSet.confirm = false;
						serverdata.posSet.cancel = false;
					}
				}
			}
			//
			function ChangeBet() {
				serverdata.totalbet = 0;
				serverdata.unconfirmbet=0;
				var len = serverdata.bet.length;
				for (var i = 0; i < len; i++) {
					serverdata.bet[i] = confirmBet[i];
					serverdata.totalbet = parseInt(serverdata.totalbet) + parseInt(confirmBet[i]);
				}
				CommFun.DoRefresh(serverdata);
			}

			//龙虎命令
			function SubGameSubCmd(wSubCmdID, pData) {
				switch (wSubCmdID) {
					case $rootScope.GameForDragon.StartBet: //开始下注
						serverdata.showpk = false; //隐藏牌
						isBet = true; //可以投注
						TragetPane(true);
						if (isFirst == false) {
							ResetData(); //重置数据
						}
						serverdata.table.status = 2; //桌台状态
						var arr = pData.split(",");
						if (arr.length == 2) {
							GameCommFun.InitTimer(parseInt(arr[0])); //显示时间
						}
						CommFun.ShowMessage($rootScope.MessageType.GameStatus, 0); //提示开局
						//播放开始
						GameCommFun.PlayAudio($rootScope.Sound.StartBet,null);
						
						break;
					case $rootScope.GameForDragon.StopBet: //停止下注
						isBet = false; //停止投注
						TragetPane(false);
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
						serverdata.posSet.back = false;
						serverdata.posSet.confirm = false;
						serverdata.posSet.cancel = false;
						CommFun.ShowMessage($rootScope.MessageType.GameStatus, 1); //提示停止投注
						//显示停止投注提示框
						//播放停止
						GameCommFun.PlayAudio($rootScope.Sound.StopBet,null);
						
						break;
					case $rootScope.GameForDragon.CardInfo: //开结果
						var cardInfo = CommandServ.cmdDragonCardInfo(pData);
						serverdata.table.status = 3;
						serverdata.showpk = true;
						ShowDragonPk(cardInfo); //显示牌
						console.log(JSON.stringify(cardInfo))
						break;
					case $rootScope.GameForDragon.DragonResult: //开结果
						var dragResult = CommandServ.cmdDragonResult(pData);
						
						serverdata.table.status = 3;
						if(dragResult==null){
							return;
						}
						PlayWin(dragResult.Result);
						ShowWin(dragResult.Result);
						isFirst = false;
						//无，眯牌才用
						break;
					case $rootScope.GameForDragon.EndResult: //结算完成
						serverdata.table.status = 5;
						isFirst = false;
						//隐藏牌
						//显示路子
						break;
					case $rootScope.GameForDragon.ChangeBoot: //更换牌靴
						serverdata.table.status = 6;
						break;
					case $rootScope.GameForDragon.ChangeDealer: //更换荷官
						serverdata.table.status = 7;
						break;
					case $rootScope.GameForDragon.CancelRound: //下一轮
						serverdata.table.status = 7;
						break;
				}
				serverdata.table.statusText = $rootScope.language.Status[serverdata.table.status];
				CommFun.DoRefresh(serverdata);
				return true;
			}

			function ShowDragonPk(cardinfo) {
				if (cardinfo.Position == 2) {
					//虎
					serverdata.playerpk[0] = cardinfo.CardNum;
					serverdata.pkresult[1] = (serverdata.pkresult[1] + GameCommFun.CountPk(cardinfo.CardNum)) % 10;
				} else {
					//龙
					serverdata.bankerPk[0] = cardinfo.CardNum;
					serverdata.pkresult[0] = (serverdata.pkresult[0] + GameCommFun.CountPk(cardinfo.CardNum)) % 10;
				}
				CommFun.DoRefresh(serverdata);
			}

			//重置页面数据
			function ResetData() {
				serverdata.showpk = false; //是否显示牌
				if (serverdata.bet) {
					serverdata.bet = null;
				}
				if (confirmBet) {
					confirmBet = null;
				}
				if (serverdata.positionBet) {
					serverdata.positionBet = null;
				}
				if (serverdata.positionMember) {
					serverdata.positionMember = null;
				}
				if (serverdata.pkresult) {
					serverdata.pkresult = null;
				}
				if (serverdata.bankerPk) {
					serverdata.bankerPk = null;
				}
				if (serverdata.playerpk) {
					serverdata.playerpk = null;
				}
				if (serverdata.winBetpos) {
					serverdata.winBetpos = null;
				}
				if (betlist) {
					betlist = null;
				}
				serverdata.totalbet = 0;
				serverdata.bet = CommFun.InitArray(5, 0); //总投注庄、闲、和、庄对、闲对
				confirmBet = CommFun.InitArray(5, 0); //确认投注
				serverdata.positionBet = CommFun.InitArray(5, 0);
				serverdata.positionMember = CommFun.InitArray(5, 0);
				serverdata.pkresult = CommFun.InitArray(2, 0);
				serverdata.winBetpos = CommFun.InitArray(3, false);
				winstr="";
				serverdata.win=0;
				//按钮是否可点击
				serverdata.posSet = {
					repeat:false,
					back: false,
					confirm: false,
					cancel: false
				}
				if(lastBetArr && lastBetArr.length>0){
					serverdata.posSet.repeat=true;
				}else{
					serverdata.posSet.repeat=false;
				}
				serverdata.bankerPk = CommFun.InitArray(3, '');
				serverdata.playerpk = CommFun.InitArray(3, '');
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
			//播放赢
			function PlayWin(result){
				var m_win= result;
				var bnum="1"+serverdata.pkresult[0];
				var pnum="2"+serverdata.pkresult[1];
				GameCommFun.PlayAudio($rootScope.Sound.GameResoult,bnum);
				GameCommFun.PlayAudio($rootScope.Sound.GameResoult,pnum);
				GameCommFun.PlayAudio($rootScope.Sound.GameWin,m_win);
			}
			//顯示赢投注位置
			function ShowWin(result) {
				if (((result == null) || result == "")) {
					return;
				}
				var pbWin = result.toString().substr(0, 1);
				switch (pbWin) {
					case "0":
						serverdata.winBetpos[0] = true;
						break;
					case "1":
						serverdata.winBetpos[1] = true;
						break;
					case "2":
						serverdata.winBetpos[2] = true;
						break;
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
				serverdata.showpk = false; //是否显示牌

				serverdata.bet = null; //总投注庄、闲、和、庄对、闲对
				confirmBet = null; //确认投注
				lastBetArr=null;//
				serverdata.positionBet = null;
				serverdata.positionMember = null;
				serverdata.pkresult = null;
				serverdata.totalResult = null;
				//按钮是否可点击
				serverdata.posSet = null;
				
				serverdata.totalChips = null;
				serverdata.chips = null;
				
				serverdata.bankerPk = null;
				serverdata.playerpk = null;
				serverdata.winBetpos = null;
				maxbetlimit = null; //投注位置最大限额数组
				minbetlimit = null; //投注位置最小限额数组
				
				currentTable = null;
				currentLimit = null; //
				userID = null; //
				rightele = null;
				leftele = null;
				betlist = null;
				
				winstr = null;
				
				GameCommFun.Destory();
				GameSendServ.Destory();
				BaccHisToryManager.Destory();
				ChipSelectManager.Destory();
				LimitServ.DestoryGame();
			}
		}
	])