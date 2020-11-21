# arduinoControlByNode.js

## 작업순서  

### 1. node.js 설치
- nodejs.org에서 다운로드  

### 2. 작업 폴더 생성  
- 바탕화면에 test라는 이름으로 폴더 생성  
- 해당 폴더로 이동  
```
C:\Users\사용자계정\Desktop\test  
```
- 프로젝트 제작을 위한 초기화  
```
npm init
```
- yes가 나올 때까지 계속 엔터, 프로젝트 내용을 적는 부분이니 내용을 적어도 무방  
- 폴더 안에 package.json 파일이 생성된 것을 확인할 수 있음  

### 3. 서버와 통신할 패키지 설치  
```
npm --save install espress // expressJS 미들웨어(프레임워크) 설치
npm --save install serialport // 시리얼포트 미들웨어 설치
npm --save install ejs // ejs(embedded javaScript) 미들웨어 설치
```
- test 폴더로 들어가보면 node_modules 폴더를 확인할 수 있음  

### 4. 아두이노 세팅  
- LED를 11, 12, 13번 핀에 연결  
- GND에 연결  
- iot.ino  
```
#define LED_01 11
#define LED_02 12
#define LED_03 13
 
#define LED_NUM 3
unsigned int ledArray[] = { LED_01,LED_02, LED_03 } ;
 
 
void setup() {
  Serial.begin(9600);
 
  for(int i = 0 ; i < LED_NUM ; i++) {
    pinMode(ledArray[i], OUTPUT) ;
  }
}
 
void loop() {
 
  if(Serial.available()) {
      char c = Serial.read();
//      Serial.write(c);
      if(c == 'A') {
            for(int i = 0 ; i < LED_NUM ; i++) {
                digitalWrite(ledArray[i], HIGH) ;
            }
           return;
      }
      if(c == 'X') {
            for(int i = 0 ; i < LED_NUM ; i++) {
                digitalWrite(ledArray[i], LOW) ;
            }
           return;
      }
      int ledNum = c - '1';
      digitalWrite(ledArray[ledNum],!digitalRead(ledArray[ledNum])) ;
  }
}
```

### 5. index.js 파일 제작  
- UTF-8 인코딩으로 저장할 것  
- 아래 부분의 #####는 자신의 아두이노 보드가 연결된 포트를 써줌  
- 아두이노 IDE의 시리얼 모니터를 켜면 node가 시리얼 포트에 오류가 나므로 끄고 실행할 것  
```
var port = new serialPort('#####',{ 
```

- index.js
```
var express = require('express');
var http = require('http');

var app = express();
var path = require('path');

var server = http.createServer(app);
server.listen(3000);

// 시리얼 포트 설정
// port : 아두이노가 연결된 포트
var serialPort  = require('serialport');
// 아래 COM10은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
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
```

### 6. test 폴더 안에 views 폴더 생성하기  
- views 폴더 안에 controller.ejs 라는 이름으로 파일을 생성하고 아래 내용을 넣기  
- UTF-8 인코딩으로 저장  
- controller.ejs  
```
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<style media="screen">
  body{
    background-color: black;
    color:white;
    border: none;
  }
  #A{
    background-color: white;
    color: grey;
    border: none;
  }
  #A:hover{
    background-color: black;
  }
  button[name="green"]{
    background-color: green;
    border: none;

  }
  button[name="green"]:hover{
    background-color: black;

  }
  button[name="red"]{
    background-color: red;
    border: none;
  }
  button[name="red"]:hover{
    background-color: black;
  }
  button[name="blue"]{
    background-color: blue;
    border: none;
  }
  button[name="blue"]:hover{
    background-color: black;
  }
  #X{
    background-color: grey;
    color: white;
    border: none;
  }
  #X:hover{
    background-color: black;
}

</style>
    <script>
    $(document).ready(function(){
        $("button").click(function(){
            $.get("/controller/" + $(this).attr('id'), function(data, status){ });
        });
    });
    </script>
    <meta charset="UTF-8">
    <title>Controll Test</title>
</head>
<body>
    <div class="container">
        <h2>Controll Test</h2>
        <button type="button" class="btn btn-success" id='A'>모두 켜기</button>

        <button name="green" type="button" class="btn btn-warning" id='1'>초록색</button>
        <button name="red" type="button" class="btn btn-primary" id='2'>빨간색</button>
        <button name="blue" type="button" class="btn btn-success" id='3'>파랑색</button>
        <button type="button" class="btn btn-default"  id='X'>모두 끄기</button>
        </div>
</body>
</html>
```

### 7. node를 이용해 서버를 열기  
```
node index.js
```

### 8. 컴퓨터의 IP 주소를 확인하고, PC의 웹브라우저나 스마트폰을 이용해 접속  
- 서버를 연 컴퓨터에서 자체적으로 접속할 때는 브라우저 주소창에 localhost:3000 라고 입력하여 접속함  
- 같은 공유기 내에서는 사설 IP:3000 으로 접속함  
- 공유기 외부에서 접속할 때는 사설 IP:3000으로 포트포워딩 설정이 된 공인 IP:포트로 접속함  



## [참고자료 링크](https://m.blog.naver.com/touart93/221091988316)  
