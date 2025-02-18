#include "CatchNewElementInfo.hpp"
#include "APIdefs_Elements.h"
#include <unordered_map>

namespace Controller {

CatchNewElementInfo::CatchNewElementInfo () :
	JS::Object ("catchNewElementInfo")
{
	AddItem (new JS::Function ("getElementTypes", std::bind(&CatchNewElementInfo::GetElementTypes, this, std::placeholders::_1)));
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
		{API_BeamID, "Beam"}
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

}