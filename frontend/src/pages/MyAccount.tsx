import { useContext, useEffect } from "react";
import { apiCall } from "@/App";
import {
  useDevFeedbackDetailsDialog,
  useSignInDialog,
  useSignOutDialog,
} from "../context/GlobalModalDialogsStatesContext";

import { UserContext, FrontendUser } from "@/context/ActiveUserContext";

function MyAccount() {
  const activeUserContext = useContext(UserContext);

  const signInDialog = useSignInDialog();

  useEffect(() => {
    if (!activeUserContext.user || activeUserContext.user.isAdmin) {
      console.log(
        "User is not authenticated or is an admin. Opening default sign-in dialog."
      );
      signInDialog.openDialog();
    }
  }, [activeUserContext]);

  if (!activeUserContext.user || activeUserContext.user.isAdmin) {
    return <div></div>;
  } else {
    return <div></div>;
  }
}

export default MyAccount;
