const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: String,
    author: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim()});

blogPostSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName,
        created: this.created
    };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};