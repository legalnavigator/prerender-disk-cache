# prerender-filesystem-cache [![Build Status](https://api.travis-ci.org/matthesrieke/prerender-filesystem-cache.svg)](https://travis-ci.org/matthesrieke/prerender-filesystem-cache)

## Status

[![Build Status](https://api.travis-ci.org/matthesrieke/prerender-filesystem-cache.svg)](https://travis-ci.org/matthesrieke/prerender-filesystem-cache)
[![Coverage Status](https://coveralls.io/repos/github/matthesrieke/prerender-filesystem-cache/badge.svg?branch=master)](https://coveralls.io/github/matthesrieke/prerender-filesystem-cache?branch=master)

This is a plugin for [prerender(.io)](https://github.com/prerender/prerender)
providing caching in the file system.
This plugin is a fork of https://github.com/suhanovv/prerender-file-cache,
focussing on improved URI parsing, platform-independency and providing test
coverage.

Requires node >= 0.11.

The version `1.0.0` of this plugin and all its hotfixes target the prerender phantomjs branch (version `4.4.x`).

## How it works

This plugin will store all prerendered pages into a filesystem hierarchy.
For example:

* url http://domain.lo/?_escaped_fragment_=/en/about - will be saved in
`CACHE_ROOT_DIR/en/about/perender.cache.html`
* url http://domain.lo/en/about?_escaped_fragment_= - will be saved in
`CACHE_ROOT_DIR/en/about/perender.cache.html`
* url http://domain.lo/?_escaped_fragment_=/en/main/path/blah - will be saved
in `CACHE_ROOT_DIR/en/main/path/blah/perender.cache.html`
* url http://domain.lo/en/main/path/blah?_escaped_fragment_= - will be saved
in `CACHE_ROOT_DIR/en/main/path/blah/perender.cache.html`


## How to use

In your local prerender project run:

`$ npm install prerender-filesystem-cache --save`

Then in the `server.js` that initializes the prerender:

`server.use(require('prerender-filesystem-cache'));`

## Configuration

Optionally, define some env variables:

```
export CACHE_ROOT_DIR=/your/directory/for/cache  
export CACHE_LIVE_TIME=10000 (in seconds)
```

* `CACHE_ROOT_DIR` defaults to `os.tmpdir()/prerender-cache`
* `CACHE_LIVE_TIME` defaults to 3600 (1 hour)
