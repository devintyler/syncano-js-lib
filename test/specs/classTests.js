'use strict';
var should = require('should');
var mockery = require('mockery');
var config = require('../config.js');

describe('Class', function() {
  describe('(Account Scope)', function() {
    var requestMock, Syncano, scope;
    before(function() {
      mockery.enable(config.mockSettings);
      mockery.registerMock('request', config.requestMock);
      Syncano = require('../../src/syncano.js');
      scope = new Syncano({
        accountKey: config.accountKey
      });
      scope = new scope.Instance(config.instance);
    });

    after(function() {
      mockery.deregisterMock('request');
      mockery.disable();
    });

    it('instance.class is an class object', function() {
      (scope.class.type).should.equal('class');
      (scope.class).should.have.properties(['list', 'add', 'detail', 'update', 'delete']);
      (scope.class.list).should.be.a.Function();
      (scope.class.add).should.be.a.Function();
      (scope.class.detail).should.be.a.Function();
      (scope.class.delete).should.be.a.Function();
      (scope.class.update).should.be.a.Function();
    });

    it('list() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.list();
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('detail() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.detail(config.className);
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('update() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.update(config.className, {});
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('PATCH');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('delete() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.delete(config.className);
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('DELETE');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });


    it('should create a new class object', function() {
      scope = new scope.Class(config.className);
      (scope.type).should.equal('class');
      (scope).should.have.properties(['detail', 'update', 'delete', 'dataobject', 'DataObject']);
      (scope.detail).should.be.a.Function();
      (scope.delete).should.be.a.Function();
      (scope.update).should.be.a.Function();
      (scope.dataobject).should.be.an.Object();
      (scope.DataObject).should.be.an.Function();
    });

    it('detail() should recieve correct options', function(done) {
      var func, res;
      func = scope.detail();
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('update() should recieve correct options', function(done) {
      var func, res;
      func = scope.update({});
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('PATCH');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('delete() should recieve correct options', function(done) {
      var func, res;
      func = scope.delete();
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('DELETE');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.accountKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

  });

  describe('(Instance Scope)', function() {
    var requestMock, Syncano, scope;
    before(function() {
      mockery.enable(config.mockSettings);
      mockery.registerMock('request', config.requestMock);
      Syncano = require('../../src/syncano.js');
      scope = new Syncano({
        apiKey: config.apiKey,
        instance: config.instance
      });
    });

    after(function() {
      mockery.deregisterMock('request');
      mockery.disable();
    });

    it('this.class should be class object', function() {
      (scope.class.type).should.equal('class');
      (scope.class).should.have.properties(['list', 'detail']);
    });

    it('list() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.list();
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.apiKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('detail() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.detail(config.className);
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.apiKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('should return new Class', function() {
      scope = new scope.Class(config.className);
      (scope.type).should.equal('class');
      (scope).should.have.properties(['detail']);
    });

  });

  describe('(Logged User Scope)', function() {
    var requestMock, Syncano, scope;
    before(function() {
      mockery.enable(config.mockSettings);
      mockery.registerMock('request', config.requestMock);
      Syncano = require('../../src/syncano.js');
      scope = new Syncano({
        apiKey: config.apiKey,
        instance: config.instance,
        userKey: config.userKey
      });
    });

    after(function() {
      mockery.deregisterMock('request');
      mockery.disable();
    });

    it('this.class should be class object', function() {
      (scope.class.type).should.equal('class');
      (scope.class).should.have.properties(['list', 'detail']);
    });


    it('list() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.list();
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.apiKey);
        (res.headers['X-USER-KEY']).should.equal(config.userKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('detail() should recieve correct options', function(done) {
      var func, res;
      func = scope.class.detail(config.className);
      func.then(function(res) {
        (res).should.have.properties(['method', 'url', 'headers']);
        (res.method).should.equal('GET');
        (res.url).should.equal('instances/' + config.instance + '/classes/' + config.className + '/');
        (res.headers).should.have.properties(['User-Agent', 'Content-Type', 'X-API-KEY']);
        (res.headers['X-API-KEY']).should.equal(config.apiKey);
        (res.headers['X-USER-KEY']).should.equal(config.userKey);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('should return new Class', function() {
      scope = new scope.Class(config.className);
      (scope.type).should.equal('class');
      (scope).should.have.properties(['detail']);
    });

  });




});
