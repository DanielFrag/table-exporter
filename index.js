const encoding = require('encoding');
const iconvLite = require('iconv-lite');

class TableExport {
    /**
    * Instantiate a TableExport object
    * @param {Object} config
    * @return {Object}
    */
    constructor(config) {
        const tableSettings = {};
        /**
         * @return {string}
         */
        this.getEncode = () => {
            return tableSettings.encode;
        };
        /**
         * @param {string} encode
         */
        this.setEncode = (encode) => {
            if (!(typeof encode == 'string' && iconvLite.encodingExists(encode))) {
                throw 'Error, check the suported encoding in iconv-lite';
            } else {
                tableSettings.encode = encode;
            }
        };
        /**
         * @param {string} delimiter
         * @param {string} separator
         * @param {string} newLine
         */
        this.setSpecialMarks = (delimiter, separator, newLine) => {
            if (typeof delimiter != 'string' || typeof separator != 'string' || typeof newLine != 'string') {
                throw 'the typeof delimiter, separator and newLine must be string';
            }
            tableSettings.delimiter = delimiter;
            tableSettings.separator = separator;
            tableSettings.newLine = newLine;
        };
        /**
         * Get the special marks used to encapsulate the set of values 
         * @return {Object}
         */
        this.getSpecialMarks = () => {
            return {
                delimiter: tableSettings.delimiter,
                separator: tableSettings.separator,
                newLine: tableSettings.newLine
            }
        };
        /**
         * @param {Array} arrayOfObjects
         */
        this.setTableData = (arrayOfObjects) => {
            if (!TableExport.isArrayOfObjects(arrayOfObjects)) {
                throw 'Expected an array of objects';
            }
            tableSettings.tableData = [];
            tableSettings.tableData.push(...arrayOfObjects);
        };
        /**
         * @param {Array} arrayOfObjects
         */
        this.appendObjectsToTableData = (arrayOfObjects) => {
            if (!TableExport.isArrayOfObjects(arrayOfObjects)) {
                throw 'Append expected an array of objects';
            }
            tableSettings.tableData.push(...arrayOfObjects);
        };
        /**
         * @return {Array}
         */
        this.getTableData = () => {
            return tableSettings.tableData;
        };
        /**
         * @param {Buffer} bom
         */
        this.setBOM = (bom) => {
            if (!(bom instanceof Buffer)) {
                throw 'Expected an instance of Buffer';
            }
            tableSettings.bom = bom;
        }
        /**
         * @return {Buffer}
         */
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
    /**
     * Check if the arrayOfObjects is an array of objects
     * @param {any} arrayOfObjects
     * @return {boolean}
     */
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
    /**
     * Arrange the object's values in a string, using a delimiter to encapsulate values and the separator to detach them
     * @param {Object} obj
     * @param {string} delimiter
     * @param {string} separator
     * @return {string} 
     */
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
    /**
     * Generate a string that use special marks to encapsulate the objects and their values.
     * The specialMarks must contain the following propoerties: delimiter, separator and newLine.
     * Each one must be a different string.
     * @param {Array} arrayOfObjects
     * @param {Object} specialMarks
     * @return {string}
     */
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
    /**
     * Encode the given string in a buffer and, if provided, set the byte mark order (BOM)
     * @param {string} str
     * @param {string} encode
     * @param {Buffer} bom
     * @return {Buffer}
     */
    static exportStringToEncodedBuffer(str, encode, bom) {
        try {
            if (!iconvLite.encodingExists(encode)) {
                throw 'Encode is not suported';
            }
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
    /**
     * Arrange the data storaged in a string, that use special marks to encapsulate the values of the objects by object.
     * @return {string}
     */
    stringMapObjectsToLines() {
        try {
            const specialMarks = this.getSpecialMarks();
            const tableData = this.getTableData();
            return TableExport.generateTableString(tableData, specialMarks);
        } catch(e) {
            throw 'String mapping objects to lines error: ' + e;
        }
    }
    /**
     * Arrange the data storaged in a string, that use special marks to encapsulate the values of the objects by his position in the object.
     * @return {string}
     */
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
    /**
     * Arrange the data storaged in a string, that use special marks to encapsulate the values of the objects by object order.
     * @return {Buffer}
     */
    bufferMapObjectsToLines() {
        try {
            const tableString = this.stringMapObjectsToLines(this.getTableData());
            return TableExport.exportStringToEncodedBuffer(tableString, this.getEncode(), this.getBOM());
        } catch(e) {
            throw 'Buffer mapping objects to lines error: ' + e;
        }
    }
    /**
     * Arrange the data storaged in a string, that use special marks to encapsulate the values of the objects by his position in the object.
     * @return {Buffer}
     */
    bufferMapObjectsToColumns() {
        try {
            const tableString = this.stringMapObjectsToColumns(this.getTableData());
            return TableExport.exportStringToEncodedBuffer(tableString, this.getEncode(), this.getBOM());
        } catch(e) {
            throw 'Buffer mapping objects to columns error: ' + e;
        }
    }
}

module.exports = TableExport;