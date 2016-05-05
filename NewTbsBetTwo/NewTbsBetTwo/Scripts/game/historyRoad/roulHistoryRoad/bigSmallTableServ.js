gameModule
	.factory('BigSmallTableServ', [function() {
		var parmas;
		var lastRoadView;
		var m_lang;
		var tableName = 'bigSmallTable'; //路子结果形状，类名
		var posArray = []; //标识表格占位
		var row;
		var showArr = []; //目前显示路子
		var server={
			Initialize: Initialize,
			Shuffle: Shuffle,
			ShowRoad: ShowRoad,
			TableName: TableName
		}
		return server;
		//初始化
		function Initialize(parma) {
			parmas=parma;
			row=parmas.rows;
			posArray = new Array();
			posArray.push(new Array(row));
		}
		function TableName() {
			return tableName; 
		}
		//显示
		function ShowRoad(strNumber,arrLength){
			showArr.push(strNumber);
			CountColumn(strNumber);
				var len = showArr.length;
			if (len >= arrLength) {
				if (posArray) {
					var poslen = posArray.length;
					if (poslen > parmas.cols) {
						var count = 0;
						var startcol = poslen - parmas.cols;
						for (var i = startcol; i < poslen; i++) {
							var lengthas = posArray[i].length;
							for (var j = 0; j < 6; j++) {
								if (posArray[i][j] == 1) {
									count++;
								}
							}
						}
						showArr = showArr.slice(arrLength - count, arrLength);
					}
				}
				lastRoadView = null;
				posArray = new Array();
				posArray.push(new Array(row));
				var length = showArr.length;
				for (var i = 0; i < length; i++) {
					Show(showArr[i]);
				}
			}
			
		}
		function  CountColumn(strNumber){
			var rpt=new BigSmallView();
			rpt.PearlView(parmas);
			rpt.SetLang(m_lang);
			rpt.RoadPosition(lastRoadView,strNumber,posArray);
			lastRoadView = rpt;
			FillingArray(rpt._column, rpt._row, 1);
		}
		function Show(strNumber) {
			var rpt=new BigSmallView();
			rpt.PearlView(parmas);
			rpt.SetLang(m_lang);
			rpt.RoadPosition(lastRoadView,strNumber,posArray);
			lastRoadView = rpt;
			FillingArray(rpt._column, rpt._row, 1);
			rpt.CanvasView(rpt.lastNum, rpt._row, rpt._column);
		}
		//洗牌
		function Shuffle() {
			lastRoadView = null;
			showArr = [];
			posArray = new Array();
			posArray.push(new Array(row));
		}
		function PosArray() {
			return posArray;
		}
		/*
		 * 数组填充值
		 @ i 一维索引
		 @ j 二维索引
		*/
		function FillingArray(i, j, val) {
			if (posArray.length < i + 1) {
				posArray.push(new Array(row));
			}
			posArray[i][j] = val;
		}

		function SetLang(strlang) {
			m_lang = strlang;
		}
		
	}])