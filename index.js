const encoding = require('encoding');
const iconvLite = require('iconv-lite');
class TableExport {
    constructor(encode, delimiter, separator, newLine, bom) {
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
}

/*
function toExcelBuffer(data, header) {
    const delimiter = '\"';
    const separator = ';';
    const newLine = '\n';
    const bom = new Buffer([0xff, 0xfe]);
    const headerText = Object
        .keys(header)
        .map(key => delimiter + header[key] + delimiter)
        .join(separator);
    const tableArray = [headerText];
    data.map(item => tableArray.push(Object.keys(item).map(key => delimiter + item[key] + delimiter).join(separator)));
    const tableStr = tableArray.reduce((str, strLine) => {
        return str + newLine + strLine;
    });
    const buffer = encoding.convert(tableStr, 'utf16-le');
    return Buffer.concat([bom, buffer]);
}
*/