#ifndef __BROWSER_CONNECTION_HPP__
#define __BROWSER_CONNECTION_HPP__

#include "JSValues.hpp"
#include <queue>
#include "CatchNewElementInfo.hpp"
#include "ScriptBuilder.hpp"

class JavascriptEngine;
namespace Controller {
	class IScriptBuilderEventHandler;
}

namespace Controller {

class BrowserConnection : public JS::Object {
public:
	BrowserConnection(JavascriptEngine& engine);
	virtual ~BrowserConnection();

	void ExecuteJS (const GS::UniString& jsCode);

	void Attach (IScriptBuilderEventHandler& observer);
	void Detach (IScriptBuilderEventHandler& observer);

private :
	void FlushQueue ();
	GS::Ref<JS::Base> EditorCreated(GS::Ref<JS::Base>);

private:
	JavascriptEngine& engine;
	std::queue<GS::UniString> queue;
	bool isEditorCreated;

	CatchNewElementInfo catchNewElementInfo;
	ScriptBuilder scriptBuilder;
};

}

#endif