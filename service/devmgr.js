'use strict';

var Q = require('q'),
	_ = require('lodash');

var bleHci = require('../hci/bleHci');

function Devmgr () {
	if (_.isObject(Devmgr.instance)) { return Devmgr.instance; }
	Devmgr.instance = this;

	this.devList = [];
}

Devmgr.prototype.newBleDevice = function () {

};

Devmgr.prototype.loadDevs = function () {

};

function BleDevice (devInfo) {
	this.role = devInfo.role;
	this.addr = devInfo.addr;
	this.connHdl = devInfo.connHdl;
	this.services = [];
}

BleDevice.prototype.save = function () {

};

BleDevice.prototype.update = function () {

};

BleDevice.prototype.remove = function () {

};

BleDevice.prototype.getServList = function () {

};

module.exports = Devmgr;