const chai = require('chai');
const arrayObjs = require('./mockData.js');
const TableExport = require('../index.js');

describe('Main test', () => {
    const tableExport = new TableExport();
    it('should instantiate a instance of TableExport and check the parameters', () => {
        const config = {
            encode: 'utf8',
            delimiter: '-',
            separator: '_',
            newLine: '@',
            bom: new Buffer([0xfe, 0xff])
        };
        const customTableExport = new TableExport(config);
        const specialMarks = customTableExport.getSpecialMarks();
        chai.expect(specialMarks.separator).to.be.equal(config.separator);
        chai.expect(specialMarks.delimiter).to.be.equal(config.delimiter);
        chai.expect(customTableExport.getEncode()).to.be.equal(config.encode);
        chai.expect(specialMarks.newLine).to.be.equal(config.newLine);
        chai.expect(customTableExport.getBOM()).to.be.equal(config.bom);
    });
    it('should instantiate a instance of TableExport without a bom', () => {
        const config = {
            encode: 'utf8',
            delimiter: '-',
            separator: '_',
            newLine: '@'
        };
        const customTableExport = new TableExport(config);
        chai.expect(customTableExport.getBOM()).to.not.exist;
    });
    it('should throw an error when try to instantiate a TableExport object with a wrong encode', () => {
        try {
            const config = {
                encode: 'wrong_encode',
                delimiter: '-',
                separator: '_',
                newLine: '@'
            };
            const customTableExport = new TableExport(config);
        } catch(e) {
            chai.expect(e).to.exist;
            chai.expect(e).to.be.a('string');
        }
    });
    it('should throw an error when the table data is not defined', () => {
        try {
            tableExport.stringMapObjectsToLines();
        } catch(e) {
            chai.expect(e).to.exist;
            chai.expect(e).to.be.a('string');
            tableExport.setTableData(arrayObjs.data);
        }
    });
    it('should generate a csv with arrayObjs arranged in lines', () => {
        const tableCsvStr = tableExport.stringMapObjectsToLines();
        chai.assert.equal(tableCsvStr, arrayObjs.lineString);
    });
    it('should generate a csv with arrayObjs arranged in columns', () => {
        const tableCsvStr = tableExport.stringMapObjectsToColumns();
        chai.assert.equal(tableCsvStr, arrayObjs.columnString);
    });
});