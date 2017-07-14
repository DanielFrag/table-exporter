Synopsis

A module for Nodejs that arrange all the object's values from an array of objects in a string/buffer (BOM is opitional) that use a specific encode and characters to organize the data.
In development.

Code Example

Instantiate a TableExport object

const TableExport = require('<use the relative path for the index file>');
//use the default values for the special characters, encode and no byte order mark (BOM)
const tableExport = new TableExport();
//special characters:
//tableExport.separator = ';'
//tableExport.delimiter = '\"'
//tableExport.encode = 'utf16-le'

//use custom values for the special characters, encode and a specific byte order mark (BOM)
const encode = 'utf8';
const delimiter = '-';
const separator = '_';
const newLine = '@';
const buffer = new Buffer([0xfe, 0xff]);
const customTableExport = new TableExport(encode, delimiter, separator, newLine, buffer);

//use the default values for the special characters, encode and a specific byte order mark (BOM)
const tableExportWithBom = new TableExport('', '', '', '', buffer);


Convert a array of objects in a csv file

const objArr = [{
  l1c1: 'l1c1',
  l1c2: 'l1c2',
  l1c3: 'l1c3'
}, {
  l2c1: 'l2c1',
  l2c2: 'l2c2'
}, {
  l3c1: 'l3c1',
  l3c2: 'l3c2',
  l3c3: 'l3c3'
}];
const  buffer = tableExportWithBom.exportTableBufferMappingObjectsToLines(objArr);
/*
To send it in the response (res)
res.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-16le; header=present;',
    'Content-Disposition': 'attachment; filename=report.csv'
});
res.write(buffer);
return res.end();
*/

Motivation

This module was written to export a csv file with a specific encode that can be read in excel.

Tests

To run the test file first install the dependencies, then run npm test:
$ npm i
$ npm test '.\test\main.js'

License

The MIT License (MIT)

Copyright (c) 2017 Daniel Marcos Fragoso de Souza <danielmarcos2@yahoo.com.br>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
