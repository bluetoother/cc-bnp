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
	'Success': 0x00,
	'Unknown_hci_cmd': 0x01,
	'Unknown_conn_id': 0x02,
	'Hw_failure': 0x03,
	'Page_timeout': 0x04,
	'Auth_failure': 0x05,
	'Pin_key_missing': 0x06,
	'Mem_cap_exceeded': 0x07,
	'Conn_timeout': 0x08,
	'Conn_limit_exceeded': 0x09,
	'Synch_conn_limit_exceeded': 0x0a,
	'Acl_conn_already_exists': 0x0b,
	'Cmd_disallowed': 0x0c,
	'Conn_rej_limited_resources': 0x0d,
	'Conn_rejected_security_reasons': 0x0e,
	'Conn_rejected_unacceptable_bdaddr': 0x0f,
	'Conn_accept_timeout_exceeded': 0x10,
	'Unsupported_feature_param_value': 0x11,
	'Invalid_hci_cmd_params': 0x12,
	'Remote_user_term_conn': 0x13,
	'Remote_device_term_conn_low_resources': 0x14,
	'Remote_device_term_conn_power_off': 0x15,
	'Conn_term_by_local_host': 0x16,
	'Repeated_attempts': 0x17,
	'Pairing_not_allowed': 0x18,
	'Unknown_lmp_pdu': 0x19,
	'Unsupported_remote_feature': 0x1a,
	'Sco_offset_rej': 0x1b,
	'Sco_interval_rej': 0x1c,
	'Sco_air_mode_rej': 0x1d,
	'Invalid_lmp_params': 0x1e,
	'Unspecified_error': 0x1f,
	'Unsupported_lmp_param_val': 0x20,
	'Role_change_not_allowed': 0x21,
	'Lmp_ll_resp_timeout': 0x22,
	'Lmp_err_transaction_collision': 0x23,
	'Lmp_pdu_not_allowed': 0x24,
	'Encrypt_mode_not_acceptable': 0x25,
	'Link_key_can_not_be_changed': 0x26,
	'Req_qos_not_supported': 0x27,
	'Instant_passed': 0x28,
	'Pairing_with_unit_key_not_supported': 0x29,
	'Different_transaction_collision': 0x2a,
	'Reserved1': 0x2b,
	'Qos_unacceptable_param': 0x2c,
	'Qos_rej': 0x2d,
	'Chan_assessment_not_supported': 0x2e,
	'Insufficient_security': 0x2f,
	'Param_out_of_mandatory_range': 0x30,
	'Reserved2': 0x31,
	'Role_switch_pending': 0x32,
	'Reserved3': 0x33,
	'Reserved_slot_violation': 0x34,
	'Role_switch_failed': 0x35,
	'Extended_inquiry_resp_too_large': 0x36,
	'Simple_pairing_not_supported_by_host': 0x37,
	'Host_busy_pairing': 0x38,
	'Conn_rej_no_suitable_chan_found': 0x39,
	'Controller_busy': 0x3a,
	'Unacceptable_conn_interval': 0x3b,
	'Directed_adv_timeout': 0x3c,
	'Conn_term_mic_failure': 0x3d,
	'Conn_failed_to_establish': 0x3e,
	'Mac_conn_failed': 0x3f
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

/**************************************************************************
 * HCI Command and Event Char Value Build and Discri
 * 
 *************************************************************************/
BHCI.cmdValBuild = ['AttWriteReq', 'AttHandleValueNoti', 'AttHandleValueInd', 'AttFindByTypeValueReq',
					'GattDiscPrimaryServiceByUuid', 'GattWriteCharValue', 'GattWriteNoRsp', 
					'GattSignedWriteNoRsp', 'GattWriteCharDesc', 'GattNotification', 'GattIndication', 'AttReadByTypeRsp', 
					'AttReadRsp', 'AttReadMultiRsp'];

BHCI.cmdWithUuid = ['AttReadByTypeReq', 'AttReadReq', 'AttWriteReq', 'AttHandleValueNoti',
					'AttHandleValueInd', 'GattDiscPrimaryServiceByUuid','GattReadCharValue', 'GattReadUsingCharUuid', 
					'GattWriteCharValue', 'GattWriteNoRsp', 'GattSignedWriteNoRsp', 'GattWriteCharDesc', 
					'GattNotification', 'GattIndication', 'AttReadByTypeRsp', 'AttReadRsp', 'AttReadMultiRsp'];

module.exports = BHCI;