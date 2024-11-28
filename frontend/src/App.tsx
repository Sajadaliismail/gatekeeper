import { useSelector } from "react-redux";
import AuthForm from "./components/authPageComponents/login";
import { RootState } from "./features/store/store";
import DashBoard from "./components/dashBoardPage/dashBoard";

function App() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  return (
    <div className="bg-gray-400 h-[100vh] overflow-hidden">
      {isLoggedIn ? <DashBoard /> : <AuthForm />}
    </div>
  );
}

export default App;
