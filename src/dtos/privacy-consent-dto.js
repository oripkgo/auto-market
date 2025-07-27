// PrivacyConsentDTO.js
class PrivacyConsentDTO {
    constructor({
                    id,
                    userId,
                    consentGiven,
                    consentVersion,
                    consentAt,
                    ipAddress = null,
                    userAgent = null,
                    createdAt,
                    updatedAt = null,
                    deletedAt = null,
                }) {
        this.id = id;                       // BIGINT
        this.userId = userId;               // BIGINT
        this.consentGiven = consentGiven;   // BOOLEAN
        this.consentVersion = consentVersion; // VARCHAR(10)
        this.consentAt = consentAt;         // DATETIME
        this.ipAddress = ipAddress;         // VARCHAR(45) | null
        this.userAgent = userAgent;         // TEXT | null
        this.createdAt = createdAt;         // DATETIME
        this.updatedAt = updatedAt;         // DATETIME | null
        this.deletedAt = deletedAt;         // DATETIME | null
    }
}

module.exports = PrivacyConsentDTO;
