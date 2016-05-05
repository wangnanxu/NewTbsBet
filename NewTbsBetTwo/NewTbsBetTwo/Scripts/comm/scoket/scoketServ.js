scoketModule
	.factory('ScoketServ', ['$timeout', '$rootScope', function($timeout, $rootScope) {
		var server = {
			ConnectVideo: ConnectVideo,
			ConnectSinglaR: ConnectSinglaR,
			SendMessage: SendMessage,
			CloseSignalr: CloseSignalr,
			CloseVideo: CloseVideo
		}
		return server;
		var chatHub;

		function ConnectSinglaR(analysisfun, callback) {
			// Declare a proxy to reference the hub
			try {
				$.connection.hub.logging = true;
				chatHub = $.connection.signalrPusher;
				chatHub.client.addMessage = function(mainCmd, subCmd, data) {
					if (analysisfun) {
						analysisfun(mainCmd, subCmd, data);
					}
				}
				registerClientMethods();
				// Start Hub
				$.connection.hub.start().done(function() {
					if (callback) {
						callback();
					}
				});
			} catch (err) {
				console.log('err:' + err.message)
			}
		};

		function SendMessage(maincmd, procmd, message) {
			try {
				chatHub.server.send2Server(maincmd, procmd, message);
			} catch (err) {
				console.log("命令发送失败" + maincmd + "-" + procmd + 'err:' + err.message)
			}
		}

		function registerClientMethods() {
			try {
				chatHub.client.onConnected = function(id, userID, url) {
					console.log("与服务器建立了链接" + url);
				}

				chatHub.client.onUserDisconnected = function(id, userID) {
					console.log("与服务器取消了链接");
				}

				chatHub.client.onNewUserConnected = function(id, userID) {
					console.log("新用户完成为合法");
				}

				chatHub.client.onExistUserConnected = function(id, userID) {
					console.log("用户" + userID + "不能重复登陆");
				}

				chatHub.client.onExit = function(id, userID) {

					console.log("用户" + userID + "成功退出！");
				}
			} catch (err) {
				console.log('err:' + err.message)
			}

		}

		function CloseSignalr() {
			try {
				$.connection.hub.stop();
				chatHub = null;
			} catch (err) {
				console.log(err.message);
			}
		}
		var videourl; //视频scoket地址
		var client; //视频scoket
		var isBrownsClose = false;
		var player;

		function ConnectVideo(url) {
			try {
				var canvas = document.getElementById('videoCanvas');
				videourl = url;
				client = new WebSocket(videourl);
				isBrownsClose = false;
				client.onopen = function(evt) {
					// 连接成功
					console.log('video连接成功'+evt);
				};
				client.onerror = function(evt) {
					//连接失败
					console.log('video连接发生错误'+evt);
				};
				client.onclose = function(evt) {
					//连接断开
					console.log('video已经断开连接'+evt);
					$timeout(function() {
						if (isBrownsClose == false) {
							ConnectVideo(videourl);
						}
					}, 3000)

				};
				if (canvas) {
					if (player) {
					 	 player.stop();
						player.destory();
						player = null;
					}
					player = new jsmpeg(client, {
						canvas: canvas
					});
				}
			} catch (err) {
				console.log('打开视频失败:' + err.message)
			}
		}

		function CloseVideo() {
			try {
				isBrownsClose = true;
				if (player) {
				 	player.stop();
					player.destory();
					
					player = null;
				}
				if (client) {
					client.close();
					client = null;
				}
				var canvas = document.getElementById('videoCanvas');
				if (canvas) {
					var ctx = canvas.getContext("2d");
					if (ctx) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
					}
				}
			} catch (err) {
				console.log('关闭视频失败：' + err.message);
			}
		}


	}])