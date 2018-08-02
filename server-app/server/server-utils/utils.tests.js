var {assert} = require('chai');
const rewire = require("rewire");
const sinon = require("sinon");

const {trimmPath} = require('./utils.js')


describe('utils.js - tests', function() {
  describe('#trimmPath(path)', function() {
    let testCases = [
        // [0] request-path [1] expected-output
        ['/about/', 'about'],
        ['/about', 'about'],
        ['/about/jake/', 'about/jake'],
        ['/about/jake', 'about/jake'],
        ['/about/john/', 'about/john'],
        ['/about/john', 'about/john'],
        ['/contact/', 'contact'],
        ['/contact', 'contact'],
        ['/', '/'],
        ['', '/']
    ]

    function shouldRemoveTrailingSlashesCorrectly(i) {
        it('should remove trailing / es from beginning and end of path', function() {
            let pathToTrim = testCases[i][0];
            let expectedOutput = testCases[i][1];

            let trimmedPath = trimmPath(pathToTrim);

            assert.equal(trimmedPath, expectedOutput);
        });
    }

    for(let i = 0; i < testCases.length; i++) {
        shouldRemoveTrailingSlashesCorrectly(i);
    }

  });

  describe('#trimmPath(path)', function() {
    

    it('should remove trailing / es from beginning and end of path', function() {
        let pathToTrim = testCases[i][0];
        let expectedOutput = testCases[i][1];

        let trimmedPath = trimmPath(pathToTrim);

        assert.equal(trimmedPath, expectedOutput);
    });

    for(let i = 0; i < testCases.length; i++) {
        shouldRemoveTrailingSlashesCorrectly(i);
    }

  });
});