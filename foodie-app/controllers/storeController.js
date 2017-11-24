const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index'); // index is the view we are using
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add storesss'});
};

exports.createStore = async (req, res) => {
    // res.json(req.body);
    const store = new Store(req.body);
    await store.save();
    res.redirect('/');
    // store
    //     .save() // fires connection with mongo db
    //     .then(store => {
    //         res.render('storeList', )
    //     })
    //     .catch(err => {
    //         throw Error(err);
    //     })
};