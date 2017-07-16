## Synopsis

A module for Nodejs that exports the class TableExports. This class's objects can arrange all the object's values, from an array of objects, in a string/buffer (BOM is opitional). The resulting string/buffer uses a specific encode and marks to organize the data. The default marks are:

* separator (;)
* delimiter (")
* new line (\n)

For the suported encode check the [iconv-lite](https://github.com/ashtuchkin/iconv-lite) page. The default encode is utf16-le.

If a byte order mark (BOM) is provided, it will be check and concatenated in the buffer export result (BOM + result). If the check fail the value ([0xff, 0xfe]) will be used.    

More information on code examples.

## Code Example

Instantiate a TableExport object

* require the module

        const TableExport = require('<use the relative path for the index file>');

* using the default values for marks, encode and no byte order mark (BOM)
        
        const tableExport = new TableExport();

* using custom values for the special characters, encode and a specific byte order mark (BOM)
    
        const encode = 'utf8';
        const delimiter = '-';
        const separator = '_';
        const newLine = '@';
        const bom = new Buffer([0xfe, 0xff]);
        const customTableExport = new TableExport({
            encode,
            delimiter,
            separator,
            newLine,
            bom
        });

* using the default values for the special characters, encode and a specific byte order mark (BOM)
        
        const tableExportWithBom = new TableExport({
            bom: new Buffer([0xfe, 0xff])
        });


Converting an array of objects in a csv file

* set the array to convert when instantiate the TableExport object

        const tableExport = new TableExport({
            tableData: [{
                column1: 'obj1key1',
                column2: 'obj1key2',
                column3: 'obj1key3',
                column4: 'obj1key4',
                column5: 'obj1key5'
            }, {
                column1: 'obj2key1',
                column2: 'obj2key2',
                column3: 'obj2key3'
            }, {
                column1: 'obj3key1',
                column2: 'obj3key2',
                column3: 'obj3key3',
                column4: 'obj3key4'
            }];
        });

* set the array to convert to an instantiace of TableExport

        const tableExport = new TableExport();
        tableExport.setTableData([{
            column1: 'obj1key1'
        }, {
            column1: 'obj2key1',
            column2: 'obj2key2',
            column3: 'obj2key3'
        }, {
            column1: 'obj3key1',
            column2: 'obj3key2'
        }]);

* push data to an instantiace of TableExport

        const tableExport = new TableExport({
            tableData: [{
                column1: 'obj1key1',
                column2: 'obj1key2',
                column3: 'obj1key3',
                column4: 'obj1key4',
                column5: 'obj1key5'
            }, {
                column1: 'obj2key1',
                column2: 'obj2key2',
                column3: 'obj2key3'
            }, {
                column1: 'obj3key1',
                column2: 'obj3key2',
                column3: 'obj3key3',
                column4: 'obj3key4'
            }];
        });
        tableExport.appendObjectsToTableData([{
            column1: 'obj4key1'
        }, {
            column1: 'obj5key1',
            column2: 'obj5key2',
            column3: 'obj5key3'
        }, {
            column1: 'obj6key1',
            column2: 'obj6key2'
        }]);

* mapping objects to tables

        const tableExport = new TableExport({
            tableData: [{
                column1: 'obj1key1',
                column2: 'obj1key2'
            }, {
                column1: 'obj2key1',
                column2: 'obj2key2'
            }]
        });

        //strings
        const tableLineStr = tableExport.stringMapObjectsToLines();
        //'"obj1key1";"obj1key2"\n"obj2key1";"obj2key2"'
        const tableColumnStr = tableExport.stringMapObjectsToColumns();
        //'"obj1key1";"obj2key1"\n"obj1key2";"obj2key2"'
        
        //buffers
        const tableLineBuffer = tableExport.bufferMapObjectsToLines();
        const tableColumnBuffer = tableExport.bufferMapObjectsToColumns();

* using a controller to send a csv file that can be read by excel (in excel, set the comma as separator)

        const controller = (req, res) => {
            const tableExport = new TableExport({
                tableData: [{
                    column1: 'obj1key1',
                    column2: 'obj1key2'
                }, {
                    column1: 'obj2key1',
                    column2: 'obj2key2'
                }],
                bom: new Buffer([0xff, 0xfe])
            });
            res.writeHead(200, {
                'Content-Type': 'text/csv; charset=utf-16le; header=present;',
                'Content-Disposition': 'attachment; filename=report.csv'
            });
            const buffer = tableExport.bufferMapObjectsToLines()
            res.write(buffer);
            return res.end();
        }


## Motivation

This module was written to export a csv file with a specific encode that can be read by excel.

## Tests

To run the test file first install the dependencies, then run npm test.
    
    $ npm i
    $ npm test './test/main.js'

## License

[MIT](https://github.com/DanielFrag/table-exporter/blob/master/LICENSE)