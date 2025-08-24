import { useEffect, useState } from "react";

export default function Header() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.nome) {
        setUserName(userData.nome.split(' ')[0]);
      }
    }

    if ((window as any).tailwind?.config) {
      (window as any).tailwind.config = {
        theme: {
          extend: {
            colors: {
              'custom-blue': '#1451B4',
              'custom-bg': '#F8F8F8',
            }
          }
        }
      };
    }
  }, []);

  return (
    <>
      <header style={{ 
        backgroundColor: 'white', 
        padding: '12px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        border: 'none',
        boxShadow: 'none'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          background: 'none',
          boxShadow: 'none'
        }}>
          <img 
            src="https://i.ibb.co/zPFChvR/logo645.png" 
            alt="Logo gov.br estilizada com texto em azul e amarelo" 
            style={{ 
              marginRight: '32px',
              background: 'none',
              boxShadow: 'none'
            }}
            width="70" 
            height="24"
          />
          <button style={{ 
            border: 'none', 
            color: '#1451B4', 
            fontSize: '14px', 
            marginLeft: '32px', 
            cursor: 'pointer',
            background: 'none',
            boxShadow: 'none',
            padding: 0
          }} aria-label="Menu de links">
            <i className="fas fa-ellipsis-v" style={{background: 'none', boxShadow: 'none', fontSize: '16px'}} aria-hidden="true"></i>
          </button>
          <div style={{ 
            borderLeft: '1px solid #ccc', 
            height: '24px', 
            margin: '0 16px',
            background: 'none',
            boxShadow: 'none'
          }}></div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          background: 'none',
          boxShadow: 'none'
        }}>
          <button style={{ 
            border: 'none', 
            color: '#1451B4', 
            cursor: 'pointer', 
            marginLeft: '24px',
            background: 'none',
            boxShadow: 'none',
            padding: 0
          }}>
            <i className="fas fa-cookie-bite" style={{background: 'none', boxShadow: 'none', fontSize: '16px'}} aria-hidden="true"></i>
          </button>
          <button style={{ 
            border: 'none', 
            color: '#1451B4', 
            cursor: 'pointer', 
            marginLeft: '24px',
            background: 'none',
            boxShadow: 'none',
            padding: 0
          }} type="button" aria-label="Sistemas">
            <i className="fas fa-th" style={{background: 'none', boxShadow: 'none', fontSize: '16px'}} aria-hidden="true"></i>
          </button>
          <button 
            style={{ 
              backgroundColor: '#1451B4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '9999px', 
              padding: '6px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '14px', 
              cursor: 'pointer',
              marginLeft: '24px',
              boxShadow: 'none'
            }} 
            type="button"
          >
            <i className="fas fa-user" style={{color: 'white', marginRight: '8px', background: 'none', boxShadow: 'none', fontSize: '16px'}} aria-hidden="true"></i>
            <span>{userName || "Entrar"}</span>
          </button>
        </div>
      </header>

      <nav style={{ 
        backgroundColor: 'white', 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        border: 'none',
        boxShadow: 'none',
        borderBottom: '1px solid #E5E5E5'
      }}>
        <button style={{ 
          border: 'none', 
          color: '#1451B4', 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          background: 'none',
          boxShadow: 'none',
          padding: 0
        }}>
          <i className="fas fa-bars" style={{
            marginRight: '10px', 
            fontSize: '16px',
            background: 'none',
            boxShadow: 'none'
          }} aria-hidden="true"></i>
          <span style={{ 
            color: '#666', 
            fontSize: '1rem', 
            fontWeight: 300, 
            lineHeight: '20px', 
            paddingTop: '2px',
            background: 'none',
            boxShadow: 'none'
          }}>
            Programa Voa Brasil
          </span>
        </button>
        <button style={{ 
          border: 'none', 
          color: '#1451B4', 
          fontSize: '16px', 
          cursor: 'pointer',
          background: 'none',
          boxShadow: 'none',
          padding: 0
        }} aria-label="Pesquisar">
          <i className="fas fa-search" style={{background: 'none', boxShadow: 'none'}} aria-hidden="true"></i>
        </button>
      </nav>
    </>
  );
}