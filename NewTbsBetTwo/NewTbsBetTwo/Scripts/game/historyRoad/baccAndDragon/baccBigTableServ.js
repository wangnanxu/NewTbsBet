gameModule
	.factory('BaccBigTableServ', ['$timeout', function($timeout) {
		var parmas;
		var _column = 0;
		var _row = 0;
		var tableName = 'strBigTable'; //路子结果形状，类名

		var lastRoadView = null; //最后一个图形对象		

		var row = 6; //表格行数
		var posArray; //标识表格占位

		var m_lang //当前语言
		var showArr = []; //目前显示路子
		var tiecount = []; //和个数
		var tableid; //绘制路子canvasid
		var cachecanvas = null;
		var server = {
			Initialize: Initialize,
			Shuffle: Shuffle,
			ShowRoad: ShowRoad,
			PosArray: PosArray,
			Row: Row,
			Column: Column,
			FShowRoad: FShowRoad,
			TableName: TableName,
			Destory: Destory
		}
		return server;
		//初始化
		function Initialize(parma, gametype, canvasid) {
			posArray = new Array();
			posArray.push(new Array(row));
			parmas = parma[tableName];
			if (canvasid) {
				tableid = canvasid;
			}
		}

		function TableName() {
			return tableName;
		}
		//显示大路
		function ShowRoad(number, arrLength) {
			if (!number || number == 0) {
				return;
			}
			showArr.push(number);
			CountColumn(number);
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
						for (var k = startcol; k < tiecount.length; k++) {
							if (tiecount[k]) {
								count = count + tiecount[k];
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
				$timeout(function() {
					var b_canvas = document.getElementById(tableid);
					if (b_canvas && cachecanvas) {
						var ctx = b_canvas.getContext("2d");
						ctx.clearRect(0, 0, b_canvas.width + 1, b_canvas.height + 1);
						ctx.drawImage(cachecanvas, 0, 0, b_canvas.width, b_canvas.height);
					}
				}, 500)
			}
		}

		function CountColumn(number) {
			if ((number == 3)) {
				if (lastRoadView) {
					if (tiecount[lastRoadView._column]) {
						tiecount[lastRoadView._column] = tiecount[lastRoadView._column] + 1;
					} else {
						tiecount[lastRoadView._column] = 1;
					}
				} else {
					tiecount[0] = 1;
				}
				return;
			} else {
				var rc = new BaccBigViewServ();
				rc.BigView(number, parmas);
				rc.SetLang(m_lang);
				rc.RoadPosition(lastRoadView, number, posArray);
				lastRoadView = rc;
				FillingArray(rc._column, rc._row, 1);
				_column = rc._column;
				_row = rc._row;
				rc = null;
			}
		}

		function Show(number) {
			if (cachecanvas == null) {
				var b_canvas = document.getElementById(tableid);
				cachecanvas = document.createElement("canvas");
				cachecanvas.width = b_canvas.width;
				cachecanvas.height = b_canvas.height;
			}
			if ((number == 3)) {
				if ((lastRoadView == null)) {
					return;
				} else {
					lastRoadView.AddDrawResult(lastRoadView);
				}
			} else {
				var rc = new BaccBigViewServ();
				rc.BigView(number, parmas, cachecanvas);
				rc.SetLang(m_lang);
				rc.RoadPosition(lastRoadView, number, posArray);
				lastRoadView = rc;
				FillingArray(rc._column, rc._row, 1);
				_column = rc._column;
				_row = rc._row;
				rc.CanvasView(number, _row, _column);
				rc = null;
			}
		}

		//预测下一次结果
		function FShowRoad(number) {
			if (!number || number == 0) {
				return;
			}
			var rc = new BaccBigViewServ();
			rc.BigView(number, parmas);
			rc.SetLang(m_lang);
			rc.RoadPosition(lastRoadView, number, posArray);
			FillingArray(rc._column, rc._row, undefined);
			_column = rc._column;
			_row = rc._row;
		}

		function PosArray() {
			return posArray;
		}

		function Column() {
			return _column;
		}

		function Row() {
			return _row;
		}
		//洗牌
		function Shuffle() {
			lastRoadView = null;
			if (cachecanvas) {
				var cachectx = cachecanvas.getContext("2d");
				cachectx.clearRect(0, 0, cachecanvas.width + 1, cachecanvas.height + 1); //部分Android机器很奇葩，如果局部刷新会出现空白的情况
			}
			cachecanvas = null;
			showArr = [];
			tiecount = [];
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

		function SetLang(strlang) {
			m_lang = strlang;

		}

		function Destory() {
			parmas = null;
			lastRoadView = null; //最后一个图形对象		
			posArray = null; //标识表格占位
			showArr = null;
			tiecount = null;
			cachecanvas = null;
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