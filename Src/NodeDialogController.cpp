#include "NodeDialogController.hpp"

namespace Controller {

NodeDialog::NodeDialog () :
	dialog (),
	browserConnection (dialog.GetJavascriptEngine ())
{
	dialog.GetJavascriptEngine ().LoadURL (u"file:///C:/Users/mpalenik/Repos/node-AC/build/dist/index.html"sv);
	browserConnection.Attach (*this);
}

NodeDialog::~NodeDialog () = default;

bool NodeDialog::InvokeDialog () {
	return dialog.Invoke ();
}

void NodeDialog::ScriptBuildingDone (const GS::UniString& /* script */)
{
}

}