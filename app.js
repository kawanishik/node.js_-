const http = require('http'); // httpサーバーmodule
const hostname = 'localhost'; // ホスト名
const port = 3000; // port番号

// httpサーバーの定義
//const server = http.createServer((req, res) => {
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

var mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node"
});

// データベースに接続できたらコンソールにConnectedを表示
connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success connect sql');
});

var array_data = []
connection.query('select * from board', function (error, results, fields) {
    for(let step=0; step < results.length; step++) {
        var n1 = [];
        n1.push(results[step].user_name);
        n1.push(results[step].message);
        n1.push(results[step].time);
        //console.log("n : ", n1);
        array_data.push(n1);
    }
});
//console.log("array : ", array_data);

// 日付を取得する
function LoadProc() {
    var target = document.getElementById("DateTimeDisp");
  
    var Year = now.getFullYear();
    var Month = now.getMonth()+1;
    var Date = now.getDate();
    var Hour = now.getHours();
    var Min = now.getMinutes();
    var Sec = now.getSeconds();
  
    target.innerHTML = Year + "年" + Month + "月" + Date + "日" + Hour + ":" + Min + ":" + Sec;
}
// EJS設定
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function (req, res) {
    //let [array, name_array] = getData();
    let [name_array, message_array, time_array, array] = getData();
    res.render('index', {message_list: [name_array, message_array, time_array]});
});
app.post('/', function (req, res) {
    //let [array, name_array] = getData();
    let [name_array, message_array, time_array, array] = getData();

    if (req.body.message[1].length > 0) {
        if(req.body.message[0].length == 0) {
            req.body.message[0] = "Anonymous";
        }
        var now = new Date();
        var time = now.getFullYear()+"年" + (now.getMonth()+1)+"月" + now.getDate()+"日" + now.getHours()+"時" + now.getMinutes()+"分";
        name_array.push(req.body.message[0]);
        message_array.push(req.body.message[1]);
        time_array.push(time);
        tmp = [];
        tmp.push(req.body.message[0]);
        tmp.push(req.body.message[1]);
        tmp.push(time);
        connection.query("insert into board set ?", {user_name:tmp[0], message:tmp[1], time:tmp[2]}, function(error,results,fields){
            if(error) {
                console.log("insert error");
            } else {
                array.push(tmp);
            }
        });
        //array.push(req.body.message + "," + time);
        //console.log("array : ", array);
        //console.log(req.body.message[0].length, ", ", req.body.message[1].length);
        //console.log(req.body.message);
        //fs.writeFileSync("data.txt", array.join("\r\n"));
    }
    var now = new Date();
    //console.log(now.getFullYear()+"年"+now.getMonth()+1,"月",now.getDate(),"日",now.getHours(),"時",now.getMinutes(),"分")
res.render('index', {message_list: [name_array, message_array, time_array]});
})
function getData() {
    // let data = fs.readFileSync("data.txt", {encoding: "utf-8"});
    // var array = [];
    // if (data.length > 0) {
    //     array = data.split(/\r\n|\r|\n/);
    // }
    // connection.query('select * from board', function (error, results, fields) {
    //     for(let step=0; step < results.length; step++) {
    //         var n1 = [];
    //         n1.push(results[step].user_name);
    //         n1.push(results[step].message);
    //         n1.push(results[step].time);
    //         console.log(n1);
    //         array.push(n1);
    //     }
    // });
    // console.log("aa : ",array);
    var multi_array = [];
    var name_array = [];
    var message_array = [];
    var time_array = [];

    for(let step=0; step < array_data.length; step++) {
        //console.log(array_data[step]);
        //var sentence_split = array_data[step].split(',');
        var sentence_split = array_data[step];
        if(sentence_split[0].length == 0) {
            sentence_split[0] = "Anonymous";
        }
        //console.log(array[step],", ", sentence_split);
        multi_array.push(sentence_split);
        name_array.push(sentence_split[0]);
        message_array.push(sentence_split[1]);
        time_array.push(sentence_split[2]);
    }
    //console.log(multi_array);
    //console.log(multi_array.length);
    return [name_array, message_array, time_array, array_data];
    //return array;
}

app.listen(3000, function () {
});

// サーバー起動
//server.listen(port, hostname, () => {
//    console.log(`Server running at http://${hostname}:${port}/`);
//});