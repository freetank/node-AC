#include "NodeDialogController.hpp"

namespace Controller {

NodeDialog::NodeDialog () :
	dialog (),
	browserConnection (dialog.GetJavascriptEngine ())
{
	dialog.GetJavascriptEngine ().LoadURL (u"file:///C:/Users/mpalenik/Repos/node-AC/build/dist/index.html"sv);
}

NodeDialog::~NodeDialog () = default;

bool NodeDialog::InvokeDialog () {
	return dialog.Invoke ();
}

}