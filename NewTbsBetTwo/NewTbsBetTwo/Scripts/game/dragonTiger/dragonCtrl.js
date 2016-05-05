gameModule
	.controller('DragonCtrl', ['$scope', 'DragonServ', '$stateParams','$timeout','GameCommFun',
		
		function($scope, DragonServ,$stateParams,$timeout,GameCommFun) {
			/*
			 * 投注位置闲、庄、和、闲对、庄对、大、小、闲保险、庄保险
			 */
			$scope.parmas=JSON.parse($stateParams.data);
				//局号、限红、投注剩余时间、桌台状态、状态
			$scope.TragetPane=TragetPane;
			$scope.TagVolume=TagVolume;
			$scope.TargetShowChips=TargetShowChips;
			$scope.ChangeSelect = ChangeSelect; //从5个筹码中选出投注筹码
			$scope.OnBet = OnBet; //投注
			$scope.ConfirmBet = ConfirmBet; //确认投注
			$scope.BackBet=BackBet;//返回投注
			$scope.CancelBet = CancelBet; //取消投注
			$scope.RepeatBet = RepeatBet; //重复投注
			$scope.GoLobbyBack=GoLobbyBack;
			$scope.ChipGoLeft=ChipGoLeft;
			$scope.ChipGoRight=ChipGoRight;
			
			$scope.serverdata = DragonServ.GetServerData(); //绑定数据
			
			//连接scoket
			$scope.$on("$ionicView.enter", function() {
				$scope.showvideo=false;
				DragonServ.InitView($scope.parmas)
				SetHight();
				$timeout(function(){
					$scope.showvideo=true;//延迟3秒显示视频，适配ios
				},3000);
				GameCommFun.TragetPane(false);
				//横屏与竖屏
				var mql = window.matchMedia("(orientation: portrait)");
				// 添加一个媒体查询改变监听者
				mql.addListener(function(m) {
					if (m.matches) {
						// 改变到直立方向;
						SetHight();
					} else {
						// 改变到水平方向
						SetHight();
						
					}
				});
			})
			$scope.$on("$ionicView.leave", function() {
				Destory();
			})
				//设置视频高度
			function SetHight(){
				GameCommFun.SetDivHight();
				GameCommFun.SetAnimate(7);
			}
			//变更滑动高度
			function TragetPane(){
				DragonServ.TragetPane();
			}
			//显示隐藏筹码
			function TargetShowChips(){
				DragonServ.TargetShowChips();
			}
			//调节声音
			function TagVolume(){
				DragonServ.TagVolume();
			}
			//投注
			function OnBet(index) {
				DragonServ.OnBet(index);
			}
			//取消投注
			function CancelBet() {
				DragonServ.CancelBet();
			}
			//重复投注
			function RepeatBet() {
				DragonServ.RepeatBet();
			}
			//确认投注
			function ConfirmBet() {
				DragonServ.SendConfirmBet(); //
			}
			//返回投注
			function BackBet(){
				DragonServ.BackBet(); //
			}
			//更换荷官
			function ControlChangeDealer() {
				SendServ.SendChangeDealer();
			}
			//更换牌靴
			function ControlChangeBoot() {
				SendServ.SendChangeBoot();
			}

			//从5个筹码中选出投注筹码
			function ChangeSelect(selectChip, index) {
				DragonServ.ChangeSelect(selectChip, index);
			}
			function ChipGoLeft(){
				DragonServ.ChipGoLeft();
			}
			function ChipGoRight(){
				DragonServ.ChipGoRight();
			}
			function GoLobbyBack(){
				DragonServ.SendStandUp();
			}
			function Destory(){
				$scope.serverdata=null;
				DragonServ.Destory();
			}
		}
	])