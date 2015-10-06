/*
 * Syncano JS Library
 * Copyright 2015 Syncano Inc.
 */

'use strict';

var version  = require('../package.json').version;
var helpers  = require('./helpers.js');
var request  = require('request');
var FormData = require('form-data');
var _        = require('lodash');
var Promise  = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var path = require('path');

var defaultOptions = {
  qsStringifyOptions: {arrayFormat: 'repeat'},
  withCredentials: false,
  headers: {
    'User-Agent': 'syncano/version:' + version,
    'Content-Type': 'application/json'
  }
};

var url = function(config) {

  var urlTmpl = {
    account: '/account/',
    admin: (config.adminId) ? '/instances/<%= instance %>/admins/<%= adminId %>/' : '/instances/<%= instance %>/admins/',
    apikey: (config.apikeyId) ? '/instances/<%= instance %>/api_keys/<%= apikeyId %>/' : '/instances/<%= instance %>/api_keys/',
    channel: (config.channelId) ? '/instances/<%= instance %>/channels/<%= channelId %>/' : '/instances/<%= instance %>/channels/',
    class: (config.className) ? '/instances/<%= instance %>/classes/<%= className %>/' : '/instances/<%= instance %>/classes/',
    codebox: (config.codeboxId) ? '/instances/<%= instance %>/codeboxes/<%= codeboxId %>/' : '/instances/<%= instance %>/codeboxes/',
    dataobject: (config.dataobjectId) ? '/instances/<%= instance %>/classes/<%= className %>/objects/<%= dataobjectId %>/' : '/instances/<%= instance %>/classes/<%= className %>/objects/',
    group: (config.groupId) ? '/instances/<%= instance %>/groups/<%= groupId %>/' : '/instances/<%= instance %>/groups/',
    instance: (config.instance) ? '/instances/<%= instance %>/' : '/instances/',
    invitation: (config.instance) ? '/instances/<%= instance %>/invitations/' : '/account/invitations/',
    schedule: (config.scheduleId) ? '/instances/<%= instance %>/schedules/<%= scheduleId %>/' : '/instances/<%= instance %>/schedules/',
    trigger: (config.triggerId) ? '/instances/<%= instance %>/triggers/<%= triggerId %>/' : '/instances/<%= instance %>/triggers/',
    webhook: (config.webhookId) ? '/instances/<%= instance %>/webhooks/<%= webhookId %>/' : '/instances/<%= instance %>/webhooks/',
    user: (config.userId) ? '/instances/<%= instance %>/users/<%= userId %>/' : '/instances/<%= instance %>/users/'
  };

  var buildUrl = function urlAddOns(config) {
    var tmpl = config.tmpl || urlTmpl[config.type];

    if (config.inviteId) {
      tmpl += '<%= inviteId %>/';
    }

    if (config.id && config.path) {
      tmpl += (config.pathFirst) ? '<%= path %>/<%= id %>/' : '<%= id %>/<%= path %>/';
    } else if (config.id && !config.path) {
      tmpl += '<%= id %>/';
    } else if (config.path) {
      tmpl += '<%= path %>/';
    }

    if (config.type === 'user' && config.json && config.json.backend) {
      tmpl += '<%= json.backend %>/';
    }

    return _.template(tmpl)(config);
  };

  return buildUrl(config);
};

var watch = function(config) {
  var opt = _.merge({}, config);
  delete opt.func;
  var reqId = (opt.channelId) ? false : true;
  return (function(id, filter) {
    if (reqId) {
      opt.id = helpers.checkId(id);
    } else {
      filter = id;
    }
    filter = filter || {};
    opt.qs = helpers.parseFilter(filter);
    var events = new EventEmitter();
    watchRec(opt, apiRequest, events);
    return events;
  });

};

