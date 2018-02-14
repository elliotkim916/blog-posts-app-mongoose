exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://elliotkim916:strymontimeline1004@ds133557.mlab.com:33557/blog-posts'
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blog-posts';
exports.PORT = process.env.PORT || 8080;