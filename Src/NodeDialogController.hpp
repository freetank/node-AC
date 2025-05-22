#ifndef __CONTROLLER_HPP__
#define __CONTROLLER_HPP__

#include "NodeDialog.hpp"
#include "BrowserConnection.hpp"
#include "IScriptBuilderEventHandler.hpp"
#include "Interpreter.hpp"

namespace Controller {

class NodeDialog : public IScriptBuilderEventHandler {
public:
	NodeDialog ();
	virtual ~NodeDialog ();

	bool InvokeDialog ();

	virtual void ScriptBuildingDone (const GS::UniString& script) override;

private:
	GS::UniString GetIndexHtmlURI () const;

private:
	UI::NodeDialog dialog;
	BrowserConnection browserConnection;
	Model::Interpreter interpreter;
};

}

#endif