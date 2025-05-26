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
	AddItem (new JS::Function ("getSlab", std::bind(&ScriptBuilder::GetSlab, this, std::placeholders::_1)));
	AddItem (new JS::Function ("generateLayout", std::bind(&ScriptBuilder::GenerateLayout, this, std::placeholders::_1)));
	AddItem (new JS::Function ("createZone", std::bind(&ScriptBuilder::CreateZone, this, std::placeholders::_1)));
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

namespace {

JS::Array* FromPolygon (const API_Polygon& polygon, API_Coord** coords)
{
	JS::Array* jsArray = new JS::Array ();
	for (Int32 i = 1; i <= polygon.nCoords; ++i) {
		JS::Object* jsCoord = new JS::Object ();
		API_Coord coord = (*coords)[i];
		jsCoord->AddItem (u"x"sv, new JS::Value(coord.x));
		jsCoord->AddItem (u"y"sv, new JS::Value(coord.y));
		jsArray->AddItem (jsCoord);
	}

	return jsArray;
}

}

GS::Ref<JS::Base> ScriptBuilder::GetSlab (GS::Ref<JS::Base> params)
{
	const GS::UniString guid = GS::DynamicCast<JS::Value> (params)->GetString ();

	API_Element element = {};
	element.header.guid = GSGuid2APIGuid (GS::Guid (guid));
	ACAPI_Element_Get (&element);

	if (element.header.type.typeID != API_SlabID) {
		return new JS::Base ();
	}

	JS::Object* jsElement = new JS::Object ();
	jsElement->AddItem (u"level"sv, new JS::Value(element.slab.level));
	jsElement->AddItem (u"thickness"sv, new JS::Value(element.slab.thickness));

	API_ElementMemo memo = {};
	ACAPI_Element_GetMemo (element.header.guid, &memo);

	jsElement->AddItem (u"polygon"sv, FromPolygon (element.slab.poly, memo.coords));

	return jsElement;
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

#pragma optimize( "", off )

GS::Ref<JS::Base> ScriptBuilder::CreateZone (GS::Ref<JS::Base> params)
{
	auto array = GS::DynamicCast<JS::Array> (params)->GetItemArray ();
	auto polygon = GS::DynamicCast<JS::Array> (array[0])->GetItemArray ();

	API_Element element = {};
	element.header.type = API_ElemType (API_ZoneID);
	API_ElementMemo memo = {};
	ACAPI_Element_GetDefaults (&element, &memo);

	GS::Array<API_Coord> coords;
	for (USize i = 0; i < polygon.GetSize (); ++i) {
		auto coord = GS::DynamicCast<JS::Object> (polygon[i]);
		API_Coord apiCoord;
		auto& itemTable = coord->GetItemTable ();
		// ACAPI_WriteReport (GS::UniString::Printf (u"Coord[%d]: %T"sv, i, coord->GetName ().ToPrintf ()), false);
		if (itemTable.ContainsKey (u"x"sv)) {
			if (GS::DynamicCast<JS::Value> (itemTable[u"x"sv])->GetType () == JS::Value::ValueType::DOUBLE) {
				apiCoord.x = GS::DynamicCast<JS::Value> (itemTable[u"x"sv])->GetDouble ();
			} else {
				apiCoord.x = GS::DynamicCast<JS::Value> (itemTable[u"x"sv])->GetInteger ();
			}
		}
		if (itemTable.ContainsKey (u"y"sv)) {
			if (GS::DynamicCast<JS::Value> (itemTable[u"y"sv])->GetType () == JS::Value::ValueType::DOUBLE) {
				apiCoord.y = GS::DynamicCast<JS::Value> (itemTable[u"y"sv])->GetDouble ();
			} else {
				apiCoord.y = GS::DynamicCast<JS::Value> (itemTable[u"y"sv])->GetInteger ();
			}
		}
		coords.Push (apiCoord);
		ACAPI_WriteReport (GS::UniString::Printf (u"Coord: %f, %f"sv, apiCoord.x, apiCoord.y), false);
	}

	constexpr double EPS = 0.00001;
	bool isClosedPoly = std::abs(coords[0].x - coords[polygon.GetSize () - 1].x) < EPS &&
						std::abs(coords[0].y - coords[coords.GetSize () - 1].y) < EPS;

	ACAPI_WriteReport (GS::UniString::Printf (u"Closed polygon: %d"sv, isClosedPoly), false);
	element.zone.manual = true;
	element.zone.poly.nCoords = polygon.GetSize () + (isClosedPoly ? 0 : 1);
	element.zone.poly.nSubPolys = 1;

	memo.coords	= reinterpret_cast<API_Coord**>		(BMAllocateHandle ((element.zone.poly.nCoords + 1) * sizeof (API_Coord), ALLOCATE_CLEAR, 0));
	memo.pends	= reinterpret_cast<Int32**>			(BMAllocateHandle ((element.zone.poly.nSubPolys + 1) * sizeof (Int32), ALLOCATE_CLEAR, 0));

	for (USize i = 0; i < coords.GetSize (); ++i) {
		(*memo.coords)[i+1].x = coords[i].x;
		(*memo.coords)[i+1].y = coords[i].y;
		ACAPI_WriteReport (GS::UniString::Printf (u"Coord[%d]: %f, %f"sv, i+1, (*memo.coords)[i+1].x, (*memo.coords)[i+1].y), false);
	}

	if (!isClosedPoly) {
		(*memo.coords)[element.zone.poly.nCoords] = (*memo.coords)[1];
		ACAPI_WriteReport (GS::UniString::Printf (u"Coord[%d]: %f, %f"sv, element.zone.poly.nCoords, (*memo.coords)[element.zone.poly.nCoords].x, (*memo.coords)[element.zone.poly.nCoords].y), false);
	}
	(*memo.pends)[1] = element.zone.poly.nCoords;

	const GS::UniString zoneName = GS::DynamicCast<JS::Value> (array[1])->GetString ();
	ACAPI_WriteReport (GS::UniString::Printf (u"Zone name: %T"sv, zoneName.ToPrintf ()), false);
	GS::snuprintf (element.zone.roomName, sizeof (element.zone.roomName), zoneName.ToCStr ().Get ());

	API_Element label = {};
	label.header.type = API_ElemType (API_LabelID);
	API_ElementMemo labelMemo = {};
	ACAPI_Element_GetDefaults (&label, &labelMemo);
	label.label.createAtDefaultPosition = true;

	ACAPI_CallUndoableCommand ("",
		[&] () {
			GSErrCode err = ACAPI_Element_Create (&element, &memo);
			if (err != NoError) {
				return err;
			}
			label.label.parent = element.header.guid;
			label.label.parentType = element.header.type;
			err = ACAPI_Element_Create (&label, &labelMemo);
			return err;
		}
	);

	return new JS::Base ();
}
#pragma optimize( "", on )

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