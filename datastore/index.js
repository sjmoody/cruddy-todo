const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
// const readFileP = Promise.promisify(require('fs').readFile);




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


exports.readAll = (callback) => {
  const readFileP = Promise.promisify(fs.readFile);
  let dataArr = [];
  let promiseArr = [];

  fs.readdir(this.dataDir, (err, data) => {
    if (err) {
      callback(err, null);
      console.log(err);
    } else {

      for (var i = 0; i < data.length; i++) {

        var filename = this.dataDir + '/' + data[i];

        promiseArr.push(readFileP(filename, 'utf8'));
      }
      Promise.all(promiseArr).then((allData)=>{
        for (var i = 0; i < allData.length; i++ ) {
          id = data[i].slice(0, 5);
          dataArr.push({id: id, text: allData[i]});
        }
      }).then(() => {
        callback(null, dataArr);
      }).catch((err) => {
        console.log(err);
      });
    }
  });

};

exports.readAllcb = (callback) => {
  var todoArray = [];
  fs.readdir(this.dataDir, (err, data) => {
    if (err) {
      callback(err, null);
      console.log(err);
    } else {

      var dataObj = _.map(data, (file)=>{
        id = file.slice(0, 5);
        return {id: id, text: id};
      });
      callback(null, dataObj);
    }
  });
};


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
