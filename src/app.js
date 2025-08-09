var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require('./config/db');
const authMiddleware = require('./middleware/auth-middleware');

var usersRouter = require('./routes/user-router');
var postsRouter = require('./routes/posts-router');
var signRouter = require('./routes/sign-router');

var app = express();


async function testDbConnection() {
    try {
        // 간단한 쿼리 실행해보기 (현재 시간 조회)
        const [rows] = await db.query('SELECT NOW() as now');
        console.log('DB 연결 성공! 현재 시간:', rows[0].now);
    } catch (error) {
        console.error('DB 연결 실패:', error);
    }
}

testDbConnection();

app.use(cors({
    origin: true, // 요청한 Origin을 그대로 반환 → 사실상 모든 오리진 허용
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));

app.use((req, res, next) => {
    res.header('Vary', 'Origin'); // 캐시 안정성 확보
    next();
});

app.use(logger('dev'));
app.use(express.json());


app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(authMiddleware);

// 모든 api에 로직 적용시
app.use((req, res, next) => {
    next();
});


app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/sign', signRouter);


// 404 핸들러
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// 에러 핸들러 (전역)
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});


module.exports = app;
