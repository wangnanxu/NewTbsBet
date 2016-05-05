gameModule
	.factory('RoulTableServ', [function() {
		var parmas;
		var lastRoadView;
		var m_lang;
		var tableName = 'strTable'; //路子结果形状，类名
		var tableid;
		var showArr = []; //目前显示路子
		var server={
			Initialize: Initialize,
			Shuffle: Shuffle,
			ShowRoad: ShowRoad,
			TableName: TableName
		}
		return server;
		//初始化
		function Initialize(parma,canvasid) {
			parmas=parma;
			tableid=canvasid;
		}
		function TableName() {
			return tableName; 
		}
		//显示
		function ShowRoad(strNumber,arrLength){
			showArr.push(strNumber);
			var len = showArr.length;
			if (len >= arrLength) {
				var count = parmas.cols * parmas.rows - 3;
				if (len > count) {
					showArr = showArr.slice(arrLength - count, arrLength);
				}
				var length = showArr.length;
				for (var i = 0; i < length; i++) {
					Show(showArr[i]);
				}
			}
			
		}
		function Show(number) {
			var rpt=new RouleetePealView();
			rpt.PearlView(parmas,tableid);
			rpt.SetLang(m_lang);
			rpt.RoadPosition(lastRoadView,number);
			lastRoadView = rpt;
			rpt.Destroy();
			rpt=null;
		}
		//洗牌
		function Shuffle() {
			lastRoadView = null;
			showArr = [];
			ClearCanvas();
		}
		
		function SetLang(strlang) {
			m_lang = strlang;
		}
		//清除路子
		function ClearCanvas() {
			var b_canvas = document.getElementById(tableid);
			if (b_canvas) {
				var ctx = b_canvas.getContext("2d");
				ctx.clearRect(0, 0, b_canvas.width, b_canvas.height);
			}

		}
		
	}])