#include "NodeDialog.hpp"
#include "ACAPinc.h"

namespace UI {

NodeDialog::NodeDialog () :
	DG::ModalDialog (ACAPI_GetOwnResModule (), ExampleDialogResourceId, ACAPI_GetOwnResModule ()),
	browser (GetReference (), BrowserId)
{
	AttachToAllItems (*this);
	Attach (*this);
}

NodeDialog::~NodeDialog ()
{
	Detach (*this);
	DetachFromAllItems (*this);
}

void NodeDialog::PanelResized (const DG::PanelResizeEvent& ev)
{
	BeginMoveResizeItems ();
	browser.Resize (ev.GetHorizontalChange (), ev.GetVerticalChange ());
	EndMoveResizeItems ();
}

JavascriptEngine& NodeDialog::GetJavascriptEngine ()
{
	return browser;
}


}