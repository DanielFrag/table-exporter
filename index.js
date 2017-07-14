const encoding = require('encoding');
const iconvLite = require('iconv-lite');
class TableExport {
    constructor(encode, delimiter, separator, newLine, bom) {
        if (!encode) {
            encode = 'utf16-le';
        } else if (!(typeof encode == 'string' && iconvLite.encodingExists(encode))) {
            throw 'Error, check the suported encoding in iconv-lite';
        }
        this.encode = encode;
        this.delimiter = delimiter || '\"';
        this.separator = separator || ';';
        this.newLine = newLine || '\n';
        this.bom = undefined;
        if (bom) {
            this.bom = bom instanceof Buffer? bom: new Buffer([0xff, 0xfe]);
        }
    }
    static convertObjectToStringLine(obj, delimiter, separator) {
        try {
            if (!typeof delimiter == 'string' || !typeof separator == 'string') {
                throw 'the type of delimiter and separator must be a string';
            }
            return Object
                .keys(obj)
                .map(key => delimiter + obj[key] + delimiter)
                .join(separator? separator: '');
        } catch(e) {
            throw 'Convert object to string line error: ' + e;
        }
    }
    exportTableStringMappingObjectsToLines(objectArray) {
        try {
            const strArray = objectArray.map(obj => {
                return TableExport.convertObjectToStringLine(obj, this.delimiter, this.separator);
            });
            return strArray.reduce((srtTable, strLine) => {
                return srtTable + this.newLine + strLine;
            });
        } catch(e) {
            throw 'String mapping objects to lines error: ' + e;
        }
    }
    exportTableStringMappingObjectsToColumns(objectArray) {
        try {
            const arrayKeys = [];
            let previousObj = objectArray[0];
            let previousObjKeys = Object.keys(previousObj);
            objectArray.forEach(obj => {
                const currentObjKeys = Object.keys(obj);
                arrayKeys.push(currentObjKeys);
                if (previousObjKeys.length < currentObjKeys.length) {
                    previousObj = obj;
                }
            });
            const yMaxSize = previousObjKeys.length;
            const xMaxSize = objectArray.length;
            const columnObjArray = []
            for (let i = 0; i < yMaxSize; i++) {
                const obj = {};
                for (let j = 0; j < xMaxSize; j++) {
                    const data = objectArray[j][arrayKeys[j][i]]? objectArray[j][arrayKeys[j][i]]: '';
                    obj[i + '_' + j ] = data;
                }
                columnObjArray.push(obj);
            }
            return this.exportTableStringMappingObjectsToLines(columnObjArray);
        } catch(e) {
            throw 'String mapping objects to columns error: ' + e;
        }
    }
    exportTableBufferMappingObjectsToLines(objectArray) {
        try {
            const tableString = this.exportTableStringMappingObjectsToLines(objectArray);
            return TableExport.exportStringToEncodedBuffer(tableString);
        } catch(e) {
            throw 'Buffer mapping objects to lines error: ' + e;
        }
    }
    exportTableBufferMappingObjectsToColumns(objectArray) {
        try {
            const tableString = this.exportTableStringMappingObjectsToColumns(objectArray);
            return TableExport.exportStringToEncodedBuffer(tableString);
        } catch(e) {
            throw 'Buffer mapping objects to columns error: ' + e;
        }
    }
    static exportStringToEncodedBuffer(str) {
        try {
            const buffer = encoding.convert(str, this.encode);
            if (this.bom) {
                return Buffer.concat([this.bom, buffer]);
            } else {
                return buffer;
            }
        } catch(e) {
            throw 'Export string to encoded buffer error: ' + e;
        }
    }
}

module.exports = TableExport;