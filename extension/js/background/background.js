console.log('I\'m in the background!');

bongo.db({
    name: 'test',
    objectStores: {
        user: ['username', 'password', 'token'],
        sites: ['domain', 'account']
    }
});
