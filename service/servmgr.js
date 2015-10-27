'use strict';

var Q = require('q'),
	_ = require('lodash');

var bleHci = require('../hci/bleHci');

function Servmgr () {
	if (_.isObject(Servmgr.instance)) { return Servmgr.instance; }
	Servmgr.instance = this;
}

Servmgr.prototype.newServ = function () {

};

function Service (servInfo) {
	this.ownerDev = null;
	this.uuid = servInfo.uuid;
	this.startHdl = servInfo.startHandle;
	this.endHdl = servInfo.endHandle;
	this.chars = [];
}

Service.prototype.save = function () {

};

Service.prototype.update = function () {

};

Service.prototype.remove = function () {

};

Service.prototype.readCharsInfo = function () {

};

Service.prototype.readCharVal = function () {

};

Service.prototype.writeCharVal = function () {

};

module.exports = Servmgr;