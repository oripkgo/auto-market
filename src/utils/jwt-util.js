const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// 환경변수로 초 단위 만료시간 (기본 3600초 = 1시간)
const JWT_EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS) || 3600;

const generateToken = (payload, expiresInSeconds = JWT_EXPIRES_IN_SECONDS) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
