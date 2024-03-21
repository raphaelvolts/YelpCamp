const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        if (i < 25) {
            user = '65799dc0923be23d0fb1e4a7';
        } else {
            user = '6579cf75b21fe9b79b4da92e';
        }
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni, dolores quaerat reprehenderit odio dignissimos veritatis adipisci ducimus voluptatibus et totam error modi consequuntur sequi expedita unde reiciendis similique officiis iste!',
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dei8hlvch/image/upload/v1702915269/YelpCamp/p4apoej15xsxjafe1wqq.jpg",
                    filename: "YelpCamp/p4apoej15xsxjafe1wqq",
                },
                {
                    url: "https://res.cloudinary.com/dei8hlvch/image/upload/v1702915269/YelpCamp/dee2gb0rmbizwiwtpqez.jpg",
                    filename: "YelpCamp/dee2gb0rmbizwiwtpqez",
                },
                {
                    url: "https://res.cloudinary.com/dei8hlvch/image/upload/v1702915269/YelpCamp/vtotcumk8p13hjdqnpjx.jpg",
                    filename: "YelpCamp/vtotcumk8p13hjdqnpjx",
                }
            ],
            author: user
        });
        await camp.save();

    }
}

seedDB().then(() => {
    mongoose.connection.close();
})