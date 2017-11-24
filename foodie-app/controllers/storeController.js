exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index'); // index is the view we are using
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add storesss'});
};

exports.createStore = (req, res) => {
    res.json(req.body);
};