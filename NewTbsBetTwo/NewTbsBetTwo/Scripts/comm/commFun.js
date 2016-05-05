commModule
	.factory('CommFun', ['$timeout', '$q', '$http', '$rootScope', '$ionicLoading', function($timeout, $q, $http, $rootScope, $ionicLoading) {
		/*
		 * 公用工具
		 */
		//提示框
		$rootScope.rootmessage = {
			type: '', //exitLogin,gameStatus,netout
			able: false,
			message: ""
		};
		var totaltime;
		var rightEle;
		var leftEle;
		var first = true;
		var callBack; //确认回调函数
		var server = {
			ShowLoading: ShowLoading, //显示加载页
			HideLoading: HideLoading, //隐藏加载页
			CompareDate:CompareDate,
			JsonToString: JsonToString, //将json数据转换为服务器接收数据
			DoRefresh: DoRefresh, //刷新页面绑定数据已达到刷新页面数据效果
			InitArray: InitArray, //初始化数组，避免数组未初始化，绑定到页面显示效果问题
			AssmbleArray: AssmbleArray,
			GetStatusText: GetStatusText,
			GetTableName: GetTableName,
			SetTotalTime: SetTotalTime,
			InitTimer: InitTimer,
			RangeDiv: RangeDiv,
			PostData: PostData,
			LoadXml:LoadXml,
			
			ShowMessage: ShowMessage,
			ExitLogin: ExitLogin,
			CloseMessage: CloseMessage,
			ConfirmMessage: ConfirmMessage
		}
		return server;

		function ShowLoading(time) {
			if (time > 0) {
				$ionicLoading.show({
					template: "  <ion-spinner icon='bubbles' class='spinner-balanced'></ion-spinner>",
					duration: time
				})
			} else {
				$ionicLoading.show({
					template: "  <ion-spinner icon='bubbles' class='spinner-balanced'></ion-spinner>"
				})
			}
		}

		function HideLoading() {
			$ionicLoading.hide();
		}
		//比较两个时间大小
		function CompareDate(newdate,olddate){
			var date3 = newdate.getTime() - olddate.getTime();   //时间差的毫秒数
			return date3/1000;
		}
		function PostData(url) {
			var q = $q.defer();
			$http({
				method: 'POST',
				url: url
					/*headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}*/
			}).success(function(response) {
				q.resolve(response);
			}).error(function(data, header, config, status) {
				//弹出提示框
				console.log("post serveice error!");
			});
			return q.promise;
		}
		function LoadXml(url){
			var q=$q.defer();
			url=url+"?"+Math.random();
			$http.get(url, {
					transformResponse: function(cnv) {
						var x2js = new X2JS();
						var aftCnv = x2js.xml_str2json(cnv);
						return aftCnv;
					}
				})
				.success(function(response) {
					q.resolve(response);
				})
				return q.promise;
		}
		//将json转为特定字符串
		function JsonToString(jsondata) {
			var str = '';
			for (var key in jsondata) {
				str = str + "," + jsondata[key];
			}
			str = str.substr(1)
			return str;
		}
		//服务器刷新数据
		function DoRefresh(data) {
			$timeout(function() {
				data = data;
			}, 0)
		}
		//初始化数组
		function InitArray(length, initdata) {
			var arr = new Array();
			for (var i = 0; i < length; i++) {
				arr[i] = initdata;
			}
			return arr;
		}
		//获取桌台状态
		function GetStatusText(status) {
			if ($rootScope.language == null) {
				return;
			}
			if ($rootScope.language.Status[status]) {
				return $rootScope.language.Status[status];
			}
			return $rootScope.language.Status[0];
		}
		//组装数组
		function AssmbleArray(totalarr, count) {
			if (totalarr == null) {
				return;
			}
			var length = totalarr.length;

			var page = Math.floor((length - 1) / count) + 1;
			var list = [];
			for (var i = 0; i < page; i++) {
				var arr = [];
				var startindex = count * i;
				var endindex = 0;
				if (startindex + count < length) {
					endindex = startindex + count;
				} else {
					endindex = length;
				}
				for (var j = startindex; j < endindex; j++) {
					arr.push(totalarr[j])
				}
				list.push(arr);
			}
			return list;
		}
		//显示提示框
		function ShowMessage(messageType, messageIndex, callback) {
			$rootScope.rootmessage.able = true;
			$rootScope.rootmessage.type = messageType;
			switch (messageType) {
				case $rootScope.MessageType.ExitLogin:
					$rootScope.rootmessage.message = $rootScope.language.Message.ExitLogin[messageIndex];
					break;
				case $rootScope.MessageType.GameStatus:
					$rootScope.rootmessage.message = $rootScope.language.Message.GameStatus[messageIndex];
					break;
				case $rootScope.MessageType.BetMessage:
					$rootScope.rootmessage.message = $rootScope.language.Message.BetMessage[messageIndex];
					break;
				case $rootScope.MessageType.OutNet:
					$rootScope.rootmessage.message = $rootScope.language.Message.OutNet[messageIndex];
					break;
			}
			callBack = callback;
			if (messageType == $rootScope.MessageType.GameStatus || messageType == $rootScope.MessageType.BetMessage) {
				Timmer(1, HideMessage);
			}
		}
		//隐藏提示框
		function HideMessage() {
			$rootScope.rootmessage.able = false;
			$rootScope.rootmessage.message = '';
		}
		//计时
		function Timmer(time, callfun) {
			$timeout(function() {
				time--;
				if (time <= 0) {
					callfun();
				} else {
					Timmer(time, callfun);
				}
			}, 1000)
		}
		//提示框关闭按钮
		function CloseMessage() {
			$rootScope.rootmessage.able = false;
			$rootScope.rootmessage.message = '';
		}
		//提示框确认按钮
		function ConfirmMessage() {
			if (typeof(callBack) == "function") {
				callBack();
			}
		}

		function ExitLogin() {
			closeWP()
				//location.reload();
		}

		function closeWP() {
			var Browser = navigator.appName;
			var indexB = Browser.indexOf('Explorer');
			if (indexB > 0) {
				var indexV = navigator.userAgent.indexOf('MSIE') + 5;
				var Version = navigator.userAgent.substring(indexV, indexV + 1);

				if (Version >= 7) {
					window.open('', '_self', '');
					window.close();
				} else if (Version == 6) {
					window.opener = null;
					window.close();
				} else {
					window.opener = '';
					window.close();
				}

			} else {
				window.close();
			}
		}
		//获取桌子名称
		function GetTableName(tablenames) {
			if ($rootScope.lang == null) {
				return;
			}
			var tableName = "";
			if (tablenames && tablenames.length > 0) {
				var arr = tablenames.split("|");
				switch ($rootScope.lang.lang) {
					case "CH":
						tableName = arr[1];
						break;
					case "EN":
						tableName = arr[0];
						break;
					case "TW":
						tableName = arr[2];
						break;
					default:
						tableName = arr[0];
						break;
				}
			}
			return tableName;
		}
		//设置总时间和进度条id
		function SetTotalTime(bettime, rightid, leftid) {

			totaltime = bettime;
			rightEle = document.getElementById(rightid);
			leftEle = document.getElementById(leftid);
		}

		function InitTimer() {
			first = true;
		}
		//旋转时间进度条
		function RangeDiv(difftime) {
			if (difftime > totaltime) {
				return;
			}
			if (leftEle == null || rightEle == null) {
				return;
			}
			if (first) {
				SetRange(leftEle, 45);
				leftEle.style.borderBottomColor = "#FFFF00";
				leftEle.style.borderLeftColor = "#FFFF00";
				first = false;
			}
			var range = 360 * difftime / totaltime;
			if (range > 180) {
				range = 360 - range + 45;
				SetRange(rightEle, range);

			} else {
				range = 180 - range + 45;
				SetRange(rightEle, 225);
				SetRange(leftEle, range);
			}
			if (difftime <= 5) {
				leftEle.style.borderBottomColor = "#FF3B30";
				leftEle.style.borderLeftColor = "#FF3B30";
			}
		}

		function SetRange(ele, range) {
			ele.style.transform = "rotate(" + range + "deg)";
			ele.style.webkitTransform = "rotate(" + range + "deg)";
			ele.style.MozTransform = "rotate(" + range + "deg)";
		}

	}])
	.directive('rootMessage', [function() {
		return {
			restrict: 'E',
			templateUrl: "page/dirtective/rootmessage.html"
		}
	}])
	.directive('hideTabs', function($rootScope) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {
				scope.$watch(attributes.hideTabs, function(value) {
					$rootScope.hideTabs = value;
				})

				scope.$on('$destroy', function() {
					$rootScope.hideTabs = false;
				})
			}
		}
	});