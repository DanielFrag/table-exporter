const encoding = require('encoding');
const iconvLite = require('iconv-lite');

class TableExport {
    constructor(config) {
        const tableSettings = {};
        this.getEncode = () => {
            return tableSettings.encode;
        };
        this.setEncode = (encode) => {
            if (!(typeof encode == 'string' && iconvLite.encodingExists(encode))) {
                throw 'Error, check the suported encoding in iconv-lite';
            } else {
                tableSettings.encode = encode;
            }
        };
        this.getDelimiter = () => {
            return tableSettings.delimiter;
        };
        this.setSpecialMarks = (delimiter, separator, newLine) => {
            if (typeof delimiter != 'string' || typeof separator != 'string' || typeof newLine != 'string') {
                throw 'the typeof delimiter, separator and newLine must be string';
            }
            tableSettings.delimiter = delimiter;
            tableSettings.separator = separator;
            tableSettings.newLine = newLine;
        };
        this.getSpecialMarks = () => {
            return {
                delimiter: tableSettings.delimiter,
                separator: tableSettings.separator,
                newLine: tableSettings.newLine
            }
        };
        this.setTableData = (arrayOfObjects) => {
            if (TableExport.isArrayOfObjects(arrayOfObjects)) {
                tableSettings.tableData = arrayOfObjects;
            } else {
                throw 'Expected an array of objects';
            }
        };
        this.appendObjectsToTableData = (arrayOfObjects) => {
            if (TableExport.isArrayOfObjects(arrayOfObjects)) {
                tableSettings.tableData.push(...arrayOfObjects);
            } else {
                throw 'Append expected an array of objects';
            }

        };
        this.getTableData = () => {
            return tableSettings.tableData;
        };
        this.setBOM = (bom) => {
            if (!(bom instanceof Buffer)) {
                throw 'Expected an instance of Buffer';
            }
            tableSettings.bom = bom;
        }
        this.getBOM = () => {
            return tableSettings.bom;
        };
        if (config) {
            this.setEncode(config.encode || 'utf16-le');
            this.setSpecialMarks(config.delimiter || '\"', config.separator || ';', config.newLine || '\n');
            if (config.tableData) {
                this.setTableData(config.tableData);
            }
            if (config.bom) {
                if (!(config.bom instanceof Buffer)) {
                    this.setBOM(new Buffer([0xff, 0xfe]));
                } else {
                    this.setBOM(config.bom);
                }
            }
        } else {
            Object.assign(tableSettings, {
                encode: 'utf16-le',
                delimiter: '\"',
                separator: ';',
                newLine: '\n',
                tableData: []
            });
        }
    }
    static isArrayOfObjects(arrayOfObjects) {
        if (!Array.isArray(arrayOfObjects) || !arrayOfObjects[0]) {
            return false;
        }
        arrayOfObjects.forEach(obj => {
            if (typeof obj != 'object') {
                return false;
            }
        });
        return true;
    }
    static objectToTableLine(obj, delimiter, separator) {
        try {
            if (!typeof delimiter == 'string' || !typeof separator == 'string') {
                throw 'the type of delimiter and separator must be a string';
            }
            return Object
                .keys(obj)
                .map(key => delimiter + obj[key] + delimiter)
                .join(separator? separator: '');
        } catch(e) {
            throw 'Convert object to table line error: ' + e;
        }
    }
    static generateTableString(arrayOfObjects, specialMarks) {
        try {
            const strArray = arrayOfObjects.map(obj => {
                return TableExport.objectToTableLine(obj, specialMarks.delimiter, specialMarks.separator);
            });
            return strArray.reduce((srtTable, strLine) => {
                return srtTable + specialMarks.newLine + strLine;
            });
        } catch(e) {
            throw 'Generate table error: ' + e;
        }
    }
    static exportStringToEncodedBuffer(str, encode, bom) {
        try {
            const buffer = encoding.convert(str, encode);
            if (bom) {
                return Buffer.concat([bom, buffer]);
            } else {
                return buffer;
            }
        } catch(e) {
            throw 'Export string to encoded buffer error: ' + e;
        }
    }
    stringMapObjectsToLines() {
        try {
            const specialMarks = this.getSpecialMarks();
            const tableData = this.getTableData();
            return TableExport.generateTableString(tableData, specialMarks);
        } catch(e) {
            throw 'String mapping objects to lines error: ' + e;
        }
    }
    stringMapObjectsToColumns() {
        try {
            const tableData = this.getTableData(); 
            const arrayKeys = [];
            let previousObj = tableData[0];
            let previousObjKeys = Object.keys(previousObj);
            tableData.forEach(obj => {
                const currentObjKeys = Object.keys(obj);
                arrayKeys.push(currentObjKeys);
                if (previousObjKeys.length < currentObjKeys.length) {
                    previousObj = obj;
                }
            });
            const yMaxSize = previousObjKeys.length;
            const xMaxSize = tableData.length;
            const columnArrayOfObjects = []
            for (let i = 0; i < yMaxSize; i++) {
                const obj = {};
                for (let j = 0; j < xMaxSize; j++) {
                    const data = tableData[j][arrayKeys[j][i]]? tableData[j][arrayKeys[j][i]]: '';
                    obj[i + '_' + j ] = data;
                }
                columnArrayOfObjects.push(obj);
            }
            return TableExport.generateTableString(columnArrayOfObjects, this.getSpecialMarks());
        } catch(e) {
            throw 'String mapping objects to columns error: ' + e;
        }
    }
    bufferMapObjectsToLines() {
        try {
            const tableString = this.stringMapObjectsToLines(this.getTableData());
            return this.exportStringToEncodedBuffer(tableString, this.getEncode(), this.getBOM());
        } catch(e) {
            throw 'Buffer mapping objects to lines error: ' + e;
        }
    }
    bufferMapObjectsToColumns(arrayOfObjects) {
        try {
            const tableString = this.stringMapObjectsToColumns(this.getTableData());
            return this.exportStringToEncodedBuffer(tableString, this.getEncode(), this.getBOM());
        } catch(e) {
            throw 'Buffer mapping objects to columns error: ' + e;
        }
    }
}

module.exports = TableExport;