import AdminSignIn from "@/components/AdminSignIn";
import { UserContext, UserIdentifier } from "@/context/UserContext";
import { useContext } from "react";
import { API_ORIGIN } from "@/App";

function AdminDashboard() {
  const currentUser = useContext(UserContext);

  async function login(username: string, password: string) {
    try {
        const response = await fetch(API_ORIGIN + '/admin/signin', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const {id, credentials} = await response.json();
        currentUser?.setUser(new UserIdentifier(id, credentials));
    } catch (error) {
        console.error('Error logging in:', error);
    }
  }

  if (!currentUser.user) {
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