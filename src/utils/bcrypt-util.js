const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;  // 보통 10~12 사이

/**
 * 비밀번호를 해시 처리
 * @param {string} plainPassword - 평문 비밀번호
 * @returns {Promise<string>} - 해시된 비밀번호
 */
const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * 평문 비밀번호와 해시된 비밀번호 비교
 * @param {string} plainPassword - 평문 비밀번호
 * @param {string} hashedPassword - 해시된 비밀번호
 * @returns {Promise<boolean>} - 일치 여부
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};
