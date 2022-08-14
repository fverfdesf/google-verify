const router = require('express').Router();
const Post = require('../models/postSchema');

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/please");
    }
    let postFound = await Post.find({ author: req.user._id });
    return res.render('profile', { user: req.user, posts: postFound });
})

router.get('/post', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/please");
    }
    res.render('post', { user: req.user })
})

router.post('/post', (req, res) => {
    let { title, content } = req.body;
    const newPost = new Post({
        title: title,
        content: content,
        author: req.user._id
    })
    newPost.save()
        .then(() => {
            res.status(200).redirect('/profile');
        })
        .catch((err) => {
            req.flash('error_message', '欄位不能為空');
            res.redirect('/profile/post')
        })
})
module.exports = router;