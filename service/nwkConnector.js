'use strict';

var Q = require('q'),
	_ = require('lodash');

var bleHci = require('../hci/bleHci'),
	Secmgr = require('./secmgr');


function NwkConnector () {
	if (_.isObject(NwkConnector.instance)) { return NwkConnector.instance; }
	NwkConnector.instance = this;

	var nwkInfo = {
		addr: 0,
		irk: 0,
		csrk: 0,
		linkParams: {
			connInterval: 0,
			connLatency: 0,
			connTimeout: 0
		}
	};

	this.adverDevs = [];
	this.addr = nwkInfo.addr;

	this.setNwkInfo = function () {

	};
};

NwkConnector.prototype.scan = function (callback) {
	var deferred = Q.defer(),
		devsInfo;

	bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 0, whiteList: 0}).then(function (result) {
		devsInfo = _.filter(_.last(result).GapDeviceDiscovery, function (val, key) {
			if (_.startsWith(key, 'dev')) { return val; }
		});
		deferred.resolve(devsInfo);
	}).fail(function (err) {
		deferred.reject(err);
	}).done();

	return deferred.promise.nodeify(callback);
};

NwkConnector.prototype.estLink = function (addr, callback) {
	var deferred = Q.defer(),
		connInfo,
		devInfo = {};
// [TODO], get addrType from addr
	bleHci.execCmd('Gap', 'EstLinkReq', {highDutyCycle: 0, whiteList: 0, addrtypePeer: addrType, peerAddr: addr}).then(function(result) {
		connInfo = result[1].GapLinkEstablished;
		devInfo.addrType = connInfo.addrType;
		devInfo.addr = connInfo.addr;
		devInfo.connHdl = connInfo.connHandle;
		devInfo.linkParams = {connInterval: connInfo.connInterval, connLatency: connInfo.connLatency, connTimeout: connInfo.connTimeout};
		deferred.resolve(devInfo);
	}).fail(function (err) {
		deferred.reject(err);
	}).done();

	return deferred.promise.nodeify(callback);
};

NwkConnector.prototype.terminateLink = function (addr, callback) {
	var deferred = Q.defer();
// [TODO], get connHandle from addr
	bleHci.execCmd('Gap', 'TerminateLink', {connHandle: connHandle, reason: 19}).then(function (result) {
		deferred.resolve({status: result[1].GapLinkTerminated.status});
	}).fail(function (err) {
		deferred.reject(err);
	}).done();

	return deferred.promise.nodeify(callback);
};

NwkConnector.prototype.getlinkParams = function (callback) {

};

NwkConnector.prototype.setlinkParams = function (callback) {

};

NwkConnector.prototype.updateLinkParam = function (callback) {

};

module.exppots = NwkConnector;