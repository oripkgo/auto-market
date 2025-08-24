const pool = require('../config/db');


const findAllWithCount = async ({category = null, page = 1, limit = 10}) => {
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];

    let whereClause = `WHERE ps.deleted_at IS NULL`;

    if (category) {
        whereClause += ` AND ps.category = ?`;
        params.push(category);
    }

    // 게시글 목록 조회
    const dataQuery = `
        SELECT
            ps.id,
            ps.user_id AS userId,
            us.name AS userName,
            ps.category,
            ps.title,
            ps.content,
            ps.views,
            ps.created_at AS createdAt,
            ps.updated_at AS updatedAt,
            ps.deleted_at AS deletedAt
        FROM posts ps
        LEFT JOIN users us on us.id = ps.user_id
            ${whereClause}
        ORDER BY ps.created_at DESC LIMIT ?
        OFFSET ?
    `;

    // 전체 카운트 조회
    const countQuery = `
        SELECT COUNT(*) AS total
        FROM posts ps ${whereClause}
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
    let whereClause = `WHERE ps.deleted_at IS NULL`;

    if (category) {
        whereClause += ` AND ps.category = ?`;
        queryParams.push(category);
    }

    const query = `
        SELECT
            ps.id,
            ps.user_id AS userId,
            us.name AS userName,
            ps.category,
            ps.title,
            ps.content,
            ps.views,
            ps.created_at AS createdAt,
            ps.updated_at AS updatedAt,
            ps.deleted_at AS deletedAt
        FROM posts ps
        LEFT JOIN users us on us.id = ps.user_id
            ${whereClause}
        ORDER BY ps.created_at DESC LIMIT ?
        OFFSET ?
    `;

    queryParams.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, queryParams);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
             ps.id,
             ps.user_id AS userId,
             us.name AS userName,
             ps.category,
             ps.title,
             ps.content,
             ps.views,
             ps.created_at AS createdAt,
             ps.updated_at AS updatedAt,
             ps.deleted_at AS deletedAt
         FROM posts ps
         LEFT JOIN users us on us.id = ps.user_id
         WHERE ps.id = ?
           AND ps.deleted_at IS NULL`,
        [id]
    );
    return rows[0] || null;
};

const insert = async (post) => {
    const {
        userId = null,
        email = null,
        phone = null,
        category,
        title,
        content
    } = post;

    const [result] = await pool.query(
        `INSERT INTO posts (user_id, category, title, content)
         VALUES (?, ?, ?, ?)`,
        [userId, category, title, content]
    );

    return findById(result.insertId);
};

const update = async (id, postData) => {
    const { userId, category, title, content } = postData;

    const fields = [];
    const values = [];

    if (userId !== undefined) {
        fields.push("user_id = ?");
        values.push(userId);
    }
    if (category !== undefined) {
        fields.push("category = ?");
        values.push(category);
    }
    if (title !== undefined) {
        fields.push("title = ?");
        values.push(title);
    }
    if (content !== undefined) {
        fields.push("content = ?");
        values.push(content);
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


const updateViews = async (id) => {

    const fields = [];
    const values = [];

    fields.push("views = views + 1");

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
    updateViews,
    softDelete
};
