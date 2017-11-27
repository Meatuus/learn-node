const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

const { catchErrors } = require('../handlers/errorHandlers');


// router.get('/', (req, res) => {
//   const turtle = {
//     name: "T",
//     age: 30,
//     location: "Aus"
//   }
//   // res.send('Hey! It works!');
//   // res.json(turtle);
//   // res.json(req.query.name); //this grabs info from url query and displays
//   res.render('hello', {
//     name: 'test',
//     dog: req.query.dog,
//     title: 'example-title'
//   }); // redner allows us to render a template - in our views
// });

// router.get('/reverse/:name', (req, res) => {
//   // res.send('it works!');
//   const reverse = [...req.params.name].reverse().join("");
//   // res.send(req.params.name) // params takes name from url (: in front means it can change)
//   res.send(reverse);
// })



router.get('/', catchErrors(storeController.getStores)); // call controller to render logic commented out below
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);

router.post('/add', 
  storeController.upload, 
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
); //how to catch errors with async await - wrap function
router.post('/add/:id', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

module.exports = router;
