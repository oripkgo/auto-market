class PagingRequestDto {
    constructor({ page, limit }) {
        this.page = Number(page) > 0 ? Number(page) : 1;
        this.limit = Number(limit) > 0 ? Number(limit) : 10;
    }
}

module.exports = PagingRequestDto;
