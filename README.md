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
* [.regCharMeta(regObj)](#regCharMeta)
 
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
<a name="regCharMeta"></a>
### .regCharMeta(regObj)
> This method will register characteristic's UUID, Field Name and Format types, which characteristics belong that UUID will be parsed.

If the [UUID](#gattdata) is exist, this will overwrite that.

**Arguments**

- regObj (*Object*): This object has three properties of `uuid`, `params` and `types`. The `uuid` is the characteristic's uuid. The `params` is the characteristic's Field Name.The `types` is the characteristic's Format types.
   
**Example**
```javascript
	var regObj = {
		uuid: '0xfff1',
		params: ['FieldName0', 'FieldName1', 'FieldName2'],
		types: ['uint8', 'uint16', 'float']
	};
    ccBnp.regCharMeta(regObj);
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

Here is another example of calling **_writeCharValue()_** from the subgroup **_gatt_**:

    // Please see Section 18.14 in TI BLE Vendor Specific HCI Reference Guide for API details.
    // argumens: (connHandle, handle, value, [uuid])
```javascript
    var valObj = {
        Flags: 15,   //bit0 = 1, bit1 = 1, bit2 = 1, bit3 = 1
        SequenceNumber: 1, 
        Year: 2015, 
        Month: 12, 
        Day: 22, 
        Hours: 18, 
        Minutes: 37, 
        Seconds: 41,
        TimeOffset: 0,
        GlucoseMol: 0.0068,
        Type: 1,
        SampleLocation: 1, 
        SensorStatus: 0
        };
    //When 'value' is a object, you can add argument 'uuid' in the last. 
    //If you don't add 'uuid', ccBnp will automatically sends a request to the target.
    ccBnp.gatt.writeCharValue(0, 37, valObj, '0x2a18').then(function (result) {    
        console.log(result;
    }).fail(function (err) {
        console.log(err);
    });
```
Characteristic's 'uuid' corresponding data type can use API [.regCharMeta()](#regCharMeta) to register or find in [default](#gattdata).
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
#### 4. ccBnp.gatt APIs

| BLE Vendor-Cmd | ccBnp Cmd-API | Arguments | Result |
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
<a name="gattdata"></a>
G​ATT Specifications 
--------------------------
GATT & ATT Read/Write Cmd-API will parse the attribute value according to its data type specified in SIG-defined GATT [Characteristic](https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicsHome.aspx).

* 'UUID' is the SIG provides UUIDs for all the types, services and profiles it defines.
* 'Field Name' is the result after parsing.
* 'Format types' is determine how a single value contained in the Characteristic Value is formatted.

Command `'ATT_ReadBlobReq'`, `'ATT_ReadBlobRsp'`, `'ATT_PrepareWriteReq'`, `'ATT_PrepareWriteRsp'`, `'GATT_ReadLongCharValue'`, `'GATT_WriteLongCharValue'`, `'GATT_ReliableWrites'` will not parse the attribute value.

#### 1.Declarations

| UUID | Field Name | Format types | 
|  -------------  |  -------------  |  -------------  | 
| 0x2800 | UUID | uuid | 
| 0x2801 | UUID | uuid | 
| 0x2802 | ServiceAttrHandle, EndGroupHandle, UUID | uint16, uint16, uuid | 
| 0x2803 | Properties, Handle, UUID | uint8, uint16, uuid | 

#### 2.Descriptors

If the descriptor has 'Condition' field, the descriptor fields are determined according to the 'Condition' field. Which fields will exist depends on field's condition value whether to include 'Condition' field's value. 

Field's condition bit value is behind Field's Name in the table.

```JavaScript
{   //0x290a instance object
    Condition: 5,
    ValueAnalogInterval: 3000
}
```

| UUID | Field Name | Format types | 
| ------------- | ------------- | ------------- | 
| 0x2900 | Properties | uint16 | 
| 0x2901 | UserDescription | string | 
| 0x2902 | Properties | uint16 | 
| 0x2903 | Properties | uint16 | 
| 0x2904 | Format, Exponent, Unit, Namespace, Description | uint8, int8, uint16, uint8, uint16 | 
| 0x2905 | ListOfHandles | uint16 | 
| 0x2907 | ExternalReportReference | uuid | 
| 0x2908 | ReportID, ReportType | uint8, uint8 | 
| 0x2909 | NoOfDigitals | uint8 | 
| 0x290a | Condition, ValueAnalog(`1,2,3`), ValueBitMask(`4`), ValueAnalogInterval(`5,6`) | uint8, uint16, uint8, uint32 | 
| 0x290b | TriggerLogic | uint8 | 
| 0x290c | Flags, SamplFunc, MeasurementPeriod, UpdateInterval, Application, MeasurementUncertainty | uint16, uint8, uint24, uint24, uint8, uint8 | 
| 0x290e | Condition, ValueNone(`0`), ValueTimeInterval(`1,2`), ValueCount(`3`) | uint8, uint8, uint24, uint16 | 

#### 3.Characteristics

If the characteristic has 'Flags' field, the descriptor fields are determined according to the 'Flags' field. Which fields will exist depends on field's condition bit values whether equal to 'Flags' field's bits.

Field's condition bit is behind Field Name in the table. `bit0` represent if Flags's bit0 equal to 1, the field will exist; `!bit0` represent if Flags's bit0 equal to 0, the field will exist.
```JavaScript
{   //0x2a1c instance object
    Flags: 2,    //bit0 = 0, bit1 = 1, bit2 = 0
    TempC: 21.5, 
    Year: 2015, 
    Month: 12, 
    Day: 25, 
    Hours: 21, 
    Minutes: 36, 
    Seconds: 12, 
}
```

Format 'obj' meaning field may be repeated.
```JavaScript
{   //0x2a22 instance object
    BootKeyboardInputReport: {
        Value0: 1,
        Value1: 2,
        Value2: 3
    }
}
```

| UUID | Field Name | Format types |
|  -------------  |  -------------  |  -------------  | 
| 0x2a00 | Name | string | 
| 0x2a01 | Category | uint16 | 
| 0x2a02 | Flag | boolean | 
| 0x2a03 | Addr | addr6 | 
| 0x2a04 | MinConnInterval, MaxConnInterval, Latency, Timeout | uint16, uint16, uint16, uint16 | 
| 0x2a05 | StartHandle, EndHandle | uint16, uint16 | 
| 0x2a06 | AlertLevel | uint8 | 
| 0x2a07 | TxPower | int8 | 
| 0x2a08 | Year, Month, Day, Hours, Minutes, Seconds | uint16, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a09 | DayofWeek | uint8 | 
| 0x2a0a | Year, Month, Day, Hours, Minutes, Seconds, DayofWeek | uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a0c | Year, Month, Day, Hours, Minutes, Seconds, DayofWeek, Fractions256 | uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a0d | DSTOffset | uint8 | 
| 0x2a0e | TimeZone | int8 | 
| 0x2a0f | TimeZone, DSTOffset | int8, uint8 | 
| 0x2a11 | Year, Month, Day, Hours, Minutes, Seconds, DSTOffset | uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a12 | Accuracy | uint8 | 
| 0x2a13 | TimeSource | uint8 | 
| 0x2a14 | Source, Accuracy, DaySinceUpdate, HourSinceUpdate | uint8, uint8, uint8, uint8 | 
| 0x2a16 | TimeUpdateCtrlPoint | uint8 | 
| 0x2a17 | CurrentState, Result | uint8, uint8 | 
| 0x2a18 | Flags, SequenceNumber, Year, Month, Day, Hours, Minutes, Seconds, TimeOffset(`bit0`), GlucoseKg(`bit1 & !bit2`), GlucoseMol(`bit1 & bit2`), Type(`bit2`), SampleLocation(`bit2`), SensorStatus(`bit3`) | uint8, uint16, uint16, uint8, uint8, uint8, uint8, uint8,  | int16, sfloat, sfloat, nibble, nibble, uint16 | 
| 0x2a19 | Level | uint8 | 
| 0x2a1c | Flags, TempC(`!bit0`), TempF(`bit0`), Year(`bit1`), Month(`bit1`), Day(`bit1`), Hours(`bit1`), Minutes(`bit1`), Seconds(`bit1`), TempType(`bit2`) | uint8, float, float, uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a1d | TempTextDescription | uint8 | 
| 0x2a1e | Flags, TempC(`!bit0`), TempF(`bit0`), Year(`bit1`), Month(`bit1`), Day(`bit1`), Hours(`bit1`), Minutes(`bit1`), Seconds(`bit1`), TempType(`bit2`) | uint8, float, float, uint16, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a21 | MeasurementInterval | uint16 | 
| 0x2a22 | BootKeyboardInputReport | obj | 
| 0x2a23 | ManufacturerIdentifier, OrganizationallyUniqueIdentifier | addr5, addr3 | 
| 0x2a24 | ModelNumber | string | 
| 0x2a25 | SerialNumber | string | 
| 0x2a26 | FirmwareRevision | string | 
| 0x2a27 | HardwareRevision | string | 
| 0x2a28 | SoftwareRevision | string | 
| 0x2a29 | ManufacturerName | string | 
| 0x2a2b | Year, Month, Day, Hours, Minutes, Seconds, DayofWeek, Fractions256, AdjustReason | uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a2c | MagneticDeclination | uint16 | 
| 0x2a31 | ScanRefreshValue | uint8 | 
| 0x2a32 | BootKeyboardOutputReport | obj | 
| 0x2a33 | BootMouseInputReport | obj | 
| 0x2a34 | Flags, SequenceNumber, ExtendedFlags(`bit7`), CarbohydrateID(`bit0`), Carbohydrate(`bit0`), Meal(`bit1`), Tester(`bit1`), Health(`bit2`), ExerciseDuration(`bit3`), ExerciseIntensity(`bit3`), MedicationID(`bit4`), MedicationKg(`bit4 & !bit5`), MedicationL(`bit4 & bit5`), HbA1c(`bit6`) | uint8, uint16, uint8, uint8, sfloat, uint8, nibble, nibble, uint16, uint8, uint8, sfloat, sfloat, sfloat | 
| 0x2a35 | Flags, SystolicMmHg(`!bit0`), DiastolicMmHg(`!bit0`), MeanArterialPressureMmHg(`!bit0`), SystolicKPa(`bit0`), DiastolicKPa(`bit0`), MeanArterialPressureKPa(`bit0`), Year(`bit1`), Month(`bit1`), Day(`bit1`), Hours(`bit1`), Minutes(`bit1`), Seconds(`bit1`), PulseRate(`bit2`), UserID(`bit3`), Status(`bit4`) | uint8, sfloat, sfloat, sfloat, sfloat, sfloat, sfloat, uint16, uint8, uint8, uint8, uint8, uint8, sfloat, uint8, uint16 | 
| 0x2a36 | Flags, SystolicMmHg(`!bit0`), DiastolicMmHg(`!bit0`), MeanArterialPressureMmHg(`!bit0`), SystolicKPa(`bit0`), DiastolicKPa(`bit0`), MeanArterialPressureKPa(`bit0`), Year(`bit1`), Month(`bit1`), Day(`bit1`), Hours(`bit1`), Minutes(`bit1`), Seconds(`bit1`), PulseRate(`bit2`), UserID(`bit3`), Status(`bit4`) | uint8, sfloat, sfloat, sfloat, sfloat, sfloat, sfloat, uint16, uint8, uint8, uint8, uint8, uint8, sfloat, uint8, uint16 | 
| 0x2a37 | Flags, HeartRate8(`!bit0`), HeartRate16(`bit0`), EnergyExpended(`bit3`), RRInterval(`bit4`) | uint8, uint8, uint16, uint16, uint16 | 
| 0x2a38 | BodySensorLocation | uint8 | 
| 0x2a39 | HeartRateCtrlPoint | uint8 | 
| 0x2a3f | AlertStatus | uint8 | 
| 0x2a40 | RingerCtrlPoint | uint8 | 
| 0x2a41 | RingerSetting | uint8 | 
| 0x2a42 | CategoryIDBitMask0, CategoryIDBitMask0 | uint8, uint8 | 
| 0x2a43 | CategoryID | uint8 | 
| 0x2a44 | CommandID, CategoryID | uint8, uint8 | 
| 0x2a45 | CategoryID, UnreadCount | uint8, uint8 | 
| 0x2a46 | CategoryID, NumberOfNewAlert, TextStringInfo | uint8, uint8, string | 
| 0x2a47 | CategoryIDBitMask0, CategoryIDBitMask0 | uint8, uint8 | 
| 0x2a48 | CategoryIDBitMask0, CategoryIDBitMask0 | uint8, uint8 | 
| 0x2a49 | BloodPressureFeature | uint16 | 
| 0x2a4a | bcdHID, bCountryCode, Flags | uint16, uint8, uint8 | 
| 0x2a4b | ReportMap | obj | 
| 0x2a4c | HIDCtrlPointCommand | uint8 | 
| 0x2a4d | Report | obj | 
| 0x2a4e | ProtocolModeValue | uint8 | 
| 0x2a4f | LEScanInterval, LEScanWindow | uint16, uint16 | 
| 0x2a50 | VendorIDSource, VendorID, ProductID, ProductVersion | uint8, uint16, uint16, uint16 | 
| 0x2a51 | GlucoseFeature | uint16 | 
| 0x2a52 | OpCode, Operator, Operand | uint8, uint8, uint8 | 
| 0x2a53 | Flags, Speed, Cadence, StrideLength(`bit0`), TotalDistance(`bit1`) | uint8, uint16, uint8, uint16, uint32 | 
| 0x2a54 | RSCFeature | uint16 | 
| 0x2a56 | Digital | uint8 | 
| 0x2a58 | Analog | uint16 | 
| 0x2a5b | Flags, CumulativeWheelRevolutions(`bit0`), LastWheelEventTime(`bit0`), CumulativeCrankRevolutions(`bit1`), LastCrankEventTime(`bit1`) | uint8, uint32, uint16, uint16, uint16 | 
| 0x2a5c | CSCFeature | uint16 | 
| 0x2a5d | SensorLocation | uint8 | 
| 0x2a5e | Flags, SpO2, PR, Year(`bit0`), Month(`bit0`), Day(`bit0`), Hours(`bit0`), Minutes(`bit0`), Seconds(`bit0`), MeasurementStatus(`bit1`), DeviceAndSensorStatus(`bit2`), PulseAmplitudeIndex(`bit3`) | uint8, sfloat, sfloat, uint16, uint8, uint8, uint8, uint8, uint8, uint16, uint24, sfloat | 
| 0x2a5f | Flags, NormalSpO2, NormalPR, FastSpO2(`bit0`), FastPR(`bit0`), SlowSpO2(`bit1`), SlowPR(`bit1`), MeasurementStatus(`bit2`), DeviceAndSensorStatus(`bit3`), PulseAmplitudeIndex(`bit4`) | uint8, sfloat, sfloat, sfloat, sfloat, sfloat, sfloat, uint16, uint24, sfloat | 
| 0x2a65 | CyclingPowerFeature | uint32 | 
| 0x2a67 | Flags, InstantaneousSpeed(`bit0`), TotalDistance(`bit1`), Latitude(`bit2`), Longitude(`bit2`), Elevation(`bit3`), Heading(`bit4`), RollingTime(`bit5`), Year(`bit6`), Month(`bit6`), Day(`bit6`), Hours(`bit6`), Minutes(`bit6`), Seconds(`bit6`) | uint8, uint16, uint24, int32, int32, int24, uint16, uint8, uint16, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a68 | Flags, Bearing, Heading, RemainingDistance(`bit0`), RemainingVerticalDistance(`bit1`), Year(`bit2`), Month(`bit2`), Day(`bit2`), Hours(`bit2`), Minutes(`bit2`), Seconds(`bit2`) | uint8, uint16, uint16, uint24, int24, uint16, uint8, uint8, uint8, uint8, uint8 | 
| 0x2a69 | Flags, NumberOfBeaconsInSolution(`bit0`), NumberOfBeaconsInView(`bit1`), TimeToFirstFix(`bit2`), EHPE(`bit3`), EVPE(`bit4`), HDOP(`bit5`), VDOP(`bit6`) | uint8, uint8, uint8, uint16, uint32, uint32, uint8, uint8 | 
| 0x2a6a | LNFeature | uint32 | 
| 0x2a6c | Elevation | int24 | 
| 0x2a6d | Pressure | uint32 | 
| 0x2a6e | Temp | int16 | 
| 0x2a6f | Humidity | uint16 | 
| 0x2a70 | TrueWindSpeed | uint16 | 
| 0x2a71 | TrueWindDirection | uint16 | 
| 0x2a72 | ApparentWindSpeed | uint16 | 
| 0x2a73 | ApparentWindDirection | uint16 | 
| 0x2a74 | GustFactor | uint8 | 
| 0x2a75 | PollenConcentration | uint24 | 
| 0x2a76 | UVIndex | uint8 | 
| 0x2a77 | Irradiance | uint16 | 
| 0x2a78 | Rainfall | uint16 | 
| 0x2a79 | WindChill | int8 | 
| 0x2a7a | eatIndex | int8 | 
| 0x2a7b | DewPoint | int8 | 
| 0x2a7d | Flags, UUID | uint16, uuid | 
| 0x2a7e | AerobicHeartRateLowerLimit | uint8 | 
| 0x2a7f | AerobicThreshold | uint8 | 
| 0x2a80 | Age | uint8 | 
| 0x2a81 | AnaerobicHeartRateLowerLimit | uint8 | 
| 0x2a82 | AnaerobicHeartRateUpperLimit | uint8 | 
| 0x2a83 | AnaerobicThreshold | uint8 | 
| 0x2a84 | AerobicHeartRateUpperLimit | uint8 | 
| 0x2a85 | Year, Month, Day | uint16, uint8, uint8 | 
| 0x2a86 | Year, Month, Day | uint16, uint8, uint8 | 
| 0x2a87 | EmailAddress | string | 
| 0x2a88 | FatBurnHeartRateLowerLimit | uint8 | 
| 0x2a89 | FatBurnHeartRateUpperLimit | uint8 | 
| 0x2a8a | FirstName | string | 
| 0x2a8b | VeryLight/Light, Light/Moderate, Moderate/Hard, Hard/Max | uint8, uint8, uint8, uint8 | 
| 0x2a8c | Gender | uint8 | 
| 0x2a8d | HeartRateMax | uint8 | 
| 0x2a8e | Height | uint16 | 
| 0x2a8f | HipCircumference | uint16 | 
| 0x2a90 | LastName | string | 
| 0x2a91 | MaxRecommHeartRate | uint8 | 
| 0x2a92 | RestingHeartRate | uint8 | 
| 0x2a93 | SportType | uint8 | 
| 0x2a94 | Light/Moderate, Moderate/Hard | uint8, uint8 | 
| 0x2a95 | Fatburn/FitnessLimit | uint8 | 
| 0x2a96 | VO2Max | uint8 | 
| 0x2a97 | WaistCircumference | uint16 | 
| 0x2a98 | Weight | uint16 | 
| 0x2a99 | DatabaseChangeIncrement | uint32 | 
| 0x2a9a | UserIndex | uint8 | 
| 0x2a9b | BodyCompositionFeature | uint32 | 
| 0x2a9c | Flags, BodyFatPercentage, Year(`bit1`), Month(`bit1`), Day(`bit1`), Hours(`bit1`), Minutes(`bit1`), Seconds(`bit1`), UserID(`bit2`), BasalMetabolism(`bit3`), MusclePercentage(`bit4`), MuscleMassKg(`!bit0 & bit5`), MuscleMassPounds(`bit0 & bit5`), FatFreeMassKg(`!bit0 & bit6`), FatFreeMassPounds(`bit0 & bit6`), SoftLeanMassKg(`!bit0 & bit7`), SoftLeanMassPounds(`bit0 & bit7`), BodyWaterMassKg(`!bit0 & bit8`), BodyWaterMassPounds(`bit0 & bit8`), Impedance(`bit9`), WeightKg(`!bit0 & bit10`), WeightPounds(`bit0 & bit10`), HeightMeters(`!bit0 & bit11`), HeightInches(`bit0 & bit11`) | uint16, uint16, uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16 | 
| 0x2a9d | Flags, WeightSI(`!bit0`), WeightImperial(`bit0`), Year(`bit1`), Month(`bit1`), Day(`bit1`), Hours(`bit1`), Minutes(`bit1`), Seconds(`bit1`), UserID(`bit2`), BMI(`bit3`), HeightSI(`!bit0 & bit3`), HeightImperial(`bit0 & bit3`) | uint8, uint16, uint16, uint16, uint8, uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16 | 
| 0x2a9e | WeightScaleFeature | uint32 | 
| 0x2aa0 | XAxis, YAxis | int16, int16 | 
| 0x2aa1 | XAxis, YAxis, ZAxis | int16, int16, int16 | 
| 0x2aa2 | Language | string | 
| 0x2aa3 | BarometricPressureTrend | uint8 | 
| 0x2aa5 | BondManagementFeature | uint24 | 
| 0x2aa6 | CentralAddrResolutionSupport | uint8 | 
| 0x2aa8 | CGMFeature, CGMType, CGMSampleLocation, E2E_CRC | uint24, nibble, nibble, uint16 | 
| 0x2aad | IndoorPositioningConfig | uint8 | 
| 0x2aae | Latitude | int32 | 
| 0x2aaf | Longitude | int32 | 
| 0x2ab0 | LocalNorthCoordinate | int16 | 
| 0x2ab1 | LocalEastCoordinate | int16 | 
| 0x2ab2 | FloorNumber | uint8 | 
| 0x2ab3 | Altitude | uint16 | 
| 0x2ab4 | Uncertainty | uint8 | 
| 0x2ab5 | LocationName | string | 
| 0x2ab6 | URI | string | 
| 0x2ab7 | HTTPHeaders | string | 
| 0x2ab8 | StatusCode, DataStatus | uint16, uint8 | 
| 0x2ab9 | HTTPEntityBody | string | 
| 0x2aba | OpCode | uint8 | 
| 0x2abb | HTTPSSecurity | boolean | 
| 0x2abd | OACPFeatures, OLCPFeatures | uint32, uint32 | 
| 0x2abe | ObjectName | string | 
| 0x2abf | ObjectType | uuid | 

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
