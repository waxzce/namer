var should = require('should'),
    namer = require('../lib/namer.js')


describe('namer', function () {
    before(function () {

    })
    it('should be awesome', function(){
        namer.awesome().should.eql('awesome')
    })
})