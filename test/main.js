const chai = require('chai');
const arrayObjs = require('./mockData.js');
const TableExport = require('../index.js');

describe('Main test', () => {
    const tableExport = new TableExport();
    it('should instantiate a instance of TableExport and check the parameters', () => {
        const encode = 'utf8';
        const delimiter = '-';
        const separator = '_';
        const newLine = '@';
        const buffer = new Buffer([0xfe, 0xff]);
        const customTableExport = new TableExport(encode, delimiter, separator, newLine, buffer);
        chai.expect(customTableExport.separator).to.be.equal(separator);
        chai.expect(customTableExport.delimiter).to.be.equal(delimiter);
        chai.expect(customTableExport.encode).to.be.equal(encode);
        chai.expect(customTableExport.newLine).to.be.equal(newLine);
        chai.expect(customTableExport.bom).to.be.equal(buffer);
    });
    it('should instantiate a instance of TableExport without a bom', () => {
        const encode = 'utf8';
        const delimiter = '-';
        const separator = '_';
        const newLine = '@';
        const customTableExport = new TableExport(encode, delimiter, separator, newLine);
        chai.expect(customTableExport.bom).to.not.exist;
    });
    it('should throw an error when try to instantiate a TableExport object with a wrong encode', () => {
        try {
            const encode = 'wrong_encode';
            const delimiter = '-';
            const separator = '_';
            const newLine = '@';
            const customTableExport = new TableExport(encode, delimiter, separator, newLine);
        } catch(e) {
            chai.expect(e).to.exist;
            chai.expect(e).to.be.a('string');
        }
    });
    it('should generate a csv with arrayObjs arranged in lines', () => {
        const tableCsvStr = tableExport.exportTableStringMappingObjectsToLines(arrayObjs.data);
        chai.assert.equal(tableCsvStr, arrayObjs.lineString);
    });
    it('should generate a csv with arrayObjs arranged in columns', () => {
        const tableCsvStr = tableExport.exportTableStringMappingObjectsToColumns(arrayObjs.data);
        chai.assert.equal(tableCsvStr, arrayObjs.columnString);
    });
    it('should throw an exception when an array of objects is not provided', () => {
        try {
            const tableCsvStr = tableExport.exportTableStringMappingObjectsToColumns([1, 2, 3]);
        } catch(e) {
            chai.expect(e).to.exist;
            chai.expect(e).to.be.a('string');
        }
    });
});