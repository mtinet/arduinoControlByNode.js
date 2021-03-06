var express = require('express');
var http = require('http');

var app = express();
var path = require('path');

var server = http.createServer(app);
server.listen(3000);

// 시리얼 포트 설정
// port : 아두이노가 연결된 포트
var serialPort  = require('serialport');
// 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
var port = new serialPort('COM10',{
    baudate : 9600,
    // defaults for Arduino serial communication
    dataBits : 8,
    parity : 'none',
    stopBits: 1,
    flowControl: false
})
port.on('open', function () {
    console.log('Opened Serial Communication by COM10');
    console.log('Open Your Web Browser and Connect to localhost:3000');
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res) {
    res.status(200).render('controller.ejs');
})

app.get('/controller/:id',function(req,res){
    console.log(req.params.id);
    port.write(req.params.id) ;
    res.status(200).send('LED Controll OK!!');
})
