#include "ScriptBuilder.hpp"
#include "IScriptBuilderEventHandler.hpp"

namespace Controller {

ScriptBuilder::ScriptBuilder () :
	JS::Object ("scriptBuilder")
{
	AddItem (new JS::Function ("scriptCreationDone", std::bind(&ScriptBuilder::ScriptCreationDone, this, std::placeholders::_1)));
}

ScriptBuilder::~ScriptBuilder () = default;

void ScriptBuilder::Attach (IScriptBuilderEventHandler& observer)
{
	EventSource::Attach (observer);
}

void ScriptBuilder::Detach (IScriptBuilderEventHandler& observer)
{
	EventSource::Detach (observer);
}

GS::Ref<JS::Base> ScriptBuilder::ScriptCreationDone (GS::Ref<JS::Base>)
{
	NotifyObservers (&IScriptBuilderEventHandler::ScriptBuildingDone, script);
	return new JS::Base ();
}

}