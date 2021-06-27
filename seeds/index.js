/** @format */

const mongoose = require("mongoose");
const Heritage = require("../models/heritage");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

mongoose.connect("mongodb://localhost:27017/sanctum", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Db connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Heritage.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const site = new Heritage({
      author: "60216ba6e16ad1e95b441c3f",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Ea ad elit excepteur proident. Esse duis tempor laboris laboris laborum quis exercitation ut laboris amet elit tempor. Proident eiusmod voluptate veniam veniam eiusmod sunt sit Lorem velit duis veniam magna. Lorem veniam excepteur reprehenderit aliquip Lorem ullamco Lorem nisi ipsum aute. Elit exercitation et amet non ad ipsum ullamco exercitation non laborum.Sit excepteur magna duis aute laboris incididunt sint sunt elit. Deserunt dolore velit aliqua aliquip dolor officia esse eiusmod sunt in irure in dolore. Velit sit enim mollit aliquip Lorem nostrud incididunt officia laboris dolor reprehenderit id dolor cillum. Sunt commodo esse elit irure mollit incididunt aliqua. Velit irure anim amet ex in ad.",
      images: [
        {
          url:
            "https://res.cloudinary.com/snazzycave/image/upload/v1617739121/Sanctum/d9i405rw6s0s83sfolwl.jpg",
          filename: "Sanctum/d9i405rw6s0s83sfolwl",
        },
      ],
    });
    await site.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
