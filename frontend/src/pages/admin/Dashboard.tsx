import AdminSignIn from "@/components/AdminSignIn";
import { UserContext, FrontendUser } from "@/context/ActiveUserContext";
import { useContext } from "react";
import { apiCall } from "@/App";

function AdminDashboard() {
  const activeUserContext = useContext(UserContext);

  async function login(username: string, password: string) {
    apiCall({
      endpoint: 'admin/signin',
      method: 'POST',
      params: {
            username,
            password,
          },
    }, (credentials) => {
        activeUserContext?.setUser(new FrontendUser(credentials));
    }, true, {
      successFeedbackMessage: "Authenticated as admin.",
      failureFeedbackMessage: "Failed to sign in as admin.",
    });
  }

  if (!activeUserContext.user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6">
        <AdminSignIn onLogin={login}></AdminSignIn>
      </div>
    );
  }
  else {
    return
  }
}

export default AdminDashboard;