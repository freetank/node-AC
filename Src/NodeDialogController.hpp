#ifndef __CONTROLLER_HPP__
#define __CONTROLLER_HPP__

#include "NodeDialog.hpp"
#include "BrowserConnection.hpp"

namespace Controller {

class NodeDialog {
public:
	NodeDialog ();
	virtual ~NodeDialog ();

	bool InvokeDialog ();

private:
	UI::NodeDialog dialog;
	BrowserConnection browserConnection;
};

}

#endif