const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGODB_URI = 'mongodb+srv://khanhtoshiro1503:xz16tbc657VnRBE5@cluster.j86ol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster'
        await mongoose.connect(MONGODB_URI);
        console.log('Ket noi den MongoDB thanh cong!');
    } catch(error) {
        console.error('Ket noi den MongoDB that bai: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;