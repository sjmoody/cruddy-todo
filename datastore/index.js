const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    if (err) {
      callback(err, null);
    } else {
      var id = data;
      // console.log("data in counter callback:", data);
      var filename = this.dataDir + '/' + id + '.txt';
      fs.writeFile(filename, text, 'utf8', (err) => {
        if (err) {
          callback(err, null);
        } else {
          // console.log("data in writeFile cb", data);
          callback(null, {id, text});
        }
      });
    }
  });
};

// readAll
// ✓ should return an empty array when there are no todos
// 1) should return an array with all saved todos

// get array from readDir of filenames
// for each item in fileNameArry
// convert filename into a id
// readOne(id, ()=> {readFile and push data into array})

// get array from readDir of filenames
// ['00001.txt', '00002.txt']
// for i in array
// remove .txt from each
// for each item in fileNameArry
// read each file, push content of file to array

exports.readAll = (callback) => {
  var todoArray = [];
  var fileNameArray = fs.readdir(this.dataDir, (err, data) => {
    if (err) {
      callback(err, null);
      console.log(err);
    } else {

      // [ '00001.txt', '00002.txt' ]
      // data
      // WANT: dataObj = {id: '00001.txt', text: '00001.txt'} {id: id, text: id}
      // array of filenames
      var dataObj = _.map(data, (file)=>{
        id = file.slice(0, 5);
        return {id: id, text: id};
      });
      callback(null, dataObj);
    }
  });
};

// input: id
// output cb with the data for one task file
// edge case: does the file exist? need to check at the same moment as reading file

exports.readOne = (id, callback) => {
  var filename = this.dataDir + '/' + id + '.txt';
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

//fs.writeFile( file, data, options, callback )
exports.update = (id, text, callback) => {
  //define filename with id
  //writeFile with (filename, text, callback)
  var filename = this.dataDir + '/' + id + '.txt';
  fs.access(filename, fs.F_OK, (err)=>{
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filename, text, 'utf8', (err)=>{
        if (err) {
          callback(err, null);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filename = this.dataDir + '/' + id + '.txt';
  fs.unlink(filename, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
