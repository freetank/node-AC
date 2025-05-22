#include "ScriptBuilder.hpp"
#include "IScriptBuilderEventHandler.hpp"
#include "ACAPinc.h"
#include "GSGuid.hpp"

namespace Controller {

ScriptBuilder::ScriptBuilder () :
	JS::Object ("scriptBuilder"),
	isCallbackCreationInProgress (false)
{
	ResetScript ();
	AddItem (new JS::Function ("getSelection", std::bind(&ScriptBuilder::GetSelection, this, std::placeholders::_1)));
	AddItem (new JS::Function ("getElements", std::bind(&ScriptBuilder::GetElements, this, std::placeholders::_1)));
	AddItem (new JS::Function ("getElement", std::bind(&ScriptBuilder::GetElement, this, std::placeholders::_1)));
	AddItem (new JS::Function ("generateLayout", std::bind(&ScriptBuilder::GenerateLayout, this, std::placeholders::_1)));
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

GS::Ref<JS::Base> ScriptBuilder::GetSelection (GS::Ref<JS::Base> /* params */)
{
	API_SelectionInfo	selectionInfo;
	GS::Array<API_Neig>	selNeigs;

	ACAPI_Selection_Get (&selectionInfo, &selNeigs, false);
	if (selNeigs.IsEmpty ()) {
		return new JS::Value (u"00000000-0000-0000-0000-000000000000"sv);
	};

	GS::Guid guid = APIGuid2GSGuid (selNeigs[0].guid);
	return new JS::Value (guid.ToUniString ());
}

GS::Ref<JS::Base> ScriptBuilder::GetElement (GS::Ref<JS::Base> params)
{
	const GS::UniString guid = GS::DynamicCast<JS::Value> (params)->GetString ();

	GS::Array<API_Guid> guids;
	script += GS::UniString::Printf (
		u"\"ACAPI_Element_Get\": {\n\
			\"guid\": \"%T\"\n\
		}\n,"sv,
		guid.ToPrintf ()
	);

	return new JS::Base ();
}

GS::Ref<JS::Base> ScriptBuilder::GetElements (GS::Ref<JS::Base> params)
{	
	const GS::UniString elementID = GS::DynamicCast<JS::Value> (params)->GetString ();

	script += GS::UniString::Printf (
		u"\"ACAPI_Element_GetElemList\": {\n\
			\"elementID\": \"%T\"\n\
		}\n,"sv,
		elementID.ToPrintf ()
	);

	std::map<GS::UniString, API_ElemTypeID> elementTypesMap = {
		{"Zombie", API_ZombieElemID},
		{"Wall", API_WallID},
		{"Column", API_ColumnID},
		{"Beam", API_BeamID},
		{"Slab", API_SlabID}
	};

	GS::Array<API_Guid> guids;
	ACAPI_Element_GetElemList (elementTypesMap[elementID], &guids);
	GS::Ref<JS::Array> jsGuids = new JS::Array ();
	for (const auto& guid : guids) {
		jsGuids->AddItem (new JS::Value (APIGuidToString (guid)));
	}

	return jsGuids;
}

GS::Ref<JS::Base> ScriptBuilder::GenerateLayout (GS::Ref<JS::Base> params)
{
	const GS::UniString description = GS::DynamicCast<JS::Value> (params)->GetString ();
	script += GS::UniString::Printf (
		u"\"GenerateLayout\": {\n\
			\"description\": \"%T\"\n\
		}\n,"sv,
		description.ToPrintf ()
	);

	return new JS::Base ();
}

GS::Ref<JS::Base> ScriptBuilder::ScriptCreationDone (GS::Ref<JS::Base>)
{
	script.DeleteLast (u","sv);
	script += u"}"sv;
	if (isCallbackCreationInProgress) {
		script += u"}\n}"sv;
		isCallbackCreationInProgress = false;
	}
	NotifyObservers (&IScriptBuilderEventHandler::ScriptBuildingDone, script);

	ResetScript ();
	return new JS::Base ();
}

}