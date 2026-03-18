import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {
  AdminEditProvider,
  AdminProvider,
  AuthProvide,
  DBProvider,
  PaymentProvider,
  RefProvide,
  SignupProvider,
} from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SignupProvider>
      <PaymentProvider>
        <AdminProvider>
          <AdminEditProvider>
            <DBProvider>
              <AuthProvide>
                <RefProvide>
                  <App />
                </RefProvide>
              </AuthProvide>
            </DBProvider>
          </AdminEditProvider>
        </AdminProvider>
      </PaymentProvider>
    </SignupProvider>
  </BrowserRouter>
);
