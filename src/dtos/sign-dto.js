// SignDTO.js
class SignDTO {
    constructor({
                    email,
                    passwordHash,
                    name = null,
                    phoneNumber = null,
                    gender = null,   // 'male' | 'female' | 'other' | null
                    address = null,
                }) {
        this.email = email;               // 필수: 이메일
        this.passwordHash = passwordHash; // 필수: 비밀번호 해시
        this.name = name;                 // 선택: 이름
        this.phoneNumber = phoneNumber;   // 선택: 휴대폰 번호
        this.gender = gender;             // 선택: 성별
        this.address = address;           // 선택: 주소
    }
}

module.exports = SignDTO;
