#include "APIEnvir.h"
#include "ACAPinc.h"

#include "ResourceIds.hpp"
#include "NodeDialogController.hpp"

namespace {

const GSResID AddOnInfoID = ID_ADDON_INFO;
const Int32 AddOnNameID = 1;
const Int32 AddOnDescriptionID = 2;

const short AddOnMenuID = ID_ADDON_MENU;
const Int32 AddOnCommandID = 1;

GSErrCode MenuCommandHandler (const API_MenuParams *menuParams)
{
	switch (menuParams->menuItemRef.menuResID) {
		case AddOnMenuID:
			switch (menuParams->menuItemRef.itemIndex) {
				case AddOnCommandID:
					{
						Controller::NodeDialog controller;
						controller.InvokeDialog ();
					}
					break;
			}
			break;
	}
	return NoError;
}

}

API_AddonType CheckEnvironment (API_EnvirParams* envir)
{
	RSGetIndString (&envir->addOnInfo.name, AddOnInfoID, AddOnNameID, ACAPI_GetOwnResModule ());
	RSGetIndString (&envir->addOnInfo.description, AddOnInfoID, AddOnDescriptionID, ACAPI_GetOwnResModule ());

	return APIAddon_Normal;
}

GSErrCode RegisterInterface ()
{
	return ACAPI_MenuItem_RegisterMenu (AddOnMenuID, 0, MenuCode_Tools, MenuFlag_Default);
}

GSErrCode Initialize ()
{
	return ACAPI_MenuItem_InstallMenuHandler (AddOnMenuID, MenuCommandHandler);
}

GSErrCode FreeData ()
{
	return NoError;
}
