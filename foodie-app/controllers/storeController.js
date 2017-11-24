const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index'); // index is the view we are using
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add storesss'});
};

exports.createStore = async (req, res) => {
    // res.json(req.body);
    const store = await (new Store(req.body)).save();
    // await store.save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
    // store
    //     .save() // fires connection with mongo db
    //     .then(store => {
    //         res.render('storeList', )
    //     })
    //     .catch(err => {
    //         throw Error(err);
    //     })
};