level 1
	1. hci layer
	2. util layer
	3. l2cap layer
	4. gap layer
		- GapPasskeyUpdate
		- GapSlaveSecurityReqUpdate
		- GapSignable
		- GapTerminateAuth
		- GapSetParam
		- GapGetParam
		- GapResolvePrivateAddr
		- GapSetAdvToken
		- GapRemoveAdvToken
		- GapUpdateAdvTokens
		- GapBondSetParam
		- GapBondGetParam
	5. att layer
		- AttErrorRsp
		- AttExchangeMtuRsp
		- AttFindInfoRsp
		- AttFindByTypeValueRsp
		- AttReadByTypeRsp
		- AttReadRsp
		- AttReadBlobRsp
		- AttReadMultiRsp
		- AttReadByGrpTypeRsp
		- AttWriteRsp
		- AttPrepareWriteReq
		- AttPrepareWriteRsp
		- AttExecuteWriteRsp
		- AttHandleValueNoti
		- AttHandleValueCfm
	6. gatt
		- GattWriteNoRsp
		- GattSignedWriteNoRsp
		- GattNotification
		- GattAddService
		- GattDelService
		- GattAddAttribute
lavel 2
	1. gap layer
		- GapDeviceInit
		- GapConfigDeviceAddr
		- GapDeviceDiscCancel
		- GapMakeDiscoverable
		- GapUpdateAdvData
		- GapEndDisc
		- GapEstLinkReq
		- GapTerminateLink
		- GapUpdateLinkParamReq
		- GapBond
	2. att layer
		- AttExchangeMtuReq
		- AttReadReq
		- AttReadBlobReq
		- AttWriteReq
		- AttExecuteWriteReq
		- AttHandleValueInd
	3. gatt layer
		- GattExchangeMtu
		- GattReadCharValue
		- GattReadLongCharValue
		- GattWriteCharValue
		- GattWriteLongCharValue
		- GattReadCharDesc
		- GattReadLongCharDesc
		- GattWriteCharDesc
		- GattWriteLongCharDesc
		- GattIndication
lavel 3 
	1. gap layer
		- GapDeviceDiscReq
		- GapAuthenticate
	2. att layer
		- AttFindInfoReq
		- AttFindByTypeValueReq
		- AttReadByTypeReq
		- AttReadMultiReq
		- AttReadByGrpTypeReq
	3. gatt layer
		- GattDiscAllPrimaryServices
		- GattDiscPrimaryServiceByUuid
		- GattFindIncludedServices
		- GattDiscAllChars
		- GattDiscCharsByUuid
		- GattDiscAllCharDescs
		- GattReadUsingCharUuid
		- GattReadMultiCharValues
		- GattReliableWrites
