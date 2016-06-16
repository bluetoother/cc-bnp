cc-bnp
===============

**cc-bnp** is the interface for a host to communicate with TI **CC**254X **B**LE **N**etwork **P**rocessor(BNP) over a serial port.  

<br />

## Table of Contents  

1. [Overview](#Overview)  
    1.1 [BLE Network Processor](#BNP)  
    1.2 [Installation](#Installation)  
    1.3 [Usage](#Usage)  

2. [Basic and Command APIs](#APIs)  
    2.1 [Basic APIs](#basicAPIs)  
    2.2 [Events](#Events)  
    2.3 [TI's BLE Vendor-Specific HCI Command APIs (Generated Event Types)](#vendorHci)  

3. [Appendix](#Appendix)  
    3.1 [Vendor-Specific HCI Command Reference Tables](#cmdTables)  
    3.2 [GATT Specifications](#gattSpec)  
    3.3 [Error Message](#errCodes)  
    3.4 [Reason Code of Link-termination](#reasonCodes)  

4. [Contributors](#Contributors)  
5. [License](#License)  

<br />

<a name="Overview"></a>
## 1. Overview  

**cc-bnp** allows you to interact with TI's CC254X BLE network processor (BNP) on node.js via *TI BLE Vendor-Specific HCI Command APIs*. Each Command API is in an asynchronous manner and supports both err-back callback style and promise-style.  

**cc-bnp** let you get rid of multiple *Vendor-Specific Events* handling of each command. **cc-bnp** gathers the multiple responses up, and finally passes the result to the Command API callback. With **cc-bnp**, it's easy and fun in designing BLE applications on node.js.  

<br />

<a name="BNP"></a>
### 1.1 BLE Network Processor (BNP)  

The following diagram shows the scenario when CC254X operates as a BNP. In this case, the controller and host are implemented together on CC2540/41, and the application can be externally developed on an application processor (e.g., another mcu or PC). The application and profiles can communicate with BNP through TI's vendor-specific HCI commands upon an UART interface.  

![Network Processor Configuration](https://github.com/bluetoother/documents/blob/master/cc-bnp/bnp.png)

<br />

<a name="Installation"></a>
### 1.2 Installation

> $ npm install cc-bnp --save

<br />

<a name="Usage"></a>
### 1.3 Usage

To begin with **cc-bnp**, you must firstly set up the serial port and initialize the BNP with a given role. To do this, simply call the [.init()](#init) method:

```javascript
    var ccbnp = require('cc-bnp');
    var cfg = {
        path: '/dev/ttyUSB0'
    };

    ccbnp.on('ready', function () {
        console.log('Initialization completes.');
    });

    ccbnp.init(cfg, 'central');
```

Here are some [examples](https://github.com/hedywings/cc-bnp/blob/master/examples/ble_connect.js).

*************************************************

<br />

<a name="APIs"></a>
## 2. Basic and Command APIs

Each Command API in **cc-bnp** supports both err-back callback style and promise-style.

<br />

<a name="basicAPIs"></a>
### 2.1 Basic APIs

The basic APIs are about how to initialize the BNP with a given role and how to close connection from the processor. **cc-bnp** also allows you to define your own characteristics with registration methods. After the BNP accomplishes its initializing procedure, a `'ready'` event will be fired by **cc-bnp**. When there comes a BLE indication message, **cc-bnp** will fire an `'ind'` event along with the message content.  

* [init()](#init)
* [close()](#close)
* [regChar()](#regChar)
* [regUuidHdlTable()](#regUuidHdlTable)
* [regTimeoutConfig()](#regTimeoutCfg)

*************************************************
<a name="init"></a>
### .init(config, role, [callback])
Connect to CC254X SoC upon a serial port as well as initialize the BNP with a given role.

**Arguments**

- config (*Object*): This value-object has two properties `path` and `options` to configure the serial port. 
    - `path` - A string that refers to the serial-port system path, e.g., `'/dev/ttyUSB0'`.  
    - `options` - A value-object to set up the [seiralport](https://www.npmjs.com/package/serialport#to-use) instance. Its default value is shown in the following example.  

- role (*String*): Device role. **cc-bnp** supports four types of single role and two types of multi-roles:
    - `'broadcaster'` - Single role. An advertiser that is non-connectable.  
    - `'observer'` - Single role. An observer that scans for advertisements. It can not initiate connections.  
    - `'peripheral'` - Single role. An advertiser that operates as a slave in a single link layer connection.  
    - `'central'` - Single role. A central that scans for advertisements and operates as a master in a single or multiple link layer connections.  
    - `'central_broadcaster'` - Multi-roles. The processor plays as a central and a broadcaster.  
    - `'peripheral_observer'` - Multi-roles. The processor plays as a peripheral and an observer.  

- callback(err, result)
    - `'err'` (*Error*) - [Error Message](#errCodes)  
    - `'result'` (*Object*) - Device information. It has the following properties:

```sh
{
    devAddr: '0x78c5e59b5ef8',  // Device public address
    irk: <Buffer 72 74 73 20 3d 20 44 75 70 6c 65 78 3b 0a 0a 2f>, // 16 bytes IRK (Identity Resolving Key)  
    csrk: <Buffer 2a 3c 72 65 70 6c 61 63 65 6d 65 6e 74 3e 2a 2f> // 16 bytes CSRK (Connection Signature Resolving Key)
}
```

**Returns**  

- (*Promise*)

**Example**

```javascript
var ccbnp = require('cc-bnp'),
    role = 'broadcaster',
    cfg = {
        path: '/dev/ttyUSB0',
        options: {
            baudRate: 115200,   // default value
            rtscts: true,       // default value
            flowControl: true   // default value
        }
    };

// init() example: callback-style
ccbnp.init(cfg, role, function (err, result) {
    if (err)
        console.log(err);
    else
        console.log(result);
});

// init() example: promise-style
ccbnp.init(cfg, role).then(function (result) {
    console.log(result);
}).fail(function (err) {
    console.log(err);
}).done();
```

*************************************************
<a name="close"></a>
### .close([callback])
Close the opened serial port.  

**Arguments**

- callback(err)
    - `'err'` (*Error*) - [Error Message](#errCodes)  

**Returns**  

- (*Promise*)

**Example**

```javascript
ccbnp.close(function (err) {
    if (err)
        console.log(err);
});
```

*************************************************
<a name="regChar"></a>
### .regChar(regObj)
Register a characteristic UUID and its value format.  

If a characteristic UUID is defined by [GATT Specifications](#gattSpec), **cc-bnp** will automatically parse it. If you have a private characteristic (defined by yourself, not by [SIG](https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicsHome.aspx)), please use this method to register your characteristic to **cc-bnp**. This will tell **cc-bnp** how to parse private characteristics from the received messages.  

**[WARNING]**: This method can overwrite a public UUID definition ([GATT Specifications](#gattSpec)). It is better to choose a private UUID different from public-defined ones.  

**Arguments**

- regObj (*Object*):  The object should be given with the following properties  
    - `uuid` (*Hex string*) - Characteristic UUID to register (e.g., '0x2a00', '0x2a1c').  
    - `params` (*Array*) - Field names in the characteristic value.  
    - `types` (*Array*) - Data type of each parameter in `params` array.  

    Note: The order of entries in `types` and `params` array should be exactly matched.  

**Returns**  

- (*none*)

**Example**

```javascript
var regObj = {
    uuid: '0xfff1',
    params: [ 'foo', 'bar', 'certainName' ],
    types: [ 'uint8', 'uint16', 'float' ]
};
ccbnp.regChar(regObj);
```

*************************************************
<a name="regUuidHdlTable"></a>
### .regUuidHdlTable(connHdl, uuidHdlTable)
Register a table that maps each characteristic handle to its characteristic UUID _under a connection_. **cc-bnp** will use this table to find out the characteristic UUID when you use the characteristic handle to operate upon a characteristic.  

**Arguments**
- connHdl (*Number*): Connection handle that identifies a connection.  
- uuidHdlTable (*Object*): Characteristic handle-to-UUID mapping table (key-value pairs). Key is characteristic handle and value is characteristic UUID.  

**Returns**  

- (*none*)

**Example**

```javascript
var myCharUuidHdlTable1 = {
    // handle: uuid
        3: '0x2a00'
        5: '0x2a01'
        7: '0x2a02'
        9: '0x2a03'
        11: '0x2a04'
        14: '0x2a05'
    },
    myCharUuidHdlTable2 = {
        4: '0x2a00'
        6: '0x2a01'
        8: '0x2a02'
        10: '0x2a03'
        12: '0x2a04'
        16: '0x2a05'
    };

ccbnp.regUuidHdlTable(0, myCharUuidHdlTable1);    // under connection handle 0
ccbnp.regUuidHdlTable(1, myCharUuidHdlTable2);    // under connection handle 1
```

*************************************************
<a name="regTimeoutCfg"></a>
### .regTimeoutCfg(connHdl, timeoutConfig)
Register the timeout configuration of commands. This will tell **cc-bnp** of how much time it should wait for the response.  

**Arguments**

- connHdl (*Number*): Connection handle that identifies a connection  
- timeoutConfig (*Object*): Timeout configuration. The following table shows the details of each property 

    | Property | Type | Mandatory | Description | Default Value |
    |----------|----------|----------|----------|----------|
    | level1 | Number | Optional | Timeout of remote control commands (mSec) | 3000 |
    | level2 | Number | Optional | Timeout of remote control and operating many characteristics commands (mSec) | 10000 |
    | scan | Number | Optional | Timeout of `gap.deviceDiscReq` command (mSec) | 15000 |

**Returns**  

- (*none*)

**Example**

```javascript
var timeoutConfig1 = {
        level1: 2000,
        level2: 5000,
        scan: 3000
    },
    timeoutConfig2 = {
        scan: 5000
    };

ccbnp.regTimeoutCfg(0, timeoutConfig1);     // for connection handle 0
ccbnp.regTimeoutCfg(1, timeoutConfig2);     // for connection handle 1
```

*************************************************

<br />

<a name="Events"></a>
### 2.2 Events

* [ready](#onReady)
* [ind](#onInd)

*************************************************
<a name="onReady"></a>
### .on('ready', callback)
The `'ready'` event is fired when the initializing procedure completes.

**Arguments**

- callback(result)
    - `'result'` (*Object*) - Device information with the following properties:
```sh
{
    devAddr: '0x78c5e59b5ef8',  // Device public address
    irk: <Buffer 72 74 73 20 3d 20 44 75 70 6c 65 78 3b 0a 0a 2f>,  // 16 bytes IRK
    csrk: <Buffer 2a 3c 72 65 70 6c 61 63 65 6d 65 6e 74 3e 2a 2f>  // 16 bytes CSRK
}
```

**Example**

```javascript
ccbnp.on('ready', function (result) {
    console.log(result);
    // do your work here
});
```

*************************************************

<a name="onInd"></a>
### .on('ind', callback)
When there is an incoming *BLE indication* message, **cc-bnp** fires an `'ind'` event along with the message object.  

**Arguments**

- callback(msg)
    - msg (*Object*): It has two properties `type` and `data`, where `type` denotes the *indication type* and `data` is the message content. The reason of link termination along with a `'linkTerminated'` indication can be found from the [reason codes table](#reasonCodes).  

        ```javascript
        ccbnp.on('ind', function (msg) {
            console.log(msg.type);
            console.log(msg.data);
        });
        ```

    - msg.type (*String*) includes
        * `'linkEstablished'`   - GAP\_LinkEstablished (TI Vendor-Specific Event)  
        * `'linkTerminated'`    - GAP\_LinkTerminated
        * `'linkParamUpdate'`   - GAP\_LinkParamUpdate
        * `'attNoti'`           - ATT\_HandleValueNoti
        * `'attInd'`            - ATT\_HandleValueInd
        * `'authenComplete'`    - GAP\_AuthenticationComplete
        * `'passkeyNeeded'`     - GAP\_PasskeyNeeded
        * `'bondComplete'`      - GAP\_BondComplete

    - msg.data (*Object*) corresponding to each indication type  

        ```javascript
        // When (msg.type === 'linkEstablished'):
        msg.data = {
            addr: '0x9059af0b8159',   // Address of the connected device
            connHandle: 0,            // Handle of the connection
            connInterval: 80,         // Connection interval used on this connection, time = 80 * 1.25 msec
            connLatency: 0,           // Connection latency used on this connection
            connTimeout: 2000,        // Connection supervision timeout, time = 2000 * 10 msec
            clockAccuracy: 0,         // The accuracy of clock 
        }
        ```

        ```javascript
        // When (msg.type === 'linkTerminated'):
        msg.data = {
            connHandle: 0,      // Connection Handle of the terminated link
            reason: 8,          // The reason of termination
        }
        ```

        ```javascript
       // When (msg.type === 'linkParamUpdate'):
        msg.data = {
            connHandle: 0,
            connInterval: 80,
            connLatency: 0,
            connTimeout: 2000
        }
        ```

        ```javascript
        // When (msg.type === 'attNoti'):
        msg.data = {
            connHandle: 0,
            authenticated: 0,       // Whether or not an authenticated link is required
            handle: 93,             // The handle of the attribute
            value: <Buffer C3 01>   // The value of the attribute 
        }
        ```

        ```javascript
        // When (msg.type === 'attInd'):
        msg.data = {
            connHandle: 0,
            authenticated: 0,
            handle: 94,
            value: <Buffer 08 00>
        }    
        ```

        ```javascript
        // When (msg.type === 'authenComplete'):
        msg.data = {
            connHandle: 0,
            mitm: 1,    // 0 or 1 means true or false
            bond: 1,    // 0 or 1 means true or false
            ltk: <Buffer 23 84 A1 D8 95 C9 ED C6 B6 E4 47 F4 44 F3 E4 73>,  // 16 bytes LTK
            div: 0x668b, 							                        // The DIV used with this LTK.
            rand: <Buffer E6 68 CE EE DC D6 E9 99>							// 8 bytes random number generated for this LTK.
        }    
        ```

        ```javascript
        // When (msg.type === 'passkeyNeeded'):
        msg.data = {
            devAddr: '0x78c5e570796e',
            connHandle: 0,
            uiInput: 1,	  // Whether to ask user to input a passcode, 0 or 1 means no or yes
            uiOutput: 0   // Whether to display a passcode, 0 or 1 means no or yes
        }    
        ```

        ```javascript
        // When (msg.type === 'bondComplete'):
        msg.data = {
            connHandle: 0
        }    
        ```

*************************************************

<br />

<a name="vendorHci"></a>
### 2.3 TI's BLE Vendor-Specific HCI Command APIs

TI's BLE Vendor-Specific HCI Commands are organized in subgroups: **hci**, **l2cap**, **att**, **gatt**, **gap**, and **util**. The description of each command is documented in [TI\_BLE\_Vendor\_Specific\_HCI_Guide.pdf](https://github.com/bluetoother/documents/blob/master/cc-bnp/TI_BLE_Vendor_Specific_HCI_Guide.pdf).  

| Command SubGroup (CSG) |  Namespace  | Number of Commands |
|:----------------------:|:-----------:|:------------------:|
|           hci          |  [ccbnp.hci](#tblHci)  |         32         |
|          l2cap         | [ccbnp.l2cap](#tblL2cap) |          1         |
|           att          |  [ccbnp.att](#tblAtt)  |         26         |
|          gatt          |  [ccbnp.gatt](#tblGatt) |         25         |
|           gap          |  [ccbnp.gap](#tblGap)  |         24         |
|          util          | [ccbnp.util](#tblUtil) |          3         |

To call the Command API:

    ccbnp[subGroup][cmdName](..., callback);  

, where **cmdName** is the Command API function name which can be found from this [reference table](#cmdTables).  

For example:

    ccbnp.gap.deviceDiscReq(..., function (err, result) { });  

Here is an example of calling **_deviceDiscReq()_** in subgroup **_gap_**:

```javascript
// Please see Section 12.3 in TI BLE Vendor Specific HCI Reference Guide for API details.
// arguments: (mode, activeScan, whiteList, callback)

ccbnp.gap.deviceDiscReq(3, 1, 0, function (err, result) {
    if (err)
        console.log(err);
    else
        console.log(result);
};
```

Here is another example of calling **_writeCharValue()_** in subgroup **_gatt_**:

```javascript
// Please see Section 18.14 in TI BLE Vendor Specific HCI Reference Guide for API details.
// arguments: (connHandle, handle, value, [uuid], callback)

var valObj = {   // value object for this command
    flags: 15,   // bit0 = 1, bit1 = 1, bit2 = 1, bit3 = 1
    sequenceNum: 1, 
    year: 2015, 
    month: 12, 
    day: 22, 
    hours: 18, 
    minutes: 37, 
    seconds: 41,
    timeOffset: 0,
    glucoseMol: 0.0068,
    type: 1,
    sampleLocation: 1, 
    sensorStatus: 0
};

// If _uuid_ is not given, ccbnp will automatically initiate a request to ask characteristic uuid to build value packet.
ccbnp.gatt.writeCharValue(0, 37, valObj, '0x2a18', function (err, result) {
    if (err)
        console.log(err);
    else
        console.log(result);
});
```
The 'uuid' of a public characteristic value can be found in [GATT Specifications ](#gattSpec). If you are using a private characteristic, please use [.regChar()](#regChar) to register your uuid first.  

*************************************************

<br />

<a name="Appendix"></a>
## 3. Appendix  

<a name="cmdTables"></a>
### 3.1 Vendor-Specific HCI Command Reference Tables

These tables are cross-references between the **Vendor-Specific HCI Command** and **cc-bnp Command APIs**. Here is the description of each column in the table:  

* BLE Vendor-Cmd  
    - The command name documented in [TI\_BLE\_Vendor\_Specific\_HCI_Guide.pdf](https://github.com/bluetoother/documents/blob/master/cc-bnp/TI_BLE_Vendor_Specific_HCI_Guide.pdf)  
* Cmd-API  
    - The API name, in cc-bnp, according to a vendor-specific HCI command  
* Arguments  
    - Required parameters of a Cmd-API  
* Result
    - Resulted data object passing to the Cmd-API callback.  
    - For **hci** subgroup, this data object is with keys: `{ status, cmdOpcode, [other keys] }`
    - For other subgroups, i.e. l2cap, att, gatt, gap, util, this data object is with keys: `{ status, opcode, dataLen, payload, collector }` 
* Generated Event(s)
    - Events generated by the remote device will be collected as an object to `collector` property in the resulted data object. It is that the value of `collector` property is an object as well.  
    - Each key in `collector` object represents the event type. The **Generated Event(s)** column will tell you of how many kinds of event types **may** be generated from the remote device.  
    - Each value in `collector` object is an array of [event-dependent data](#tblEvt). (Since the same type of event may be generated more than one time from the remote device, an array is used to gather them up.)  

**Example**

Let's take `ccbnp.gap.deviceDiscReq()` as an example. Here, I only take out something that we need from [ccbnp.gap APIs table](#tblGap). The table down here tells that  

| BLE Vendor-Cmd             |     Cmd-API    | Arguments                   | Generated Event(s) - `collector`         |
| -------------------------- | -------------- | --------------------------- | ---------------------------------------- |
| GAP_DeviceDiscoveryRequest | deviceDiscReq  | mode, activeScan, whiteList | `{ [GapDeviceInfo], GapDeviceDiscovery }`|

* This command is named as **GAP_DeviceDiscoveryRequest** in TI's HCI guide and is named as **deviceDiscReq** under the namespace **gap** in cc-bnp.  
* The required arguments to this Cmd-API are `mode`, `activeScan`, and `whiteList` listed in order.
* The returned result is an object with keys `{ status, opcode, dataLen, payload, collector }`, the table will tell you of what may appear in `collector` object by **Generated Event(s)**.  
* `collector` is an object that may has a field `GapDeviceInfo` and will has a field `GapDeviceDiscovery`. The embraced **[GapDeviceInfo]** event type tells that such an event may not be generated from the remote device.  
* Here is an example of result object that passes to `gap.deviceDiscReq` API callback:  

    ```Javascript
    {
        status: 0,  
        opcode: 65028,  
        dataLen: 0,
        payload: <Buffer >
        collector: {
            GapDeviceInfo: [        // collects the event-depenedent data of 'GapDeviceInfo' event type
                { 
                    status: 0,
                    eventType: 0,
                    addrType: 0,
                    addr: '0xd03972c3d10a',
                    rssi: 216,
                    dataLen: 31,
                    dataField: <Buffer 02 01 05 03 02 10 ... > 
                },
                { 
                    status: 0,
                    eventType: 0,
                    addrType: 0,
                    addr: '0x9059af0b8159',
                    rssi: 167,
                    dataLen: 3,
                    dataField: <Buffer 02 01 05> 
                }
            ],
            GapDeviceDiscovery: [   // collects the event-depenedent data of 'GapDeviceDiscovery' event type
                { 
                    status: 0, 
                    numDevs: 2, 
                    devs: [ 
                        { evtType: 0, addrType: 0, addr: '0xd03972c3d10a' }, 
                        { evtType: 0, addrType: 0, addr: '0x9059af0b8159' } 
                    ]
                }
            ]
        }
    }
    ```

*************************************************
<a name="tblHci"></a>
#### 3.1.1 ccbnp.hci APIs

* Result object: `{ status, cmdOpcode, [other keys] }`
* **hci** commands mainly interact with the local ble network processor(BNP). There is no event from remote devices and hence there will be no `collector` property in the result object.  


| BLE Vendor-Cmd |    Cmd-API   | Arguments | Result Object |
| ------------- | ------------- | ------------- | ------------- |
|HCI_EXT_SetRxGainCmd|setRxGain|rxGain|`{ status, cmdOpcode }`|
|HCI_EXT_SetTxPowerCmd|setTxPower|txPower|`{ status, cmdOpcode }`|
|HCI_EXT_OnePacketPerEventCmd|onePktPerEvt|control|`{status, cmdOpcode }`|
|HCI_EXT_ClkDivOnHaltCmd|clkDivideOnHalt|control|`{ status, cmdOpcode }`|
|HCI_EXT_DeclareNvUsageCmd|declareNvUsage|mode|`{ status, cmdOpcode }`|
|HCI_EXT_DecryptCmd|decrypt|key, encText|`{ status, cmdOpcode, plainTextData }`|
|HCI_EXT_SetLocalSupportedFeaturesCmd|setLocalSupportedFeatures|localFeatures|`{ status, cmdOpcode }`|
|HCI_EXT_SetFastTxResponseTimeCmd|setFastTxRespTime|control|`{ status, cmdOpcode }`|
|HCI_EXT_ModemTestTxCmd|modemTestTx|cwMode, txFreq|`{ status, cmdOpcode }`|
|HCI_EXT_ModemHopTestTxCmd|modemHopTestTx|none|`{ status, cmdOpcode }`|
|HCI_EXT_ModemTestRxCmd|modemTestRx|rxFreq|`{ status, cmdOpcode }`|
|HCI_EXT_EndModemTestCmd|endModemTest|none|`{ status, cmdOpcode }`|
|HCI_EXT_SetBDADDRCmd|setBdaddr|bdAddr|`{ status, cmdOpcode }`|
|HCI_EXT_SetSCACmd|setSca|scalnPPM|`{ status, cmdOpcode }`|
|HCI_EXT_EnablePTMCmd|enablePtm|none|`{ status, cmdOpcode }`|
|HCI_EXT_SetFreqTuneCmd|setFreqTune|step|`{ status, cmdOpcode }`|
|HCI_EXT_SaveFreqTuneCmd|saveFreqTune|none|`{ status, cmdOpcode }`|
|HCI_EXT_SetMaxDtmTxPowerCmd|setMaxDtmTxPower|txPower|`{ status, cmdOpcode }`|
|HCI_EXT_MapPmInOutPortCmd|mapPmIoPort|ioPort, ioPin|`{ status, cmdOpcode }`|
|HCI_EXT_DisconnectImmedCmd|disconnectImmed|connHandle|`{ status, cmdOpcode }`|
|HCI_EXT_PacketErrorRateCmd|per|connHandle, cmd|`{ status, cmdOpcode, cmdVal, numPkts, numCrcErr, numEvents, numMissedEvents }`|
|HCI_EXT_PERbyChanCmd|perByChan|connHandle, perByChan|`{ status, cmdOpcode }`|
|HCI_EXT_ExtendRfRangeCmd|extendRfRange|none|`{ status, cmdOpcode }`|
|HCI_EXT_AdvEventNoticeCmd|advEventNotice|taskId, cmd|`{ status, cmdOpcode }`|
|HCI_EXT_ConnEventNoticeCmd|connEventNotice|taskId, taskEvt|`{ status, cmdOpcode }`|
|HCI_EXT_HaltDuringRfCmd|haltDuringRf|mode|`{ status, cmdOpcode }`|
|HCI_EXT_SetSlaveLatencyOverrideCmd|overrideSl|taskId|`{ status, cmdOpcode }`|
|HCI_EXT_BuildRevisionCmd|buildRevision|mode, userRevNum|`{ status, cmdOpcode, userRevNum, buildRevNum }`|
|HCI_EXT_DelaySleepCmd|delaySleep|delay|`{ status, cmdOpcode }`|
|HCI_EXT_ResetSystemCmd|resetSystem|mode|`{ status, cmdOpcode }`|
|HCI_EXT_OverlappedProcessingCmd|overlappedProcessing|mode|`{ status, cmdOpcode }`|
|HCI_EXT_NumComplPktsLimitCmd|numCompletedPktsLimit|limit, flushOnEvt|`{ status, cmdOpcode }`|

*************************************************
<a name="tblL2cap"></a>
#### 3.1.2 ccbnp.l2cap APIs

* Result object: `{ status, opcode, dataLen, payload, collector }`  
* **Generated Event(s)** will be collected as key-value pairs within the `collector` object.  

| BLE Vendor-Cmd | Cmd-API | Arguments | Generated Event(s) |
| ------------- | ------------- | ------------- | ------------- |
|L2CAP_ConnParamUpdateReq|paramUpdateReq|connHandle, intervalMin, intervalMax, slaveLatency, timeoutMultiplier|`{ L2capParamUpdateRsp }`|

*************************************************
<a name="tblAtt"></a>
#### 3.1.3 ccbnp.att APIs

* Result object: `{ status, opcode, dataLen, payload, collector }` 
* **Generated Event(s)** will be collected as key-value pairs within the `collector` object.  

**Note**:
    The embraced **[uuid]** argument is to help ccbnp with building the packet. If uuid is not provided and is not registered by regUuidHdlTable() to a Characteristic handle-to-UUID mapping table, ccbnp will automatically initiate a remote request for the characteristic uuid.  

| BLE Vendor-Cmd |   Cmd-API    | Arguments | Generated Event(s) |
| ------------- | ------------- | ------------- | ------------- |
|ATT_ErrorRsp|errorRsp|connHandle, reqOpcode, handle, errCode|none|
|ATT_ExchangeMtuReq|exchangeMtuReq|connHandle, clientRxMTU|`{ AttExchangeMtuRsp }`|
|ATT_ExchangeMtuRsp|exchangeMtuRsp|connHandle, serverRxMTU|none|
|ATT_FindInfoReq|findInfoReq|connHandle, startHandle, endHandle|`{ AttFindInfoRsp }`|
|ATT_FindInfoRsp|findInfoRsp|connHandle, format, info|none|
|ATT_FindByTypeValueReq|findByTypeValueReq|connHandle, startHandle, endHandle, type, value|`{ AttFindByTypeValueRsp }`|
|ATT_FindByTypeValueRsp|findByTypeValueRsp|connHandle, handlesInfo|none|
|ATT_ReadByTypeReq|readByTypeReq|connHandle, startHandle, endHandle, type| `{ AttReadByTypeRsp }`|
|ATT_ReadByTypeRsp|readByTypeRsp|connHandle, length, data, [uuid]|none|
|ATT_ReadReq|readReq|connHandle, handle, [uuid]|`{ AttReadRsp }`|
|ATT_ReadRsp|readRsp|connHandle, value, [uuid]|none|
|ATT_ReadBlobReq|readBlobReq|connHandle, handle, offset| `{ AttReadBlobRsp }`|
|ATT_ReadBlobRsp|readBlobRsp|connHandle, value|none|
|ATT_ReadMultiReq|readMultiReq|connHandle, handles, [uuid]|`{ AttReadMultiRsp }`|
|ATT_ReadMultiRsp|readMultiRsp|connHandle, value, [uuid]|none|
|ATT_ReadByGrpTypeReq|readByGrpTypeReq|connHandle, startHandle, endHandle, type|`{ AttReadByGrpTypeRsp }`|
|ATT_ReadByGrpTypeRsp|readByGrpTypeRsp|connHandle, length, data|none|
|ATT_WriteReq|writeReq|connHandle, signature, command, handle, value, [uuid]|`{ AttWriteRsp }`|
|ATT_WriteRsp|writeRsp|connHandle|none|
|ATT_PrepareWriteReq|prepareWriteReq|connHandle, handle, offset, value|`{ AttPrepareWriteRsp `}|
|ATT_PrepareWriteRsp|prepareWriteRsp|connHandle, handle, offset, value|none|
|ATT_ExecuteWriteReq|executeWriteReq|connHandle, flags|`{ AttExecuteWriteRsp }`|
|ATT_ExecuteWriteRsp|executeWriteRsp|connHandle|none|
|ATT_HandleValueNoti|handleValueNoti|connHandle, authenticated, handle, value, [uuid]|none|
|ATT_HandleValueInd|handleValueInd|connHandle, authenticated, handle, value, [uuid]|`{ AttHandleValueCfm }`|
|ATT_HandleValueCfm|handleValueCfm|connHandle|none|

*************************************************
<a name="tblGatt"></a>
#### 3.1.4 ccbnp.gatt APIs

* Result object: `{ status, opcode, dataLen, payload, collector }`   
* **Generated Event(s)** will be collected as key-value pairs within the `collector` object. 

**Note**:
    The embraced **[uuid]** argument is to help ccbnp with building the packet. If uuid is not provided and is not registered by regUuidHdlTable() to a Characteristic handle-to-UUID mapping table, ccbnp will automatically initiate a remote request for the characteristic uuid.  

| BLE Vendor-Cmd |     Cmd-API  | Arguments | Generated Event(s) |
| ------------- | ------------- | ------------- | ------------- |
|GATT_ExchangeMtu|exchangeMtu|connHandle, clientRxMTU|`{ AttExchangeMtuRsp }`|
|GATT_DiscAllPrimaryServices|discAllPrimaryServices|connHandle|`{ AttReadByGrpTypeRsp }`|
|GATT_DiscPrimaryServiceByUuid|discPrimaryServiceByUuid|connHandle, value, [uuid]|`{ AttFindByTypeValueRsp }`|
|GATT_FindIncludedServices|findIncludedServices|connHandle, startHandle, endHandle|`{ AttReadByTypeRsp }`|
|GATT_DiscAllChars|discAllChars|connHandle, startHandle, endHandle|`{ AttReadByTypeRsp }`|
|GATT_DiscCharsByUuid|discCharsByUuid|connHandle, startHandle, endHandle, type|`{ AttReadByTypeRsp }`|
|GATT_DiscAllCharDescs|discAllCharDescs|connHandle, startHandle, endHandle|`{ AttFindInfoRsp }`|
|GATT_ReadCharValue|readCharValue|connHandle, handle, [uuid]|`{ AttReadRsp }`|
|GATT_ReadUsingCharUuid|readUsingCharUuid|connHandle, startHandle, endHandle, type|`{ AttReadByTypeRsp }`|
|GATT_ReadLongCharValue|readLongCharValue|connHandle, handle, offset|`{ AttReadBlobRsp }`|
|GATT_ReadMultiCharValues|readMultiCharValues|connHandle, handles|`{ AttReadMultiRsp }`|
|GATT_WriteNoRsp|writeNoRsp|connHandle, handle, value, [uuid]|none|
|GATT_SignedWriteNoRsp|signedWriteNoRsp|connHandle, handle, value, [uuid]|none|
|GATT_WriteCharValue|writeCharValue|connHandle, handle, value, [uuid]|`{ AttWriteRsp }`|
|GATT_WriteLongCharValue|writeLongCharValue|connHandle, handle, offset, value|`{ [AttPrepareWriteRsp], AttExecuteWriteRsp }`|
|GATT_ReliableWrites|reliableWrites|connHandle, numberRequests, requests|`{ [AttPrepareWriteRsp], AttExecuteWriteRsp }`|
|GATT_ReadCharDesc|readCharDesc|connHandle, handle|`{ AttReadRsp }`|
|GATT_ReadLongCharDesc|readLongCharDesc|connHandle, handle, offset|`{ AttReadBlobRsp }`|
|GATT_WriteCharDesc|writeCharDesc|connHandle, handle, value, [uuid]|`{ AttWriteRsp }`|
|GATT_WriteLongCharDesc|writeLongCharDesc|connHandle, handle, offset, value|`{ [AttPrepareWriteRsp], AttExecuteWriteRsp }`|
|GATT_Notification|notification|connHandle, authenticated, handle, value, [uuid]|none|
|GATT_Indication|indication|connHandle, authenticated, handle, value, [uuid]|`{ AttHandleValueCfm }`|
|GATT_AddService|addService|uuid, numAttrs|none|
|GATT_DelService|delService|handle|none|
|GATT_AddAttribute|addAttribute|uuid, permissions|none|

*************************************************
<a name="tblGap"></a>
#### 3.1.5 ccbnp.gap APIs

* Result object: `{ status, opcode, dataLen, payload, collector }` 
* **Generated Event(s)** will be collected as key-value pairs within the `collector` object.  

| BLE Vendor-Cmd |    Cmd-API   | Arguments | Generated Event(s) |
| ------------- | ------------- | ------------- | ------------- |
|GAP_DeviceInit|deviceInit|profileRole, maxScanResponses, irk, csrk, signCounter|`{ GapDeviceInitDone }`|
|GAP_ConfigDeviceAddr|configDeviceAddr|bitMask, addr|`{ GapRandomAddrChanged }`|
|GAP_DeviceDiscoveryRequest|deviceDiscReq|mode, activeScan, whiteList|`{ [GapDeviceInfo], GapDeviceDiscovery }`|
|GAP_DeviceDiscoveryCancel|deviceDiscCancel|none|`{ GapDeviceDiscovery }`|
|GAP_MakeDiscoverable|makeDiscoverable|eventType, initiatorAddrType, initiatorAddr, channelMap, filterPolicy|`{ GapMakeDiscoverableDone, GapEndDiscoverableDone }`|
|GAP_UpdateAdvertisingData|updateAdvData|adType, daraLen, advertData|`{ GapAdvDataUpdateDone }`|
|GAP_EndDiscoverable|endDisc|none|`{ GapEndDiscoverableDone }`|
|GAP_EstablishLinkRequest|estLinkReq|highDutyCycle, whiteList, addrtypePeer, peerAddr|`{ GapLinkEstablished }`|
|GAP_TerminateLinkRequest|terminateLink|connHandle, reason|`{ GapLinkTerminated }`|
|GAP_Authenticate|authenticate|connHandle, secReq_ioCaps, secReq_oobAvailable, secReq_oob, secReq_authReq, secReq_maxEncKeySize, secReq_keyDist, pairReq_Enable, pairReq_ioCaps, pairReq_oobDataFlag, pairReq_authReq, pairReq_maxEncKeySize, pairReq_keyDist|`{ GapAuthenticationComplete }`|
|GAP_UpdateLinkParamReq|updateLinkParamReq|connHandle, intervalMin, intervalMax, connLatency, connTimeout|`{ GapLinkParamUpdate }`|
|GAP_PasskeyUpdate|passkeyUpdate|connHandle, passkey|none|
|GAP_SlaveSecurityRequest|slaveSecurityReqUpdate|connHandle, authReq|none|
|GAP_Signable|signable|connHandle, authenticated, csrk, signCounter|none|
|GAP_Bond|bond|connHandle, authenticated, ltk, div, rand, ltkSize|`{ GapBondComplete }`|
|GAP_TerminateAuth|terminateAuth|connHandle, reason|`{ GapAuthenticationComplete }`|
|GAP_SetParam|setParam|paramID, paramValue|none|
|GAP_GetParam|getParam|paramID|none|
|GAP_ResolvePrivateAddr|resolvePrivateAddr|irk, addr|none|
|GAP_SetAdvToken|setAdvToken|adType, advDataLen, advData|none|
|GAP_RemoveAdvToken|removeAdvToken|adType|none|
|GAP_UpdateAdvToken|updateAdvTokens|none|none|
|GAP_BondSetParam|bondSetParam|paramID, paramDataLan, paramData|none|
|GAP_BondGetParam|bondGetParam|paramID|none|

*************************************************
<a name="tblUtil"></a>
#### 3.1.6 ccbnp.util APIs

* Result object: `{ status, opcode, dataLen, payload, collector }`  
* **Generated Event(s)** will be collected as key-value pairs within the `collector` object.  

| BLE Vendor-Cmd |    Cmd-API   | Arguments | Generated Event(s) |
| ------------- | ------------- | ------------- | ------------- |
|UTIL_NVRead|nvRead|nvID, nvDataLen|none|
|UTIL_NVWrite|nvWrite|nvID, nvDataLen, nvData|none|
|UTIL_ForceBoot|forceBoot|none|none|

*************************************************
<a name="tblEvt"></a>
#### 3.1.7 Vendor-Specific HCI Events (Generated Event Types)

| Subgroup |       BLE Vendor-Evt       |      Generated Event Type        |                                                                                                             Data Object                                                                                                       |
|-----------|--------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| l2cap     | L2CAP_ConnParamUpdateRsp   | L2capParamUpdateRsp       | `{ status, connHandle, reason }`                                                                                                                                                                                                        |
| att       | ATT_ExchangeMtuRsp         | AttExchangeMtuRsp         | `{ status, connHandle, pduLen, serverRxMTU }`                                                                                                                                                                                           |
|           | ATT_FindInfoRsp            | AttFindInfoRsp            | `{ status, connHandle, pduLen, format, info }`                                                                                                                                                                                         |
|           | ATT_FindByTypeValueRsp     | AttFindByTypeValueRsp     | `{ status, connHandle, pduLen, handlesInfo }`                                                                                                                                                                                           |
|           | ATT_ReadByTypeRsp          | AttReadByTypeRsp          | `{ status, connHandle, pduLen, length, data }`                                                                                                                                                                                          |
|           | ATT_ReadRsp                | AttReadRsp                | `{ status, connHandle, pduLen, value }`                                                                                                                                                                                                 |
|           | ATT_ReadBlobRsp            | AttReadBlobRsp            | `{ status, connHandle, pduLen, value }`                                                                                                                                                                                                 |
|           | ATT_ReadMultiRsp           | AttReadMultiRsp           | `{ status, connHandle, pduLen, value }`                                                                                                                                                                                                 |
|           | ATT_ReadByGrpTypeRsp       | AttReadByGrpTypeRsp       | `{ status, connHandle, pduLen, length, data }`                                                                                                                                                                                          |
|           | ATT_WriteRsp               | AttWriteRsp               | `{ status, connHandle, pduLen }`                                                                                                                                                                                                        |
|           | ATT_PrepareWriteRsp        | AttPrepareWriteRsp        | `{ status, connHandle, pduLen, handle, offset, value }`                                                                                                                                                                                 |
|           | ATT_ExecuteWriteRsp        | AttExecuteWriteRsp        | `{ status, connHandle, pduLen }`                                                                                                                                                                                                        |
|           | ATT_HandleValueCfm         | AttHandleValueCfm         | `{ status, connHandle, pduLen }`                                                                                                                                                                                                        |
| gap       | GAP_DeviceInitDone         | GapDeviceInitDone         | `{ status, devAddr, dataPktLen, numDataPkts, IRK, CSRK }`                                                                                                                                                                               |
|           | GAP_DeviceDiscovery        | GapDeviceDiscovery        | `{ status, numDevs, devs }`                                                                                                                                                                                                                                  |
|           | GAP_AdvertDataUpdateDone   | GapAdvDataUpdateDone      | `{ status, adType }`                                                                                                                                                                                                                    |
|           | GAP_MakeDiscoverableDone   | GapMakeDiscoverableDone   | `{ status, interval }`                                                                                                                                                                                                                  |
|           | GAP_EndDiscoverableDone    | GapEndDiscoverableDone    | `{ status }`                                                                                                                                                                                                                            |
|           | GAP_LinkEstablished        | GapLinkEstablished        | `{ status, addrType, addr, connHandle, connInterval, connLatency, connTimeout, clockAccuracy }`                                                                                                                                         |
|           | GAP_LinkTerminated         | GapLinkTerminated         | `{ status, connHandle, reason }`                                                                                                                                                                                                        |
|           | GAP_LinkParamUpdate        | GapLinkParamUpdate        | `{ status, connHandle, connInterval, connLatency, connTimeout }`                                                                                                                                                                        |
|           | GAP_RandomAddrChanged      | GapRandomAddrChanged      | `{ status, addrType, newRandomAddr }`                                                                                                                                                                                                   |
|           | GAP_AuthenticationComplete | GapAuthenticationComplete | `{ status, connHandle, authState, secInfo, sec_ltkSize, sec_ltk, sec_div, sec_rand, devSecInfo, dev_ltkSize, dev_ltk, dev_div, dev_rand, identityInfo, identity_irk, identity_bd_addr, signingInfo, signing_irk, signing_signCounter }` |
|           | GAP_DeviceInformation      | GapDeviceInfo             | `{ status, eventType, addrType, addr, rssi, dataLen, dataField }`                                                                                                                                                                       |
|           | GAP_BondComplete           | GapBondComplete           | `{ status, connHandle }`                                                                                                                                                                                                                |

*************************************************
<br />

<a name="gattSpec"></a>
### 3.2 G​ATT Specifications 

In BLE, an attributes is the smallest data entity defined by GATT. Attributes are used to describe the hierarchical data organization, such as **Services** and **Characteristics**, and pieces of the user data. A Service conceptually groups all the related Characteristics together, and each **Characteristic** always contain at least two attributes: _Characteristic Declaration_ and _Characteristic Value_.  

**cc-bnp** will automatically parse the attributes if they are publicly SIG-defined ones.  

*************************************************
#### 3.2.1 Declarations

* A [**Declaration**](https://developer.bluetooth.org/gatt/declarations/Pages/DeclarationsHome.aspx) is an attribute to indicate the type of a GATT profile attribute. There are four types of GATT profile attributes defined by SIG, they are **Primary Service**(0x2800), **Secondary Service**(0x2801), **Include**(0x2802), and **Characteristic**(0x2803).  
* In **cc-bnp**, a **Declaration** attribute will be parsed into an object with **Field Names**(keys) listed in the following table and **Field types** tells each data type of the corresponding field.  

| UUID | Field Names | Field types | 
|  -------------  |  -------------  |  -------------  | 
| 0x2800 | uuid | uuid | 
| 0x2801 | uuid | uuid | 
| 0x2802 | serviceAttrHandle, endGroupHandle, uuid | uint16, uint16, uuid | 
| 0x2803 | properties, handle, uuid | uint8, uint16, uuid | 

*************************************************
#### 3.2.2 Descriptors

* A **Descriptor** is an attribute that describes a Characteristic Value.  
* In **cc-bnp**, a **Descriptor** will be parsed into an object with **Field Names**(keys) listed in the following table.  

**Note**:  

* A field type of **_list(type)_** indicates that value of this field is an array and _(type)_ tells the data type of each entry in it.  

| UUID | Field Names | Field types | 
| ------------- | ------------- | ------------- | 
| 0x2900 | properties | uint16 | 
| 0x2901 | userDescription | string | 
| 0x2902 | properties | uint16 | 
| 0x2903 | properties | uint16 | 
| 0x2904 | format, exponent, unit, namespace, description | uint8, int8, uint16, uint8, uint16 | 
| 0x2905 | listOfHandles | list(uint16) | 
| 0x2907 | extReportRef | uuid | 
| 0x2908 | reportID, reportType | uint8, uint8 | 
| 0x2909 | noOfDigitals | uint8 | 
| 0x290a | **condition**, analog(`1,2,3`), bitMask(`4`), analogInterval(`5,6`) | uint8, uint16, uint8, uint32 | 
| 0x290b | triggerLogic | uint8 | 
| 0x290c | flags, samplFunc, measurePeriod, updateInterval, application, measureUncertainty | uint16, uint8, uint24, uint24, uint8, uint8 | 
| 0x290e | **condition**, none(`0`), timeInterval(`1,2`), count(`3`) | uint8, uint8, uint24, uint16 | 

* Note about the **'condition'** field
    - The `'condition'` field is used to pick which fields should be parsed into the result object.  
    - For example, analogInterval(`5,6`) indicates that the result object will have `analogInterval` field if `condition` equals to 5 or 6.  
    - Here is an example of the result object. (The Descriptor with UUID 0x290a **may** have fields: `analog`, `bitMask`, and `analogInterval`, and which one will be picked depends on the value of `condition`)  

    ```JavaScript
    {   // Result object of Descriptor with UUID 0x290a
        condition: 5,
        analogInterval: 3000    // analogInterval(5,6)
    }
    ```

*************************************************
#### 3.2.3 Characteristics  

* A [Characteristic](https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicsHome.aspx) is a container of the user data. It is defined by
    * **UUID**: a 16-bit number defined by SIG to represent a attribute
    * **Value**: actual value of the user data which is a piece of bytes

* **Value** is a logical value and cc-bnp will further parse it into an object according to particular rules. The following table gives the fields and their data types of a parsed object.  
* The 'flags' field tells how to parse the **Value**, and the rule is given with something like tempF(`bit0`) and tempC(`!bit0`).  
    - tempF(`bit0`) means that if bit0 of 'flags' is 1, the field `tempF` will be picked and parsed.  
    - tempC(`!bit0`) means that if bit0 of 'flags' is 0, the field `tempC` will be picked and parsed.  
    - medicationL(`bit4 & bit5`) means that if bit4 and bit5 of 'flags' are both 1, the field `medicationL` will be picked and parsed.  
    - Here is an example of the parsed result object of a Characteristic with UUID 0x2a1c

        ```JavaScript
        {   // Result object of UUID 0x2a1c 
            flags: 2,       // bit0 = 0, bit1 = 1, bit2 = 0
            tempC: 21.5,    // tempC(!bit0)
            year: 2015,     // year(bit1)
            month: 12,      // month(bit1)
            day: 25,        // day(bit1)
            hours: 21,      // hours(bit1)
            minutes: 36,    // minutes(bit1) 
            seconds: 12     // seconds(bit1) 
        }
        ```

<br />

**Note**:  

* A field type of **_list(type)_** indicates that value of this field is an array and _(type)_ tells the data type of each entry in it.  

```JavaScript
{   // Result object of UUID 0x2a22, Field type: list(uint8)
    bootKeyboardInputReport: [1, 2, 3]
}
```

* cc-bnp will not build and parse the packet comes with the following commands, since the input to each command is probably not an eligible Characteristic Value.  
    * `'ATT_ReadBlobRsp'`, `'ATT_PrepareWriteReq'`, `'ATT_PrepareWriteRsp'`,  `'GATT_WriteLongCharValue'`, `'GATT_ReliableWrites'`
* cc-bnp will not build and parse the Characteristic Value comes with the following UUIDs, since there are fields with variable length, optional, or unknown.  
    * `'0x2a2a'`, `'0x2a55'`, `'0x2a5a'`, `'0x2a63'`, `'0x2a64'`, `'0x2a66'`, `'0x2a6b'`, `'0x2aa4'`, `'0x2aa7'`, `'0x2aa9'`, `'0x2aaa'`, `'0x2aab'`, `'0x2aac'`

| UUID | Field Names | Filed types |
|  -------------  |  -------------  |  -------------  | 
| 0x2a00 | name | string | 
| 0x2a01 | category | uint16 | 
| 0x2a02 | flag | boolean | 
| 0x2a03 | addr | addr6 | 
| 0x2a04 | minConnInterval, maxConnInterval, latency, timeout | uint16, uint16, uint16, uint16 | 
| 0x2a05 | startHandle, endHandle | uint16, uint16 | 
| 0x2a06 | alertLevel | uint8 | 
| 0x2a07 | txPower | int8 | 
| 0x2a08 | year, month, day, hours, minutes, seconds | uint16, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a09 | dayOfWeek | uint8 | 
| 0x2a0a | year, month, day, hours, minutes, seconds, dayOfWeek | uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a0c | year, month, day, hours, minutes, seconds, dayOfWeek, fractions256 | uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a0d | dstOffset | uint8 | 
| 0x2a0e | timeZone | int8 | 
| 0x2a0f | timeZone, dstOffset | int8, uint8 | 
| 0x2a11 | year, month, day, hours, minutes, seconds, dstOffset | uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a12 | accuracy | uint8 | 
| 0x2a13 | timeSource | uint8 | 
| 0x2a14 | source, accuracy, daySinceUpdate, hourSinceUpdate | uint8, uint8, uint8, uint8 | 
| 0x2a16 | timeUpdateCtrl | uint8 | 
| 0x2a17 | currentState, result | uint8, uint8 | 
| 0x2a18 | flags, sequenceNum, year, month, day, hours, minutes, seconds, timeOffset(`bit0`), glucoseKg(`bit1 & !bit2`), glucoseMol(`bit1 & bit2`), type(`bit2`), sampleLocation(`bit2`), sensorStatus(`bit3`) | uint8, uint16, uint16, uint8, uint8, uint8, uint8, uint8,  | int16, sfloat, sfloat, nibble, nibble, uint16 | 
| 0x2a19 | level | uint8 | 
| 0x2a1c | flags, tempC(`!bit0`), tempF(`bit0`), year(`bit1`), month(`bit1`), day(`bit1`), hours(`bit1`), minutes(`bit1`), seconds(`bit1`), tempType(`bit2`) | uint8, float, float, uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a1d | tempTextDesc | uint8 | 
| 0x2a1e | flags, tempC(`!bit0`), tempF(`bit0`), year(`bit1`), month(`bit1`), day(`bit1`), hours(`bit1`), minutes(`bit1`), seconds(`bit1`), tempType(`bit2`) | uint8, float, float, uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a21 | measureInterval | uint16 | 
| 0x2a22 | bootKeyboardInput | list(uint8) | 
| 0x2a23 | manufacturerID, organizationallyUID | addr5, addr3 | 
| 0x2a24 | modelNum | string | 
| 0x2a25 | serialNum | string | 
| 0x2a26 | firmwareRev | string | 
| 0x2a27 | hardwareRev | string | 
| 0x2a28 | softwareRev | string | 
| 0x2a29 | manufacturerName | string | 
| 0x2a2b | year, month, day, hours, minutes, seconds, dayOfWeek, fractions256, adjustReason | uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a2c | magneticDeclination | uint16 | 
| 0x2a31 | scanRefresh | uint8 | 
| 0x2a32 | bootKeyboardOutput | list(uint8) | 
| 0x2a33 | bootMouseInput | list(uint8) | 
| 0x2a34 | flags, sequenceNum, extendedFlags(`bit7`), carbohydrateID(`bit0`), carbohydrate(`bit0`), meal(`bit1`), tester(`bit1`), health(`bit2`), exerciseDuration(`bit3`), exerciseIntensity(`bit3`), medicationID(`bit4`), medicationKg(`bit4 & !bit5`), medicationL(`bit4 & bit5`), hbA1c(`bit6`) | uint8, uint16, uint8, uint8, sfloat, uint8, nibble, nibble, uint16, uint8, uint8, sfloat, sfloat, sfloat | 
| 0x2a35 | flags, systolicMmHg(`!bit0`), diastolicMmHg(`!bit0`), arterialPresMmHg(`!bit0`), systolicKpa(`bit0`), diastolicKpa(`bit0`), arterialPresKpa(`bit0`), year(`bit1`), month(`bit1`), day(`bit1`), hours(`bit1`), minutes(`bit1`), seconds(`bit1`), pulseRate(`bit2`), userID(`bit3`), status(`bit4`) | uint8, sfloat, sfloat, sfloat, sfloat, sfloat, sfloat, uint16, uint8, uint8, uint8, uint8, uint8, sfloat, uint8, uint16 | 
| 0x2a36 | flags, systolicMmHg(`!bit0`), diastolicMmHg(`!bit0`), arterialPresMmHg(`!bit0`), systolicKpa(`bit0`), diastolicKpa(`bit0`), arterialPresKpa(`bit0`), year(`bit1`), month(`bit1`), day(`bit1`), hours(`bit1`), minutes(`bit1`), seconds(`bit1`), pulseRate(`bit2`), userID(`bit3`), status(`bit4`) | uint8, sfloat, sfloat, sfloat, sfloat, sfloat, sfloat, uint16, uint8, uint8, uint8, uint8, uint8, sfloat, uint8, uint16 | 
| 0x2a37 | flags, heartRate8(`!bit0`), heartRate16(`bit0`), energyExpended(`bit3`), rrInterval(`bit4`) | uint8, uint8, uint16, uint16, uint16 | 
| 0x2a38 | bodySensorLocation | uint8 | 
| 0x2a39 | heartRateCtrl | uint8 | 
| 0x2a3f | alertStatus | uint8 | 
| 0x2a40 | ringerCtrlPoint | uint8 | 
| 0x2a41 | ringerSet | uint8 | 
| 0x2a42 | categoryIDBitMask0, categoryIDBitMask1 | uint8, uint8 | 
| 0x2a43 | categoryID | uint8 | 
| 0x2a44 | commID, categoryID | uint8, uint8 | 
| 0x2a45 | categoryID, unreadCount | uint8, uint8 | 
| 0x2a46 | categoryID, newAlert, textStringInfo | uint8, uint8, string | 
| 0x2a47 | categoryIDBitMask0, categoryIDBitMask1 | uint8, uint8 | 
| 0x2a48 | categoryIDBitMask0, categoryIDBitMask1 | uint8, uint8 | 
| 0x2a49 | feature | uint16 | 
| 0x2a4a | bcdHID, bCountryCode, flags | uint16, uint8, uint8 | 
| 0x2a4b | reportMap | list(uint8) | 
| 0x2a4c | hidCtrl | uint8 | 
| 0x2a4d | report | list(uint8) | 
| 0x2a4e | protocolMode | uint8 | 
| 0x2a4f | leScanInterval, leScanWindow | uint16, uint16 | 
| 0x2a50 | vendorIDSource, vendorID, productID, productVersion | uint8, uint16, uint16, uint16 | 
| 0x2a51 | feature | uint16 | 
| 0x2a52 | opcode, operand | uint8, uint8, uint8 | 
| 0x2a53 | flags, speed, cadence, strideLength(`bit0`), totalDist(`bit1`) | uint8, uint16, uint8, uint16, uint32 | 
| 0x2a54 | feature | uint16 | 
| 0x2a56 | digital | uint8 | 
| 0x2a58 | analog | uint16 | 
| 0x2a5b | flags, cumulativeWheelRev(`bit0`), lastWheelEventTime(`bit0`), cumulativeCrankRev(`bit1`), lastCrankEventTime(`bit1`) | uint8, uint32, uint16, uint16, uint16 | 
| 0x2a5c | feature | uint16 | 
| 0x2a5d | sensorLocation | uint8 | 
| 0x2a5e | flags, spotCheckSpO2, spotCheckPr, year(`bit0`), month(`bit0`), day(`bit0`), hours(`bit0`), minutes(`bit0`), seconds(`bit0`), measureStatus(`bit1`), deviceAndSensorStatus(`bit2`), pulseAmpIndex(`bit3`) | uint8, sfloat, sfloat, uint16, uint8, uint8, uint8, uint8, uint8, uint16, uint24, sfloat | 
| 0x2a5f | flags, normalSpO2, normalPR, fastSpO2(`bit0`), fastPR(`bit0`), slowSpO2(`bit1`), slowPR(`bit1`), measureStatus(`bit2`), deviceAndSensorStatus(`bit3`), pulseAmpIndex(`bit4`) | uint8, sfloat, sfloat, sfloat, sfloat, sfloat, sfloat, uint16, uint24, sfloat | 
| 0x2a65 | feature | uint32 | 
| 0x2a67 | flags, instantSpeed(`bit0`), totalDist(`bit1`), latitude(`bit2`), longitude(`bit2`), elevation(`bit3`), heading(`bit4`), rollingTime(`bit5`), year(`bit6`), month(`bit6`), day(`bit6`), hours(`bit6`), minutes(`bit6`), seconds(`bit6`) | uint8, uint16, uint24, int32, int32, int24, uint16, uint8, uint16, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a68 | flags, bearing, heading, remainingDist(`bit0`), remainingVertDist(`bit1`), year(`bit2`), month(`bit2`), day(`bit2`), hours(`bit2`), minutes(`bit2`), seconds(`bit2`) | uint8, uint16, uint16, uint24, int24, uint16, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a69 | flags, beaconsInSolution(`bit0`), beaconsInView(`bit1`), timeToFirstFix(`bit2`), ehpe(`bit3`), evpe(`bit4`), hdop(`bit5`), vdop(`bit6`) | uint8, uint8, uint8, uint16, uint32, uint32, uint8, uint8 | 
| 0x2a6a | feature | uint32 | 
| 0x2a6c | elevation | int24 | 
| 0x2a6d | pressure | uint32 | 
| 0x2a6e | temp | int16 | 
| 0x2a6f | humidity | uint16 | 
| 0x2a70 | trueWindSpeed | uint16 | 
| 0x2a71 | trueWindDirection | uint16 | 
| 0x2a72 | apparentWindSpeed | uint16 | 
| 0x2a73 | apparentWindDirection | uint16 | 
| 0x2a74 | gustFactor | uint8 | 
| 0x2a75 | pollenConc | uint24 | 
| 0x2a76 | uvIndex | uint8 | 
| 0x2a77 | irradiance | uint16 | 
| 0x2a78 | rainfall | uint16 | 
| 0x2a79 | windChill | int8 | 
| 0x2a7a | heatIndex | int8 | 
| 0x2a7b | dewPoint | int8 | 
| 0x2a7d | flag, uuid | uint16, uuid | 
| 0x2a7e | lowerLimit | uint8 | 
| 0x2a7f | threshold | uint8 | 
| 0x2a80 | age | uint8 | 
| 0x2a81 | lowerLimit | uint8 | 
| 0x2a82 | upperLimit | uint8 | 
| 0x2a83 | threshold | uint8 | 
| 0x2a84 | upperLimit | uint8 | 
| 0x2a85 | year, month, day | uint16, uint8, uint8 | 
| 0x2a86 | year, month, day | uint16, uint8, uint8 | 
| 0x2a87 | emailAddr | string | 
| 0x2a88 | lowerLimit | uint8 | 
| 0x2a89 | upperLimit | uint8 | 
| 0x2a8a | firstName | string | 
| 0x2a8b | veryLightAndLight, lightAndModerate, moderateAndHard, hardAndMax | uint8, uint8, uint8, uint8 | 
| 0x2a8c | gender | uint8 | 
| 0x2a8d | heartRateMax | uint8 | 
| 0x2a8e | height | uint16 | 
| 0x2a8f | hipCircumference | uint16 | 
| 0x2a90 | lastName | string | 
| 0x2a91 | maxHeartRate | uint8 | 
| 0x2a92 | restingHeartRate | uint8 | 
| 0x2a93 | sportType | uint8 | 
| 0x2a94 | lightAndModerate, moderateAndHard | uint8, uint8 | 
| 0x2a95 | fatburnAndFitness | uint8 | 
| 0x2a96 | vo2Max | uint8 | 
| 0x2a97 | waistCir | uint16 | 
| 0x2a98 | weight | uint16 | 
| 0x2a99 | changeIncrement | uint32 | 
| 0x2a9a | userIndex | uint8 | 
| 0x2a9b | feature | uint32 | 
| 0x2a9c | flags, bodyFatPercent, year(`bit1`), month(`bit1`), day(`bit1`), hours(`bit1`), minutes(`bit1`), seconds(`bit1`), userID(`bit2`), basalMetabolism(`bit3`), musclePercent(`bit4`), muscleMassKg(`!bit0 & bit5`), muscleMassPounds(`bit0 & bit5`), fatFreeMassKg(`!bit0 & bit6`), fatFreeMassPounds(`bit0 & bit6`), softLeanMassKg(`!bit0 & bit7`), softLeanMassPounds(`bit0 & bit7`), bodyWaterMassKg(`!bit0 & bit8`), bodyWaterMassPounds(`bit0 & bit8`), impedance(`bit9`), weightKg(`!bit0 & bit10`), weightPounds(`bit0 & bit10`), heightMeters(`!bit0 & bit11`), heightInches(`bit0 & bit11`) | uint16, uint16, uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16 | 
| 0x2a9d | flags, weightSI(`!bit0`), weightImperial(`bit0`), year(`bit1`), month(`bit1`), day(`bit1`), hours(`bit1`), minutes(`bit1`), seconds(`bit1`), userID(`bit2`), bmi(`bit3`), heightSI(`!bit0 & bit3`), heightImperial(`bit0 & bit3`) | uint8, uint16, uint16, uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16 | 
| 0x2a9e | feature | uint32 | 
| 0x2a9f | opcode, parameter | uint8, buffer |
| 0x2aa0 | xAxis, yAxis | int16, int16 | 
| 0x2aa1 | xAxis, yAxis, zAxis | int16, int16, int16 | 
| 0x2aa2 | language | string | 
| 0x2aa3 | barometricPresTrend | uint8 | 
| 0x2aa5 | feature | uint24 | 
| 0x2aa6 | addrResolutionSup | uint8 | 
| 0x2aa8 | feature, type, sampleLocation, e2eCrc | uint24, nibble, nibble, uint16 | 
| 0x2aad | indoorPosition | uint8 | 
| 0x2aae | latitude | int32 | 
| 0x2aaf | longitude | int32 | 
| 0x2ab0 | localNorthCoordinate | int16 | 
| 0x2ab1 | localEastCoordinate | int16 | 
| 0x2ab2 | floorNum | uint8 | 
| 0x2ab3 | altitude | uint16 | 
| 0x2ab4 | uncertainty | uint8 | 
| 0x2ab5 | locationName | string | 
| 0x2ab6 | uri | string | 
| 0x2ab7 | httpHeaders | string | 
| 0x2ab8 | statusCode, dataStatus | uint16, uint8 | 
| 0x2ab9 | httpEntityBody | string | 
| 0x2aba | opcode | uint8 | 
| 0x2abb | httpsSecurity | boolean | 
| 0x2abc | opcode, organizationID, parameter | uint8, uint8, buffer |
| 0x2abd | oacpFeatures, olcpFeatures | uint32, uint32 | 
| 0x2abe | objectName | string | 
| 0x2abf | objectType | uuid | 

<br />

<a name="errCodes"></a>
### 3.3 Error Message

The error returned from BNP will pass to the callback as an error object. The error message is a string formatted as  

```sh
    HciError(10): Synch conn limit exceeded
```

, where 'HciError' denotes the type of error and number 10 is the corresponding error code.  

#### 3.3.1 HciError
  
|Error code|Description|
| ------------- | ------------- |
|   1 | Unknown hci cmd |
|   2 | Unknown conn id |
|   3 | Hw failure |
|   4 | Page timeout |
|   5 | Auth failure |
|   6 | Pin key missing |
|   7 | Mem cap exceeded |
|   8 | Conn timeout |
|   9 | Conn limit exceeded |
|  10 | Synch conn limit exceeded |
|  11 | Acl conn already exists |
|  12 | Cmd disallowed |
|  13 | Conn rej limited resources |
|  14 | Conn rejected security reasons |
|  15 | Conn rejected unacceptable bdaddr |
|  16 | Conn accept timeout exceeded |
|  17 | Unsupported feature param value |
|  18 | Invalid hci cmd params |
|  19 | Remote user term conn |
|  20 | Remote device term conn low resources |
|  21 | Remote device term conn power off |
|  22 | Conn term by local host |
|  23 | Repeated attempts |
|  24 | Pairing not allowed |
|  25 | Unknown lmp pdu |
|  26 | Unsupported remote feature |
|  27 | Sco offset rej |
|  28 | Sco interval rej |
|  29 | Sco air mode rej |
|  30 | Invalid lmp params |
|  31 | Unspecified error |
|  32 | Unsupported lmp param val |
|  33 | Role change not allowed |
|  34 | Lmp ll resp timeout |
|  35 | Lmp err transaction collision |
|  36 | Lmp pdu not allowed |
|  37 | Encrypt mode not acceptable |
|  38 | Link key can not be changed |
|  39 | Req qos not supported |
|  40 | Instant passed |
|  41 | Pairing with unit key not supported |
|  42 | Different transaction collision |
|  43 | Reserved 1 |
|  44 | Qos unacceptable param |
|  45 | Qos rej |
|  46 | Chan assessment not supported |
|  47 | Insufficient security |
|  48 | Param out of mandatory range |
|  49 | Reserved 2 |
|  50 | Role switch pending |
|  51 | Reserved 3 |
|  52 | Reserved slot violation |
|  53 | Role switch failed |
|  54 | Extended inquiry resp too large |
|  55 | Simple pairing not supported by host |
|  56 | Host busy pairing |
|  57 | Conn rej no suitable chan found |
|  58 | Controller busy |
|  59 | Unacceptable conn interval |
|  60 | Directed adv timeout |
|  61 | Conn term mic failure |
|  62 | Conn failed to establish |
|  63 | Mac conn failed |

*************************************************
#### 3.3.2 AttError
  
|Error code|Description|
| ------------- | ------------- |
|  1 | The attribute handle given was not valid on this server |
|  2 | The attribute cannot be read |
|  3 | The attribute cannot be written |
|  4 | The attribute PDU was invalid |
|  5 | The attribute requires authentication before it can be read or written |
|  6 | Attribute server does not support the request received from the client |
|  7 | Offset specified was past the end of the attribute |
|  8 | The attribute requires authorization before it can be read or written |
|  9 | Too many prepare writes have been queued |
| 10 | No attribute found within the given attribute handle range |
| 11 | The attribute cannot be read or written using the Read Blob Request |
| 12 | The Encryption Key Size used for encrypting this link is insufficient |
| 13 | The attribute value length is invalid for the operation |
| 14 | The attribute request that was requested has encountered an error that was unlikely |
| 15 | The attribute requires encryption before it can be read or written |
| 16 | The attribute type is not a supported grouping attribute as defined by a higher layer specification |
| 17 | Insufficient Resources to complete the request |
|128 | The attribute value is invalid for the operation |

*************************************************
#### 3.3.3 GenericError
  
|Error code|Description|
| ------------- | ------------- |
|  1 | Failure |
|  2 | Invalidparameter |
|  3 | Invalid task |
|  4 | Msg buffer not avail |
|  5 | Invalid msg pointer |
|  6 | Invalid event id |
|  7 | Invalid interrupt id |
|  8 | No timer avail |
|  9 | Nv item uninit |
| 10 | Nv oper failed |
| 11 | Invalid mem size |
| 12 | Nv bad item len |
| 16 | Ble Not Ready |
| 17 | Ble Already In Requested Mode |
| 18 | Ble Incorrect Mode |
| 19 | Ble MemAlloc Error |
| 20 | Ble Not Connected |
| 21 | Ble No Resources |
| 22 | Ble Pending |
| 23 | Ble Timeout |
| 24 | Ble Invalid Range |
| 25 | Ble Link Encrypted |
| 26 | Ble Procedure Complete |
| 48 | Ble GAP User Canceled |
| 49 | Ble GAP Conn Not Acceptable |
| 50 | Ble GAP Bond Rejected |
| 64 | Ble Invalid PDU |
| 65 | Ble Insufficient Authen |
| 66 | Ble Insufficient Encrypt |
| 67 | Ble Insufficient KeySize |

*************************************************

<br />

<a name="reasonCodes"></a>
### 3.4 Reason Code of Link-termination
  
|Value|Description|
| ------------- | ------------- |
|   8 | Supervisor Timeout |
|  19 | Peer Requested |
|  22 | Host Requested |
|  34 | Control Packet Timeout |
|  40 | Control Packet Instant Passed |
|  59 | LSTO Violation |
|  61 | MIC Failure |

<br />

<a name="Contributors"></a>
## 4. Contributors
  
* [Hedy Wang](https://www.npmjs.com/~hedywings)  
* [Peter Yi](https://www.npmjs.com/~petereb9)
* [Simen Li](https://www.npmjs.com/~simenkid)

<br />

<a name="License"></a>
## 5. License
  
The MIT License (MIT)

Copyright (c) 2015 
Hedy Wang <hedywings@gmail.com>, Peter Yi <peter.eb9@gmail.com>, and Simen Li <simenkid@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
