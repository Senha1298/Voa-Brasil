import LoginForm from "../components/LoginForm";
import "../styles/govbr.css";

export default function Login() {
  return (
    <>
      <header>
        <img 
          src="https://i.ibb.co/WGrsWGN/IMG-1297.jpg" 
          alt="Imagem de cabeçalho com design moderno e cores vibrantes" 
          style={{width: '100%'}}
        />
      </header>
      
      <div className="container">
        <aside id="aside-signin">
          <img 
            id="identidade-govbr" 
            src="https://cdn.jsdelivr.net/gh/govbr-assets/images/conta_govbr_v2.jpg"
            alt="Logomarca GovBR"
          />
        </aside>
        
        <main id="main-signin">
          <LoginForm />
        </main>
      </div>
    </>
  );
}
