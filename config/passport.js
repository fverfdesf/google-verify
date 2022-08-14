const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const User = require("../models/userSchema");
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    User.findById({ _id: id }).then((user) => {
        done(null, user);
    })
})

//本地驗證機制
passport.use(new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    try {
        const findUser = await User.findOne({ email: username });
        if (!findUser) return done(null, false);
        bcrypt.compare(password, findUser.password, (err, result) => {
            if (!result) return done(null, false);
            return done(null, findUser);
        })
    } catch (err) {
        console.log(err);
    }
}))


//google 驗證機制
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLR_CLIENT_PASSWORD,
    callbackURL: "/auth/google/redirect"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
            console.log("user exist");
            done(null, foundUser);
            console.log(profile);
        } else {
            new User({
                name: profile.displayName,
                googleID: profile.id,
                thumbnail: profile.photos[0].value,
                email: profile.emails[0].value
            }).save().then((newUser) => {
                console.log("new User Creat");
                done(null, newUser);
            })
        }
    })
}))