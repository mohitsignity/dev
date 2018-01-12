// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:4000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:4000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '146747299181-0quu2di0pphc0h2bc2iom6laqqvnjn8e.apps.googleusercontent.com',
        'clientSecret'  : '0kmC0P3NcDwNLRLWe0wvzrUS',
        'callbackURL'   : 'http://localhost:4000/auth/google/callback'
    }

};
