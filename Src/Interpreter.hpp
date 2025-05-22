#ifndef __INTERPRETER_HPP__
#define __INTERPRETER_HPP__

#include "document.h"

namespace GS {
	class UniString;
}

namespace Model {

class Interpreter {
public:
	virtual ~Interpreter ();

	void RunScript (const GS::UniString& script);

private:
	rapidjson::Document ParseScript (const GS::UniString& script);
};

}

#endif