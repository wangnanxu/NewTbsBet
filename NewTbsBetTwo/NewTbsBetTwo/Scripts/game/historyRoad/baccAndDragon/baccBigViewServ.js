var BaccBigViewServ = function() {
	var parmas;
	var txtDraw = null;
	var _drawCount = 0; //和的个数
	this._row = 0; //行数，记录当前填充的行
	this._column = 0; //列数，记录当前填充的列
	this.l_startColumn = 0; //记录最后一个对象起始列

	this.lastNum = 0; //记录最后一个颜色，1表示红，2表示蓝
	var maxRow = 6; //最大行数

	var m_lang;//语言
	var cachecanvas = null;
	var tiecount;//连续和个数
	var lastroad;//最近一次庄闲
	var imglist=["zero","one","two","three","four","five","six","seven","eight","nine"]

	this.BigView = function(number, parma, canvas) {
		if (!number || number == 0) {
			return;
		}
		if (!parma) {
			return;
		}
		parmas = parma;
		cachecanvas=canvas;
	}

	//和的时候添加数字或者改变改变图形
	this.AddDrawResult = function(rp) {
		_drawCount++;
		if ((_drawCount == 1)) {
			this.CanvasView(3, rp._row, rp._column);
		} else {
			this.CanvasView(4, rp._row, rp._column);
		}
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
	this.SetLang = function(strlang) {
		m_lang = strlang;
	}
	this.CanvasView = function(num, row, col) {
		var isText = false;
		var str = '';
		switch (num) {
			case 1:
				str = 'img/game/bacc/road/bigTableView/banker.png'
				isText=false;
				tiecount=0;
				lastroad=1;
				break;
			case 2:
				str = 'img/game/bacc/road/bigTableView/player.png'
				isText=false;
				tiecount=0;
				lastroad=2;
				break;
			case 3:
				str = 'img/game/bacc/road/bigTableView/tie.png'
				isText = false;
				tiecount++;
				break;
			case 4: //和多次描写数字
				isText = true;
				tiecount++;
				if(	lastroad==1){
					str = 'img/game/bacc/road/bigTableView/banker.png'
				}else{
					str = 'img/game/bacc/road/bigTableView/player.png'
				}
				break;
		}
		var img = new Image();
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
			var x = cell_width * col + pointX;
			var y = cell_height * row + pointY;
			var textimg=new Image();
			if (isText) {
				var imgstr="img/game/bacc/road/bigTableView/tie"+imglist[tiecount]+".png";
				textimg.src=imgstr;
			}
			img.onload = function() {
				
				if (isText) {
					ctx.clearRect(x + 1, y + 1, cell_width - 2, cell_height - 2);
					textimg.onload=function(){
						ctx.drawImage(img, x + 1, y + 1, cell_width - 2, cell_height - 2);
						ctx.drawImage(textimg, x + 1, y + 1, cell_width - 2, cell_height - 2);
					}
				}else{
					ctx.drawImage(img, x + 1, y + 1, cell_width - 2, cell_height - 2);
				}
			}
		}
	}
	this.Destroy=function(){
		this.BigView=null;
		this.RoadPosition=null;
		this.NonEmpty=null;
		this.SetLang=null;
		this.CanvasView=null;
		parmas=null;
		cachecanvas=null;
		imglist=null;
	}
}