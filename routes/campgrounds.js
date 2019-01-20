var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user })
        }
    });
});


router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: description, author: author, price: price };
    Campground.create(newCampground, function(err, newCamp) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newCamp);
            res.redirect("/");

        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");

});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {

            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            }

            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {

        if (!foundCampground) {
            return res.status(400).send("Item not found.")
        }

        res.render("campgrounds/edit", { campground: foundCampground });

    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});



module.exports = router;
