#include "BrowserConnection.hpp"
#include "JavascriptEngine.hpp"

namespace Controller {

BrowserConnection::BrowserConnection(JavascriptEngine& engine) :
	JS::Object ("acConnection"),
	engine(engine),
	isEditorCreated (false)
{
	AddItem (new JS::Function ("editorCreated", std::bind(&BrowserConnection::EditorCreated, this, std::placeholders::_1)));

	engine.RegisterAsynchJSObject (this);
	engine.RegisterAsynchJSObject (&catchNewElementInfo);
	engine.RegisterAsynchJSObject (&scriptBuilder);
}

BrowserConnection::~BrowserConnection() = default;

void BrowserConnection::ExecuteJS (const GS::UniString& jsCode)
{
	if (isEditorCreated) {
		engine.ExecuteJS (jsCode);
	} else {
		queue.push (jsCode);
	}
}

void BrowserConnection::Attach (IScriptBuilderEventHandler& observer)
{
	scriptBuilder.Attach (observer);
}

void BrowserConnection::Detach (IScriptBuilderEventHandler& observer)
{
	scriptBuilder.Detach (observer);
}

void BrowserConnection::FlushQueue ()
{
	while (!queue.empty ()) {
		engine.ExecuteJS (queue.front ());
		queue.pop ();
	}
}

GS::Ref<JS::Base> BrowserConnection::EditorCreated(GS::Ref<JS::Base>)
{
	isEditorCreated = true;
	FlushQueue ();
	return new JS::Base ();
}
	
}
