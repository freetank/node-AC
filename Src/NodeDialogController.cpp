#include "NodeDialogController.hpp"
#include "Location.hpp"
#include "ACAPinc.h"

namespace Controller {

NodeDialog::NodeDialog () :
	dialog (),
	browserConnection (dialog.GetJavascriptEngine ())
{
	dialog.GetJavascriptEngine ().LoadURL (GetIndexHtmlURI ().ToCStr ().Get ());
	browserConnection.Attach (*this);
}

NodeDialog::~NodeDialog () = default;

bool NodeDialog::InvokeDialog () {
	return dialog.Invoke ();
}

void NodeDialog::ScriptBuildingDone (const GS::UniString& script)
{
	ACAPI_WriteReport (script, false);
	// interpreter.RunScript (script);
}

GS::UniString NodeDialog::GetIndexHtmlURI () const
{
	IO::Location indexLoc;
	ACAPI_GetOwnLocation (&indexLoc);
	indexLoc.DeleteLastLocalName (); // remove add-on apx/bundle
	indexLoc.DeleteLastLocalName (); // remove parent folder
	indexLoc.AppendToLocal (IO::Name (u"dist"sv));
	indexLoc.AppendToLocal (IO::Name (u"index.html"sv));

	const GS::UniString indexURL = GS::UniString::Printf (u"file:///%T"sv, indexLoc.ToDisplayText ().ToPrintf ());
	return indexURL;
}

}