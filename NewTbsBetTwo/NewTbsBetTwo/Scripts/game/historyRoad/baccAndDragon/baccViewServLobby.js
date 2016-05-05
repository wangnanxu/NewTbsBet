var BaccViewServLobby = function() {
	var parmas;
	this.num = 0;
	var _row = 0; //行数，记录当前填充的行
	var _column = 0; //列数，记录当前填充的列

	this.l_startColumn = 0; //记录最后一个对象起始列

	var maxRow = 6; //最大行数

	var m_lang='CH';
	var gameType; //游戏类型
	var cachecanvas = null;

	this.PearlView = function(parma, type,canvas) {
		gameType = type;
		parmas = parma;
		cachecanvas=canvas;
	}

	/**
	 * 珠盘路定位
	 @ lastRPV 上一个珠盘对象 
	 @ number 珠盘图形对应的索引
	 @ arr 占位数组
	**/
	this.RoadPosition = function(lastRPV, number, arr) {
			var suite = 0;
			if (lastRPV != null) {
				var lastPV = lastRPV;
				this.num = lastPV.num + 1;
				suite = this.num;
			} else {
				this.num = 0;
				suite = 0;
			}
			_column = Math.floor(suite / maxRow);
			_row = Math.floor(suite % maxRow);
			this.CanvasView(number, _row, _column);
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
	this.CanvasView = function(num, row, col) {
		var img = new Image();
		var str = '';
		if (gameType == 'bacc') {
			str = 'img/game/bacc/road/tableView/'
			switch (num) {
				case 1:
					str =str+'banker'+m_lang+'.png'
					break;
				case 2:
					str = str+'player'+m_lang+'.png'
					break;
				case 3:
					str = str+'tie'+m_lang+'.png'
					break;
				case 4:
					str = str+'playerbp'+m_lang+'.png'
					break;
				case 5:
					str = str+'playerb'+m_lang+'.png'
					break;
				case 6:
					str = str+'playerp'+m_lang+'.png'
					break;
				case 7:
					str = str+'bankerbp'+m_lang+'.png'
					break;
				case 8:
					str = str+'bankerb'+m_lang+'.png'
					break;
				case 9:
					str = str+'bankerp'+m_lang+'.png'
					break;
				case 10:
					str = str+'tiebp'+m_lang+'.png'
					break;
				case 11:
					str = str+'tieb'+m_lang+'.png'
					break;
				case 12:
					str = str+'tiep'+m_lang+'.png'
					break;
			}
		}else if(gameType=='dragon'){
			str = 'img/game/dragon/';
			switch (num) {
				case 1:
					str = str+'dragon'+m_lang+'.png'
					break;
				case 2:
					str = str+'tiger'+m_lang+'.png'
					break;
				case 3:
					str = 'img/game/bacc/road/tableView/tie'+m_lang+'.png'
					break;
				}
		}
		img.src = str;
			if(cachecanvas){
		var rows = parmas.rows;
		var cols = parmas.cols;
		var pointX = cachecanvas.width * parmas.pointX;
		var width = cachecanvas.width * parmas.width;
		var height = width * (rows / cols);
		var pointY = height * parmas.pointY;
		var cell_height = height / rows;
		var cell_width = width / cols;
		var x = cell_width * col + pointX;
		var y = cell_height * row + pointY;
		var cachectx = cachecanvas.getContext("2d");
		img.onload = function() {
			cachectx.drawImage(img, x + 1, y + 1, cell_width - 2, cell_height - 2);
		}
		}
	}
	this.Destroy=function(){
		this.PearlView=null;
		this.RoadPosition=null;
		this.NonEmpty=null;
		this.Row=null;
		this.Column=null;
		this.SetLang=null;
		this.CanvasView=null;
		parmas=null;
		cachecanvas=null;
	}
}