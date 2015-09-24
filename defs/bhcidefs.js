'use strict'

var Enum = require('enum');
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
	'HCI': 0x0000,     
	'L2CAP': 0x0080,
	'ATT': 0x0100,
	'GATT': 0x0180,
	'GAP': 0x0200,
	'UTIL': 0x0280,
	'PROFILE': 0x0380
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
	'SET_RX_GAIN': 0x0000,
	'SET_TX_POWER': 0x0001,
	'ONE_PKT_PER_EVT': 0x0002,
	'CLK_DIVIDE_ON_HALT': 0x0003,
	'DECLARE_NV_USAGE': 0x0004,
	'DECRYPT': 0x0005,
	'SET_LOCAL_SUPPORTED_FEATURES': 0x0006,
	'SET_FAST_TX_RESP_TIME': 0x0007,
	'MODEM_TEST_TX': 0x0008,
	'MODEM_HOP_TEST_TX': 0x0009,
	'MODEM_TEST_RX': 0x000A,
	'END_MODEM_TEST': 0x000B,
	'SET_BDADDR': 0x000C,
	'SET_SCA': 0x000D,
	'ENABLE_PTM': 0x000E,
	'SET_FREQ_TUNE': 0x000F,
	'SAVE_FREQ_TUNE': 0x0010,
	'SET_MAX_DTM_TX_POWER': 0x0011,
	'MAP_PM_IO_PORT': 0x0012,
	'DISCONNECT_IMMED': 0x0013,
	'PER': 0x0014,
	'PER_BY_CHAN': 0x0015,
	'EXTEND_RF_RANGE': 0x0016,
	'ADV_EVENT_NOTICE': 0x0017,
	'CONN_EVENT_NOTICE': 0x0018,
	'HALT_DURING_RF': 0x0019,
	'OVERRIDE_SL': 0x001A,
	'BUILD_REVISION': 0x001B,
	'DELAY_SLEEP': 0x001C,
	'RESET_SYSTEM': 0x001D,
	'OVERLAPPED_PROCESSING': 0x001E,
	'NUM_COMPLETED_PKTS_LIMIT': 0x001F
});

/* (2) L2CAP COMMANDS: SubGroupCmd.L2CAP, Ref: l2cap.h                   */
BHCI.SubGroupCmd.L2CAP = new Enum({
	'PARAM_UPDATE_REQ': 0x0012
});

/* (3) ATT COMMANDS: SubGroupCmd.ATT, Ref: att.h                         */
BHCI.SubGroupCmd.ATT = new Enum({
	'ERROR_RSP': 0x0001,
	'EXCHANGE_MTU_REQ': 0x0002,
	'EXCHANGE_MTU_RSP': 0x0003,
	'FIND_INFO_REQ': 0x0004,
	'FIND_INFO_RSP': 0x0005,
	'FIND_BY_TYPE_VALUE_REQ': 0x0006,
	'FIND_BY_TYPE_VALUE_RSP': 0x0007,
	'READ_BY_TYPE_REQ': 0x0008,
	'READ_BY_TYPE_RSP': 0x0009,
	'READ_REQ': 0x000A,
	'READ_RSP': 0x000B,
	'READ_BLOB_REQ': 0x000C,
	'READ_BLOB_RSP': 0x000D,
	'READ_MULTI_REQ': 0x000E,
	'READ_MULTI_RSP': 0x000F,
	'READ_BY_GRP_TYPE_REQ': 0x0010,
	'READ_BY_GRP_TYPE_RSP': 0x0011,
	'WRITE_REQ': 0x0012,
	'WRITE_RSP': 0x0013,
	'PREPARE_WRITE_REQ': 0x0016,
	'PREPARE_WRITE_RSP': 0x0017,
	'EXECUTE_WRITE_REQ': 0x0018,
	'EXECUTE_WRITE_RSP': 0x0019,
	'HANDLE_VALUE_NOTI': 0x001B,
	'HANDLE_VALUE_IND': 0x001D,
	'HANDLE_VALUE_CFM': 0x001E
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
	'CMD_REJECT': 0x0001,
	'PARAM_UPDATE_RSP': 0x0013,
});

/* (3) ATT Events: SubGroupEvt.ATT, Ref: att.h                           */
BHCI.SubGroupEvt.ATT = BHCI.SubGroupCmd.ATT;

/* (4) GATT Events: SubGroupEvt.GATT, Ref: gattservapp.h                 */
BHCI.SubGroupEvt.GATT = new Enum({
    'CLIENT_CHAR_CFG_UPDATED': 0x0000
});

/* (5) GAP Events: SubGroupEvt.GAP, Ref: gap.h                           */
BHCI.SubGroupEvt.GAP = new Enum({
	'DEVICE_INIT_DONE': 0x0000,
	'DEVICE_DISCOVERY': 0x0001,
	'ADV_DATA_UPDATE_DONE': 0x0002,
	'MAKE_DISCOVERABLE_DONE': 0x0003,
	'END_DISCOVERABLE_DONE': 0x0004,
	'LINK_ESTABLISHED': 0x0005,
	'LINK_TERMINATED': 0x0006,
	'LINK_PARAM_UPDATE': 0x0007,
	'RANDOM_ADDR_CHANGED': 0x0008,
	'SIGNATURE_UPDATED': 0x0009,
	'AUTHENTICATION_COMPLETE': 0x000A,
	'PASSKEY_NEEDED': 0x000B,
	'SLAVE_REQUESTED_SECURITY': 0x000C,
	'DEVICE_INFO': 0x000D,
	'BOND_COMPLETE': 0x000E,
	'PAIRING_REQ': 0x000F,
	'CMD_STATUS': 0x007F
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
})

module.exports = BHCI;