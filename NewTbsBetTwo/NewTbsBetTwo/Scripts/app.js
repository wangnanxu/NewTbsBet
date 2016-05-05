// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('tbsBet', ['ionic', 'LoginModule','ScoketModule', 'LobbyModule', 'InfoModule', 'StatementModule', 'SettingModule', 'GameModule', 'CommModule'])

.run(function($ionicPlatform, CommandServ, $rootScope, $state, ScoketServ, LobbyServ,SoundServ) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		//获取所有命令
		CommandServ.GetCommandData();
		//获取所有声音
		SoundServ.GetSoundData();
		window.onbeforeunload = function() {
			//if(event.clientX>document.body.clientWidth&&event.clientY<0||event.altKey) { 
			if (event.clientX <= 0 && event.clientY < 0) {} else {
				//刷新浏览器，退回到登陆页面重新登陆
				ScoketServ.CloseSignalr();
				LobbyServ.Destory();
			}
		}; 
		
        $state.go("login");
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
	$ionicConfigProvider.platform.ios.tabs.style('standard');
	$ionicConfigProvider.platform.ios.tabs.position('bottom');
	$ionicConfigProvider.platform.android.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.position('bottom');

	$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
	$ionicConfigProvider.platform.android.navBar.alignTitle('center');

	$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
	$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

	$ionicConfigProvider.platform.ios.views.transition('ios');
	$ionicConfigProvider.platform.android.views.transition('android');
	
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
		.state('login', {
			url: '/login',
			cache: false,
			templateUrl: "page/login.html",
			controller: 'LoginCtrl'
		})
		.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'page/tabs.html'
		})
		.state('tab.lobby', {
			url: '/lobby/:data',
			cache:false,
			views: {
				'tab-lobby': {
					templateUrl: 'page/lobby.html',
					controller: 'LobbyCtrl'
				}
			}
		})
		.state('tab.info', {
			url: '/info/:type',
			views: {
				'tab-info': {
					templateUrl: 'page/info.html',
					controller: 'InfoCtrl'
				}
			}
		})
		.state('tab.statement', {
			url: '/statement/:type',
			views: {
				'tab-statement': {
					templateUrl: 'page/statement.html',
					controller: 'StatementCtrl'
				}
			}
		})

		.state('bacc', {
			url: '/bacc/:data',
			cache: false,
			templateUrl: "page/bacc.html",
			controller: 'BaccCtrl'
		})
		.state('inbacc', {
			url: '/inbacc/:data',
			cache: false,
			templateUrl: "page/inbacc.html",
			controller: 'InBaccCtrl'
		})
		.state('dragon', {
			url: '/dragon/:data',
			cache: false,
			templateUrl: "page/dragon.html",
			controller: 'DragonCtrl'
		})
		.state('roul', {
			url: '/roul/:data',
			cache: false,
			templateUrl: "page/roulette.html",
			controller: 'RoulCtrl'
		})

	$urlRouterProvider.otherwise('/login');

});