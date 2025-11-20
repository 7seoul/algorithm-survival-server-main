# SurvivAlgo - Main Server

백준(Solvedac) 사용자들을 위한 알고리즘 문제 풀이 추적 및 경쟁 서비스의 메인 서버

## 기술 스택

- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcrypt
- Puppeteer + Cheerio (웹 스크래핑)
- Winston (로깅)
- Node-cron (스케줄링)

## 환경 변수 설정

`.env` 파일 생성:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/survivalgo
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (nodemon)
npm run dev
```
