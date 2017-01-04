# cc-bnp
The interface for a host to communicate with TI **CC**254X **B**LE **N**etwork **P**rocessor(BNP) over a serial port.  

[![NPM](https://nodei.co/npm/cc-bnp.png?downloads=true)](https://nodei.co/npm/cc-bnp/)  

[![Travis branch](https://travis-ci.org/bluetoother/cc-bnp.svg?branch=master)](https://travis-ci.org/bluetoother/cc-bnp)
[![npm](https://img.shields.io/npm/v/cc-bnp.svg?maxAge=2592000)](https://www.npmjs.com/package/cc-bnp)
[![npm](https://img.shields.io/npm/l/cc-bnp.svg?maxAge=2592000)](https://www.npmjs.com/package/cc-bnp)

<br />

## Documentation  

Please visit the [Wiki](https://github.com/bluetoother/cc-bnp/wiki).

<br />

## Overview  

**cc-bnp** allows you to interact with TI's CC254X BLE network processor (BNP) on node.js via *TI BLE Vendor-Specific HCI Command APIs*. Each Command API is in an asynchronous manner and supports both err-back callback style and promise-style.  

**cc-bnp** let you get rid of multiple *Vendor-Specific Events* handling of each command. **cc-bnp** gathers the multiple responses up, and finally passes the result to the Command API callback. With **cc-bnp**, it's easy and fun in designing BLE applications on node.js.  

<br />

## Installation

> $ npm install cc-bnp --save

<br />

## Usage

See [Usage](https://github.com/bluetoother/cc-bnp/wiki#Usage) on the Wiki.  

<br />

## License
  
Licensed under [MIT](https://github.com/bluetoother/cc-bnp/blob/master/LICENSE).
