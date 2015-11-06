ccBnp
===============

**ccBnp** is the interface for communicating with TI **CC**254X **B**LE **N**etwork **P**rocessor(BNP) over a serial port.

<br>
Overview
--------
**ccBnp** allows you to interact with TI's CC254X BLE network processor(BNP) on node.js via *TI BLE Vendor-Specific HCI Command APIs*. Each Command API function is in an asynchronous manner and supports both err-back callback style and promise-style.

**ccBnp** helps you to get rid of multiple *Vendor-Specific Events* handling of each command. **ccBnp** gathers the multiple responses up, and finally passes the result to the Command API callback. With **ccBnp**, it's easy and fun in designing BLE applications on node.js.

BLE Network Processor (BNP)
--------
The following diagram shows the scenario when CC254X operates as a BNP. In this case, the controller and host are implemented together on the CC2540/41, and the application can be externally developed on an application processor (e.g., another mcu or PC). The application and profiles can communicate with BNP via TI's vendor-specific HCI commands upon an UART interface.

![Network Processor Configuration](https://raw.githubusercontent.com/hedywings/ccBnp/master/documents/bnp.png)


Basic and Command APIs
--------
**ccBnp** provides two kinds of APIs:

#### 1. [Basic APIs and Events](#basic_apis)
The basic APIs are about how to initialize the BNP with a given role and how to close the connection from the processor. After the BNP accomplishes the initializing procedure, a `'ready'` event will be fired by **ccBnp** . When there comes a BLE indication message, **ccBnp** will fire an `'ind'` event along with the message content.

* [.init(config, role, [callback])](#init)
* [.close([callback])](#close)
* [.on('ready', callback)](#onReady)
* [.on('ind', callback)](#onInd)
 
#### 2. [TI's BLE Vendor-Specific HCI Command APIs](#vendorHci)
TI's BLE Vendor-Specific HCI Commands are used to communicate with the CC254X BNP. These commands are organized in API subgroubps: hci, l2cap, att, gatt, gap, and util.

| Command SubGroup (CSG) |  Namespace  | Number of Commands |
|:----------------------:|:-----------:|:------------------:|
|           hci          |  [ccBnp.hci](#tblHci)  |         32         |
|          l2cap         | [ccBnp.l2cap](#tblL2cap) |          1         |
|           att          |  [ccBnp.att](#tblAtt)  |         26         |
|          gatt          |  [ccBnp.gatt](#tblGatt) |         25         |
|           gap          |  [ccBnp.gap](#tblGap)  |         24         |
|          util          | [ccBnp.util](#tblUtil) |          3         |

<br>
Installation
------------
Available via [npm](https://www.npmjs.com/package/ccbnp):
> $ npm install ccbnp --save

<br>
Usage
--------
To begin with **ccBnp**, you must firstly set up the serial port and initialize the BNP with a given role. To do this, simply call the .init() method:
```javascript
    var ccBnp = require('ccbnp');
    var cfg = {
        path: '/dev/ttyUSB0'
    };

    ccBnp.on('ready', function () {
        console.log('Initialization completes.');
    });

    ccBnp.init(cfg, 'central');
```
Here are some [examples](https://github.com/hedywings/blob/master/ccBnp/examples/ble_connect.js).

<br>
<a name="basic_apis"></a>
Basic APIs and Events
-------

<a name="init"></a>
### .init(config, role, [callback])
> This method will connect to the CC254X SoC upon a serial port as well as initialize the BNP with a given role.

**Arguments**

- config (*Object*): This value-object has two properties `path` and `options` for configuring the serial port. The `path` property is a string that refers to the system path of the serial port, e.g., `'/dev/ttyUSB0'`. The `options` property is a value-object for setting up the [seiralport](https://www.npmjs.com/package/serialport#to-use) instance. The default value of `options` is shown in the following example.
- role (*String*): The device role. **ccBnp** supports four types of single role and two types of multi-roles:
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
        IRK: <Buffer 72 74 73 20 3d 20 44 75 70 6c 65 78 3b 0a 0a 2f>, // 16 bytes Identity Resolving Key
        CSRK: <Buffer 2a 3c 72 65 70 6c 61 63 65 6d 65 6e 74 3e 2a 2f> // 16 bytes Connection Signature Resolving Key
    }
```

**Example**
```javascript
    var ccBnp = require('ccBnp'),
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

    ccBnp.init(cfg, role);
```
<br>
<a name="close"></a>
### .close([callback])
> This method will close the opened serial port.

**Arguments**

- callback(err)
    - `'err'` (*Error*) - [Error Message](#errcodes)

**Example**
```javascript
    ccBnp.close(function (err) {
        if (err) console.log(err);
    });
```
<br>
<a name="onReady"></a>
### .on('ready', callback)
> The `'ready'` event is fired when the initializing procedure accomplishes.

**Arguments**

- callback(result)
    - `'result'` (*Object*)- Device information that contains the properties:
```sh
    {
        devAddr: '0x78c5e59b5ef8',                            // Device public address
        IRK: <Buffer 72 74 73 20 3d 20 44 75 70 6c 65 78 3b 0a 0a 2f>,  // 16 bytes IRK
        CSRK: <Buffer 2a 3c 72 65 70 6c 61 63 65 6d 65 6e 74 3e 2a 2f>  // 16 bytes CSRK
    }
```

**Example**
```javascript
    ccBnp.on('ready', function (result) {
        console.log(result);
        // do your work here
    });
```
<br>
<a name="onInd"></a>
### .on('ind', callback)
> When there is a *BLE indication* message coming from BNP, the **ccBnp** fires an `'ind'` event along with a message object.    

**Arguments**

- callback(msg)
    - msg (*Object*): This message object has two properties of `type` and `data`. The `type` denotes the type of the *BLE indication* message. The `data` is the content of the corresponding message. With the indication type of `'linkTerminated'`, you can find the reason of link termination from the [reason codes table](#reasoncodes).
    ```javascript
    ccBnp.on('ind', function (msg) {
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

<br>
<a name="vendorHci"></a>
Calling the TI BLE Vendor-Specific HCI Command APIs
--------------------------
The **ccBnp** organizes the *TI's Vendor-Specific HCI Commands* into 6 API subgroups. Each Command API in **ccBnp** supports both the err-back callback style and promise-style. The description of commands is documented in [TI\_BLE\_Vendor\_Specific\_HCI_Guide.pdf](https://github.com/hedywings/ccBnp/blob/master/documents/TI_BLE_Vendor_Specific_HCI_Guide.pdf). 

To invoke the Command API:

    ccBnp[subGroup][cmdName](..., callback);

**subGroup** can be 'hci', 'l2cap', 'att', 'gatt', 'gap', or 'util'. In addition, **cmdName** is the Command API function name in string. You can find the function name of a Command API from this [reference table](#cmdTables).

Here is an example of calling **_deviceDiscReq()_** from the subgroup **_gap_**:

    // Please see Section 12.3 in TI BLE Vendor Specific HCI Reference Guide for API details.
    // argumens: (mode, activeScan, whiteList)
```javascript
    ccBnp.gap.deviceDiscReq(3, 1, 0, function (err, result) {
    	if (err) {
    		console.log(err);
    	} else {
    		console.log(result);
    	}
    };
```
In promise-style:
```javascript
    ccBnp.gap.deviceDiscReq(3, 1, 0).then(function (result) {
        console.log(result)
    }).fail(function (err) {
        console.log(err);
    }).done();
```
<br>
<a name="cmdTables"></a>
Vendor-Specific HCI Command Reference Tables
--------------------------
These tables are the cross-references between the **Vendor-Specific HCI Command** and **ccBnp** Command API names.

* 'BLE Vendor-Cmd' is the the command name documented in [TI\_BLE\_Vendor\_Specific\_HCI_Guide.pdf](https://github.com/hedywings/ccBnp/blob/master/documents/TI_BLE_Vendor_Specific_HCI_Guide.pdf).
* 'ccBnp Cmd-API' is the API function name according to a vendor-specfic HCI command.
* 'Arguments' is the required paramters to invoke the API.
* 'Result' is the result passing to the callback.

<a name="tblHci"></a>
#### 1. ccBnp.hci APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
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
#### 2. ccBnp.l2cap APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|L2CAP_ConnParamUpdateReq|paramUpdateReq|connHandle, intervalMin, intervalMax, slaveLatency, timeoutMultiplier|status, connHandle, reason|

<a name="tblAtt"></a>
#### 3. ccBnp.att APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|ATT_ErrorRsp|errorRsp|connHandle, reqOpcode, handle, errCode|status, connHandle, pduLen, reqOpcode, handle, errCode|
|ATT_ExchangeMtuReq|exchangeMtuReq|connHandle, clientRxMTU|status, connHandle, pduLen, clientRxMTU|
|ATT_ExchangeMtuRsp|exchangeMtuRsp|connHandle, serverRxMTU|status, connHandle, pduLen, serverRxMTU|
|ATT_FindInfoReq|findInfoReq|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|ATT_FindInfoRsp|findInfoRsp|connHandle, format, info|status, connHandle, pduLen, format, info|
|ATT_FindByTypeValueReq|findByTypeValueReq|connHandle, startHandle, endHandle, type, value|status, connHandle, pduLen, startHandle, endHandle, type, value|
|ATT_FindByTypeValueRsp|findByTypeValueRsp|connHandle, handlesInfo|status, connHandle, pduLen, handlesInfo|
|ATT_ReadByTypeReq|readByTypeReq|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle|
|ATT_ReadByTypeRsp|readByTypeRsp|connHandle, length, data|status, connHandle, pduLen, length, format|
|ATT_ReadReq|readReq|connHandle, handle|status, connHandle, pduLen, handle|
|ATT_ReadRsp|readRsp|connHandle, value|status, connHandle, pduLen, value|
|ATT_ReadBlobReq|readBlobReq|connHandle, handle, offset|status, connHandle, pduLen, handle, offset|
|ATT_ReadBlobRsp|readBlobRsp|connHandle, value|status, connHandle, pduLen, value|
|ATT_ReadMultiReq|readMultiReq|connHandle, handles|status, connHandle, pduLen, handles|
|ATT_ReadMultiRsp|readMultiRsp|connHandle, value|status, connHandle, pduLen, value|
|ATT_ReadByGrpTypeReq|readByGrpTypeReq|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle, type|
|ATT_ReadByGrpTypeRsp|readByGrpTypeRsp|connHandle, length, data|status, connHandle, pduLen, length, data|
|ATT_WriteReq|writeReq|connHandle, signature, command, handle, value|status, connHandle, pduLen, signature, command, handle, value|
|ATT_WriteRsp|writeRsp|connHandle|status, connHandle, pduLen|
|ATT_PrepareWriteReq|prepareWriteReq|connHandle, handle, offset, value|status, connHandle, pduLen, handle, offset, value|
|ATT_PrepareWriteRsp|prepareWriteRsp|connHandle, handle, offset, value|status, connHandle, pduLen, handle, offset, value|
|ATT_ExecuteWriteReq|executeWriteReq|connHandle, flags|status, connHandle, pduLen, value|
|ATT_ExecuteWriteRsp|executeWriteRsp|connHandle|status, connHandle, pduLen|
|ATT_HandleValueNoti|handleValueNoti|connHandle, authenticated, handle, value|status, connHandle, pduLen, authenticated, handle, value|
|ATT_HandleValueInd|handleValueInd|connHandle, authenticated, handle, value|status, connHandle, pduLen, authenticated, handle, value|
|ATT_HandleValueCfm|handleValueCfm|connHandle|status, connHandle, pduLen|

<a name="tblGatt"></a>
#### 4. ccBnp.gatt APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|GATT_ExchangeMtu|exchangeMtu|connHandle, clientRxMTU|status, connHandle, pduLen, clientRxMTU|
|GATT_DiscAllPrimaryServices|discAllPrimaryServices|connHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscPrimaryServiceByUuid|discPrimaryServiceByUuid|connHandle, value|status, connHandle, pduLen, startHandle, endHandle, type|
|GATT_FindIncludedServices|findIncludedServices|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscAllChars|discAllChars|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscCharsByUuid|discCharsByUuid|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle|
|GATT_DiscAllCharDescs|discAllCharDescs|connHandle, startHandle, endHandle|status, connHandle, pduLen, startHandle, endHandle|
|GATT_ReadCharValue|readCharValue|connHandle, handle|status, connHandle, pduLen, handle|
|GATT_ReadUsingCharUuid|readUsingCharUuid|connHandle, startHandle, endHandle, type|status, connHandle, pduLen, startHandle, endHandle|
|GATT_ReadLongCharValue|readLongCharValue|connHandle, handle, offset|status, connHandle, pduLen, handle, offset|
|GATT_ReadMultiCharValues|readMultiCharValues|connHandle, handles|status, connHandle, pduLen, handles|
|GATT_WriteNoRsp|writeNoRsp|connHandle, handle, value|none|
|GATT_SignedWriteNoRsp|signedWriteNoRsp|connHandle, handle, value|none|
|GATT_WriteCharValue|writeCharValue|connHandle, handle, value|status, connHandle, pduLen, signature, command, handle|
|GATT_WriteLongCharValue|writeLongCharValue|connHandle, handle, offset, value|status, connHandle, pduLen, value|
|GATT_ReliableWrites|reliableWrites|connHandle, numberRequests, requests|status, connHandle, pduLen, value|
|GATT_ReadCharDesc|readCharDesc|connHandle, handle|status, connHandle, pduLen, handle|
|GATT_ReadLongcharDesc|readLongCharDesc|connHandle, handle, offset|status, connHandle, pduLen, handle, offset|
|GATT_WriteCharDesc|writeCharDesc|connHandle, offset, value|status, connHandle, pduLen, signature, command, handle|
|GATT_WriteLongCharDesc|writeLongCharDesc|connHandle, handle, offset, value|status, connHandle, pduLen, value|
|GATT_Notification|notification|connHandle, authenticated, handle, value|none|
|GATT_Indication|indication|connHandle, authenticated, handle, value|status, connHandle, pduLen, authenticated, handle|
|GATT_AddService|addService|UUID, numAttrs|none|
|GATT_DelService|delService|handle|none|
|GATT_AddAttribute|addAttribute|UUID, permissions|none|

<a name="tblGap"></a>
#### 5. ccBnp.gap APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|GAP_DeviceInit|deviceInit|profileRole, maxScanResponses, IRK, CSRK, signCounter|status, devAddr, dataPktLen, numDataPkts, IRK, CSRK|
|GAP_ConfigDeviceAddr|configDeviceAddr|BitMask, Addr|status, addrType, newRandomAddr|
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
|GAP_Signable|signable|connHandle, authenticated, CSRK, signCounter|status|
|GAP_Bond|bond|connHandle, authenticated, LTK, DIV, rand, LTKsize|status|
|GAP_TerminateAuth|terminateAuth|connHandle, reason|status, connHandle|
|GAP_SetParam|setParam|paramID, paramValue|status|
|GAP_GetParam|getParam|paramID|status, paramValue|
|GAP_ResolvePrivateAddr|resolvePrivateAddr|IRK, Addr|status|
|GAP_SetAdvToken|setAdvToken|adType, advDataLen, advData|status|
|GAP_RemoveAdvToken|removeAdvToken|adType|status|
|GAP_UpdateAdvToken|updateAdvTokens|none|status|
|GAP_BondSetParam|bondSetParam|paramID, paramDataLan, paramData|status|
|GAP_BondGetParam|bondGetParam|paramID|status, paramDataLen, paramData|

<a name="tblUtil"></a>
#### 6. ccBnp.util APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
| ------------- | ------------- | ------------- | ------------- |
|UTIL_NVRead|nvRead|nvID, nvDataLen|status, nvData|
|UTIL_NVWrite|nvWrite|nvID, nvDataLen, nvData|status|
|UTIL_ForceBoot|forceBoot|none|status|

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
|   1 |Unknown hci cmd |
|   2 |Unknown conn id |
|   3 |Hw failure |
|   4 |Page timeout |
|   5 |Auth failure |
|   6 |Pin key missing |
|   7 |Mem cap exceeded |
|   8 |Conn timeout |
|   9 |Conn limit exceeded |
|  10 |Synch conn limit exceeded |
|  11 |Acl conn already exists |
|  12 |Cmd disallowed |
|  13 |Conn rej limited resources |
|  14 |Conn rejected security reasons |
|  15 |Conn rejected unacceptable bdaddr |
|  16 |Conn accept timeout exceeded |
|  17 |Unsupported feature param value |
|  18 |Invalid hci cmd params |
|  19 |Remote user term conn |
|  20 |Remote device term conn low resources |
|  21 |Remote device term conn power off |
|  22 |Conn term by local host |
|  23 |Repeated attempts |
|  24 |Pairing not allowed |
|  25 |Unknown lmp pdu |
|  26 |Unsupported remote feature |
|  27 |Sco offset rej |
|  28 |Sco interval rej |
|  29 |Sco air mode rej |
|  30 |Invalid lmp params |
|  31 |Unspecified error |
|  32 |Unsupported lmp param val |
|  33 |Role change not allowed |
|  34 |Lmp ll resp timeout |
|  35 |Lmp err transaction collision |
|  36 |Lmp pdu not allowed |
|  37 |Encrypt mode not acceptable |
|  38 |Link key can not be changed |
|  39 |Req qos not supported |
|  40 |Instant passed |
|  41 |Pairing with unit key not supported |
|  42 |Different transaction collision |
|  43 |Reserved 1 |
|  44 |Qos unacceptable param |
|  45 |Qos rej |
|  46 |Chan assessment not supported |
|  47 |Insufficient security |
|  48 |Param out of mandatory range |
|  49 |Reserved 2 |
|  50 |Role switch pending |
|  51 |Reserved 3 |
|  52 |Reserved slot violation |
|  53 |Role switch failed |
|  54 |Extended inquiry resp too large |
|  55 |Simple pairing not supported by host |
|  56 |Host busy pairing |
|  57 |Conn rej no suitable chan found |
|  58 |Controller busy |
|  59 |Unacceptable conn interval |
|  60 |Directed adv timeout |
|  61 |Conn term mic failure |
|  62 |Conn failed to establish |
|  63 |Mac conn failed |

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

Further Work
--------
1. Parse the attribte value according to its data type specified in SIG-defined GATT [Characteristic](https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicsHome.aspx).

Contributors
--------

* [Hedy Wang](https://www.npmjs.com/~hedywings)
* [Peter Yi](https://www.npmjs.com/~petereb9)
* [Simen Li](https://www.npmjs.com/~simenkid)

License
--------
MIT
