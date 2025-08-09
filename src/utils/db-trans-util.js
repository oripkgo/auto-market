const pool = require('../config/db');

/**
 * 트랜잭션 실행 함수
 * @param {Function} callback - async (conn) => { ... } 형태로 실행할 콜백
 * @returns {*} callback의 반환값
 */
const withTransaction = async (callback) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const result = await callback(conn);

        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

module.exports = withTransaction;
