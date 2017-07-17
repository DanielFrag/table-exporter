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
        }
    });
    it('should set the table data', () => {
        tableExport.setTableData(arrayObjs.data);
        chai.expect(tableExport.getTableData().length).to.be.equal(arrayObjs.data.length);
    });
    it('should generate a csv with arrayObjs arranged in lines', () => {
        const tableCsvStr = tableExport.stringMapObjectsToLines();
        chai.assert.equal(tableCsvStr, arrayObjs.lineString);
    });
    it('should generate a csv with arrayObjs arranged in columns', () => {
        const tableCsvStr = tableExport.stringMapObjectsToColumns();
        chai.assert.equal(tableCsvStr, arrayObjs.columnString);
    });
    it('should append new data to TableExport instance', () => {
        tableExport.appendObjectsToTableData(arrayObjs.append);
        chai.expect(tableExport.getTableData().length).to.be.equal(arrayObjs.data.length + arrayObjs.append.length);
    });
    it('should set new data and generate each table modes (string and buffer by line and columns)', () => {
        tableExport.setTableData([{
            column1: 'o1k1',
            column2: 'o1k2'
        }, {
            column1: 'o2k1',
            column2: 'o2k2'
        }]);
        //strings
        const tableLineStr = tableExport.stringMapObjectsToLines();
        chai.expect(tableLineStr).to.be.equal('"o1k1";"o1k2"\n"o2k1";"o2k2"');
        const tableColumnStr = tableExport.stringMapObjectsToColumns();
        chai.expect(tableColumnStr).to.be.equal('"o1k1";"o2k1"\n"o1k2";"o2k2"');
        //buffers
        const tableLineBuffer = tableExport.bufferMapObjectsToLines();
        const tableColumnBuffer = tableExport.bufferMapObjectsToColumns();
        chai.expect(tableLineBuffer).to.not.equal(tableColumnBuffer);
    });
});