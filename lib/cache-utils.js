var fs = require('node-fs');
var url = require('url');
var os = require('os')
var pathTool = require('path');
var sanitize = require("sanitize-filename");

var writeCacheFile = function(key, value, callback) {
  /*
  * write the file to the corresponding cache directory
  */
  var pathObject = resolvePath(key);

  fs.exists(pathObject.path, function(exists){
    if (exists === false) {
      console.trace("creating subdirectory: "+ pathObject.path);
      fs.mkdirSync(pathObject.path, '0777',true);
    }

    var fn = constructFileName(pathObject);
    console.trace("writing file: "+ fn);
    fs.writeFile(fn, value, callback || (e => {
      if (e) {
        console.log('Could not write file', e);
      }
    }));
  });

};

var readCacheFile = function(key, callback) {
  /*
   * set the cache_live_time to the env variable or a default
   */
  var cacheLifeTime = process.env.CACHE_LIVE_TIME || 3600;
  var pathObject = resolvePath(key);

  fs.exists(constructFileName(pathObject), function(exists){
    if (exists === false) {
      return callback(false, null);
    }

    var date = new Date();

    if (date.getTime() - fs.statSync(constructFileName(pathObject)).mtime.getTime()
          > cacheLifeTime * 1000) {
      return callback(false, null);
    }

    var file = constructFileName(pathObject);
    console.trace("Reading file: "+file);
    fs.readFile(file, callback || ((e, data) => {
      if (e) {
        console.log('Could not read file', e);
      }
    }));

  });

};

var getCachePath = function() {
  return process.env.CACHE_ROOT_DIR || pathTool.join(os.tmpdir(), "prerender-cache");
};

var resolvePath = function (requestUrl) {
  var reqUrl = url.parse(requestUrl);

  var path = getCachePath();
  var filename = 'prerender.cache.html';

  if (reqUrl.pathname && reqUrl.pathname !== '/') {
    /*
    * parse the URL path and join it with the cache base path
    */
    path = pathTool.join(path, pathTool.format(pathTool.parse(reqUrl.pathname)));
    if (reqUrl.query) {
      /*
      * a query is set, join this as well
      */
      path = pathTool.join(path, sanitize(reqUrl.query));
    }
  }

  return {"path": path, "filename": filename};
};

var constructFileName = function (pathObject) {
  return pathTool.join(pathObject.path, pathObject.filename);
};

module.exports = {

  getCachePath: getCachePath,

  resolvePath: resolvePath,

  constructFileName: constructFileName,

  readCacheFile: readCacheFile,

  writeCacheFile: writeCacheFile,

  fileSystemCache: {
    get: readCacheFile,
    set: writeCacheFile
  }

}
