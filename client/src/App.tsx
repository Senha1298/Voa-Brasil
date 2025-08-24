import { Switch, Route } from "wouter";
import Login from "./pages/Login";
import Verificacao from "./pages/Verificacao";
import Success from "./pages/Success";
import SaibaMais from "./pages/SaibaMais";
import VerifyAvailability from "./pages/VerifyAvailability";
import Pagamento from "./pages/Pagamento";
import PixPayment from "./pages/PixPayment";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/verificacao" component={Verificacao} />
      <Route path="/saiba-mais" component={SaibaMais} />
      <Route path="/success" component={Success} />
      <Route path="/verify-availability" component={VerifyAvailability} />
      <Route path="/pagamento" component={Pagamento} />
      <Route path="/pix-payment" component={PixPayment} />
    </Switch>
  );
}

export default App;