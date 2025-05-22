#include "Interpreter.hpp"
#include "UniString.hpp"
#include "stream.h"
#include "ACAPinc.h"
#include <memory>
#include <unordered_map>

namespace std {
    template<>
    struct hash<GS::UniString> {
        std::size_t operator()(const GS::UniString& s) const noexcept {
            auto strView = s.ToCStr().ToStringView();
            return std::hash<std::string_view>{}(strView);
        }
    };
}

namespace Model {

namespace {

class Statement {
public:
	virtual ~Statement ();

	virtual void Run (const rapidjson::Value& value) = 0;
};

Statement::~Statement () = default;

class CatchNewElement : public Statement {
public:
	virtual void Run (const rapidjson::Value& value) override;

private:
	static GSErrCode ElementEventHandler (const API_NotifyElementType* elemType);
	static std::unordered_map<GS::UniString, rapidjson::Document>& GetCallback ();

	void AddCallback (const GS::UniString& guid, const rapidjson::Value& callback);
};

void CatchNewElement::Run (const rapidjson::Value& value)
{
	auto elementID = value.FindMember ("elementID");

	API_ToolBoxItem toolboxItem = {};
	toolboxItem.type = API_ElemType (static_cast<API_ElemTypeID> (elementID->value.GetInt ()));

	ACAPI_Element_CatchNewElement (&toolboxItem, ElementEventHandler);

	auto guid = value.FindMember ("guid")->value.GetString ();
	auto callback = value.FindMember ("callback");
	AddCallback (guid, callback->value);
}

std::unordered_map<GS::UniString, rapidjson::Document>& CatchNewElement::GetCallback ()
{
	static std::unordered_map<GS::UniString, rapidjson::Document> callbackMap;
	return callbackMap;
}

void CatchNewElement::AddCallback (const GS::UniString& guid, const rapidjson::Value& callback)
{
	auto& callbackMap = GetCallback ();
    rapidjson::Document doc;
    doc.CopyFrom(callback, doc.GetAllocator());
    callbackMap[guid] = std::move(doc);
}

GSErrCode CatchNewElement::ElementEventHandler (const API_NotifyElementType* /* elemType */)
{
	return NoError;
}

class ElementGet : public Statement {
public:
	virtual void Run (const rapidjson::Value& value) override;
};

void ElementGet::Run (const rapidjson::Value& value)
{
	ACAPI_WriteReport (GS::UniString::Printf (u"Key: ElementGet, Value: %s\n"sv, value.GetString()), false);
}

class GenerateLayout : public Statement {
public:
	virtual void Run (const rapidjson::Value& value) override;
};

void GenerateLayout::Run (const rapidjson::Value& value)
{
	ACAPI_WriteReport (GS::UniString::Printf (u"Key: GenerateLayout, Value: %s\n"sv, value.GetString()), false);
}

std::unique_ptr<Statement> GetStatement (const GS::UniString& key)
{
	if (key == "ACAPI_Element_CatchNewElement") {
		return std::make_unique<CatchNewElement> ();
	} else if (key == "ACAPI_Element_Get") {
		return std::make_unique<ElementGet> ();
	} else if (key == "GenerateLayout") {
		return std::make_unique<GenerateLayout> ();
	}
	return nullptr;
}

}

Interpreter::~Interpreter () = default;

void Interpreter::RunScript (const GS::UniString& script)
{
	rapidjson::Document json = ParseScript (script);
	rapidjson::ParseErrorCode error = json.GetParseError ();
	ACAPI_WriteReport (GS::UniString::Printf (u"Parse error: %d\n"sv, error), false);

	for (auto it = json.MemberBegin(); it != json.MemberEnd(); ++it) {
		GetStatement (it->name.GetString ())->Run (it->value);
	}
}

rapidjson::Document Interpreter::ParseScript (const GS::UniString& script)
{
	std::string scriptString (script.ToCStr ().ToStringView ());
	rapidjson::StringStream json (scriptString.c_str ());

	rapidjson::Document document;
	document.ParseStream (json);

	return document;
}

}