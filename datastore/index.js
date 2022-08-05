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
      var filename = this.dataDir + '/' + id + '.txt';
      fs.writeFile(filename, text, 'utf8', (err, data) => {
        if (err) {
          callback(err, null);
        } else {
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
      // iterate through array of filenames and readfile, push data into todoarray
      // data is array of filenames
      for (var i = 0; i < data.length; i++) {
        fs.readFile(data[i], (err, data) => {
          if (err) {
            callback(err, null);
          } else {
            //want to make an object
            todoArray.push(data);
          }
        });
      }
      callback(null, todoArray);
      // callback(null, data);
      // console.log(data);

      // TODO: Refactor with Promises.all on all of the file names
    }
  });
};

exports.readAllLive = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
