gameModule
	.controller('InBaccCtrl', ['$scope','InBaccServ','$stateParams','$timeout','GameCommFun',
		function($scope, InBaccServ,$stateParams,$timeout,GameCommFun) {
			/*
			 * 投注位置闲、庄、和、闲对、庄对、大、小、闲保险、庄保险
			 */
			$scope.parmas=JSON.parse($stateParams.data);
				//局号、限红、投注剩余时间、桌台状态、状态
				$scope.TragetPane=TragetPane;
				$scope.TagVolume=TagVolume;
				$scope.TargetShowChips=TargetShowChips;
			$scope.SelectChips = SelectChips; //选择所有筹码中选5个筹码
			$scope.ChangeSelect = ChangeSelect; //从5个筹码中选出投注筹码
			$scope.ConfirmSelect = ConfirmSelect; //显示选中的5个筹码
			$scope.CancelSelect = CancelSelect; //取消筹码选择
			$scope.OnBet = OnBet; //投注
			$scope.ConfirmBet = ConfirmBet; //确认投注
			$scope.BackBet=BackBet;//返回投注
			$scope.CancelBet = CancelBet; //取消投注
			$scope.RepeatBet = RepeatBet; //重复投注
			$scope.GoLobbyBack=GoLobbyBack;
			$scope.ChipGoLeft=ChipGoLeft;
			$scope.ChipGoRight=ChipGoRight;
				

			
			$scope.serverdata = InBaccServ.GetServerData(); //绑定数据
			//连接scoket
			$scope.$on("$ionicView.enter", function() {
				$scope.showvideo=false;
				InBaccServ.InitView($scope.parmas)
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
				InBaccServ.TragetPane();
			}
			//显示隐藏筹码
			function TargetShowChips(){
				InBaccServ.TargetShowChips();
			}
			//调节声音
			function TagVolume(){
				InBaccServ.TagVolume();
			}
			//投注
			function OnBet(index) {
				InBaccServ.OnBet(index);
			}
			//取消投注
			function CancelBet() {
				InBaccServ.CancelBet();
			}
			//重复投注
			function RepeatBet() {
				InBaccServ.RepeatBet();
			}
			//确认投注
			function ConfirmBet() {
				InBaccServ.SendConfirmBet(); //
			}
			//返回投注
			function BackBet(){
				InBaccServ.BackBet(); //
			}
			//更换荷官
			function ControlChangeDealer() {
				InBaccServ.SendChangeDealer();
			}
			//更换牌靴
			function ControlChangeBoot() {
				InBaccServ.SendChangeBoot();
			}

			//选择所有筹码中选5个筹码
			function SelectChips(selectChip, index) {
				InBaccServ.SelectChips(selectChip, index);
			}
			//从5个筹码中选出投注筹码
			function ChangeSelect(selectChip, index) {
				InBaccServ.ChangeSelect(selectChip, index);
			}
			function ChipGoLeft(){
				InBaccServ.ChipGoLeft();
			}
			function ChipGoRight(){
				InBaccServ.ChipGoRight();
			}
			//确定选中筹码
			function ConfirmSelect() {
				InBaccServ.ConfirmSelect();
			}

			function CancelSelect() {
				InBaccServ.CancelSelect();
			}
			function GoLobbyBack(){
				InBaccServ.SendStandUp();
			}
			
			function Destory(){
				$scope.serverdata=null;
				InBaccServ.Destory();
			}
		}
	])