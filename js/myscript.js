console.log("hello from aaa");
//document.write("<p>UTF-8で記述された外部ファイル</p>");
/*
$(function() {
	console.log("hello");
	$('body').append('<p>hogehoge</p>');
});*/
console.log("hellaao");

var test = 4;
var info = new Array;
info.a = 3;

var greet = document.createElement('p');
var text = document.createTextNode('hello worldkaka');

document.body.appendChild(greet).appendChild(text);

//var top = document.getElementById('top');
//top.appendChild()


function myEnter(){
	test += 1;
	console.log(test);
	//myPassWord=prompt("Tatsuya家のパスワードを入力してください","");
	/*
	if ( myPassWord == "pass1" ){
	  alert("yes");
	}else{
	  alert( "パスワードが違います!" );
}*/
}
function simulation(){
	info.a+=1;
	console.log("hellosimu");
	var x = document.getElementById('num').value;
	numx = parseInt(x);
	numx = numx + 1;
	document.getElementById('answer').innerHTML = numx;
	plotGraph(info);
}
function plotGraph(info){
	console.log(info.a);

}