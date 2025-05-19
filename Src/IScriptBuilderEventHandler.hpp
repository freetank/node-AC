#ifndef __SCRIPT_BUILDER_EVENT_HANDLER_HPP__
#define __SCRIPT_BUILDER_EVENT_HANDLER_HPP__

#include "EventObserver.hpp"

namespace Controller {

class IScriptBuilderEventHandler : public GS::EventObserver {
public:
	virtual ~IScriptBuilderEventHandler () override;

	virtual void ScriptBuildingDone (const GS::UniString& script) = 0;
};

}

#endif