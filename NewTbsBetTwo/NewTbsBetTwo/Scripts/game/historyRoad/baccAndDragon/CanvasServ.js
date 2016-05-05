gameModule
	.factory('CanvasServ', ['$timeout', function($timeout) {
		var server = {
			GetParmas: GetParmas,
			CanvasTable: CanvasTable
		}
		return server;
		var parmas = [];

		function GetParmas(parma) {
			parmas = parma;
		}
		//绘制表格
		function CanvasTable(type,canvasid) {
			var rows = parmas[type].rows;
			var cols = parmas[type].cols;
			var a_canvas = document.getElementById(canvasid);
			if (a_canvas) {
				var context = a_canvas.getContext("2d");
				pointX = a_canvas.width * parmas[type].pointX;
				width = a_canvas.width * parmas[type].width;
				height = width * (rows / cols);
				pointY = height * parmas[type].pointY;
				var cell_height = height / rows;
				var cell_width = width / cols;
				context.lineWidth = 1;
				context.strokeStyle = "#000000";
				//填充背景
				var gradient = context.createLinearGradient(0,0,0,300);
         		gradient.addColorStop(0,"#e0e0e0");
         		gradient.addColorStop(1,"#ffffff");
         		context.fillStyle = gradient;
				context.fillRect(pointX,pointY,width,height);
				// 结束边框描绘 
				context.beginPath();
				// 准备画竖线 
				for (var col = 0; col <= cols; col++) {
					var x = col * cell_width + pointX;
					context.moveTo(x, pointY);
					context.lineTo(x, pointY + height);
				}
				// 准备画横线
				for (var row = 0; row <= rows; row++) {
					var y = row * cell_height + pointY;
					context.moveTo(pointX, y);
					context.lineTo(pointX + width, y);
				}
				context.stroke();
			}

		}
		
	}])