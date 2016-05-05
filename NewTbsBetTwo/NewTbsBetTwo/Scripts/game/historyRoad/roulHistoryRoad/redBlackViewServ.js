var RedBlackView = function() {
	var parmas;
	var txtDraw = null;
	var _drawCount = 0; //和的个数
	this._row = 0; //行数，记录当前填充的行
	this._column = 0; //列数，记录当前填充的列
	this.l_startColumn = 0; //记录最后一个对象起始列

	this.lastNum = 0; //记录最后一个颜色，1表示红，2表示蓝
	var maxRow = 6; //最大行数
	var m_lang;
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
	this.PearlView = function(parma) {
			parmas = parma;
		}
		/**
		 * 珠盘路定位
		 @ lastRPV 上一个珠盘对象 
		 @ number 珠盘图形对应的索引
		 @ arr 占位数组
		**/
	this.RoadPosition = function(lastRPV, number,arr) {
			this.lastNum=roadResult[number][0];
			if(lastRPV==null){//最后一个值为空时，位置为默认位置
			}else{
				if(lastRPV.lastNum!=roadResult[number][0]){
					this._row=0;
					this._column=lastRPV.l_startColumn+1;
					this.l_startColumn=lastRPV.l_startColumn+1;
				}else{
					this.l_startColumn=lastRPV.l_startColumn;
					if(lastRPV._row+1<maxRow&& this.NonEmpty(arr[lastRPV._column][lastRPV.Row+1])){
						this._row=lastRPV._row+1;
						this._column=lastRPV._column;
					}else{
						this._row=lastRPV._row;
						this._column=lastRPV._column+1;
					}
				}
			}
			
		} //非空判断
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
		var str = "";
		var b_canvas = document.getElementById('b_canvas');
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
		//设置字体样式
		ctx.font = cell_width+"px Courier New";
		switch (num) {
			case 1:
				str = '红';
				ctx.fillStyle = "red";
				break;
			case 2:
				str = '黑';
				ctx.fillStyle = "blue";
				break;
			case 3:
				str = '零';
				ctx.fillStyle = "green";
				break;
		}
		//设置字体填充颜色
		//从坐标点(50,50)开始绘制文字
		ctx.fillText(str, x + 1, y + 1+cell_height);
	}
}