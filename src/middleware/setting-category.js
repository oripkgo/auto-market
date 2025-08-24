const setCategory = category => (req, res, next) => {
    if (req.body && req.body.category) {
        req.query.category = req.body.category;
    } else {


        if( req.query ){
            req.query.category = category;
        }

        if( req.body ){
            req.body.category = category;
        }

    }

    next();
};

module.exports = setCategory;