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


exports.getStores = async (req, res) => {
    // 1. Query the database for a list of all stores
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores});
}

exports.editStore = async (req, res) => {
    // 1. find store with givin id
    // 2. confirm they are the owner of the store
    // 3. render out the edit form so the user can update their store
    const store = await Store.findOne({ _id: req.params.id });
    res.render('editStore', { title: `Edit ${store.name}`, store });
}

exports.updateStore = async (req, res) => {
    // find and update store
    // redirect to store and tell them it worked
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of old one
        runValidators: true // force model to run validators
    }).exec();    // mongodb method

    req.flash('success', `Successfully update ${store.name}. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store.id}/edit`);
}
