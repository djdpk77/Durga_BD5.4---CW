const express = require("express");
const { resolve } = require("path");

const app = express();
let { sequelize } = require("./lib/index");
let { track } = require("./models/track.model");
const { user } = require("./models/user.model");

app.use(express.json());

let movieData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await track.bulkCreate(movieData);

    res.status(200).json({ message: "Database seeding successfull" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data", error: error.message });
  }
});

async function fetchAllTracks() {
  let tracks = await track.findAll();
  return { tracks };
}

app.get("/tracks", async (req, res) => {
  try {
    let response = await fetchAllTracks();

    if (response.tracks.length === 0) {
      return res.status(404).json({ message: "No tracks found." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addNewTrack(trackData) {
  let newTrack = await track.create(trackData);

  return { newTrack };
}

app.post("/tracks/new", async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let response = await addNewTrack(newTrack);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateTrackById(updatedTrackData, id) {
  let trackDetails = await track.findOne({ where: { id } });
  if (!trackDetails) {
    return {};
  }

  trackDetails.set(updatedTrackData);
  let updatedTrack = await trackDetails.save();

  return { message: "Track updated successfully", updatedTrack };
}

app.post("/tracks/update/:id", async (req, res) => {
  try {
    let newTrackData = req.body;
    let id = parseInt(req.params.id);

    let response = await updateTrackById(newTrackData, id);

    if (!response.message) {
      return res.status(404).json({ message: "Track not found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function deleteTrackById(id) {
  let destroyedTrack = await track.destroy({ where: { id } });

  if (destroyedTrack === 0) return {};

  return { message: "Track deleted successfully" };
}

app.post("/tracks/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);

    let response = await deleteTrackById(id);
    if (!response.message) {
      return res.status(404).json({ message: "Track not found" });
    }

    return res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function addNewUser(newUser) {
  let newData = await user.create(newUser);

  return { newData };
}

app.post("/users/new", async (req, res) => {
  try {
    let newUser = req.body.newUser;
    let response = await addNewUser(newUser);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateUserById(updatedUserData, id) {
  let userDetails = await user.findOne({ where: { id } });
  if (!userDetails) {
    return {};
  }

  userDetails.set(updatedUserData);
  let updatedUser = await userDetails.save();

  return { message: "User updated successfully", updatedUser };
}

app.post("/users/update/:id", async (req, res) => {
  try {
    let updatedUserData = req.body;
    let id = parseInt(req.params.id);

    let response = await updateUserById(updatedUserData, id);

    if (!response.message) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
