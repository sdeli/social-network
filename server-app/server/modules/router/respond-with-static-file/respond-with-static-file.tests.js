const fs = require('fs');
const path = require('path');

var {assert, expect} = require('chai');
const rewire = require("rewire");
const sinon = require("sinon");

const {getFilesFromFolder} = require('../../server-utils/utils.js');

let staticFilesPathArr = getFilesFromFolder('../../../public/');
let pagesPathesArr = [
                '../views/home.ejs', 
                '../views/about.ejs', 
                '../views/contac.ejs'
            ];

const pathTo404Page = '../../views/404.html';

describe('MODULE: respond with file module', function() {
    describe('FUNCTION: getContentType', function() {
        const {getContentType} = require('./respond-with-static-file.js');

        var mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        }

        function shouldReturnContentTypeToAStaticFile(){
            it('should return content type to a static file', function() {
                let contentType = getContentType(`/advert.${extension}`);
                expect(contentType).to.be.equal(mimeTypes[extension]);
            });
        }
        
        for (extension in mimeTypes) {
                shouldReturnContentTypeToAStaticFile()
        }
    });

    describe('FUNCTION: respondWithStaticFile - serving pages', function() {
        const testedModule = rewire('./respond-with-static-file.js');

        let sendStaticFile = sinon.spy();
        let res = {
            writeHead : sinon.spy()
        }

        testedModule.__set__('sendStaticFile', sendStaticFile);
        let {respondWithStaticFile} = testedModule;

        let pagesPathesArr = [
                '../views/home.ejs', 
                '../views/about.ejs', 
                '../views/contac.ejs'
            ];
        let statusCodeTest = 200;
        let optsTest = {contentType : 'text/html'};

        function ItShouldCall_sendStaticFile_withCorrectParamters(i) {
            it('it should send pages with correct paramters', function() {
                respondWithStaticFile(res, pagesPathesArr[i], optsTest);

                assert.isAbove(sendStaticFile.callCount, 0, 'sendStaticFile.callcount is less then 1');

                let args = sendStaticFile.args[0];
                var filePathInSpy = args[1];
                assert.equal(filePathInSpy, pagesPathesArr[0], `filePathInSpy is: ${filePathInSpy} but should be: ${pagesPathesArr[0]}`);

                let writeHeadArgs = args[0].writeHead.args[0];
                var statusCodeInSpy = writeHeadArgs[0]
                assert.equal(statusCodeInSpy, statusCodeTest, `statusCodeInSpy is: ${statusCodeTest} but should be: ${statusCodeTest}`);

                var ContentTypeInSpy = writeHeadArgs[1]['Content-Type'];
                assert.equal(ContentTypeInSpy, optsTest.contentType, `ContentTypeInSpy is: ${ContentTypeInSpy} but should be: ${optsTest.contentType}`);
            });
        }

        for (let i = 0; i < pagesPathesArr.length; i++) {
            ItShouldCall_sendStaticFile_withCorrectParamters(i);
        }
    });

    describe('FUNCTION: respondWithStaticFile - serving static files', function() {
        const testedModule = rewire('./respond-with-static-file.js');

        let sendStaticFile = sinon.spy();
        let res = {
            writeHead : sinon.spy()
        }

        testedModule.__set__('sendStaticFile', sendStaticFile);

        let {respondWithStaticFile} = testedModule;
        let statusCodeTest = 200;

        function ItShouldCall_sendStaticFile_withCorrectParamters(i) {
            it('it should send static files with correct paramters', function() {
                respondWithStaticFile(res, staticFilesPathArr[i]);

                assert.isAbove(sendStaticFile.callCount, 0, 'sendStaticFile.callcount is less then 1');

                let args = sendStaticFile.args[0];
                var staticFilePathInSpy = args[1];
                assert.equal(staticFilePathInSpy, staticFilesPathArr[0], `filePathInSpy is: ${staticFilePathInSpy} but should be: ${staticFilesPathArr[0]}`);

                let writeHeadArgs = args[0].writeHead.args[0];
                var statusCodeInSpy = writeHeadArgs[0]
                assert.equal(statusCodeInSpy, statusCodeTest, `statusCodeInSpy is: ${statusCodeTest} but should be: ${statusCodeTest}`);

            });
        }

        for (let i = 0; i < staticFilesPathArr.length; i++) {
            ItShouldCall_sendStaticFile_withCorrectParamters(i);
        }
    });
});