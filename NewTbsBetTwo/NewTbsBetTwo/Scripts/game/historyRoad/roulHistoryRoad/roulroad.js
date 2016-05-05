gameModule
.factory('RoulRoad',[function(){
	var roadstr=null;//总路子
	var showroad=null;//显示路子数组
	var showlength=10;//路子显示个数
	var currentindex=0;//当前起始索引
	var server={
		StringSplit:StringSplit,
		GoLeft:GoLeft,
		GoRight:GoRight,
		Destory:Destory
		
	}
	return server;
	function StringSplit(strServerResult){
		
		if (strServerResult == "") {
			Shuffle();
			return;
		}
		if(roadstr==null){
			roadstr=new Array();
		}
		Shuffle();
		roadstr = strServerResult.split("|");
		var len=roadstr.length;
		var index=0;
		if(len>showlength){
			index=len-showlength;
		}else{
			index=0;
		}
		currentindex=index;
		for(index;index<len;index++){
			var arr={
				count:0,
				type:0,
			}
			arr.count=roadstr[index];
			arr.type=GetRoadType(roadstr[index]);
			if(showroad==null){
				showroad=new Array();
			}
			showroad.push(arr);
		}
		return showroad;
	}
	function GetRoadType(num){
		switch(parseInt(num)){
			case 0:
				return 2;
			case 1:
			case 3:
			case 5:
			case 7:
			case 9:
			case 12:
			case 14:
			case 16:
			case 18:
			case 19:
			case 21:
			case 23:
			case 25:
			case 27:
			case 30:
			case 32:
			case 34:
			case 36:
				return 1;
			case 2:
			case 4:
			case 6:
			case 8:
			case 10:
			case 11:
			case 13:
			case 15:
			case 17:
			case 20:
			case 22:
			case 24:
			case 26:
			case 28:
			case 29:
			case 31:
			case 33:
			case 35:
				return 3;
		}
		return 4;
	}
	//向左移动路子
	function GoLeft(){
		if(roadstr==null || showroad==null){
			return;
		}
		if(currentindex<=0){
			return;
		}
		if(roadstr && showroad && roadstr[currentindex-1]){
			showroad.pop();
			var arr={
				count:0,
				type:0,
			}
			arr.count=roadstr[currentindex-1];
			arr.type=GetRoadType(roadstr[currentindex-1]);
			showroad.unshift(arr);
		}
		currentindex--;
		return showroad;
		
	}
	//向右移动路子
	function GoRight(){
		if(roadstr==null || showroad==null){
			return;
		}
		var len=roadstr.length;
		if((currentindex+showlength)>=len){
			return;
		}
		if(roadstr && showroad && roadstr[currentindex+showlength]){
			showroad.shift();
			var arr={
				count:0,
				type:0,
			}
			arr.count=roadstr[currentindex+showlength];
			arr.type=GetRoadType(roadstr[currentindex+showlength]);
			showroad.push(arr);
		}
		currentindex++;
		return showroad;
	}
	function Shuffle(){
		showroad=null;
		roadstr=null;
	}
	function Destory(){
		Shuffle();
	}
}])
