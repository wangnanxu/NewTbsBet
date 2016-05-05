gameModule
	.controller('RoulCtrl', ['$scope', 'RoulServ', '$stateParams', '$ionicPopover', '$timeout','GameCommFun',
		function($scope, RoulServ, $stateParams, $ionicPopover, $timeout,GameCommFun) {

			$scope.parmas = JSON.parse($stateParams.data);
			$scope.TragetPane=TragetPane;
			$scope.TagVolume=TagVolume;
			$scope.TargetShowChips=TargetShowChips;
			$scope.ChangeSelect = ChangeSelect; //从5个筹码中选出投注筹码

			$scope.OnBet = OnBet; //投注
			$scope.ConfirmBet = ConfirmBet; //确认投注
			$scope.BackBet = BackBet; //返回投注
			$scope.CancelBet = CancelBet; //取消投注
			$scope.RepeatBet = RepeatBet; //重复投注
			$scope.GoLobbyBack = GoLobbyBack;
			$scope.ChipGoLeft = ChipGoLeft;
			$scope.ChipGoRight = ChipGoRight;
			$scope.RoadGoLeft = RoadGoLeft;
			$scope.RoadGoRight = RoadGoRight;
			$scope.serverdata = RoulServ.GetServerData();

			$scope.$on("$ionicView.enter", function() {
				$scope.showvideo = false;
				RoulServ.InitView($scope.parmas)
					//计算滑动高度
				
				SetHeight();
				$timeout(function() {
					$scope.showvideo = true; //延迟3秒显示视频，适配ios
				}, 3000)
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
			//
			function SetHeight(){
				var divA = document.getElementById("RoulPane");
				var screenheight = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
				var height = screenheight - 40;
				var divheight=divA.clientHeight;
				if(divheight>height){
					divA.style.cssText = "height:" + height + "px";
				}
				GameCommFun.SetDivHight();
				GameCommFun.SetAnimate(7);
			}
			//变更滑动高度
			function TragetPane(){
				RoulServ.TragetPane();
			}
			//显示隐藏筹码
			function TargetShowChips(){
				RoulServ.TargetShowChips();
			}
			//调节声音
			function TagVolume(){
				RoulServ.TagVolume();
			}
			//轮盘投注显示
			function OnBet(index) {
				RoulServ.OnBet(index);
			}
			//取消投注
			function CancelBet() {
				RoulServ.CancelBet();
			}
			//重复上局投注
			function RepeatBet() {
				RoulServ.RepeatBet();
			}
			//确认投注
			function ConfirmBet() {
				RoulServ.SendConfirmBet(); //

			}
			//返回投注
			function BackBet() {
				RoulServ.BackBet(); //
			}
			//更换荷官
			function ControlChangeDealer() {
				RoulServ.SendChangeDealer();
			}
			//更换牌靴
			function ControlChangeBoot() {
				RoulServ.SendChangeBoot();
			}
			//从5个筹码中选出投注筹码
			function ChangeSelect(selectChip, index) {
				RoulServ.ChangeSelect(selectChip, index);
			}

			function ChipGoLeft() {
				RoulServ.ChipGoLeft();
			}

			function ChipGoRight() {
				RoulServ.ChipGoRight();
			}

			function RoadGoLeft() {
				RoulServ.RoadGoLeft();
			}

			function RoadGoRight() {
				RoulServ.RoadGoRight();
			}

			function GoLobbyBack() {
				RoulServ.SendStandUp();
			}

			function Destory() {
				$scope.serverdata = null;
				RoulServ.Destory();
			}

		}
	])