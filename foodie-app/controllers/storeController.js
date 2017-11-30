const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index'); // index is the view we are using
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add storesss'});
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next(); //skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

exports.createStore = async (req, res) => {
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};


exports.getStores = async (req, res) => {
    // 1. Query the database for a list of all stores
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores});
};

const confirmOwner = (store, user) => {
    if (!store.author.equals(user.id)) {
        throw Error('You must own a store in order to edit it.')
    }
};

exports.editStore = async (req, res) => {
    // 1. find store with givin id
    const store = await Store.findOne({ _id: req.params.id });
    // 2. confirm they are the owner of the store
    confirmOwner(store, req.user);
    // 3. render out the edit form so the user can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
    req.body.location.type = 'Point';
    // find and update store
    // redirect to store and tell them it worked
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of old one
        runValidators: true // force model to run validators
    }).exec();    // mongodb method

    req.flash('success', `Successfully update ${store.name}. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store.id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
    // res.send('it worls');
    const store = await Store.findOne({ slug: req.params.slug }).populate('author');
    // res.json(store);
    res.render( 'store', { store, title: store.name })
    if (!store) return next();
}

exports.getStoresByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };

    const tagPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagPromise, storesPromise]);
    // const tags = await Store.getTagsList();
    res.render('tag', { tags, title: 'Tags', tag, stores });
};

exports.searchStores = async (req, res) => {
    const stores = await Store.find({
        $text: {
            $search: req.query.q            
        } 
    }, {
        score: { $meta: 'textScore' }
    })
    // sort the items
    .sort({
        score: { $meta: 'textScore' }
    })
    .limit(5);
    res.json(stores);
};

exports.mapStores = async (req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 //10km
            }
        }
    }

    const stores = await Store.find(q).select('slug name description location photo').limit(10);
    res.json(stores);
};

exports.mapPage = (req, res) => {
    res.render('map', { title: 'Map' });
};