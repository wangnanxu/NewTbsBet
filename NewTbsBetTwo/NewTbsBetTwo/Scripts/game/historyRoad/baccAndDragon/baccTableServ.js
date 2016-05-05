gameModule
	.factory('BaccTableServ', ['$rootScope','$timeout',function($rootScope,$timeout) {
		var parmas;
		var tableName = 'strTable'; //路子结果形状，类名
		var lastRoadView = null; //最后一个图形对象		
		var _column = 0;
		var _row = 0;
		var row = 6; //表格行数
		var posArray; //标识表格占位

		var showArr = []; //目前显示路子
		var gameType; //游戏类型
		var cachecanvas = null;
		var tableid;
		var server = {
			Initialize: Initialize,
			Shuffle: Shuffle,
			ShowRoad: ShowRoad,
			TableName: TableName,
			Destory: Destory
		}
		return server;
		//初始化
		function Initialize(parma, type,canvasid) {
			gameType = type;
			posArray = new Array();
			posArray.push(new Array(row));
			parmas = parma[tableName];
			if(canvasid){
				tableid=canvasid;
			}
		}

		function TableName() {
			return tableName;
		}
		/*
		 * 显示珠盘路
		 @ number 要显示的结果索引
		*/
		function ShowRoad(number, arrLength) {
			if (!number || number == 0) {
				return;
			}
			showArr.push(number);
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
				$timeout(function(){
					var b_canvas = document.getElementById(tableid);
					if(b_canvas && cachecanvas){
					var ctx = b_canvas.getContext("2d");
						ctx.clearRect(0, 0, b_canvas.width + 1, b_canvas.height + 1);
        				ctx.drawImage(cachecanvas, 0, 0, b_canvas.width, b_canvas.height);
        			}
				},500)
			}
		}

		function Show(number) {
			if (!number || number == 0) {
				return;
			}
			
			if (cachecanvas == null) {
				var b_canvas = document.getElementById(tableid);
				cachecanvas = document.createElement("canvas");
				cachecanvas.width = b_canvas.width;
				cachecanvas.height = b_canvas.height;
			}
			var pt = new BaccViewServ();
			pt.PearlView(parmas, gameType,cachecanvas);
			if($rootScope.lang){
				pt.SetLang($rootScope.lang.lang);
			}
			pt.RoadPosition(lastRoadView, number);
			
			lastRoadView = pt;
			_column = pt.Column();
			_row = pt.Row();
			pt.Destory();
			pt=null;
		}
		//洗牌
		function Shuffle() {
			showArr = [];
			lastRoadView = null;
			if(cachecanvas){
				var cachectx = cachecanvas.getContext("2d");
				cachectx.clearRect(0, 0, cachecanvas.width + 1, cachecanvas.height + 1); //部分Android机器很奇葩，如果局部刷新会出现空白的情况
			}
			cachecanvas=null;
			posArray = new Array();
			posArray.push(new Array(row));
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

		function Destory() {
			parmas = null;
			lastRoadView = null; //最后一个图形对象		
			posArray = null; //标识表格占位
			showArr = null; //目前显示路子
			cachecanvas=null;
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