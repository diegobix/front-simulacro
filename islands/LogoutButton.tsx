import { FunctionComponent } from "preact";

const LogoutButton: FunctionComponent = () => {
  const logout = () => {
    const date = new Date(0);
    document.cookie = `auth=; expires=${date}`;
    window.location.href = "/";
  };

  return <a class="logout-button" onClick={() => logout()}>Logout</a>;
};

export default LogoutButton;
