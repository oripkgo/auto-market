const consentMapper = require('../mapper/privacy-consent-mapper');
const latestTermsVersion = '2025.7.27';

// 페이징 조회
const getAllConsents = async ({ page, limit }) => {
    return await consentMapper.findAllWithPaging({ page, limit });
};

// 단일 조회
const getConsentById = async (id) => {
    return await consentMapper.findById(id);
};

// 신규 동의 생성
const createConsent = async ({ userId, consentGiven, ipAddress, userAgent },trx) => {
    const newConsent = {
        user_id: userId,
        consent_given: consentGiven,
        consent_version: latestTermsVersion,
        ip_address: ipAddress || null,
        user_agent: userAgent || null
    };
    return await consentMapper.insert(newConsent,trx);
};

// 동의 정보 수정
const updateConsent = async (id, updateData) => {
    const existing = await consentMapper.findById(id);
    if (!existing) return null;

    const updatePayload = {};
    if (updateData.userId !== undefined) updatePayload.user_id = updateData.userId;
    if (updateData.consentGiven !== undefined) updatePayload.consent_given = updateData.consentGiven;
    if (updateData.consentVersion !== undefined) updatePayload.consent_version = updateData.consentVersion;
    if (updateData.consentAt !== undefined) updatePayload.consent_at = updateData.consentAt;
    if (updateData.ipAddress !== undefined) updatePayload.ip_address = updateData.ipAddress;
    if (updateData.userAgent !== undefined) updatePayload.user_agent = updateData.userAgent;

    return await consentMapper.update(id, updatePayload);
};

// 동의 삭제 (소프트)
const deleteConsent = async (id) => {
    return await consentMapper.remove(id);
};

module.exports = {
    getAllConsents,
    getConsentById,
    createConsent,
    updateConsent,
    deleteConsent
};
