'use strict';

var Enum = require('enum'),
	DChunks = require('dissolve-chunks'),
	ru = DChunks().Rule();

var BHCI = {
		SubGroupCmd: {},
		SubGroupEvt: {},
		cmdEvtCorrTable: {}
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
BHCI.SubGroupCmd.Hci = new Enum({
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
BHCI.SubGroupCmd.L2cap = new Enum({
	'ParamUpdateReq': 0x0012
});

/* (3) ATT COMMANDS: SubGroupCmd.ATT, Ref: att.h                         */
BHCI.SubGroupCmd.Att = new Enum({
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
BHCI.SubGroupCmd.Gatt = new Enum({
	'ExchangeMtu': 0x0002,
	'DiscAllPrimaryServices': 0x0010,
	'DiscPrimaryServiceByUuid': 0x0006,
	'FindIncludedServices': 0x0030,
	'DiscAllChars': 0x0032,
	'DiscCharsByUuid': 0x0008,
	'DiscAllCharDescs': 0x0004,
	'ReadCharValue': 0x000A,
	'ReadUsingCharUuid': 0x0034,
	'ReadLongCharValue': 0x000C,
	'ReadMultiCharValues':0x000E, 
	'WriteNoRsp': 0x0036,
	'SignedWriteNoRsp': 0x0038,
	'WriteCharValue': 0x0012,
	'WriteLongCharValue': 0x0016,
	'ReliableWrites': 0x003A,
	'ReadCharDesc': 0x003C,
	'ReadLongCharDesc': 0x003E,
	'WriteCharDesc': 0x0040,
	'WriteLongCharDesc': 0x0042,
	'Notification': 0x001B,
	'Indication': 0x001D,
	'AddService': 0x007C,
	'DelService': 0x007D,
	'AddAttribute': 0x007E
});

/* (5) GAP COMMANDS: SubGroupCmd.GAP, Ref: hci_ext_app.h                 */
BHCI.SubGroupCmd.Gap = new Enum({
	'DeviceInit': 0x0000,
	'ConfigDeviceAddr': 0x0003,
	'DeviceDiscReq': 0x0004,
	'DeviceDiscCancel': 0x0005,
	'MakeDiscoverable': 0x0006,
	'UpdateAdvData': 0x0007,
	'EndDisc': 0x0008,
	'EstLinkReq': 0x0009,
	'TerminateLink': 0x000A,
	'Authenticate': 0x000B,
	'PasskeyUpdate': 0x000C,
	'SlaveSecurityReqUpdate': 0x000D,
	'Signable': 0x000E,
	'Bond': 0x000F,
	'TerminateAuth': 0x0010,
	'UpdateLinkParamReq': 0x0011,
	'SetParam': 0x0030,
	'GetParam': 0x0031,
	'ResolvePrivateAddr': 0x0032,
	'SetAdvToken': 0x0033,
	'RemoveAdvToken': 0x0034,
	'UpdateAdvTokens': 0x0035,
	'BondSetParam': 0x0036,
	'BondGetParam': 0x0037,
	'BondServiceChange': 0x0038
});

/* (6) UTIL COMMANDS: SubGroupCmd.UTIL, Ref: hci_ext_app.h               */
BHCI.SubGroupCmd.Util = new Enum({
	'NvRead': 0x0001,
	'NvWrite': 0x0002,
	'ForceBoot': 0x0003
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
BHCI.EvtSubGroup = BHCI.CmdSubGroup;

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
BHCI.SubGroupEvt.Hci = BHCI.SubGroupCmd.Hci;

/* (2) L2CAP Events: SubGroupEvt.L2CAP, Ref: l2cap.h                     */
BHCI.SubGroupEvt.L2cap = new Enum({
	'CmdReject': 0x0001,
	'ParamUpdateRsp': 0x0013,
});

/* (3) ATT Events: SubGroupEvt.ATT, Ref: att.h                           */
BHCI.SubGroupEvt.Att = BHCI.SubGroupCmd.Att;

/* (4) GATT Events: SubGroupEvt.GATT, Ref: gattservapp.h                 */
BHCI.SubGroupEvt.Gatt = new Enum({
	'ClientCharCfgUpdate': 0x0000
});

/* (5) GAP Events: SubGroupEvt.GAP, Ref: gap.h                           */
BHCI.SubGroupEvt.Gap = new Enum({
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
BHCI.HciErrCode = new Enum({
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
 *
 *
 *************************************************************************/
BHCI.AttErrCode = new Enum({
	'The attribute handle given was not valid on this server': 0x01,
	'The attribute cannot be read': 0x02,
	'The attribute cannot be written': 0x03,
	'The attribute PDU was invalid': 0x04,
	'The attribute requires authentication before it can be read or written': 0x05,
	'Attribute server does not support the request received from the client': 0x06,
	'Offset specified was past the end of the attribute': 0x07,
	'The attribute requires authorization before it can be read or written': 0x08,
	'Too many prepare writes have been queued': 0x09,
	'No attribute found within the given attribute handle range': 0x0A,
	'The attribute cannot be read or written using the Read Blob Request': 0x0B,
	'The Encryption Key Size used for encrypting this link is insufficient': 0x0C,
	'The attribute value length is invalid for the operation': 0x0D,
	'The attribute request that was requested has encountered an error that was unlikely, and therefore could not be completed as requested': 0x0E,
	'The attribute requires encryption before it can be read or written': 0x0F,
	'The attribute type is not a supported grouping attribute as defined by a higher layer specification': 0x10,
	'Insufficient Resources to complete the request': 0x11,
	'The attribute value is invalid for the operation': 0x80
});
/**************************************************************************
 *
 *
 *************************************************************************/
 BHCI.GenericStatus = new Enum({
	'SUCCESS': 0x00,
	'FAILURE': 0x01,
	'INVALID_PARAMETER': 0x02,
	'INVALID_TASK': 0x03,
	'MSG_BUFFER_NOT_AVAIL': 0x04,
	'INVALID_MSG_POINTER': 0x05,
	'INVALID_EVENT_ID': 0x06,
	'INVALID_INTERRUPT_ID': 0x07,
	'NO_TIMER_AVAIL': 0x08,
	'NV_ITEM_UNINIT': 0x09,
	'NV_OPER_FAILED': 0x0A,
	'INVALID_MEM_SIZE': 0x0B,
	'NV_BAD_ITEM_LEN': 0x0C,
	//BLE Status
	'bleNotReady': 0x10,
	'bleAlreadyInRequestedMode': 0x11,
	'bleIncorrectMode': 0x12,
	'bleMemAllocError': 0x13,
	'bleNotConnected': 0x14,
	'bleNoResources': 0x15,
	'blePending': 0x16,
	'bleTimeout': 0x17,
	'bleInvalidRange': 0x18,
	'bleLinkEncrypted': 0x19,
	'bleProcedureComplete': 0x1A,
	// GAP Status
	'bleGAPUserCanceled': 0x30,
	'bleGAPConnNotAcceptable': 0x31,
	'bleGAPBondRejected': 0x32,
	// ATT Status
	'bleInvalidPDU': 0x40,
	'bleInsufficientAuthen': 0x41,
	'bleInsufficientEncrypt': 0x42,
	'bleInsufficientKeySize': 0x43
});

/**************************************************************************
 * HCI Command and Event Corresponding Table
 * 
 *************************************************************************/
BHCI.cmdEvtCorrTable.Att = {
	AttExchangeMtuReq: 'AttExchangeMtuRsp',
	AttFindInfoReq: ['AttFindInfoRsp'],
	AttFindByTypeValueReq: ['AttFindByTypeValueRsp'],
	AttReadByTypeReq: ['AttReadByTypeRsp'],
	AttReadReq: 'AttReadRsp',
	AttReadBlobReq: ['AttReadBlobRsp'],
	AttReadMultiReq: 'AttReadMultiRsp',
	AttReadByGrpTypeReq: ['AttReadByGrpTypeRsp'],
	AttWriteReq: 'AttWriteRsp',
	AttPrepareWriteReq: 'AttPrepareWriteRsp',
	AttExecuteWriteReq: 'AttExecuteWriteRsp',
	AttHandleValueInd: 'AttHandleValueCfm'
};

BHCI.cmdEvtCorrTable.Gatt = {
	GattExchangeMtu: BHCI.cmdEvtCorrTable.Att.AttExchangeMtuReq,
	GattDiscAllPrimaryServices: BHCI.cmdEvtCorrTable.Att.AttReadByGrpTypeReq,
	GattDiscPrimaryServiceByUuid: BHCI.cmdEvtCorrTable.Att.AttFindByTypeValueReq,
	GattFindIncludedServices: BHCI.cmdEvtCorrTable.Att.AttReadByTypeReq,
	GattDiscAllChars: BHCI.cmdEvtCorrTable.Att.AttReadByTypeReq,
	GattDiscCharsByUuid: BHCI.cmdEvtCorrTable.Att.AttReadByTypeReq,
	GattDiscAllCharDescs: BHCI.cmdEvtCorrTable.Att.AttFindInfoReq,
	GattReadCharValue: BHCI.cmdEvtCorrTable.Att.AttReadReq,
	GattReadUsingCharUuid: BHCI.cmdEvtCorrTable.Att.AttReadByTypeReq,
	GattReadLongCharValue: BHCI.cmdEvtCorrTable.Att.AttReadBlobReq,
	GattReadMultiCharValues: BHCI.cmdEvtCorrTable.Att.AttReadMultiReq,
	GattWriteCharValue: BHCI.cmdEvtCorrTable.Att.AttWriteReq,
	GattWriteLongCharValue: BHCI.cmdEvtCorrTable.Att.AttExecuteWriteReq,
	GattReliableWrites: BHCI.cmdEvtCorrTable.Att.AttExecuteWriteReq,
	GattReadCharDesc: BHCI.cmdEvtCorrTable.Att.AttReadReq,
	GattReadLongCharDesc: BHCI.cmdEvtCorrTable.Att.AttReadBlobReq,
	GattWriteCharDesc: BHCI.cmdEvtCorrTable.Att.AttWriteReq,
	GattWriteLongCharDesc: BHCI.cmdEvtCorrTable.Att.AttExecuteWriteReq,
	GattIndication: BHCI.cmdEvtCorrTable.Att.AttHandleValueInd
};

BHCI.cmdEvtCorrTable.Gap = {
	GapDeviceInit: 'GapDeviceInitDone',
	GapConfigDeviceAddr: 'GapRandomAddrChanged',
	GapDeviceDiscReq: ['GapDeviceInfo', 'GapDeviceDiscovery'],
	GapDeviceDiscCancel: 'GapDeviceDiscovery',
	GapMakeDiscoverable: ['GapMakeDiscoverableDone', 'GapEndDiscoverableDone'],
	GapUpdateAdvData: 'GapAdvDataUpdateDone',
	GapEndDisc: 'GapEndDiscoverableDone',
	GapEstLinkReq: 'GapLinkEstablished',
	GapTerminateLink: 'GapLinkTerminated',
	GapAuthenticate: 'GapAuthenticationComplete',
	GapBond: 'GapBondComplete',
	GapTerminateAuth: 'GapAuthenticationComplete',
	GapUpdateLinkParamReq: 'GapLinkParamUpdate',
};

module.exports = BHCI;