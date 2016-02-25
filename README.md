cc-bnp
===============

**cc-bnp** is the interface for communicating with TI **CC**254X **B**LE **N**etwork **P**rocessor(BNP) over a serial port.

<br>
Overview
--------
**cc-bnp** allows you to interact with TI's CC254X BLE network processor(BNP) on node.js via *TI BLE Vendor-Specific HCI Command APIs*. Each Command API function is in an asynchronous manner and supports both err-back callback style and promise-style.

**cc-bnp** helps you to get rid of multiple *Vendor-Specific Events* handling of each command. **cc-bnp** gathers the multiple responses up, and finally passes the result to the Command API callback. With **cc-bnp**, it's easy and fun in designing BLE applications on node.js.

BLE Network Processor (BNP)
--------
The following diagram shows the scenario when CC254X operates as a BNP. In this case, the controller and host are implemented together on the CC2540/41, and the application can be externally developed on an application processor (e.g., another mcu or PC). The application and profiles can communicate with BNP via TI's vendor-specific HCI commands upon an UART interface.

![Network Processor Configuration](https://raw.githubusercontent.com/hedywings/cc-bnp/master/documents/bnp.png)


Basic and Command APIs
--------
**cc-bnp** provides two kinds of APIs, Each Command API in **cc-bnp** supports both the err-back callback style and promise-style.

#### 1. [Basic APIs and Events](#basic_apis)
The basic APIs are about how to initialize the BNP with a given role and how to close the connection from the processor. After the BNP accomplishes the initializing procedure, a `'ready'` event will be fired by **cc-bnp** . When there comes a BLE indication message, **cc-bnp** will fire an `'ind'` event along with the message content.

* [.init(config, role, [callback])](#init)
* [.close([callback])](#close)
* [.regChar(regObj)](#regChar)
* [.on('ready', callback)](#onReady)
* [.on('ind', callback)](#onInd)

#### 2. [TI's BLE Vendor-Specific HCI Command APIs](#vendorHci)
TI's BLE Vendor-Specific HCI Commands are used to communicate with the CC254X BNP. These commands are organized in API subgroubps: hci, l2cap, att, gatt, gap, and util.

| Command SubGroup (CSG) |  Namespace  | Number of Commands |
|:----------------------:|:-----------:|:------------------:|
|           hci          |  [ccbnp.hci](#tblHci)  |         32         |
|          l2cap         | [ccbnp.l2cap](#tblL2cap) |          1         |
|           att          |  [ccbnp.att](#tblAtt)  |         26         |
|          gatt          |  [ccbnp.gatt](#tblGatt) |         25         |
|           gap          |  [ccbnp.gap](#tblGap)  |         24         |
|          util          | [ccbnp.util](#tblUtil) |          3         |

<br>
Installation
------------
Available via [npm](https://www.npmjs.com/package/ccbnp):
> $ npm install cc-bnp --save

<br>
Usage
--------
To begin with **cc-bnp**, you must firstly set up the serial port and initialize the BNP with a given role. To do this, simply call the .init() method:
```javascript
    var ccbnp = require('ccbnp');
    var cfg = {
        path: '/dev/ttyUSB0'
    };

    ccbnp.on('ready', function () {
        console.log('Initialization completes.');
    });

    ccbnp.init(cfg, 'central');
```
Here are some [examples](https://github.com/hedywings/cc-bnp/blob/master/examples/ble_connect.js).

<br>
<a name="basic_apis"></a>
Basic APIs and Events
-------

<a name="init"></a>
### .init(config, role, [callback])
This method will connect to the CC254X SoC upon a serial port as well as initialize the BNP with a given role.

**Arguments**

- config (*Object*): This value-object has two properties `path` and `options` for configuring the serial port. 
    - `path` - The `path` property is a string that refers to the system path of the serial port, e.g., `'/dev/ttyUSB0'`. 
    - `options` - The `options` property is a value-object for setting up the [seiralport](https://www.npmjs.com/package/serialport#to-use) instance. The default value of `options` is shown in the following example.
- role (*String*): The device role. **cc-bnp** supports four types of single role and two types of multi-roles:
    - `'broadcaster'` - Single role. An advertiser that is non-connectable.
    - `'observer'` - Single role. An observer that scans for advertisements. It can not initiate connections.
    - `'peripheral'` - Single role. An advertiser that operates as a slave in a single link layer connection.
    - `'central'` - Single role. A central that scans for advertisements and operates as a master in a single or multiple link layer connections.
    - `'central_broadcaster'` - Multi-roles. The processor plays as a central and a broadcaster.
    - `'peripheral_observer'` - Multi-roles. The processor plays as a peripheral and an observer.
- callback(err, result)
    - `'err'` (*Error*) - [Error Message](#errcodes)
    - `'result'` (*Object*) - Device information that contains the following properties:
```sh
    {
        devAddr: '0x78c5e59b5ef8',                           // Device public address
        irk: <Buffer 72 74 73 20 3d 20 44 75 70 6c 65 78 3b 0a 0a 2f>, // 16 bytes Identity Resolving Key
        csrk: <Buffer 2a 3c 72 65 70 6c 61 63 65 6d 65 6e 74 3e 2a 2f> // 16 bytes Connection Signature Resolving Key
    }
```

**Returns**  

- (*Promise*)

**Example**
```javascript
    var ccbnp = require('ccbnp'),
        role = 'broadcaster',
        cfg = {
            path: '/dev/ttyUSB0',
            options: {
                baudrate: 115200,   // default
                dataBits: 8,        // default
                stopBits: 1,        // default
                parity: 'none',     // default
                bufferSize: 255     // default
            }
        };

    // In callback-style
    ccbnp.init(cfg, role, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });

    // In promise-style
    ccbnp.init(cfg, role).then(function (result) {
        console.log(result);
    }).fail(function (err) {
        console.log(err);
    }).done();
```
<br>
<a name="close"></a>
### .close([callback])
This method will close the opened serial port.

**Arguments**

- callback(err)
    - `'err'` (*Error*) - [Error Message](#errcodes)

**Returns**  

- (*Promise*)

**Example**
```javascript
    ccbnp.close(function (err) {
        if (err) console.log(err);
    });
```
<br>
<a name="regChar"></a>
### .regChar(regObj)
This method is used to register characteristic UUID and characteristic value format.

If the characteristic UUID has been defined by [GATT Specifications](#gattdata) or registered by using this method, the corresponding characteristic value will be parsed according to the value format you have registered.

This method can overwrite UUID definition which is defined by [GATT Specifications](#gattdata).

**Arguments**

- regObj (*Object*): This object has three properties of `uuid`, `params` and `types`. 
    - `uuid` (*String*) - The characteristic UUID needs to be registered. 
    - `params` (*Array*) - Field names of characteristic value corresponding to `uuid`.
    - `types` (*Array*) - `types` used to type each data in the `params` array.

    Note: The order of entries in `types` and `params` array should be exactly matched.

**Returns**  

- (*none*)

**Example**
```javascript
    var regObj = {
        uuid: '0xfff1',
        params: ['fieldName0', 'fieldName1', 'fieldName2'],
        types: ['uint8', 'uint16', 'float']
    };
    ccbnp.regChar(regObj);
```
<br>
<a name="onReady"></a>
### .on('ready', callback)
The `'ready'` event is fired when the initializing procedure completes.

**Arguments**

- callback(result)
    - `'result'` (*Object*)- Device information that contains the following properties:
```sh
    {
        devAddr: '0x78c5e59b5ef8',                            // Device public address
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
<br>
<a name="onInd"></a>
### .on('ind', callback)
When there is a *BLE indication* message coming from BNP, the **cc-bnp** fires an `'ind'` event along with a message object.    

**Arguments**

- callback(msg)
    - msg (*Object*): This message object has two properties of `type` and `data`. The `type` denotes the type of the *BLE indication* message. The `data` is the content of the corresponding message. With the indication type of `'linkTerminated'`, you can find the reason of link termination from the [reason codes table](#reasoncodes).
    ```javascript
    ccbnp.on('ind', function (msg) {
        console.log(msg.type);
        console.log(msg.data);
    });
    ```

    - msg.type (*String*)
        * `'linkEstablished'`   - TI Vendor-Specific Event **GAP\_LinkEstablished**
        * `'linkTerminated'`    - TI Vendor-Specific Event **GAP\_LinkTerminated**
        * `'linkParamUpdate'`   - TI Vendor-Specific Event **GAP\_LinkParamUpdate**
        * `'attNoti'`           - TI Vendor-Specific Event **ATT\_HandleValueNoti**
        * `'attInd'`            - TI Vendor-Specific Event **ATT\_HandleValueInd**
        * `'authenComplete'`    - TI Vendor-Specific Event **GAP\_AuthenticationComplete**
        * `'passkeyNeeded'`     - TI Vendor-Specific Event **GAP\_PasskeyNeeded**
        * `'bondComplete'`      - TI Vendor-Specific Event **GAP\_BondComplete**

    - msg.data (*Object*)   

    ```sh
    When (msg.type === 'linkEstablished'):
    msg.data = {
        addr: '0x9059af0b8159',   // Address of the connected device
        connHandle: 0,      // Handle of the connection
        connInterval: 80,   // Connection interval used on this connection, time = 80 * 1.25 msec
        connLatency: 0,     // Connection latency used on this connection
        connTimeout: 2000,  // Connection supervision timeout, time = 2000 * 10 msec
        clockAccuracy: 0,   // The accuracy of clock 
    }
    ```

    ```sh
    When (msg.type === 'linkTerminated'):
    msg.data = {
        connHandle: 0,      // Connection Handle of the terminated link
        reason: 8,          // The reason of termination
    }
    ```

    ```sh
    When (msg.type === 'linkParamUpdate'):
    msg.data = {
        connHandle: 0,
        connInterval: 80,
        connLatency: 0,
        connTimeout: 2000
    }
    ```

    ```sh
    When (msg.type === 'attNoti'):
    msg.data = {
        connHandle: 0,
        authenticated: 0,       // Whether or not an authenticated link is required
        handle: 93,             // The handle of the attribute
        value: <Buffer C3 01>   // The value of the attribute 
    }
    ```

    ```sh
    When (msg.type === 'attInd'):
    msg.data = {
        connHandle: 0,
        authenticated: 0,
        handle: 94,
        value: <Buffer 08 00>
    }    
    ```

    ```sh
    When (msg.type === 'authenComplete'):
    msg.data = {
        connHandle: 0,
        mitm: 1, //0 or 1 means true or false
        bond: 1, //0 or 1 means true or false
        ltk: <Buffer 23:84:1A:D8:95:C9:ED:6C:B6:4E:47:F4:44:F3:E4:73>,
        div: 0x668b,
        rand: <Buffer 6E 68 CE EE DC D6 E9 99>
    }    
    ```

    ```sh
    When (msg.type === 'passkeyNeeded'):
    msg.data = {
        devAddr: '0x78c5e570796e',
        connHandle: 0,
        uiInput: 1,
        uiOutput: 0 
    }    
    ```

    ```sh
    When (msg.type === 'bondComplete'):
    msg.data = {
        connHandle: 0
    }    
    ```
    
<br>
<a name="vendorHci"></a>
Calling the TI BLE Vendor-Specific HCI Command APIs
--------------------------
The **cc-bnp** organizes the *TI's Vendor-Specific HCI Commands* into 6 API subgroups. The description of commands is documented in [TI\_BLE\_Vendor\_Specific\_HCI_Guide.pdf](https://github.com/hedywings/cc-bnp/blob/master/documents/TI_BLE_Vendor_Specific_HCI_Guide.pdf). 

To invoke the Command API:

    ccbnp[subGroup][cmdName](..., callback);

**subGroup** can be 'hci', 'l2cap', 'att', 'gatt', 'gap', or 'util'. In addition, **cmdName** is the Command API function name in string. You can find the function name of a Command API from this [reference table](#cmdTables).

Here is an example of calling **_deviceDiscReq()_** from the subgroup **_gap_**:

```javascript
    // Please see Section 12.3 in TI BLE Vendor Specific HCI Reference Guide for API details.
    // argumens: (mode, activeScan, whiteList)

    ccbnp.gap.deviceDiscReq(3, 1, 0, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    };
```

Here is another example of calling **_writeCharValue()_** from the subgroup **_gatt_**:

```javascript
    // Please see Section 18.14 in TI BLE Vendor Specific HCI Reference Guide for API details.
    // argumens: (connHandle, handle, value, [uuid])

    var valObj = {   //Instance object of uuid 0x2a18
        flags: 15,   //bit0 = 1, bit1 = 1, bit2 = 1, bit3 = 1
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

    //If arguments do not contain 'uuid', ccbnp will send the request to 'uuid' automatically.
    ccbnp.gatt.writeCharValue(0, 37, valObj, '0x2a18', function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
```
The 'uuid' corresponding characteristic value can find in [GATT Specifications ](#gattdata) or use API [.regChar()](#regChar) to register.
<br>
<a name="cmdTables"></a>
Vendor-Specific HCI Command Reference Tables
--------------------------
These tables are the cross-references between the **Vendor-Specific HCI Command** and **cc-bnp** Command API names.

* 'BLE Vendor-Cmd' is the the command name documented in [TI\_BLE\_Vendor\_Specific\_HCI_Guide.pdf](https://github.com/hedywings/cc-bnp/blob/master/documents/TI_BLE_Vendor_Specific_HCI_Guide.pdf).
* 'cc-bnp Cmd-API' is the API function name according to a vendor-specfic HCI command.
* 'Arguments' is the required paramters to invoke the API.
* 'Result' is the result passing to the callback.

<a name="tblHci"></a>
#### 1. ccbnp.hci APIs

| BLE Vendor-Cmd | cc-bnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|HCI_EXT_SetRxGainCmd|setRxGain|rxGain|status|
|HCI_EXT_SetTxPowerCmd|setTxPower|txPower|status|
|HCI_EXT_OnePacketPerEventCmd|onePktPerEvt|control|status|
|HCI_EXT_ClkDivOnHaltCmd|clkDivideOnHalt|control|status|
|HCI_EXT_DeclareNvUsageCmd|declareNvUsage|mode|status|
|HCI_EXT_DecryptCmd|decrypt|key, encText|status, plainTextData|
|HCI_EXT_SetLocalSupportedFeaturesCmd|setLocalSupportedFeatures|localFeatures|status|
|HCI_EXT_SetFastTxResponseTimeCmd|setFastTxRespTime|control|status|
|HCI_EXT_ModemTestTxCmd|modemTestTx|cwMode, txFreq|status|
|HCI_EXT_ModemHopTestTxCmd|modemHopTestTx|none|status|
|HCI_EXT_ModemTestRxCmd|modemTestRx|rxFreq|status|
|HCI_EXT_EndModemTestCmd|endModemTest|none|status|
|HCI_EXT_SetBDADDRCmd|setBdaddr|bdAddr|status|
|HCI_EXT_SetSCACmd|setSca|scalnPPM|status|
|HCI_EXT_EnablePTMCmd|enablePtm|none|status|
|HCI_EXT_SetFreqTuneCmd|setFreqTune|step|status|
|HCI_EXT_SaveFreqTuneCmd|saveFreqTune|none|status|
|HCI_EXT_SetMaxDtmTxPowerCmd|setMaxDtmTxPower|txPower|status|
|HCI_EXT_MapPmInOutPortCmd|mapPmIoPort|ioPort, ioPin|status|
|HCI_EXT_DisconnectImmedCmd|disconnectImmed|connHandle|status|
|HCI_EXT_PacketErrorRateCmd|per|connHandle, cmd|status, cmdVal|
|HCI_EXT_PERbyChanCmd|perByChan|connHandle, perByChan|status|
|HCI_EXT_ExtendRfRangeCmd|extendRfRange|none|status|
|HCI_EXT_AdvEventNoticeCmd|advEventNotice|taskId, cmd|status|
|HCI_EXT_ConnEventNoticeCmd|connEventNotice|taskId, taskEvt|status|
|HCI_EXT_HaltDuringRfCmd|haltDuringRf|mode|status|
|HCI_EXT_SetSlaveLatencyOverrideCmd|overrideSl|taskId|status|
|HCI_EXT_BuildRevisionCmd|buildRevision|mode, userRevNum|status, userRevNum, buildRevNum|
|HCI_EXT_DelaySleepCmd|delaySleep|delay|status|
|HCI_EXT_ResetSystemCmd|resetSystem|mode|status|
|HCI_EXT_OverlappedProcessingCmd|overlappedProcessing|mode|status|
|HCI_EXT_NumComplPktsLimitCmd|numCompletedPktsLimit|limit, flushOnEvt|status|

<a name="tblL2cap"></a>
#### 2. ccbnp.l2cap APIs

| BLE Vendor-Cmd | cc-bnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|L2CAP_ConnParamUpdateReq|paramUpdateReq|connHandle, intervalMin, intervalMax, slaveLatency, timeoutMultiplier|status, connHandle, reason|

<a name="tblAtt"></a>
#### 3. ccbnp.att APIs

| BLE Vendor-Cmd | cc-bnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|ATT_ErrorRsp|errorRsp|connHandle, reqOpcode, handle, errCode|status, connHandle, pduLen, reqOpcode, handle, errCode|
|ATT_ExchangeMtuReq|exchangeMtuReq|connHandle, clientRxMTU|status, connHandle, pduLen, clientRxMTU|
|ATT_ExchangeMtuRsp|exchangeMtuRsp|connHandle, serverRxMTU|status, connHandle, pduLen, serverRxMTU|
|ATT_FindInfoReq|findInfoReq|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|ATT_FindInfoRsp|findInfoRsp|connHandle, format, info|status, connHandle, pduLen, format, info|
|ATT_FindByTypeValueReq|findByTypeValueReq|connHandle, startHandle, endHandle, type, value|status, connHandle, pduLen, startHandle, endHandle, type, value|
|ATT_FindByTypeValueRsp|findByTypeValueRsp|connHandle, handlesInfo|status, connHandle, pduLen, handlesInfo|
|ATT_ReadByTypeReq|readByTypeReq|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle|
|ATT_ReadByTypeRsp|readByTypeRsp|connHandle, length, data, [uuid]|status, connHandle, pduLen, length, format|
|ATT_ReadReq|readReq|connHandle, handle, [uuid]|status, connHandle, pduLen, handle|
|ATT_ReadRsp|readRsp|connHandle, value, [uuid]|status, connHandle, pduLen, value|
|ATT_ReadBlobReq|readBlobReq|connHandle, handle, offset|status, connHandle, pduLen, handle, offset|
|ATT_ReadBlobRsp|readBlobRsp|connHandle, value|status, connHandle, pduLen, value|
|ATT_ReadMultiReq|readMultiReq|connHandle, handles, [uuid]|status, connHandle, pduLen, handles|
|ATT_ReadMultiRsp|readMultiRsp|connHandle, value, [uuid]|status, connHandle, pduLen, value|
|ATT_ReadByGrpTypeReq|readByGrpTypeReq|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle, type|
|ATT_ReadByGrpTypeRsp|readByGrpTypeRsp|connHandle, length, data|status, connHandle, pduLen, length, data|
|ATT_WriteReq|writeReq|connHandle, signature, command, handle, value, [uuid]|status, connHandle, pduLen, signature, command, handle, value|
|ATT_WriteRsp|writeRsp|connHandle|status, connHandle, pduLen|
|ATT_PrepareWriteReq|prepareWriteReq|connHandle, handle, offset, value|status, connHandle, pduLen, handle, offset, value|
|ATT_PrepareWriteRsp|prepareWriteRsp|connHandle, handle, offset, value|status, connHandle, pduLen, handle, offset, value|
|ATT_ExecuteWriteReq|executeWriteReq|connHandle, flags|status, connHandle, pduLen, value|
|ATT_ExecuteWriteRsp|executeWriteRsp|connHandle|status, connHandle, pduLen|
|ATT_HandleValueNoti|handleValueNoti|connHandle, authenticated, handle, value, [uuid]|status, connHandle, pduLen, authenticated, handle, value|
|ATT_HandleValueInd|handleValueInd|connHandle, authenticated, handle, value, [uuid]|status, connHandle, pduLen, authenticated, handle, value|
|ATT_HandleValueCfm|handleValueCfm|connHandle|status, connHandle, pduLen|

<a name="tblGatt"></a>
#### 4. ccbnp.gatt APIs

| BLE Vendor-Cmd | cc-bnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|GATT_ExchangeMtu|exchangeMtu|connHandle, clientRxMTU|status, connHandle, pduLen, clientRxMTU|
|GATT_DiscAllPrimaryServices|discAllPrimaryServices|connHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscPrimaryServiceByUuid|discPrimaryServiceByUuid|connHandle, value, [uuid]|status, connHandle, pduLen, startHandle, endHandle, type|
|GATT_FindIncludedServices|findIncludedServices|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscAllChars|discAllChars|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscCharsByUuid|discCharsByUuid|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscAllCharDescs|discAllCharDescs|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_ReadCharValue|readCharValue|connHandle, handle, [uuid]|status, connHandle, pduLen, handle|
|GATT_ReadUsingCharUuid|readUsingCharUuid|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle|
|GATT_ReadLongCharValue|readLongCharValue|connHandle, handle, offset|status, connHandle, pduLen, handle, offset|
|GATT_ReadMultiCharValues|readMultiCharValues|connHandle, handles|status, connHandle, pduLen, handles|
|GATT_WriteNoRsp|writeNoRsp|connHandle, handle, value, [uuid]|none|
|GATT_SignedWriteNoRsp|signedWriteNoRsp|connHandle, handle, value, [uuid]|none|
|GATT_WriteCharValue|writeCharValue|connHandle, handle, value, [uuid]|status, connHandle, pduLen, signature, command, handle|
|GATT_WriteLongCharValue|writeLongCharValue|connHandle, handle, offset, value|status, connHandle, pduLen, value|
|GATT_ReliableWrites|reliableWrites|connHandle, numberRequests, requests|status, connHandle, pduLen, value|
|GATT_ReadCharDesc|readCharDesc|connHandle, handle|status, connHandle, pduLen, handle|
|GATT_ReadLongcharDesc|readLongCharDesc|connHandle, handle, offset|status, connHandle, pduLen, handle, offset|
|GATT_WriteCharDesc|writeCharDesc|connHandle, handle, value, [uuid]|status, connHandle, pduLen, signature, command, handle|
|GATT_WriteLongCharDesc|writeLongCharDesc|connHandle, handle, offset, value|status, connHandle, pduLen, value|
|GATT_Notification|notification|connHandle, authenticated, handle, value, [uuid]|none|
|GATT_Indication|indication|connHandle, authenticated, handle, value, [uuid]|status, connHandle, pduLen, authenticated, handle|
|GATT_AddService|addService|uuid, numAttrs|none|
|GATT_DelService|delService|handle|none|
|GATT_AddAttribute|addAttribute|uuid, permissions|none|

<a name="tblGap"></a>
#### 5. ccbnp.gap APIs

| BLE Vendor-Cmd | cc-bnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|GAP_DeviceInit|deviceInit|profileRole, maxScanResponses, irk, csrk, signCounter|status, devAddr, dataPktLen, numDataPkts, irk, csrk|
|GAP_ConfigDeviceAddr|configDeviceAddr|bitMask, addr|status, addrType, newRandomAddr|
|GAP_DeviceDiscoveryRequest|deviceDiscReq|mode, activeScan, whiteList|status, eventType, addrType, addr, rssi, dataField|
|GAP_DeviceDiscoveryCancel|deviceDiscCancel|none|status, numDevs, eventType, addrType, addr|
|GAP_MakeDiscoverable|makeDiscoverable|eventType, initiatorAddrType, initiatorAddr, channelMap, filterPolicy|status, interval|
|GAP_UpdateAdvertisingData|updateAdvData|adType, daraLen, advertData|status, adType|
|GAP_EndDiscoverable|endDisc|none|status|
|GAP_EstablishLinkRequest|estLinkReq|highDutyCycle, whiteList, addrtypePeer, peerAddr|status, addrType, addr, connHandle, connInterval, connLatency, connTimeout, clockAccuracy|
|GAP_TerminateLinkRequest|terminateLink|connHandle, reason|status, connHandle, reason|
|GAP_Authenticate|authenticate|connHandle, secReq_ioCaps, secReq_oobAvailable, secReq_oob, secReq_authReq, secReq_maxEncKeySize, secReq_keyDist, pairReq_Enable, pairReq_ioCaps, pairReq_oobDataFlag, pairReq_authReq, pairReq_maxEncKeySize, pairReq_keyDist|status, connHandle, authState, secInfo, sec_ltkSize, sec_ltk, sec_div, sec_rand, devSecInfo, dev_ltkSize, dev_ltk, dev_div, dev_rand, identityInfo, identity_irk, identity_bd_addr, signingInfo, signing_irk, signing_signCounter|
|GAP_UpdateLinkParamReq|updateLinkParamReq|connHandle, intervalMin, intervalMax, connLatency, connTimeout|status|
|GAP_PasskeyUpdate|passkeyUpdate|connHandle, passkey|status, connHandle, connInterval, connLatency, connTimeout|
|GAP_SlaveSecurityRequest|slaveSecurityReqUpdate|connHandle, authReq|status|
|GAP_Signable|signable|connHandle, authenticated, csrk, signCounter|status|
|GAP_Bond|bond|connHandle, authenticated, ltk, div, rand, ltkSize|status|
|GAP_TerminateAuth|terminateAuth|connHandle, reason|status, connHandle|
|GAP_SetParam|setParam|paramID, paramValue|status|
|GAP_GetParam|getParam|paramID|status, paramValue|
|GAP_ResolvePrivateAddr|resolvePrivateAddr|irk, addr|status|
|GAP_SetAdvToken|setAdvToken|adType, advDataLen, advData|status|
|GAP_RemoveAdvToken|removeAdvToken|adType|status|
|GAP_UpdateAdvToken|updateAdvTokens|none|status|
|GAP_BondSetParam|bondSetParam|paramID, paramDataLan, paramData|status|
|GAP_BondGetParam|bondGetParam|paramID|status, paramDataLen, paramData|

<a name="tblUtil"></a>
#### 6. ccbnp.util APIs

| BLE Vendor-Cmd | cc-bnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|UTIL_NVRead|nvRead|nvID, nvDataLen|status, nvData|
|UTIL_NVWrite|nvWrite|nvID, nvDataLen, nvData|status|
|UTIL_ForceBoot|forceBoot|none|status|

<br>
<a name="gattdata"></a>
G​ATT Specifications 
--------------------------
GATT & ATT Read/Write Cmd-API will parse the attribute value according to its data type specified in SIG-defined GATT [Characteristic](https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicsHome.aspx).

* 'UUID' is a 16-bit number defined by SIG which is used to represent a attribute.
* 'Field Name' is the field name of attribute value.
* 'Format types' determine how a single value contained in the Characteristic Value is formatted.

**Note**: 

1. Characteristic value of command `'ATT_ReadBlobReq'`, `'ATT_ReadBlobRsp'`, `'ATT_PrepareWriteReq'`, `'ATT_PrepareWriteRsp'`, `'GATT_ReadLongCharValue'`,  `'GATT_WriteLongCharValue'`, `'GATT_ReliableWrites'` not support to be parsed in cc-bnp.
2. Characteristic value of UUID `'0x2a2a'`, `'0x2a55'`, `'0x2a5a'`, `'0x2a63'`, `'0x2a64'`, `'0x2a66'`, `'0x2a6b'`, `'0x2a9f'`, `'0x2aa4'`, `'0x2aa7'`, `'0x2aa9'`, `'0x2aaa'`, `'0x2aab'`, `'0x2aac'`, `'0x2abc'` not support to be parsed in cc-bnp.

#### 1. Declarations

Declarations are defined GATT profile attribute types.

| UUID | Field Name | Format types | 
|  -------------  |  -------------  |  -------------  | 
| 0x2800 | uuid | uuid | 
| 0x2801 | uuid | uuid | 
| 0x2802 | serviceAttrHandle, endGroupHandle, uuid | uint16, uint16, uuid | 
| 0x2803 | properties, handle, uuid | uint8, uint16, uuid | 

#### 2. Descriptors

Descriptors are defined attributes that describe a characteristic value.

If a descriptor contains 'condition' field, other fields of this descriptor will exist depends on the value of 'condition' field. 

In the table below, `field condition values` inside the parentheses behind the field name (e.g., analogInterval(`5,6`)), `field condition values` representing the field, field will exist only if `field condition values` equals to the value of 'condition' field.

For example, UUID 0x290a has three field names, analog, bitMask, and analogInterval. Since the value of 'condition' field is equal to `field condition values` of analogInterval field, therefore analogInterval field presence.
```JavaScript
{   //Instance object of UUID 0x290a
    condition: 5,
    analogInterval: 3000    // analogInterval(5,6)
}
```

| UUID | Field Name | Format types | 
| ------------- | ------------- | ------------- | 
| 0x2900 | properties | uint16 | 
| 0x2901 | userDescription | string | 
| 0x2902 | properties | uint16 | 
| 0x2903 | properties | uint16 | 
| 0x2904 | format, exponent, unit, namespace, description | uint8, int8, uint16, uint8, uint16 | 
| 0x2905 | listOfHandles | uint16 | 
| 0x2907 | extReportRef | uuid | 
| 0x2908 | reportID, reportType | uint8, uint8 | 
| 0x2909 | noOfDigitals | uint8 | 
| 0x290a | condition, analog(`1,2,3`), bitMask(`4`), analogInterval(`5,6`) | uint8, uint16, uint8, uint32 | 
| 0x290b | triggerLogic | uint8 | 
| 0x290c | flags, samplFunc, measurePeriod, updateInterval, application, measureUncertainty | uint16, uint8, uint24, uint24, uint8, uint8 | 
| 0x290e | condition, none(`0`), timeInterval(`1,2`), count(`3`) | uint8, uint8, uint24, uint16 | 

#### 3. Characteristics

Characteristics are defined attribute types that contain a single logical value.

If a characteristic contains the 'flags' field, a corresponding field name will be determined by the `field condition bits`.

In the table below, there are `field condition bits` inside the parentheses behind the field name (e.g., tempC(`!bit0`); tempF(`bit0`)). 

- fieldNameA(`bit0`) means if bit0 of 'flags' field value equals to 1, the field will be parsed. 
- fieldNameB(`!bit0`) means if bit0 of 'flags' field value equals to 0, the field will be parsed. 
- fieldNameC(`bit1 & bit2`) means if bit1 and bit2 of 'flags' fields value both equals to 1, the fields will be parsed. 

For example, a UUID 0x2a1c Characteristics's 'flags' is 2. We put it into 8 bit binary to observe, it bit0 is 0, bit1 is 1 and bit2 is 0. So the fields 'tempC',  'year', 'month', 'day', 'hours', 'minutes' and 'seconds' will be parsed.
```JavaScript
{   //instance object of UUID 0x2a1c 
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

Format 'obj' meaning field may be repeated.
```JavaScript
{   //Instance object of UUID 0x2a22
    bootKeyboardInputReport: {
        value0: 1,
        value1: 2,
        value2: 3
    }
}
```

| UUID | Field Name | Format types |
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
| 0x2a22 | bootKeyboardInput | obj | 
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
| 0x2a32 | bootKeyboardOutput | obj | 
| 0x2a33 | bootMouseInput | obj | 
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
| 0x2a4b | reportMap | obj | 
| 0x2a4c | hidCtrl | uint8 | 
| 0x2a4d | report | obj | 
| 0x2a4e | protocolMode | uint8 | 
| 0x2a4f | leScanInterval, leScanWindow | uint16, uint16 | 
| 0x2a50 | vendorIDSource, vendorID, productID, productVersion | uint8, uint16, uint16, uint16 | 
| 0x2a51 | feature | uint16 | 
| 0x2a52 | opCode, operator, operand | uint8, uint8, uint8 | 
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
| 0x2aba | opCode | uint8 | 
| 0x2abb | httpsSecurity | boolean | 
| 0x2abd | oacpFeatures, olcpFeatures | uint32, uint32 | 
| 0x2abe | objectName | string | 
| 0x2abf | objectType | uuid | 

<br>
<a name="errcodes"></a>
Error Message
--------------------------
The error returned from BNP will pass to the callback as an error object with a message formatted in

```sh
    HciError(10): Synch conn limit exceeded
```

, where 'HciError' denotes the type of error and the number 10 within the parentheses is the corresponding error code.

#### 1. HciError
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

#### 2. AttError
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

#### 3. GenericError
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

<a name="reasoncodes"></a>
Reason Code of Link-termination
--------------------------

|Value|Description|
| ------------- | ------------- |
|   8 | Supervisor Timeout |
|  19 | Peer Requested |
|  22 | Host Requested |
|  34 | Control Packet Timeout |
|  40 | Control Packet Instant Passed |
|  59 | LSTO Violation |
|  61 | MIC Failure |

Contributors
--------

* [Hedy Wang](https://www.npmjs.com/~hedywings)
* [Peter Yi](https://www.npmjs.com/~petereb9)
* [Simen Li](https://www.npmjs.com/~simenkid)

License
--------
The MIT License (MIT)

Copyright (c) 2015 Hedy Wang <hedywings@gmail.com>

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
