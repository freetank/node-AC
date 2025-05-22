#ifndef __SCRIPT_BUILDER_HPP__
#define __SCRIPT_BUILDER_HPP__

#include "UniString.hpp"
#include "JSValues.hpp"
#include "EventSource.hpp"

namespace Controller {
	class IScriptBuilderEventHandler;
}

namespace Controller {
// TODO PaM: rename
class ScriptBuilder :	public JS::Object,
						public GS::EventSource
{
public:
	ScriptBuilder();
	virtual ~ScriptBuilder();

	void Attach (IScriptBuilderEventHandler& observer);
	void Detach (IScriptBuilderEventHandler& observer);

private:
	GS::Ref<JS::Base> GetSelection (GS::Ref<JS::Base> params);
	GS::Ref<JS::Base> ScriptCreationDone (GS::Ref<JS::Base> params);
	GS::Ref<JS::Base> GetElement (GS::Ref<JS::Base> params);
	GS::Ref<JS::Base> GetElements (GS::Ref<JS::Base> params);
	GS::Ref<JS::Base> GenerateLayout (GS::Ref<JS::Base> params);

	void ResetScript ();

private:
	GS::UniString script;
	bool isCallbackCreationInProgress;
};

}

#endif