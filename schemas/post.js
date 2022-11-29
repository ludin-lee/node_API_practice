const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
  ,
},{ timestamps: true });


// postSchema.virtual('postId').get(function(){
//   return this._id
// });

// // Ensure virtual fields are serialised.  REF
// postSchema.set('toJSON', {
//   virtuals: true
// });


module.exports = mongoose.model("Post", postSchema);
