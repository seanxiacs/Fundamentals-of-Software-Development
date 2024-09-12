// Account Document Schema


const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
  This is where we specify the format of the data we're going to put into
  the database.
*/
const accountSchema = new Schema(
    {
    username: { type: String, required: true },
    email: { type: String, required: true }, //Account name (email)
    secretPassword: { type: String, required: true },
    created_date_time: { type: Date, default: Date.now },
    reputation: {type: Number, default: 0},
    isAdmin: {type: Boolean, default: false},
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

accountSchema.virtual('url').get(function () {
    return `posts/accounts/${this._id}`;
});

module.exports = mongoose.model('Account', accountSchema)

