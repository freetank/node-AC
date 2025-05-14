#include "CatchNewElementInfo.hpp"
#include "APIdefs_Elements.h"
#include "APIdefs_Environment.h"
#include "APIdefs_Callback.h"
#include "ACAPinc.h"
#include <unordered_map>

namespace Controller {

CatchNewElementInfo::CatchNewElementInfo () :
	JS::Object ("catchNewElementInfo")
{
	AddItem (new JS::Function ("getElementTypes", std::bind(&CatchNewElementInfo::GetElementTypes, this, std::placeholders::_1)));
	AddItem (new JS::Function ("registerNewElementCallback", std::bind(&CatchNewElementInfo::RegisterNewElementCallback, this, std::placeholders::_1)));
}

CatchNewElementInfo::~CatchNewElementInfo () = default;

GS::Ref<JS::Base> CatchNewElementInfo::GetElementTypes (GS::Ref<JS::Base>) const
{
	GS::UniString elementTypes = u"\
		{\
			\"elementTypes\": [\
				%T\
			]\
		}"sv;

	// TODO PaM: Logic part
	std::unordered_map<API_ElemTypeID, GS::UniString> elementTypesMap = {
		{API_ZombieElemID, "Zombie"},
		{API_WallID, "Wall"},
		{API_ColumnID, "Column"},
		{API_BeamID, "Beam"},
		{API_SlabID, "Slab"}
	};

	GS::UniString element = u"\
		{\
			\"element\": {\
				\"name\": \"%T\",\
				\"ID\": %d\
			}\
		}"sv;

	GS::UniString elements;

	auto lastElement = std::prev(elementTypesMap.end());
	for (auto it = elementTypesMap.begin(); it != elementTypesMap.end(); ++it) {
		elements += GS::UniString::Printf (element, it->second.ToPrintf (), it->first);
		if (it != lastElement) {
			elements += u",";
		}
	}

	return new JS::Value (GS::UniString::Printf (elementTypes, elements.ToPrintf ()));
}

GSErrCode ElementEventHandler (const API_NotifyElementType */* elemType */)
{
	return NoError;
}

GS::Ref<JS::Base> CatchNewElementInfo::RegisterNewElementCallback (GS::Ref<JS::Base> params)
{
	const Int32 elementID = GS::DynamicCast<JS::Value> (params)->GetInteger ();
	API_ToolBoxItem toolboxItem = {};
	toolboxItem.type = API_ElemType (static_cast<API_ElemTypeID> (elementID));

	GSErrCode error = ACAPI_Element_CatchNewElement (&toolboxItem, ElementEventHandler);

	if (error != NoError) {
		return new JS::Value (error);
	}

	return new JS::Value ();
}

}