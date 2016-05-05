var RouleetePealView = function() {
	var parmas;
	this.num = 0;
	var _row = 0; //行数，记录当前填充的行
	var _column = 0; //列数，记录当前填充的列

	this.l_startColumn = 0; //记录最后一个对象起始列

	var maxRow = 6; //最大行数

	var m_lang;
	var viewid;
	var roadResult = [
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
	this.PearlView = function(parma,canvasid) {
			parmas = parma;
			if(canvasid){
				viewid=canvasid;
			}
		}
		/**
		 * 珠盘路定位
		 @ lastRPV 上一个珠盘对象 
		 @ number 珠盘图形对应的索引
		 @ arr 占位数组
		**/
	this.RoadPosition = function(lastRPV, number) {
			if (roadResult == null || roadResult[number] == null) {
				number = 0;
			}
			var cor = roadResult[number][0];
			if (cor == 0) {
				return;
			}
			var suite = 0;
			if (lastRPV != null) {
				this.num = lastRPV.num + 1;
				suite = this.num;
			}
			_column= Math.floor(suite / maxRow);
			_row = Math.floor(suite % maxRow);
			this.CanvasView(number, _row, _column);
		} //非空判断
	this.NonEmpty = function(param) {
		if (param == undefined || param == null) {
			return true;
		}
		return false;
	}

	//行属性
	this.Row = function() {
		return _row;
	}

	//列属性
	this.Column = function() {
		return _column;
	}
	this.SetLang = function(strlang) {
			m_lang = strlang;
	}
	this.CanvasView = function( num, row, col) {
		var img = new Image();
		var str = 'img/game/roul/'+num+'.png'
		img.src = str;
		var b_canvas = document.getElementById(viewid);
		var ctx = b_canvas.getContext("2d");
		var rows = parmas.rows;
		var cols = parmas.cols;
		var pointX = b_canvas.width * parmas.pointX;
		var width = b_canvas.width * parmas.width;
		var height = width * (rows / cols);
		var pointY = height * parmas.pointY;
		var cell_height = height / rows;
		var cell_width = width / cols;
		var x = cell_width * col + pointX;
		var y = cell_height * row + pointY;
		img.onload = function() {
			ctx.drawImage(img, x + 1, y + 1, cell_width - 2, cell_height - 2);
		}
	}
	this.Destroy=function(){
		this.PearlView =null;
		this.RoadPosition =null;
		this.NonEmpty =null;
		this.Row =null;
		this.Column =null;
		this.SetLang =null;
		this.CanvasView =null;
		parmas=null;
		roadResult=null;
	}
}