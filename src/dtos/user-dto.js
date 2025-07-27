// UserDTO.js
class UserDTO {
    constructor({
                    id,
                    email,
                    passwordHash,
                    name = null,
                    phoneNumber = null,
                    gender = null,       // 'male' | 'female' | 'other' | null
                    address = null,
                    createdAt,
                    updatedAt = null,
                    deletedAt = null,
                }) {
        this.id = id;                         // BIGINT
        this.email = email;                   // VARCHAR(255)
        this.passwordHash = passwordHash;   // VARCHAR(255)
        this.name = name;                    // VARCHAR(100) | null
        this.phoneNumber = phoneNumber;      // VARCHAR(20) | null
        this.gender = gender;                // ENUM or null
        this.address = address;              // VARCHAR(1000) | null
        this.createdAt = createdAt;          // Date or string
        this.updatedAt = updatedAt;          // Date or string | null
        this.deletedAt = deletedAt;          // Date or string | null
    }
}

module.exports = UserDTO;
