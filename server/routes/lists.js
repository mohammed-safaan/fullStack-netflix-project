const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

// Create New List

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);

    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Update List

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(201).json(updatedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Delete List

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("list has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Get Lists

router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $match: { type: typeQuery, genre: genreQuery } },
          { $sample: { size: 10 } },
        ]);
      } else {
        list = await List.aggregate([
          { $match: { type: typeQuery } },
          { $sample: { size: 10 } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Specific List

router.get("/:id", verify, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
