const pool = require('../config/db');

const findAllWithPaging = async ({page = 1, limit = 10}) => {
    const offset = (Number(page) - 1) * Number(limit);

    const [users] = await pool.query(
        `SELECT *
         FROM users
         WHERE deleted_at IS NULL
         ORDER BY id LIMIT ?
         OFFSET ?`,
        [Number(limit), Number(offset)]
    );

    const [countResult] = await pool.query(
        `SELECT COUNT(*) AS total
         FROM users
         WHERE deleted_at IS NULL`
    );

    return {
        data: users,
        total: countResult[0].total,
        page: Number(page),
        limit: Number(limit)
    };
};


const findAll = async () => {
    const [rows] = await pool.query(
        `SELECT *
         FROM users
         WHERE deleted_at IS NULL
         ORDER BY id`
    );
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM users
         WHERE id = ?
           AND deleted_at IS NULL`,
        [id]
    );
    return rows[0] || null;
};

const findByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM users
         WHERE email = ?
           AND deleted_at IS NULL`,
        [email]
    );
    return rows[0] || null;
};

const insert = async (user) => {
    const {
        email,
        password_hash,
        name = null,
        phone_number = null,
        gender = null,
        address = null
    } = user;

    const [result] = await pool.query(
        `INSERT INTO users (email, password_hash, name, phone_number, gender, address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [email, password_hash, name, phone_number, gender, address]
    );
    return findById(result.insertId);
};

const update = async (id, userData) => {
    const fields = [];
    const values = [];

    for (const key of ['email', 'password_hash', 'name', 'phone_number', 'gender', 'address']) {
        if (userData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(userData[key]);
        }
    }

    if (fields.length === 0) return null;

    values.push(id);

    const sql = `UPDATE users
                 SET ${fields.join(', ')},
                     updated_at = NOW()
                 WHERE id = ?
                   AND deleted_at IS NULL`;
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) return null;

    return findById(id);
};

const remove = async (id) => {
    const [result] = await pool.query(
        `UPDATE users
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
    findByEmail,
    insert,
    update,
    remove
};
