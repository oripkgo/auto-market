const jwtUtil = require('../utils/jwt-util');

const checkUserRole = (minLevel) =>{
    return function (req, res, next) {

        try {
            const user = req.user;
            
            if( !user ){
                return res.status(401).json({ message: '유저정보가 없습니다.' });
            }

            // 유저 정보 추출
            const userLevel = user.level*1;
            if (typeof userLevel !== 'number') {
                return res.status(403).json({ message: 'User level not found' });
            }

            // 권한 체크
            if (userLevel < minLevel) {
                return res.status(403).json({ message: 'Forbidden: insufficient level' });
            }

            // 5. req에 유저정보와 토큰 저장 후 통과
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}



module.exports = checkUserRole;