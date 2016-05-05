loginModule
	.controller('LoginCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'LanguageServ', '$ionicPopover', 'CommFun', '$timeout', function($scope, $state, $rootScope, $stateParams, LanguageServ, $ionicPopover, CommFun, $timeout) {
		$scope.DoLogin = DoLogin;
		$scope.ShowLangList = ShowLangList;
		$scope.SelectLanguage = SelectLanguage;
		$scope.loginData = {
			name: '', //登陆名
			pwd: '' //登陆密码
		};
		$scope.langlist = [{
			lang: "CH",
			src: "img/login/CH.png",
		}, {
			lang: "TW",
			src: "img/login/TW.png",
		}, {
			lang: "EN",
			src: "img/login/EN.png",
		}, {
			lang: "JP",
			src: "img/login/JP.png",
		}, {
			lang: "ML",
			src: "img/login/ML.png",
		}]
		if ($rootScope.lang == null) { //当前语言
			$rootScope.lang = $scope.langlist[0];
		}
		$rootScope.language = LanguageServ.LanguageData($rootScope.lang.lang); //语言数据

		$scope.$on('$ionicView.enter', function() {
			if ($stateParams.type == '1') {
				window.location.reload();
			}
		})

		function ShowLangList($event) {
			$ionicPopover.fromTemplateUrl('page/language.html', {
				scope: $scope
			}).then(function(popover) {
				$scope.popover = popover;
				$scope.popover.show($event);
			})
		}

		function SelectLanguage(item) {
			if (item.lang != $rootScope.lang.lang) {
				var data = LanguageServ.LanguageData(item.lang);
				if (data) {
					$rootScope.lang = item;
					$rootScope.language = data;
					$scope.popover.hide();
				}

			}
		}
		var str = {
			mcid: 1,
			scid: 1,
			//acc: 'pzh008',
			acc: 'pzh001',
			//acc:'pzh003',
			//LoginCode: '811558c1bd3e146398d45699c805e5b94294967297',
			LoginCode: 'ac6767330e84939eb9550fb88f5f5f604294967297',
			//LoginCode:'fc79ba3dd88c80008cf4524945bf3870257',
			UserLimit: "0#1|6|8#21#1;1#1|6|8#21#1;2#1|6|8#21#1;3#1|6|8#21#1;4#1|6|8#21#1;5#1|6|8#21#1;6#1|6|8#21#1;7#1|6|8#21#1",
			//UserLimit:"1|2|3;21",
			SystemLimit: "1#10|1000#|4,50|||||||;2#20|1000#|4,50|||||||;3#50|1500#|4,50|||||||;4#100|3000#|8,90|||||||;5#100|5000#|20,200|||||||;6#100|10000#|30,300|||||||;7#200|10000#|30,300|||||||;8#500|10000#|30,300|||||||;9#200|20000#|50,600|||||||;10#400|20000#|50,600|||||||;11#600|20000#|50,600|||||||;12#300|30000#|80,900|||||||;13#600|30000#|80,900|||||||;14#1000|30000#|80,900|||||||;15#1000|50000#|200,2000|||||||;16#1500|50000#|200,2000|||||||;17#2500|50000#|200,2000|||||||;18#1500|80000#|300,3000|||||||;19#2500|80000#|300,3000|||||||;20#4000|80000#|300,3000|||||||;21#2000|100000#|300,3000|||||||;22#3000|100000#|300,3000|||||||;23#5000|100000#|300,3000|||||||;24#5000|200000#|500,6000|||||||;25#10000|200000#|500,6000|||||||;26#20000|200000#|500,6000|||||||;27#10000|300000#|800,9000|||||||;28#15000|300000#|800,9000|||||||;29#30000|300000#|800,9000|||||||;30#20000|500000#|2000,20000|||||||;31#25000|500000#|2000,20000|||||||;32#50000|500000#|2000,20000|||||||",
			RoomInfo: '',
			MoneyType: "MYR",
			Language: 'ch'
		}
		//测试
		CommFun.ShowLoading(3000);//显示3秒加载页面
				$timeout(function(){
					$rootScope.language = LanguageServ.LanguageData($rootScope.lang.lang);//语言数据
					$state.go('tab.lobby', {
						data: JSON.stringify(str)
					});
				},1000)
				
		DoLogin();
		function DoLogin() {
			/*CommFun.ShowLoading(0);
			//登陆请求数据
			CommFun.PostData('../GetLoginParam.aspx?type=getparam').then(function(data) {
				//var data={"MCID":1,"SCID":1,"Account":"pzh002","ShowName":"","Code":"40c5019861f6a7064a537156b68acb9c4294967297","MemLimit":"0#1|2|3#21#1;1#1|2|3#21#1;2#1|2|3#21#1;3#1|2|3#21#1;4#1|2|3#21#1;5#1|2|3#21#1;6#1|2|3#21#1;7#1|2|3#21#1","Limit":"1#2|200#|4,50|||||||;2#4|200#|4,50|||||||;3#8|300#|4,50|||||||;4#20|500#|4,50|||||||;5#20|1000#|4,50|||||||;6#20|2000#|5,60|||||||;7#40|2000#|5,60|||||||;8#100|2000#|5,60|||||||;9#50|3000#|8,90|||||||;10#70|3000#|8,90|||||||;11#100|3000#|8,90|||||||;12#50|5000#|20,200|||||||;13#100|5000#|20,200|||||||;14#200|5000#|20,200|||||||;15#200|10000#|30,300|||||||;16#300|10000#|30,300|||||||;17#500|10000#|30,300|||||||;18#300|15000#|40,500|||||||;19#500|15000#|40,500|||||||;20#1000|15000#|40,500|||||||;21#200|20000#|50,600|||||||;22#400|20000#|50,600|||||||;23#600|20000#|50,600|||||||;24#300|30000#|80,900|||||||;25#600|30000#|80,900|||||||;26#1000|30000#|80,900|||||||;27#500|50000#|200,2000|||||||;28#1000|50000#|200,2000|||||||;29#2000|50000#|200,2000|||||||;30#800|80000#|300,3000|||||||;31#2000|80000#|300,3000|||||||;32#5000|80000#|300,3000|||||||","Room":"1#NormalLoby#rtmp://210.5.189.211/goldenasia/gg-live1|rtmp://210.5.189.211/goldenasia/gg-live1|rtmp://210.5.189.211/goldenasia/gg-live1|rtmp://210.5.189.211/goldenasia/gg-live1;2#MainLoby#rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01;3#VIPLoby#rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01;4#ShowLobby#rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01|rtmp://103.244.251.3/goldenasia/ga-vip01","Money":"USD","Language":"ch"}
				if(data==null || data.length<=0){
					CommFun.HideLoading();
					return;
				}
					var param=data;
					if (param.MCID) {
						str.mcid = parseInt(param.MCID);
					}
					if (param.SCID) {
						str.scid = parseInt(param.SCID);
					}
					if (param.Account) {
						str.acc = param.Account;
					}
					if (param.Code) {
						str.LoginCode = param.Code;
					}
					if (param.Limit) {
						str.SystemLimit = param.Limit;
					}
					if (param.MemLimit) {
						str.UserLimit = param.MemLimit;
					}
					if (param.Room) {
						str.RoomInfo = param.Room;
					}
					if (param.Money) {
						str.MoneyType = param.Money;
					}
					if (param.Language) {
						str.Language = param.Language;
						$rootScope.lang.lang=str.Language.toLocaleUpperCase();
						$rootScope.language = LanguageServ.LanguageData($rootScope.lang.lang); //语言数据
					}
					CommFun.HideLoading();
					$timeout(function() {
						$state.go('tab.lobby', {
							data: JSON.stringify(str)
						})
					}, 1000);
				}, function(err) {
					CommFun.HideLoading();
				})*/
		}

	}])