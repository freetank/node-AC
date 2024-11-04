#include "APIEnvir.h"
#include "ACAPinc.h"

#include "ResourceIds.hpp"
#include "DGModule.hpp"
#include "DGBrowser.hpp"

static const GSResID AddOnInfoID = ID_ADDON_INFO;
static const Int32 AddOnNameID = 1;
static const Int32 AddOnDescriptionID = 2;

static const short AddOnMenuID = ID_ADDON_MENU;
static const Int32 AddOnCommandID = 1;

class NodeDialog :	public DG::ModalDialog,
					public DG::PanelObserver,
					public DG::CompoundItemObserver
{
public:
	enum DialogResourceIds
	{
		ExampleDialogResourceId = ID_ADDON_DLG,
		BrowserId = 1
	};

	NodeDialog () :
		DG::ModalDialog (ACAPI_GetOwnResModule (), ExampleDialogResourceId, ACAPI_GetOwnResModule ()),
		browser (GetReference (), BrowserId)
	{
		AttachToAllItems (*this);
		Attach (*this);
		browser.LoadURL (u"file:///C:/Users/mpalenik/Repos/node-AC/build/dist/index.html"sv);
	}

	~NodeDialog ()
	{
		Detach (*this);
		DetachFromAllItems (*this);
	}

private:
	virtual void PanelResized (const DG::PanelResizeEvent& ev) override
	{
		BeginMoveResizeItems ();
		browser.Resize (ev.GetHorizontalChange (), ev.GetVerticalChange ());
		EndMoveResizeItems ();
	}

	DG::Browser browser;
};

static GSErrCode MenuCommandHandler (const API_MenuParams *menuParams)
{
	switch (menuParams->menuItemRef.menuResID) {
		case AddOnMenuID:
			switch (menuParams->menuItemRef.itemIndex) {
				case AddOnCommandID:
					{
						NodeDialog dialog;
						dialog.Invoke ();
					}
					break;
			}
			break;
	}
	return NoError;
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
