const userService = require('../services/user-service');
const bcryptUtil = require('../utils/bcrypt-util');
const jwtUtil = require('../utils/jwt-util');
const privacyConsentService = require('../services/privacy-consent-service');
const withTransaction = require('../utils/db-trans-util');


exports.signUp = async (req, res, next) => {
    try {
        const userAgent = req.headers['user-agent'];
        const clientIp =
            (req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',')[0]) ||
            (req.connection && req.connection.remoteAddress) ||
            (req.socket && req.socket.remoteAddress) ||
            (req.connection && req.connection.socket ? req.connection.socket.remoteAddress : null);


        const {email, password, name, phone, gender, agreePrivacy} = req.body;
        if (!email || !password || !name) {
            const error = new Error('이메일, 비밀번호, 이름은 필수입니다.');
            error.status = 400;
            throw error;
        }

        // 이메일 중복 확인
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            const error = new Error('이미 존재하는 이메일입니다.');
            error.status = 409;
            throw error;
        }

        // 비밀번호 해시 생성
        const passwordHash = await bcryptUtil.hashPassword(password);

        // 사용자 생성 및 약관 정보 저장
        let newUserId = 0;
        await withTransaction(async (conn) => {
            newUserId = await userService.createUser({email, passwordHash, name, phone, gender, agreePrivacy}, conn);

            await privacyConsentService.createConsent({
                userId: newUserId,
                consentGiven: agreePrivacy,
                ipAddress: clientIp,
                userAgent
            }, conn);

        });

        res.status(201).json({message: '회원가입 성공', userId: newUserId});
    } catch (err) {
        next(err);
    }
};

exports.signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            const error = new Error('이메일과 비밀번호를 입력해주세요.');
            error.status = 400;
            throw error;
        }

        const user = await userService.getUserByEmail(email);
        if (!user) {
            const error = new Error('가입되지 않은 이메일입니다.');
            error.status = 401;
            throw error;
        }

        // 비밀번호 비교
        const isMatch = await bcryptUtil.comparePassword(password, user.passwordHash);
        if (!isMatch) {
            const error = new Error('비밀번호가 일치하지 않습니다.');
            error.status = 401;
            throw error;
        }

        // JWT 토큰 생성
        const token = jwtUtil.generateToken({userId: user.id, email: user.email, name: user.name, level:user.level});

        res.json({message: '로그인 성공', token, userLevel:user.level, userId:user.id});
    } catch (err) {
        next(err);
    }
};
