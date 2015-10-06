'use strict'

var Enum = require('enum'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule();

var BHCI = {
	SubGroupCmd: {},
	SubGroupEvt: {}
};

/**************************************************************************
 * HCI Packet Type, Ref: hci_tl.h
 * PacketType
 *************************************************************************/
BHCI.PacketType = new Enum({
    'CMD': 0x01,
    'ACL_DATA': 0x02,
    'SCO_DATA': 0x03,
    'EVENT': 0x04
});

/**************************************************************************
 * HCI Opcode Group Field, Ref: 
 * CmdGroup(OGF)
 *************************************************************************/
BHCI.CmdGroup = new Enum({
    'LINK_CONTROL': 0x0400,
    'LINK_POLICY': 0x0800,
    'CONTROLLER_AND_BASEBAND': 0x0C00,
    'INFORMATIONAL_PARAMETERS': 0x1000,
    'STATUS_PARAMETERS': 0x1400,
    'TESTING': 0x1800,
    'LE_ONLY': 0x2000,
    'VENDOR_SPECIFIC': 0xFC00
});

/**************************************************************************
 * HCI Command SubGroup, Ref: hci_ext_app.h
 * CmdSubGroup(CSG)
 *************************************************************************/
BHCI.CmdSubGroup = new Enum({
	'Hci': 0x0000,     
	'L2cap': 0x0080,
	'Att': 0x0100,
	'Gatt': 0x0180,
	'Gap': 0x0200,
	'Util': 0x0280,
	'Profile': 0x0380
});

/**************************************************************************
 * HCI Command Opcode Mask
 * CmdOpcodeMask
 *************************************************************************/
BHCI.CmdOpcodeMask = new Enum({
	'OGF': 0xFC00,
	'CSG': 0x0380,
	'Cmd': 0x007F
});

/**************************************************************************
 * HCI Command SubGroup
 * SubGroupCmd(Command ID)
 *************************************************************************/
/* (1) HCI COMMANDS: SubGroupCmd.HCI, Ref: hci_tl.h                      */
BHCI.SubGroupCmd.HCI = new Enum({
	'SetRxGain': 0x0000,
	'SetTxPower': 0x0001,
	'OnePktPerEvt': 0x0002,
	'ClkDivideOnHalt': 0x0003,
	'DeclareNvUsage': 0x0004,
	'Decrypt': 0x0005,
	'SetLocalSupportedFeatures': 0x0006,
	'SetFastTxRespTime': 0x0007,
	'ModemTestTx': 0x0008,
	'ModemHopTestTx': 0x0009,
	'ModemTestRx': 0x000A,
	'EndModemTest': 0x000B,
	'SetBdaddr': 0x000C,
	'SetSca': 0x000D,
	'EnablePtm': 0x000E,
	'SetFreqTune': 0x000F,
	'SaveFreqTune': 0x0010,
	'SetMaxDtmTxPower': 0x0011,
	'MapPmIoPort': 0x0012,
	'DisconnectImmed': 0x0013,
	'Per': 0x0014,
	'PerByChan': 0x0015,
	'ExtendRfRange': 0x0016,
	'AdvEventNotice': 0x0017,
	'ConnEventNotice': 0x0018,
	'HaltDuringRf': 0x0019,
	'OverrideSl': 0x001A,
	'BuildRevision': 0x001B,
	'DelaySleep': 0x001C,
	'ResetSystem': 0x001D,
	'OverlappedProcessing': 0x001E,
	'NumCompletedPktsLimit': 0x001F
});

/* (2) L2CAP COMMANDS: SubGroupCmd.L2CAP, Ref: l2cap.h                   */
BHCI.SubGroupCmd.L2CAP = new Enum({
	'PARAM_UPDATE_REQ': 0x0012
});

/* (3) ATT COMMANDS: SubGroupCmd.ATT, Ref: att.h                         */
BHCI.SubGroupCmd.ATT = new Enum({
	'ErrorRsp': 0x0001,
	'ExchangeMtuReq': 0x0002,
	'ExchangeMtuRsp': 0x0003,
	'FindInfoReq': 0x0004,
	'FindInfoRsp': 0x0005,
	'FindByTypeValueReq': 0x0006,
	'FindByTypeValueRsp': 0x0007,
	'ReadByTypeReq': 0x0008,
	'ReadByTypeRsp': 0x0009,
	'ReadReq': 0x000A,
	'ReadRsp': 0x000B,
	'ReadBlobReq': 0x000C,
	'ReadBlobRsp': 0x000D,
	'ReadMultiReq': 0x000E,
	'ReadMultiRsp': 0x000F,
	'ReadByGrpTypeReq': 0x0010,
	'ReadByGrpTypeRsp': 0x0011,
	'WriteReq': 0x0012,
	'WriteRsp': 0x0013,
	'PrepareWriteReq': 0x0016,
	'PrepareWriteRsp': 0x0017,
	'ExecuteWriteReq': 0x0018,
	'ExecuteWriteRsp': 0x0019,
	'HandleValueNoti': 0x001B,
	'HandleValueInd': 0x001D,
	'HandleValueCfm': 0x001E
});

/* (4) GATT COMMANDS: SubGroupCmd.GATT, Ref: hci_ext_app.h               */
BHCI.SubGroupCmd.GATT = new Enum({
	'EXCHANGE_MTU': 0x0002,
	'DISC_ALL_PRIMARY_SERVICES': 0x0010,
	'DISC_PRIMARY_SERVICE_BY_UUID': 0x0006,
	'FIND_INCLUDED_SERVICES': 0x0030,
	'DISC_ALL_CHARS': 0x0032,
	'DISC_CHARS_BY_UUID': 0x0008,
	'DISC_ALL_CHAR_DESCS': 0x0004,
	'READ_CHAR_VALUE': 0x000A,
	'READ_USING_CHAR_UUID': 0x0034,
	'READ_LONG_CHAR_VALUE': 0x000C,
	'READ_MULTI_CHAR_VALUES':0x000E, 
	'WRITE_NO_RSP': 0x0036,
	'SIGNED_WRITE_NO_RSP': 0x0038,
	'WRITE_CHAR_VALUE': 0x0012,
	'WRITE_LONG_CHAR_VALUE': 0x0016,
	'RELIABLE_WRITES': 0x003A,
	'READ_CHAR_DESC': 0x003C,
	'READ_LONG_CHAR_DESC': 0x003E,
	'WRITE_CHAR_DESC': 0x0040,
	'WRITE_LONG_CHAR_DESC': 0x0042,
	'NOTIFICATION': 0x001B,
	'INDICATION': 0x001D,
	'ADD_SERVICE': 0x007C,
	'DEL_SERVICE': 0x007D,
	'ADD_ATTRIBUTE': 0x007E
});

/* (5) GAP COMMANDS: SubGroupCmd.GAP, Ref: hci_ext_app.h                 */
BHCI.SubGroupCmd.GAP = new Enum({
	'DEVICE_INIT': 0x0000,
	'CONFIG_DEVICE_ADDR': 0x0003,
	'DEVICE_DISC_REQ': 0x0004,
	'DEVICE_DISC_CANCEL': 0x0005,
	'MAKE_DISCOVERABLE': 0x0006,
	'UPDATE_ADV_DATA': 0x0007,
	'END_DISC': 0x0008,
	'EST_LINK_REQ': 0x0009,
	'TERMINATE_LINK': 0x000A,
	'AUTHENTICATE': 0x000B,
	'PASSKEY_UPDATE': 0x000C,
	'SLAVE_SECURITY_REQ_UPDATE': 0x000D,
	'SIGNABLE': 0x000E,
	'BOND': 0x000F,
	'TERMINATE_AUTH': 0x0010,
	'UPDATE_LINK_PARAM_REQ': 0x0011,
	'SET_PARAM': 0x0030,
	'GET_PARAM': 0x0031,
	'RESOLVE_PRIVATE_ADDR': 0x0032,
	'SET_ADV_TOKEN': 0x0033,
	'REMOVE_ADV_TOKEN': 0x0034,
	'UPDATE_ADV_TOKENS': 0x0035,
	'BOND_SET_PARAM': 0x0036,
	'BOND_GET_PARAM': 0x0037,
	'BOND_SERVICE_CHANGE': 0x0038
});

/* (6) UTIL COMMANDS: SubGroupCmd.UTIL, Ref: hci_ext_app.h               */
BHCI.SubGroupCmd.UTIL = new Enum({
	'NV_READ': 0x0001,
	'NV_WRITE': 0x0002,
	'FORCE_BOOT': 0x0003
});

/**************************************************************************
 * HCI Event Code, Ref: hci_tl.h
 * EvtCode(EC)
 *************************************************************************/
BHCI.EvtCode = new Enum({
    'DISCONNECTION_COMPLETE': 0x05,
	'ENCRYPTION_CHANGE': 0x08,
	'READ_REMOTE_INFO_COMPLETE': 0x0C,
	'COMMAND_COMPLETE': 0x0E,
	'COMMAND_STATUS': 0x0F,
	'BLE_HARDWARE_ERROR': 0x10,
	'NUM_OF_COMPLETED_PACKETS': 0x13,
	'DATA_BUFFER_OVERFLOW': 0x1A,
	'KEY_REFRESH_COMPLETE': 0x30,
	'LE': 0x3E,
	'VENDOR_SPECIFIC': 0xFF
});

/**************************************************************************
 * HCI Event Opcode Group Field, Ref: 
 * EvtGroup(EOGF)
 *************************************************************************/
BHCI.EvtGroup = new Enum({
    'EMBEDDED': 0x0000,
    'CORE': 0x0400,
    'PROFILE_REQ': 0x0800,
    'PROFILE_RSP': 0x0C00,
});

/**************************************************************************
 * HCI Event SubGroup, Ref: hci_ext_app.h
 * EvtSubGroup(ESG)
 *************************************************************************/
BHCI.EvtSubGroup = new Enum({
    'HCI': 0x0000,     
	'L2CAP': 0x0080,
	'ATT': 0x0100,
	'GATT': 0x0180,
	'GAP': 0x0200,
	'UTIL': 0x0280,
	'PROFILE': 0x0380
});

/**************************************************************************
 * HCI Event Opcode Mask
 * EvtOpcodeMask
 *************************************************************************/
BHCI.EvtOpcodeMask = new Enum({
	'EOGF': 0xFC00,
	'ESG': 0x0380,
	'Evt': 0x007F
});

/**************************************************************************
 * HCI Event SubGroup
 * SubGroupEvt(Event ID)
 *************************************************************************/
/* (1) HCI Events: SubGroupEvt.HCI, Ref: hci_tl.h                        */
BHCI.SubGroupEvt.HCI = BHCI.SubGroupCmd.HCI;

/* (2) L2CAP Events: SubGroupEvt.L2CAP, Ref: l2cap.h                     */
BHCI.SubGroupEvt.L2CAP = new Enum({
	'CmdReject': 0x0001,
	'ParamUpdateRsp': 0x0013,
});

/* (3) ATT Events: SubGroupEvt.ATT, Ref: att.h                           */
BHCI.SubGroupEvt.ATT = BHCI.SubGroupCmd.ATT;

/* (4) GATT Events: SubGroupEvt.GATT, Ref: gattservapp.h                 */
BHCI.SubGroupEvt.GATT = new Enum({
    'ClientCharCfgUpdate': 0x0000
});

/* (5) GAP Events: SubGroupEvt.GAP, Ref: gap.h                           */
BHCI.SubGroupEvt.GAP = new Enum({
	'DeviceInitDone': 0x0000,
	'DeviceDiscovery': 0x0001,
	'AdvDataUpdateDone': 0x0002,
	'MakeDiscoverableDone': 0x0003,
	'EndDiscoverableDone': 0x0004,
	'LinkEstablished': 0x0005,
	'LinkTerminated': 0x0006,
	'LinkParamUpdate': 0x0007,
	'RandomAddrChanged': 0x0008,
	'SignatureUpdated': 0x0009,
	'AuthenticationComplete': 0x000A,
	'PasskeyNeeded': 0x000B,
	'SlaveRequestedSecurity': 0x000C,
	'DeviceInfo': 0x000D,
	'BondComplete': 0x000E,
	'PairingReq': 0x000F,
	'CmdStatus': 0x007F
});

/**************************************************************************
 * HCI Error Code, Ref: hci.h
 * ErrCode
 *************************************************************************/
BHCI.ErrCode = new Enum({
    'SUCCESS': 0x00,
    'UNKNOWN_HCI_CMD': 0x01,
    'UNKNOWN_CONN_ID': 0x02,
    'HW_FAILURE': 0x03,
    'PAGE_TIMEOUT': 0x04,
    'AUTH_FAILURE': 0x05,
    'PIN_KEY_MISSING': 0x06,
    'MEM_CAP_EXCEEDED': 0x07,
    'CONN_TIMEOUT': 0x08,
    'CONN_LIMIT_EXCEEDED': 0x09,
    'SYNCH_CONN_LIMIT_EXCEEDED': 0x0A,
    'ACL_CONN_ALREADY_EXISTS': 0x0B,
    'CMD_DISALLOWED': 0x0C,
    'CONN_REJ_LIMITED_RESOURCES': 0x0D,
    'CONN_REJECTED_SECURITY_REASONS': 0x0E,
    'CONN_REJECTED_UNACCEPTABLE_BDADDR': 0x0F,
    'CONN_ACCEPT_TIMEOUT_EXCEEDED': 0x10,
    'UNSUPPORTED_FEATURE_PARAM_VALUE': 0x11,
    'INVALID_HCI_CMD_PARAMS': 0x12,
    'REMOTE_USER_TERM_CONN': 0x13,
    'REMOTE_DEVICE_TERM_CONN_LOW_RESOURCES': 0x14,
    'REMOTE_DEVICE_TERM_CONN_POWER_OFF': 0x15,
    'CONN_TERM_BY_LOCAL_HOST': 0x16,
    'REPEATED_ATTEMPTS': 0x17,
    'PAIRING_NOT_ALLOWED': 0x18,
    'UNKNOWN_LMP_PDU': 0x19,
    'UNSUPPORTED_REMOTE_FEATURE': 0x1A,
    'SCO_OFFSET_REJ': 0x1B,
    'SCO_INTERVAL_REJ': 0x1C,
    'SCO_AIR_MODE_REJ': 0x1D,
    'INVALID_LMP_PARAMS': 0x1E,
    'UNSPECIFIED_ERROR': 0x1F,
    'UNSUPPORTED_LMP_PARAM_VAL': 0x20,
    'ROLE_CHANGE_NOT_ALLOWED': 0x21,
    'LMP_LL_RESP_TIMEOUT': 0x22,
    'LMP_ERR_TRANSACTION_COLLISION': 0x23,
    'LMP_PDU_NOT_ALLOWED': 0x24,
    'ENCRYPT_MODE_NOT_ACCEPTABLE': 0x25,
    'LINK_KEY_CAN_NOT_BE_CHANGED': 0x26,
    'REQ_QOS_NOT_SUPPORTED': 0x27,
    'INSTANT_PASSED': 0x28,
    'PAIRING_WITH_UNIT_KEY_NOT_SUPPORTED': 0x29,
    'DIFFERENT_TRANSACTION_COLLISION': 0x2A,
    'RESERVED1': 0x2B,
    'QOS_UNACCEPTABLE_PARAM': 0x2C,
    'QOS_REJ': 0x2D,
    'CHAN_ASSESSMENT_NOT_SUPPORTED': 0x2E,
    'INSUFFICIENT_SECURITY': 0x2F,
    'PARAM_OUT_OF_MANDATORY_RANGE': 0x30,
    'RESERVED2': 0x31,
    'ROLE_SWITCH_PENDING': 0x32,
    'RESERVED3': 0x33,
    'RESERVED_SLOT_VIOLATION': 0x34,
    'ROLE_SWITCH_FAILED': 0x35,
    'EXTENDED_INQUIRY_RESP_TOO_LARGE': 0x36,
    'SIMPLE_PAIRING_NOT_SUPPORTED_BY_HOST': 0x37,
    'HOST_BUSY_PAIRING': 0x38,
    'CONN_REJ_NO_SUITABLE_CHAN_FOUND': 0x39,
    'CONTROLLER_BUSY': 0x3A,
    'UNACCEPTABLE_CONN_INTERVAL': 0x3B,
    'DIRECTED_ADV_TIMEOUT': 0x3C,
    'CONN_TERM_MIC_FAILURE': 0x3D,
    'CONN_FAILED_TO_ESTABLISH': 0x3E,
    'MAC_CONN_FAILED': 0x3F
});

/**************************************************************************
 * HCI Event Common Chunk Rules
 * 
 *************************************************************************/
BHCI.HciAttrs = {
    len: 2,
    paramLens: 5,
    params: ['status', 'cmdOpcode'],
    types: ['uint8', 'uint16le'],
};

module.exports = BHCI;