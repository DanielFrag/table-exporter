module.exports = {
    data: [{
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
    }],
    append: [{
        column1: 'obj4key1'
    }, {
        column1: 'obj5key1',
        column2: 'obj5key2',
        column3: 'obj5key3'
    }, {
        column1: 'obj6key1',
        column2: 'obj6key2'
    }],
    lineString: '"obj1key1";"obj1key2";"obj1key3";"obj1key4";"obj1key5"\n"obj2key1";"obj2key2";"obj2key3"\n"obj3key1";"obj3key2";"obj3key3";"obj3key4"',
    columnString: '"obj1key1";"obj2key1";"obj3key1"\n"obj1key2";"obj2key2";"obj3key2"\n"obj1key3";"obj2key3";"obj3key3"\n"obj1key4";"";"obj3key4"\n"obj1key5";"";""'
};