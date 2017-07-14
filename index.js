const encoding = require('encoding');
const iconvLite = require('iconv-lite');
class TableExport {
    constructor(encode, delimiter, separator, newLine, bom) {
        if (!(typeof encode == 'string')) {
            encode = 'utf16-le';
        }
        this.encode = iconvLite.encodingExists(encode)? encode: 'utf16-le';
        this.delimiter = delimiter || '\"';
        this.separator = separator || ';';
        this.newLine = newLine || '\n';
        this.bom = bom instanceof Buffer? bom: new Buffer([0xff, 0xfe]);
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
            throw 'the type of obj must be an object';
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
            throw 'Array of objects expected';
        }
    }
    exportTableBufferMappingObjectsToLines(objectArray) {
        try {
            const tableString = this.exportTableStringMappingObjectsToLines(objectArray);
            const buffer = encoding.convert(tableString, this.encode);
            return Buffer.concat([this.bom, buffer]);
        } catch(e) {
            throw 'Array of objects expected';
        }
    }
    exportTableBufferMappingObjectsToColumns(objectArray) {
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
                    const data = objectArray[j][i]? objectArray[j][i]: '';
                    obj[i + '_' + j ] = data;
                }
                columnObjArray.push(obj);
            }
            return this.exportTableBufferMappingObjectsToLines(columnObjArray);
        } catch(e) {
            throw 'Array of objects expected';
        }
    }
}