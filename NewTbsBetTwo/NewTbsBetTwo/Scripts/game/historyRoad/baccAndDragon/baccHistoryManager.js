gameModule
	.factory('BaccHisToryManager', ['BaccTableServ', 'BaccBigTableServ', 'BaccBigEyeTableServ', '$timeout', 'CanvasServ',
		function(BaccTableServ, BaccBigTableServ, BaccBigEyeTableServ, $timeout, CanvasServ) {
			var newBgResult = -1; //大路的最新结果
			var parmas = null;
			var bt = null; //大路

			var strPearlTable;
			var strBigTable;
			var strBigEyesTable;
			var strSmallTable;
			var strSmallForcedTablele;
			var strRoadInfo;
			var roadView = []; //路子表格数组
			var roadLoadView = []; //已经加载到界面的表格

			//var roadPos = []; //路子表格位置

			var column = 0; //最新大路列；
			var row = 0; //最新大路行；
			var bigArr = null; //大路最新结果数组
			var maxRow = 6; //最大行数

			var BEType = 1; //判断大眼路结果参数
			var SType = 2; //判断小路结果参数
			var SFType = 3; //判断小强路结果参数

			var arrResult = []; //显示结果数组

			var localResultArray = []; //本地存储结果数组
			var sameCount = 10; //本地数据和发回数据从后向前比较，有sameCount个连续相同停止比较
			var forwardNumber = 20; //向前推进个数
			var resoultList = []; //统计结果计数

			var roadstr;

			var arrLength = new Array(5); //数组长度
			var isAsk = false;
			var bAsk = true;
			var pAsk = true;
			var askArr;
			var gameType;
			var tablecanvasId = "a_canvas";
			var viewcanvasId = "b_canvas";
			var server = {
				BaccaratHistoryResultManger: BaccaratHistoryResultManger,
				StringSplit: StringSplit,
				Askb: Askb,
				Askp: Askp,
				Destory: Destory
			}
			return server;

			function BaccaratHistoryResultManger(gametype) {
				parmas = {
					strTable: {
						'rows': 6,
						'cols': 6,
						'pointX': 0.015,
						'pointY': 0,
						'width': 0.35
					},
					strBigTable: {
						'rows': 6,
						'cols': 12,
						'pointX': 0.016,
						'pointY': 0,
						'width': 0.35
					},
					strBigEyesTable: {
						'rows': 3,
						'cols': 12,
						'pointX': 0.016,
						'pointY': 2.1,
						'width': 0.35
					}
				}

				gameType = gametype;
				strPearlTable = BaccTableServ;
				strBigTable = BaccBigTableServ;
				strBigEyesTable=BaccBigEyeTableServ;
				roadView = new Array();

				if (strPearlTable != null && strPearlTable != "") {
					roadView.push(strPearlTable);
				}
				if (strBigTable != null && strBigTable != "") {
					roadView.push(strBigTable);
				}
				if (strBigEyesTable != null && strBigEyesTable != "") {
					roadView.push(strBigEyesTable);
				}
				if (strSmallTable != null && strSmallTable != "") {
					roadView.push(strSmallTable);
				}
				if (strSmallForcedTablele != null && strSmallForcedTablele != "") {
					roadView.push(strSmallForcedTablele);
				}
				if (strRoadInfo != null && strRoadInfo != "") {
					roadView.push(strRoadInfo);
				}

				roadLoadView = new Array();
				CanvasServ.GetParmas(parmas);
				ShowTable();
			}
			/*
			 * 服务器返回字符串分割
			 @ number 向前推进个数
			 @ sameCount 相同数量
			*/
			function StringSplit(strServerResult, bool) {
				if (bool == false) {
					roadstr = strServerResult;
				}
				if (resoultList == null) {
					resoultList = [0, 0, 0, 0];
				}
				isAsk = bool;
				if (strServerResult == "") {
					Shuffle();
					return resoultList;
				}
				var index = -1;
				var serverResult = new Array();
				serverResult = strServerResult.split("|");
				Shuffle();
				for (var i = 0; i < 5; i++) {
					arrLength[i] = serverResult.length;
				}
				for (var i = 0; i < serverResult.length; i++) {
					ShowRoad(serverResult[i]);
				}
				return resoultList;
			}
			//处理结果，装入数组显示
			function ShowRoad(strNumber) {
				if (roadView == null) {
					return;
				}
				var lenght = roadView.length;
				arrResult = BaccaratResult(strNumber);
				if (arrResult) {
					ShowRoadTable(arrResult);
				}
			}
			//结果处理
			//结果 1:庄;2:闲;3:和;4:闲(庄对闲对);5:闲(庄对);6闲(闲对);7:庄(庄对闲对);8:庄(庄对);9:庄(闲对);10:和(庄对闲对);11:和(庄对);12:和(闲对)
			function BaccaratResult(strNumber) {
				if (strNumber == null || strNumber == "") {
					return null;
				}
				var lenght = roadView.length;
				var Result = new Array(lenght);
				var blankPlay = 0;
				switch (strNumber.substring(0, 1)) {
					case "0":
						blankPlay = 3;
						resoultList[2] += 1;
						break;
					case "1":
						blankPlay = 1;
						resoultList[0] += 1;
						break;
					case "2":
						blankPlay = 2;
						resoultList[1] += 1;
						break;
				}
				switch (strNumber.substr(1, 2)) {
					case "00":
						Result[0] = blankPlay;
						break;
					case "01":
						if (blankPlay == 1) {
							Result[0] = 9;
						} else if (blankPlay == 2) {
							Result[0] = 6;
						} else {
							Result[0] = 12;
						}
						break;
					case "10":
						if (blankPlay == 1) {
							Result[0] = 8;
						} else if (blankPlay == 2) {
							Result[0] = 5;
						} else {
							Result[0] = 11;
						}
						break;
					case "11":
						if (blankPlay == 1) {
							Result[0] = 7;
						} else if (blankPlay == 2) {
							Result[0] = 4;
						} else {
							Result[0] = 10;
						}
						break;
				}
				if (gameType == 'dragon') {
					Result[0] = blankPlay;
				}
				Result[1] = blankPlay;
				Result[lenght - 1] = Result[0];

				return Result;
			}

			//显示历史记录
			function ShowRoadTable(arr) {
				if (!roadView || roadView.length < 1) {
					return;
				}
				var index = 0;
				while (index < roadView.length) {
					if (roadLoadView[index] == null) {
						var rtable = roadView[index];

						roadLoadView[index] = rtable;
						rtable.InitTable();
					}
					var className = roadLoadView[index];
					switch (className.TableName()) {
						case 'strBigEyesTable': //大眼路
							if (arr[1] == 3) {
								arrLength[index] = arrLength[index] - 1;
							}
							if (newBgResult != -1 && newBgResult != 3) {
								arr[index] = AttachedResult(column, row, BEType); //得到大眼路结果
							} else {
								arr[index] = 0;
							}
							if (arr[index] == 0) {
								arrLength[index] = arrLength[index] - 1;
							}

							break;
						case 'strSmallTable': //小路
							if (arr[1] == 3) {
								arrLength[index] = arrLength[index] - 1;
							}
							if (newBgResult != -1 && newBgResult != 3) {
								arr[index] = AttachedResult(column, row, SType); //得到小路结果
							} else {
								arr[index] = 0;
							}
							if (arr[index] == 0) {
								arrLength[index] = arrLength[index] - 1;
							}
							break;
						case 'strSmallForcedTablele': //小强路
							if (arr[1] == 3) {
								arrLength[index] = arrLength[index] - 1;
							}
							if (newBgResult != -1 && newBgResult != 3) {
								arr[index] = AttachedResult(column, row, SFType); //得到小路结果
							} else {
								arr[index] = 0;
							}
							if (arr[index] == 0) {
								arrLength[index] = arrLength[index] - 1;
							}
							break;
					}
					if (!NonEmpty(arr[index]) && arr[index] != 0) { //如果没有数据和数据为0不显示
						roadLoadView[index].ShowRoad(arr[index], arrLength[index]);
						//显示路子;
						if (className == strBigTable) { //大路
							if (bt == null) {
								bt = roadLoadView[index];
							}
							column = roadLoadView[index].Column();
							row = roadLoadView[index].Row();
							bigArr = roadLoadView[index].PosArray();
							newBgResult = arr[index];
						}
					}
					index++;
				}
			}

			function Shuffle() {
				if ((roadLoadView && roadLoadView.length > 0)) {
					var index = 0;
					while ((index < roadLoadView.length)) {
						if (roadLoadView[index]) {
							roadLoadView[index].Shuffle();
						}
						index++;
					}
				}
				localResultArray = null;
				bigArr = null;
				isAsk = false;
				arrLength = new Array(5);
				resoultList = [0, 0, 0, 0];
			}

			function GetResoultList() {
				return resoultList;
			}
			/*
			 * 显示表格
			 */
			function ShowTable() {
				var index = 0;
				while (index < roadView.length) {
					if (roadLoadView[index] == null) {
						var rtable = roadView[index];
						roadLoadView[index] = rtable;
						var type = rtable.TableName();
						switch(type){
							case "strTable":
								viewcanvasId="aa_canvas";
								tablecanvasId="ba_canvas";
							break;
							case "strBigTable":
								viewcanvasId="ab_canvas";
								tablecanvasId="bb_canvas";
							break;
							case "strBigEyesTable":
								viewcanvasId="ac_canvas";
								tablecanvasId="bc_canvas";
							break;
						}
						rtable.Initialize(parmas, gameType, viewcanvasId);
						CanvasServ.CanvasTable(type, tablecanvasId);
					}
					index++;
				}
			}
			/*
			 * 更具大路最新结果判断大眼路，小路，小强路显示结果
			 @ c 最新列
			 @ r 最新行
			 @ type 路子类型 1 大眼路 2小路 3小强路
			*/
			function AttachedResult(c, r, type) {
				var ret = 0;
				if ((bigArr == null)) {
					return ret;
				}
				var c_star = 2,
					c_last = 3; //c_star表示开始计算的列，c_last表示如果c_star列第二行没有值从c_last列开始计算
				if ((type == BEType)) { //大眼路从第2列第二行开始，如果第2列没有则从第3列第一行开始
					c_star = 2;
					c_last = 3;
				} else if ((type == SType)) { //小路从第3列第二行开始，如果第3列没有则从第4列第一行开始
					c_star = 3;
					c_last = 4;
				} else if ((type == SFType)) { //小强路从第4列第二行开始，如果第4列没有则从第5列第一行开始
					c_star = 4;
					c_last = 5;
				}
				if (bigArr.length < c_star) {
					return ret;
				}
				if (bigArr.length == c_star) {
					if (NonEmpty(bigArr[c_star - 1][1])) {
						return ret;
					}
				}
				if (bigArr.length >= c_last) {
					if (NonEmpty(bigArr[c_star - 1][1]) && NonEmpty(bigArr[c_last - 1][0])) {
						return ret;
					}
				}
				if ((row == 0)) { //换列大眼路对前一列与前二列结果，小路对前一列与前三列结果，小强路对前一列与前四列结果，整齐则画红（1），不整齐则画蓝（2）
					for (var n = 0; n < maxRow; n++) {
						if (((NonEmpty(bigArr[c - c_star][n]) && !NonEmpty(bigArr[c - 1][n])) || !NonEmpty(bigArr[c - c_star][n]) && NonEmpty(bigArr[c - 1][n]))) {

							ret = 2;
							break;
						} else if ((NonEmpty(bigArr[c - c_star][n]) && NonEmpty(bigArr[c - 1][n]))) {
							ret = 1;
							break;
						}
					}
				} else { //换行大路和前一列比较，小路和前二列比较，小强路和前三列比较
					if (!NonEmpty(bigArr[c - c_star + 1][r])) { //有结果则为红（1）
						ret = 1;
					} else {
						if (NonEmpty(bigArr[c - c_star + 1][r - 1])) { //无结果，如果前面的前两行或两行以上都没都没结果为红（1），否则为蓝（2）
							ret = 1;
						} else {
							ret = 2;
						}
					}
				}
				return ret;
			}

			/*
			 * 非空判断
			 @ param 要判断的值
			*/
			function NonEmpty(param) {
				if (((param == undefined) || param == null)) {
					return true;
				}
				return false;
			}


			function Askb() {
				if (bAsk) {
					bAsk = false;
					pAsk = true;
					askArr = roadstr + "|1001";
					StringSplit(askArr, true);
					$timeout(function() {
						bAsk = true;
						StringSplit(roadstr, false);
					}, 3000)
				}
			}

			function Askp() {
				if (pAsk) {
					bAsk = true;
					pAsk = false;
					askArr = roadstr + "|2001";
					StringSplit(askArr, true);
					$timeout(function() {
						pAsk = true;
						StringSplit(roadstr, false);
					}, 3000)
				}
			}

			function Destory() {
				parmas = null;
				if (strPearlTable) {
					strPearlTable.Destory();
					strPearlTable = null;
				}
				if (strBigTable) {
					strBigTable.Destory();
					strBigTable = null;
				}
				if (strBigEyesTable) {
					strBigEyesTable.Destory();
					strBigEyesTable = null;
				}
				if (strSmallForcedTablele) {
					strSmallForcedTablele.Destory();
					strSmallForcedTablele = null;
				}
				if (strSmallTable) {
					strSmallTable.Destory();
					strSmallTable = null;
				}
				strRoadInfo = null;
				roadView = null; //路子表格数组
				roadLoadView = null; //已经加载到界面的表格
				//var roadPos = []; //路子表格位置
				bigArr = null; //大路最新结果数组
				arrResult = null; //显示结果数组
				localResultArray = null; //本地存储结果数组
				resoultList = null; //统计结果计数
				roadstr = null;
				arrLength = null; //数组长度
				askArr = null;
				bt = null;
			}

		}
	])