const pool = require('../config/db');


const findAllWithCount = async ({category = null, page = 1, limit = 10}) => {
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];

    let whereClause = `WHERE deleted_at IS NULL`;

    if (category) {
        whereClause += ` AND category = ?`;
        params.push(category);
    }

    // 게시글 목록 조회
    const dataQuery = `
        SELECT *
        FROM posts ${whereClause}
        ORDER BY created_at DESC LIMIT ?
        OFFSET ?
    `;

    // 전체 카운트 조회
    const countQuery = `
        SELECT COUNT(*) AS total
        FROM posts ${whereClause}
    `;

    const [dataRows] = await pool.query(dataQuery, [...params, Number(limit), Number(offset)]);
    const [countRows] = await pool.query(countQuery, params);

    return {
        data: dataRows,
        total: countRows[0].total,
        page: Number(page),
        limit: Number(limit)
    };
};


const findAll = async ({category = null, page = 1, limit = 10}) => {
    const offset = (Number(page) - 1) * Number(limit);

    const queryParams = [];
    let whereClause = `WHERE deleted_at IS NULL`;

    if (category) {
        whereClause += ` AND category = ?`;
        queryParams.push(category);
    }

    const query = `
        SELECT *
        FROM posts ${whereClause}
        ORDER BY created_at DESC LIMIT ?
        OFFSET ?
    `;

    queryParams.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, queryParams);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM posts
         WHERE id = ?
           AND deleted_at IS NULL`,
        [id]
    );
    return rows[0] || null;
};

const insert = async (post) => {
    const {
        user_id = null,
        user_name = null,
        category,
        title,
        content
    } = post;

    const [result] = await pool.query(
        `INSERT INTO posts (user_id, user_name, category, title, content)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, user_name, category, title, content]
    );

    return findById(result.insertId);
};

const update = async (id, postData) => {
    const fields = [];
    const values = [];

    for (const key of ['user_id', 'user_name', 'category', 'title', 'content']) {
        if (postData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(postData[key]);
        }
    }

    if (fields.length === 0) return null;

    values.push(id);

    const sql = `UPDATE posts
                 SET ${fields.join(', ')},
                     updated_at = NOW()
                 WHERE id = ?
                   AND deleted_at IS NULL`;
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) return null;

    return findById(id);
};

const softDelete = async (id) => {
    const [result] = await pool.query(
        `UPDATE posts
         SET deleted_at = NOW()
         WHERE id = ?
           AND deleted_at IS NULL`,
        [id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    findAllWithCount,
    findAll,
    findById,
    insert,
    update,
    softDelete
};
