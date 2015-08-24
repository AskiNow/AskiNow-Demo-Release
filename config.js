
// connection to MongoDB database

module.exports = {
    "development" : {
        'mongodb': 'mongodb://vincent:foobar@127.0.0.1/test'
    },
    "production": {
        'mongodb': 'mongodb://heroku:foobar123@candidate.21.mongolayer.com:10963,candidate.20.mongolayer.com:11171/askinow-test?replicaSet=set-55da58c366834562f30008dc'
    },
    'secret': 'vincenthelloworld'
};
