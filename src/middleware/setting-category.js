const setCategory = category => (req, res, next) => {
    if (req.body && req.body.category) {
        req.query.category = req.body.category;
    } else {
        req.query.category = category;
    }

    next();
};

module.exports = setCategory;