const jwtUtil = require('../utils/jwt-util');

// 검증을 제외할 경로 목록
const openPaths = ['/sign/in', '/sign/up', '/posts/free', '/posts/inquiry'];

const authMiddleware = (req, res, next) => {
    // 현재 요청 경로가 openPaths 중 하나로 시작하는지 검사
    const isExcluded = openPaths.some(path => req.path.startsWith(path));
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
