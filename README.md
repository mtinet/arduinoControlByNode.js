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
- 아두이노 IDE의 시리얼 모니터를 켜면 node가 시리얼 포트에 오류가 나므로 끄고 실핼할 것  
```
var port = new serialPort('#####',{ 
```
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
// 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
var port = new serialPort('#####',{
    baudrate : 9600,
    // defaults for Arduino serial communication
    dataBits : 8,
    parity : 'none',
    stopBits: 1,
    flowControl: false
})
port.on('open', function () {
    console.log('open serial communication');
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





## [참고자료 링크](https://m.blog.naver.com/touart93/221091988316)  
