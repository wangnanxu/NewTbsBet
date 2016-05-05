lobbyModule
	.controller('LobbyCtrl', ['$scope', '$rootScope', '$stateParams', 'LobbyServ', '$ionicModal', 'ConnectServ', 'SendServ',
		function($scope, $rootScope, $stateParams, LobbyServ, $ionicModal, ConnectServ, SendServ) {
			$scope.ShowLimit = ShowLimit; //选择限额
			$scope.TagVolume = TagVolume;
			$scope.EnterGame = EnterGame; //进入游戏
			$scope.GoBackLobby = GoBackLobby;
			$scope.ConfirmMessage = ConfirmMessage;
			$scope.CloseMessage = CloseMessage; //关闭提示框
			$scope.ExitToLogin = ExitToLogin; //退回到登陆页面
			var u = navigator.userAgent;
			$rootScope.browser = {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			}
			if ($rootScope.browser.ios) {
				$scope.isIos = true;
			} else {
				$scope.isIos = false;
			}
			var infodata = null;

			//初始化
			$scope.$on("$ionicView.enter", function() {
				if ($stateParams.data != null && $stateParams.data != '') {
					//启动signlar
					ConnectSinglaR();
					infodata = JSON.parse($stateParams.data); //
					LobbyServ.GetParmaLimit(infodata);
					LobbyServ.GetVideoLine();
				}
				$scope.servdata = LobbyServ.GetServerData(); //获得serveice数据
			})

			//连接singalr
			function ConnectSinglaR() {
				ConnectServ.ConnectSinglaR(callBack);

				function callBack() {
					SendMessage();
				}
			}
			//连接成功发送
			function SendMessage() {
				var str = "1,1" + "," + infodata.acc + "," + infodata.LoginCode;
				var logindata = {
					UserID: infodata.acc,
					Data: str
				};
				//发送大厅连接请求
				SendServ.SendMessage($rootScope.MainCommand.LobbyForMember, $rootScope.LobbyForMember.Login, JSON.stringify(logindata));
			}
			//调节声音
			function TagVolume() {

				LobbyServ.TagVolume();
			}
			//选择限额
			function ShowLimit(parentindex, index, $event) {
				if (!$scope.popover) {
					$ionicModal.fromTemplateUrl('page/limitpop.html', {
						scope: $scope,
						animation: 'slide-in-up'
					}).then(function(popover) {
						$scope.modal = popover;
						$scope.modal.show($event);
					})
				} else {
					$scope.modal.show($event);
				}
				var table = $scope.servdata.tablearr[parentindex][index];
				$rootScope.TableName = LobbyServ.GetTableName(table.table.TableName);
				$scope.enterTable = table; //当前桌台所有限额
			}
			//进入游戏@_limit当前游戏限额[int limitid，string “20-50”]
			function EnterGame(_limit, tableId) {
				$scope.modal.hide();
				LobbyServ.EnterGame(_limit, tableId);
			}

			function GoBackLobby() {
				if ($scope.modal) {
					$scope.modal.hide();
				}
			}

			function ConfirmMessage() {
				LobbyServ.ConfirmMessage();
			}

			function CloseMessage() {
				LobbyServ.CloseMessage();
			}

			function ExitToLogin() {
				LobbyServ.ExitToLogin();
			}
		}
	])