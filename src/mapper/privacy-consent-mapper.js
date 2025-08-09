const pool = require('../config/db');

// 페이징 조회
const findAllWithPaging = async ({ page = 1, limit = 10 }) => {
    const offset = (Number(page) - 1) * Number(limit);

    const [rows] = await pool.query(
        `SELECT
             id,
             user_id AS userId,
             consent_given AS consentGiven,
             consent_version AS consentVersion,
             consent_at AS consentAt,
             ip_address AS ipAddress,
             user_agent AS userAgent,
             created_at AS createdAt,
             updated_at AS updatedAt,
             deleted_at AS deletedAt
         FROM privacy_consents
         WHERE deleted_at IS NULL
         ORDER BY id
         LIMIT ?
         OFFSET ?`,
        [Number(limit), Number(offset)]
    );

    const [countResult] = await pool.query(
        `SELECT COUNT(*) AS total
         FROM privacy_consents
         WHERE deleted_at IS NULL`
    );

    return {
        data: rows,
        total: countResult[0].total,
        page: Number(page),
        limit: Number(limit)
    };
};

// 전체 조회
const findAll = async () => {
    const [rows] = await pool.query(
        `SELECT
             id,
             user_id AS userId,
             consent_given AS consentGiven,
             consent_version AS consentVersion,
             consent_at AS consentAt,
             ip_address AS ipAddress,
             user_agent AS userAgent,
             created_at AS createdAt,
             updated_at AS updatedAt,
             deleted_at AS deletedAt
         FROM privacy_consents
         WHERE deleted_at IS NULL
         ORDER BY id`
    );
    return rows;
};

// ID로 조회
const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
             id,
             user_id AS userId,
             consent_given AS consentGiven,
             consent_version AS consentVersion,
             consent_at AS consentAt,
             ip_address AS ipAddress,
             user_agent AS userAgent,
             created_at AS createdAt,
             updated_at AS updatedAt,
             deleted_at AS deletedAt
         FROM privacy_consents
         WHERE id = ?
           AND deleted_at IS NULL`,
        [id]
    );
    return rows[0] || null;
};

// 삽입
const insert = async (consent, trx) => {
    const {
        user_id,
        consent_given,
        consent_version,
        consent_at = new Date(),
        ip_address = null,
        user_agent = null
    } = consent;

    const [result] = await (trx || pool).query(
        `INSERT INTO privacy_consents
         (user_id, consent_given, consent_version, consent_at, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, consent_given, consent_version, consent_at, ip_address, user_agent]
    );
    return findById(result.insertId);
};

// 업데이트
const update = async (id, consentData) => {
    const fields = [];
    const values = [];

    for (const key of ['user_id', 'consent_given', 'consent_version', 'consent_at', 'ip_address', 'user_agent']) {
        if (consentData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(consentData[key]);
        }
    }

    if (fields.length === 0) return null;

    values.push(id);

    const sql = `UPDATE privacy_consents
                 SET ${fields.join(', ')},
                     updated_at = NOW()
                 WHERE id = ?
                   AND deleted_at IS NULL`;
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) return null;

    return findById(id);
};

// 소프트 삭제
const remove = async (id) => {
    const [result] = await pool.query(
        `UPDATE privacy_consents
         SET deleted_at = NOW()
         WHERE id = ?
           AND deleted_at IS NULL`,
        [id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    findAllWithPaging,
    findAll,
    findById,
    insert,
    update,
    remove
};
