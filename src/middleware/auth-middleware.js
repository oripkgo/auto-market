const jwtUtil = require('../utils/jwt-util');

// 검증을 제외할 경로와 메소드 목록
const openRoutes = [
    { path: '/sign/in', method: 'POST' },
    { path: '/sign/up', method: 'POST' },
    { path: '/posts/free', method: 'GET' },
    { path: '/posts/notice', method: 'GET' },
    { path: '/posts/review', method: 'GET' }
];

const authMiddleware = (req, res, next) => {
    // 현재 요청이 openRoutes에 포함되는지 확인
    const isExcluded = openRoutes.some(route =>
        req.path.startsWith(route.path) && req.method === route.method
    );

    if (isExcluded) {
        return next(); // 인증 생략
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    const decoded = jwtUtil.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    req.user = decoded;
    next();
};

module.exports = authMiddleware;
