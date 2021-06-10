const mongoose = require("mongoose");;

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>console.log("connection successfully.."))
.catch(err=>console.log(err));