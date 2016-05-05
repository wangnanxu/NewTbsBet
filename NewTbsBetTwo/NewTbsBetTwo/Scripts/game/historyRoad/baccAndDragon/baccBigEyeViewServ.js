var BaccBigEyeViewServ = function() {
	var parmas;
	this._row = 0; //行数，记录当前填充的行
	this._column = 0; //列数，记录当前填充的列

	//var _x = 1; //初始x坐标
	//var _y = 1; //初始y坐标

	var _width = 0; //宽
	var _height = 0; //高

	//var l_startx = 1; //记录最后一个对象起始x坐标
	this.l_startColumn = 0; //记录最后一个对象起始列

	this.lastNum = 0; //记录最后一个颜色，1表示红，2表示蓝
	var maxRow=6; //最大行数

	var roadResult = []; //存储结果对应的状态 一维索引表示最新结果 二维索引表示属性[0-5]分别代表红黑，大小,打，列，单双

	var m_lang;
	var cachecanvas = null;

	this.BigEyesView = function(number,parma,canvas) {
		if (!number || number == 0) {
			return;
		}
		//gotoAndStop(number);
		width = height = _width = _height = 5.75;
		parmas=parma;
		cachecanvas=canvas;
	}

	this.RoadPosition = function(rpv, number, arr) {
		if (!number || number == 0) {
			return;
		}
		this.lastNum = number;
		if (rpv == null) { //最后一个值为空时，位置为默认位置
		} else {
			if (rpv.lastNum != number) {
				this._row = 0;
				this._column = rpv.l_startColumn + 1;
				this.l_startColumn = rpv.l_startColumn + 1;
			} else {
				this.l_startColumn = rpv.l_startColumn;
				if (rpv._row + 1 < maxRow && this.NonEmpty(arr[rpv._column][rpv._row + 1])) {
					this._row = rpv._row + 1;
					this._column = rpv._column;
				} else {
					this._row = rpv._row;
					this._column = rpv._column + 1;
				}
			}
		}
	}

	//非空判断
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
	this.CanvasView = function(num,row,col) {
		var img = new Image();
		var str = '';
		switch (num) {
			case 1:
				str = 'img/game/bacc/road/bigEyeTableView/red.png'
				break;
			case 2:
				str = 'img/game/bacc/road/bigEyeTableView/blue.png'
				break;
		}
		img.src = str;
		if(cachecanvas){
		var ctx = cachecanvas.getContext("2d");
		var rows = parmas.rows;
		var cols = parmas.cols;
		var pointX = cachecanvas.width * parmas.pointX;
		var width = cachecanvas.width * parmas.width;
		var height = width * (rows / cols);
		var pointY = height * parmas.pointY;
		var cell_height = height / rows;
		var cell_width = width / cols;
		var x = cell_width/2 * col + pointX;
		var y = cell_height/2 * row + pointY;
		
		img.onload = function() {
			ctx.drawImage(img, x, y,cell_width/2,cell_height/2);
		}
		}
	}
	this.Destory=function(){
		this.BigEyesView=null;
		this.RoadPosition=null;
		this.NonEmpty=null;
		this.Row=null;
		this.Column=null;
		this.SetLang=null;
		this.CanvasView=null;
		parmas=null;
		cachecanvas=null;
		roadResult=null;
	}
}