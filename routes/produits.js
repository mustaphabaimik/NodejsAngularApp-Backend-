const express = require('express');
const router = express.Router();
const {database}=require("../config/db");


/* method getall() */
router.get('/', function (req, res) {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;     // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }
    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    nbr: prods.length,
                    produits: prods
                });
            } else {
                res.json({message: "Aucun produits trouvé"});
            }
        })
        .catch(err => console.log(err));
});

//method get one
router.get('/:idProduit', (req, res) => {
    let idProd = req.params.idProduit;

    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id',
            'p.images'
        ])
        .filter({'p.id': idProd})
        .get()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({message: `Aucun produit ne correspond à ce produit. ${productId}`});
            }
        }).catch(err => res.json(err));
});

// produit par categorie
router.get('/categorie/:cattitre', (req, res) => {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }


    const titre_cat = req.params.cattitre;

    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id WHERE c.title LIKE '%${titre_cat}%'`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: 1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: `Aucun produit trouvé dans cette categorié ${cat_title}`});
            }
        }).catch(err => res.json(err));

});


module.exports = router;
