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


## [참고자료 링크](https://m.blog.naver.com/touart93/221091988316)  
