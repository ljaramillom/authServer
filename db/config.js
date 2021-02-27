const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('<< db online >>');
    } catch (error) {
        console.log(error);
        throw new Error('<< error db >>')
    }
}

module.exports = {
    dbConnection
}