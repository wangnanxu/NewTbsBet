gameModule
	.factory('RoulHisToryManager', ['RoulTableServ', 'BigSmallTableServ', 'RedBlackTableServ', 'EvenOldTableServ', '$timeout', 'CanvasServ',
		function(RoulTableServ, BigSmallTableServ, RedBlackTableServ, EvenOldTableServ, $timeout, CanvasServ) {
			var parmas = {
				strTable: {
					'rows': 6,
					'cols': 20,
					'pointX': 0,
					'pointY': 0,
					'width': 1
				},
				bigSmallTable: {
					'rows': 6,
					'cols': 20,
					'pointX': 0,
					'pointY': 0,
					'width': 1
				},
				redBlackTable: {
					'rows': 6,
					'cols': 20,
					'pointX': 0,
					'pointY': 0,
					'width': 1
				},
				evenOldTable: {
					'rows': 6,
					'cols': 20,
					'pointX': 0,
					'pointY': 0,
					'width': 1
				}
			}
			var showIndex = 0; //0:珠盘路,1:大小,2:红黑,3:单双
			var strTable;
			var bigSmallTable;
			var redBlackTable;
			var evenOldTable;
			var roadView = []; //路子表格数组
			var roadLoadView = []; //已经加载到界面的表格

			//var roadPos = []; //路子表格位置
			var maxRow = 6; //最大行数

			var arrResult = []; //显示结果数组

			var localResultArray = []; //本地存储结果数组
			var sameCount = 10; //本地数据和发回数据从后向前比较，有sameCount个连续相同停止比较
			var forwardNumber = 20; //向前推进个数
			var resoultList = []; //统计结果计数[大，小，单，双，红，黑，零]
			var arrLength; //字符串长度
			var roadstr;
			var m_lang;

			var server = {
				RoulHistoryResultManger: RoulHistoryResultManger,
				StringSplit: StringSplit,
				ChangeRoad: ChangeRoad,
				Destory: Destory
			}
			return server;

			function RoulHistoryResultManger() {
				strTable = RoulTableServ;
				bigSmallTable = BigSmallTableServ;
				redBlackTable = RedBlackTableServ;
				evenOldTable = EvenOldTableServ;
				roadView = new Array();
				if (strTable != null && strTable != "") {
					roadView.push(strTable);
				}
				if (bigSmallTable != null && bigSmallTable != "") {
					roadView.push(bigSmallTable);
				}
				if (redBlackTable != null && redBlackTable != "") {
					roadView.push(redBlackTable);
				}
				if (evenOldTable != null && evenOldTable != "") {
					roadView.push(evenOldTable);
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
			function StringSplit(strServerResult) {
				roadstr = strServerResult;
				if (resoultList == null) {
					resoultList = [0, 0, 0, 0, 0, 0, 0];
				}
				if (strServerResult == "") {
					Shuffle();
					return;
				}
				var index = -1;
				var serverResult = new Array();
				serverResult = strServerResult.split("|");
				var len = serverResult.length;
				arrLength = len;
				Shuffle();
				for (var i = 0; i < len; i++) {
					ShowRoad(serverResult[i]);
				}
				return resoultList;
			}
			//处理结果，装入数组显示
			function ShowRoad(strNumber) {
				var lenght = roadView.length;
				arrResult = new Array(lenght);
				Resoult(strNumber);
				ShowRoadTable(strNumber);
			}
			//结果统计计算
			function Resoult(str) {
				var index = str;
				var list = [
					[3, 3, 4, 4, 3],
					[1, 2, 1, 1, 2],
					[2, 2, 1, 2, 1],
					[1, 2, 1, 3, 2],
					[2, 2, 1, 1, 1],
					[1, 2, 1, 2, 2],
					[2, 2, 1, 3, 1],
					[1, 2, 1, 1, 2],
					[2, 2, 1, 2, 1],
					[1, 2, 1, 3, 2],
					[2, 2, 1, 1, 1],
					[2, 2, 1, 2, 2],
					[1, 2, 1, 3, 1],
					[2, 2, 2, 1, 2],
					[1, 2, 2, 2, 1],
					[2, 2, 2, 3, 2],
					[1, 2, 2, 1, 1],
					[2, 2, 2, 2, 2],
					[1, 2, 2, 3, 1],
					[1, 1, 2, 1, 2],
					[2, 1, 2, 2, 1],
					[1, 1, 2, 3, 2],
					[2, 1, 2, 1, 1],
					[1, 1, 2, 2, 2],
					[2, 1, 2, 3, 1],
					[1, 1, 3, 1, 2],
					[2, 1, 3, 2, 1],
					[1, 1, 3, 3, 2],
					[2, 1, 3, 1, 1],
					[2, 1, 3, 2, 2],
					[1, 1, 3, 3, 1],
					[2, 1, 3, 1, 2],
					[1, 1, 3, 2, 1],
					[2, 1, 3, 3, 2],
					[1, 1, 3, 1, 1],
					[2, 1, 3, 2, 2],
					[1, 1, 3, 3, 1]
				]
				switch (list[index][1]) {
					case 2:
						resoultList[1] += 1;
						break;
					case 1:
						resoultList[0] += 1;
						break;
					case 3:
						resoultList[6] += 1;
						break;
				}
				switch (list[index][4]) {
					case 1:
						resoultList[3] += 1;
						break;
					case 2:
						resoultList[2] += 1;
						break;
				}
				switch (list[index][0]) {
					case 1:
						resoultList[4] += 1;
						break;
					case 2:
						resoultList[5] += 1;
						break;
				}
			}
			//显示历史记录
			function ShowRoadTable(strNumber) {
				if (!roadView || roadView.length < 1) {
					return;
				}
				if (roadLoadView[showIndex] == null) {
					var rtable = roadView[showIndex];
					roadLoadView[showIndex] = rtable;
					rtable.InitTable();
				}
				var className = roadLoadView[showIndex];
				className.ShowRoad(strNumber, arrLength);
			}

			function Shuffle() {
				if ((roadLoadView && roadLoadView.length > 0)) {
					if (roadLoadView[showIndex]) {
						roadLoadView[showIndex].Shuffle();
					}
					CanvasServ.ClearCanvas();
					localResultArray = null;
					resoultList = [0, 0, 0, 0, 0, 0, 0];
				}
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
						rtable.Initialize(parmas[type]);
					}
					index++;
				}
				CanvasServ.CanvasTable('strTable');
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

			function SetLang(strlang) {
				var index = 0;
				for (index; index < roadLoadView.length; index++) {
					roadLoadView[index].SetLang(strlang);
				}
				m_lang = strlang;
				if (roadstr) {
					StringSplit(roadstr);
				}
			}
			//点击,切换显示
			function ChangeRoad(index) {
				if (index == showIndex) {
					return;
				}
				showIndex = index;
				if (roadstr) {
					StringSplit(roadstr);
				}
			}

			function Destory() {
				parmas = null;
				strTable = null;
				bigSmallTable = null;
				redBlackTable = null;
				evenOldTable = null;
				roadView = null; //路子表格数组
				roadLoadView = null; //已经加载到界面的表格
				//roadPos == null; //路子表格位置
				arrResult = null; //显示结果数组
				localResultArray = null; //本地存储结果数组
				resoultList = null; //统计结果计数[大，小，单，双，红，黑，零]
				roadstr = null;
			}
		}
	])