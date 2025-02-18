#ifndef __NODE_DIALOG_HPP__
#define __NODE_DIALOG_HPP__

#include "ResourceIds.hpp"
#include "DGDialog.hpp"
#include "DGBrowser.hpp"

namespace UI {

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

	NodeDialog ();
	virtual ~NodeDialog ();

	JavascriptEngine& GetJavascriptEngine ();

private:
	virtual void PanelResized (const DG::PanelResizeEvent& ev) override;

	DG::Browser browser;
};

}

#endif