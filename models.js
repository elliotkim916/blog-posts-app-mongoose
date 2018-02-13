const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: String,
    author: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    }
});

blogPostSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim()});

blogPostSchema.methods.serialize = function() {
    return {
        title: this.title,
        content: this.content,
        author: this.authorName
    };
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};