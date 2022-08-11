const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

// Create New Movie

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json("sorry" + err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Update Movie

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(201).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Delete Movie

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(201).json("movie has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Get All Movie

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const limit = 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const movies = await Movie.find().skip(offset).limit(limit);
      const moviesCount = await Movie.count();
      const totalPages = Math.ceil(moviesCount / limit);
      res.status(201).json({
        data: movies,
        paging: {
          totalMovies: moviesCount,
          currentPage: page,
          totalPages: totalPages,
        },
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("Not Allowed!!");
  }
});

// Get Movie

router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Random Movie

router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true, year: "2022" } },
        { $sample: { size: 5 } },
      ]);
    } else if (type === "movies") {
      movie = await Movie.aggregate([
        { $match: { isSeries: false, year: "2022" } },
        { $sample: { size: 5 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { year: "2022" } },
        { $sample: { size: 5 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Movies By Genre

router.get("/filter", verify, async (req, res) => {
  const searchTxt = new RegExp(req.query.search, "i");
  const type = req.query.type;
  const genre =
    req.query.genre &&
    req.query.genre[0].toUpperCase() + req.query.genre.slice(1).toLowerCase();

  let filter = { isSeries: type == "series" ? true : false };
  // if (genre) {
  //   filter.genre = genre;
  // }
  genre && (filter.genre = genre);
  searchTxt && (filter.title = searchTxt);

  // pagination
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  let movies;
  try {
    movies = await Movie.aggregate([
      { $match: filter },
      { $skip: offset },
      { $limit: limit },
    ]);
    moviesCount = await Movie.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$isSeries",
          count: { $sum: 1 },
        },
      },
    ]);
    const totalPages =
      moviesCount.length !== 0 && Math.ceil(moviesCount[0].count / limit);

    if (movies.length !== 0) {
      res.status(200).json({
        data: movies,
        paging: {
          totalMovies: moviesCount[0].count,
          currentPage: page,
          totalPages: totalPages,
        },
      });
    } else {
      res.status(200).json({ data: [] });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
