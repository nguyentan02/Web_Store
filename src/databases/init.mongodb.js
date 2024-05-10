
const mongoose = require('mongoose')

async function connet() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/Stores', {

        });
        console.log('Succesfully');
    } catch (error) {
        console.log("error");
    }
}

module.exports = { connet }