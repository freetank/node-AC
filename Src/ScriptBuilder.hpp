#ifndef __INTERPRETER_HPP__
#define __INTERPRETER_HPP__

#include "UniString.hpp"
#include "JSValues.hpp"
#include "EventSource.hpp"

namespace Controller {
	class IScriptBuilderEventHandler;
}

namespace Controller {

class ScriptBuilder :	public JS::Object,
						public GS::EventSource
{
public:
	ScriptBuilder();
	virtual ~ScriptBuilder();

	void Attach (IScriptBuilderEventHandler& observer);
	void Detach (IScriptBuilderEventHandler& observer);

private:
	GS::Ref<JS::Base> ScriptCreationDone (GS::Ref<JS::Base>);

private:
	GS::UniString script;
};

}

#endif