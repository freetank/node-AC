#include "ScriptBuilder.hpp"
#include "IScriptBuilderEventHandler.hpp"

namespace Controller {

ScriptBuilder::ScriptBuilder () :
	JS::Object ("scriptBuilder"),
	isCallbackCreationInProgress (false)
{
	ResetScript ();
	AddItem (new JS::Function ("catchNewElement", std::bind(&ScriptBuilder::CatchNewElement, this, std::placeholders::_1)));
	AddItem (new JS::Function ("getElement", std::bind(&ScriptBuilder::GetElement, this, std::placeholders::_1)));
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

void ScriptBuilder::ResetScript ()
{
	script = u"{\n"sv;
}

GS::Ref<JS::Base> ScriptBuilder::CatchNewElement (GS::Ref<JS::Base> params)
{
	const GS::Array<GS::Ref<JS::Base>> array = GS::DynamicCast<JS::Array> (params)->GetItemArray ();
	const Int32 elementID = GS::DynamicCast<JS::Value> (array[0])->GetInteger ();
	const GS::UniString guid = GS::DynamicCast<JS::Value> (array[1])->GetString ();

	isCallbackCreationInProgress = true;

	script += GS::UniString::Printf (
		u"\"ACAPI_Element_CatchNewElement\': {\n\
			\"elementID\": %d,\n\
			\"guid\": \"%T\",\n\
			\"callback\": {\n"sv,
		elementID,
		guid.ToPrintf ()
	);

	return new JS::Base ();
}

GS::Ref<JS::Base> ScriptBuilder::GetElement (GS::Ref<JS::Base> params)
{
	const GS::UniString guid = GS::DynamicCast<JS::Value> (params)->GetString ();

	script += GS::UniString::Printf (
		u"\"ACAPI_Element_Get\': {\n\
			\"guid\": \"%T\",\n\
		}"sv,
		guid.ToPrintf ()
	);

	return new JS::Base ();
}

GS::Ref<JS::Base> ScriptBuilder::ScriptCreationDone (GS::Ref<JS::Base>)
{
	script.DeleteLast (u","sv);
	script += u"}"sv;
	if (isCallbackCreationInProgress) {
		script += u"}"sv;
		isCallbackCreationInProgress = false;
	}
	NotifyObservers (&IScriptBuilderEventHandler::ScriptBuildingDone, script);

	ResetScript ();
	return new JS::Base ();
}

}