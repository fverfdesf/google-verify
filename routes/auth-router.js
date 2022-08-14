let router = require('express').Router();
let passport = require('passport');
let User = require('../models/userSchema');
let bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('signup', { user: req.user });
})

router.get('/login', (req, res) => {
    res.render('login.ejs', { user: req.user });
})

//登出後導向到首頁
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})


//展開驗證，驗證方式為google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: "帳號或密碼錯誤",
}), function (req, res) {
    res.redirect('/profile');
}
)

router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    User.findOne({ email: email }).then((emailExist) => {
        if (emailExist) {
            req.flash('error_message', '信箱被註冊，請重新輸入');
            return res.redirect('/auth/signup');
        }
        if (!emailExist) {
            let saltRound = 10;
            bcrypt.genSalt(saltRound, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: hash
                    })
                    newUser
                        .save()
                        .then(() => {
                            req.flash('success_message', '註冊成功');
                            res.redirect('/auth/login');
                        })
                        .catch((err) => {
                            if (name.length <= 6) {
                                req.flash('error_message', '使用者名稱長度不能小於6');
                                return res.redirect('/auth/signup');
                            }
                            if (password.length <= 8) {
                                req.flash('error_message', '密碼長度不能小於8');
                                return res.redirect('/auth/signup');
                            }
                        })
                })
            })
        }
    })
})


module.exports = router;