var watchRec = function(config, func, events) {
  var opt = _.merge({}, config);
  func(opt).then(function(res){
    if (res !== undefined) {
      events.emit(res.action, res.payload);
      opt.qs.last_id = res.id;
    }
    watchRec(opt, func, events);
  }).catch(function(err) {
    events.emit('error', err);
    watchRec(opt, func, events);
  });

};


var filterReq = function filterReq(config) {
  var opt = _.merge({}, config);
  delete opt.func;
  return (function(filter, cb) {
    if (arguments.length <= 1) {
      var args = helpers.sortArgs(filter, cb);
      filter = args.filter;
      cb = args.cb;
    }

    opt.qs = helpers.parseFilter(filter);

    return apiRequest(opt, cb);
  });

};

var idReq = function idReq(config) {

  var opt = _.merge({}, config);
  delete opt.func;

  return (function(id, cb) {
    opt.id = helpers.checkId(id);
    return apiRequest(opt, cb);
  });

};

var filterIdReq = function filterIdReq(config) {

  var opt = _.merge({}, config);
  delete opt.func;

  return (function(id, filter, cb) {

    opt.id = helpers.checkId(id);
    if (arguments.length <= 2) {
      var args = helpers.sortArgs(filter, cb);
      filter = args.filter;
      cb = args.cb;
    }

    opt.qs = helpers.parseFilter(filter);

    return apiRequest(opt, cb);
  });

};

var paramReq = function paramReq(config) {

  var opt = _.merge({}, config);
  delete opt.func;

  return (function(params, filter, cb) {
    // TODO Add check for optional params - respond accordingly
    params = helpers.checkParams(params);

    if (arguments.length <= 2) {
      var args = helpers.sortArgs(filter, cb);
      filter = args.filter;
      cb = args.cb;
    }

    opt.qs = helpers.parseFilter(filter);
    opt.json = params;

    return apiRequest(opt, cb);

  });

};

var paramIdReq = function paramIdReq(config) {
  var opt = _.merge({}, config);
  delete opt.func;

  return (function(id, params, filter, cb) {
    // TODO Add check for optional params - respond accordingly
    opt.id = helpers.checkId(id);

    params = helpers.checkParams(params, false);

    if (arguments.length <= 3) {
      var args = helpers.sortArgs(filter, cb);
      filter = args.filter;
      cb = args.cb;
    }

    opt.qs = helpers.parseFilter(filter);
    opt.json = params;


    return apiRequest(opt, cb);

  });

};

var apiRequest = function apiRequest(config, cb) {

  if (config.method === "POST"){
    if (config.json && config.json.file){ // testing for undefined and for file
      defaultOptions.headers = {
        'User-Agent': 'syncano/version:' + version,
        'Content-Type': 'multipart/form-data'
      };

      //var formData = {
      //  file: config.json.file
      //};

      var formData = new FormData();
      console.log(config.json.file);
      formData.append('file', fs.createReadStream(config.json.file));

      config.json.file = formData;

      console.log(formData);
    }
  }

  var opt = _.merge({}, defaultOptions, config, helpers.addAuth(config));
  opt.url = url(opt);
  opt.baseUrl = config.baseUrl || 'https://api.syncano.io/v1';

  return new Promise(function(resolve, reject) {
    request(opt.url, opt, function(err, res) {
      var localError, response;

      if (err || !(res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204)) {
        localError = err ? new Error(err) : new Error(JSON.stringify(res.body));
        reject(localError);
        return;
      }
      if (res.statusCode === 204) {
        response = res.statusMessage;
      } else {
        response = (typeof res.body !== 'object') ? JSON.parse(res.body) : res.body;
        if (opt.debug) {
          response.debug = res;
        }
      }

      resolve(response);
    });
  }).nodeify(cb);
};

var core = {
  filterReq: filterReq,
  filterIdReq: filterIdReq,
  idReq: idReq,
  paramReq: paramReq,
  paramIdReq: paramIdReq,
  watch: watch
};

module.exports = core;
