scoketModule
	.factory('ConnectServ', ['ScoketServ', 'ReceiveServ', function(ScoketServ, ReceiveServ) {
		/*
		 * 连接webscoket
		 */
		var server = {
			ConnectSinglaR: ConnectSinglaR,
			CloseSignalr:CloseSignalr
		}
		return server;
	
		//连接singalR，登录进大厅时调用
		function ConnectSinglaR(callback) {
			ScoketServ.ConnectSinglaR(ReceiveServ.ReceiveScoketData, callback);
		}
		function CloseSignalr(){
			ScoketServ.CloseSignalr();
		}
		
	}])
	.factory('ReceiveServ', ['$rootScope',  'LobbyServ', 'GameReciveServ', function($rootScope, LobbyServ, GameReciveServ) {
		/*
		 * 接收服务器数据，并进行分发
		 */
		var server = {
			ReceiveScoketData: ReceiveScoketData //接收服务器传回数据
		}
		return server;
		//服务器返回数据
		function ReceiveScoketData(mainCmd, subCmd, pData) {
			switch (mainCmd) {
				case $rootScope.MainCommand.LobbyForMember:
					LobbyServ.AnalysisData(mainCmd, subCmd, pData);
					break;
				case $rootScope.MainCommand.GameServerForMember:
					GameReciveServ.AnalysisData(mainCmd, subCmd, pData);
					break;
				default:
					break;
			}
		}
	}])
	.factory('VideoServ',['ScoketServ', function(ScoketServ) {
		var server={
			ConnectVideo:ConnectVideo,
			CloseVideo:CloseVideo
		}
		return server;
			//连接视频，进入游戏界面时调用
		function ConnectVideo(url) {
			ScoketServ.ConnectVideo(url);
		}//关闭视频，退出具体游戏时调用
		function CloseVideo() {
			ScoketServ.CloseVideo();
		}
	}])
	.factory('SendServ', ['ScoketServ', function(ScoketServ) {
		/*
		 * 向服务器发送数据
		 */
		var server = {
			SendMessage: SendMessage, //发送数据
			
		}
		return server;
		//发送数据
		function SendMessage(maincmd, procmd, message) {
			ScoketServ.SendMessage(maincmd, procmd, message);
		}
		
	}])
	
	