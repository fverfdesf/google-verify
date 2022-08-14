const router = require('express').Router();

router.get('/', (req, res) => {
    res.render("please");

})
module.exports = router;