const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Ket noi den MongoDB thanh cong!');
    } catch(error) {
        console.error('Ket noi den MongoDB that bai: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;