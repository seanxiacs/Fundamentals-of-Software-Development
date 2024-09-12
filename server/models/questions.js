// Question Document Schema


const mongoose = require('mongoose');
const Schema = mongoose.Schema

/*
  This is where we specify the format of the data we're going to put into
  the database.
*/
const questionSchema = new Schema(
    {
    title: {type: String, required: true},
    text: {type: String, required: true},
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }], // [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    asked_by: { type: String, required: true },
    ask_date_time: {type: Date, default: Date.now},
    views: {type: Number, default: 0},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    summary: {type: String, required: true},
    votes: {type: Number, default: 0},
    },
    {
        toJSON: { virtuals: true }, // Enable virtual properties in JSON output
        toObject: { virtuals: true }, // Enable virtual properties in regular objects
    }
);

// Define a virtual getter for the URL
questionSchema.virtual('url').get(function () {
    return `posts/questions/${this._id}`;
});

module.exports = mongoose.model('Question', questionSchema); //Question has to be uppercase for some reason?