// PostDTO.js
class PostDTO {
    constructor({
                    id,
                    userId = null,
                    name = null,
                    email = null,
                    phone = null,
                    userName = null,
                    category,
                    title,
                    content,
                    views = 0,
                    createdAt,
                    updatedAt = null,
                    deletedAt = null,
                }) {
        this.id = id;               // BIGINT
        this.userId = userId;       // BIGINT | null
        this.name = name;       
        this.email = email;       
        this.phone = phone;      
        this.userName = userName;   // BIGINT | null (필요시 string으로 변경)
        this.category = category;   // 'notice' | 'free' | 'review' | 'inquiry'
        this.title = title;         // VARCHAR(200)
        this.content = content;     // MEDIUMTEXT
        this.views = views;         // INT, 기본 0
        this.createdAt = createdAt; // Date 또는 문자열
        this.updatedAt = updatedAt; // Date 또는 문자열 | null
        this.deletedAt = deletedAt; // Date 또는 문자열 | null
    }
}

module.exports = PostDTO;
