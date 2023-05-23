// To connect with your mongoDB database
const mongoose = require('mongoose');

// constatns
const ConnectionString = 'mongodb://localhost:27017/';
const DatabaseName = 'LocalDatabase';
const CollectionName = 'formdatas';

mongoose.connect(ConnectionString, {
    dbName: DatabaseName,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) :
    console.log('Connected to yourDB-name database'));

// Schema for FormDataScheme of app
const FormDataScheme = new mongoose.Schema({
    htmlJson: {
        type: String,
        required: false
    },
    formData: {
        type: String,
        required: false
    }
});

const FormData = mongoose.model(CollectionName, FormDataScheme);
FormData.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});


app.post("/save", async (req, resp) => {
    console.log('register method called')
    try {
        const formData = new FormData(req.body);
        let result = await formData.save();
        result = result.toObject();
        if (result) {
            resp.send(req.body);
            console.log(result);
        }

    } catch (e) {
        resp.send("Error: ", e);
    }
});

app.listen(5000);
