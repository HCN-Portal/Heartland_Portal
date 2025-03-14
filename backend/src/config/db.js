const mongoose = require('mongoose')

module.exports.dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DB_URL,{useNewURLParser: true, useUnifiedTopology: true})
        console.log('Database connected')
    }
    catch (err) {
      console.error('MongoDB Connection Error:', err.message);
      process.exit(1);
    }
}
