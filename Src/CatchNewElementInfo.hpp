#ifndef __CATCH_NEW_ELEMENT_INFO_HPP__
#define __CATCH_NEW_ELEMENT_INFO_HPP__

#include "UniString.hpp"
#include "JSValues.hpp"

namespace Controller {

class CatchNewElementInfo : public JS::Object {
public:
	CatchNewElementInfo();
	virtual ~CatchNewElementInfo();

	GS::Ref<JS::Base> GetElementTypes(GS::Ref<JS::Base>) const;
	GS::Ref<JS::Base> RegisterNewElementCallback (GS::Ref<JS::Base> params); // TODO PaM delet this
};

}

#endif