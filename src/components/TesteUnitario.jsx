import styled from "styled-components";
import { useState, useRef, useEffect } from "react";

const colors = {
  darkBlue: "#1F2937",
  lightGray: "#A3B1BA",
  buttonHover: "#374151",
};

const matrixChars = "高貴な精神は最も小さな人をも高める";

export default function TesteUnitario() {
  const [showConsole, setShowConsole] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [logs, setLogs] = useState([]);
  const [executadoEm, setExecutadoEm] = useState("");
  const [loading, setLoading] = useState(false); // ✅ controla o estado de carregamento
  const canvasRef = useRef();
  const animationRef = useRef();

  // Iniciar o console
  const openConsole = async (ctrl) => {
    setShowConsole(true);
    setMatrixMode(ctrl);
    setLogs([]); // ✅ limpa logs antigos antes de carregar
    setExecutadoEm("");
    setLoading(true); // ✅ mostra "Carregando..."

    if (!ctrl) {
      try {
        const res = await fetch("verificacoes_login.json?_=" + Date.now()); // força não usar cache
        if (!res.ok) throw new Error("Arquivo JSON não encontrado");
        const data = await res.json();
        setLogs(data.steps || []);
        setExecutadoEm(data.executado_em || "");
      } catch (err) {
        console.error("Erro ao ler JSON:", err);
        setLogs([
          {
            step: "erro",
            message:
              "⚠️ Não foi possível ler verificacoes_login.json. Verifique se o Selenium gerou o arquivo.",
            ok: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Formata data/hora para exibição local
  const formatTime = (utcString) => {
    if (!utcString) return "";
    const date = new Date(utcString);
    return date.toLocaleString("pt-BR", { hour12: false });
  };

  // Função Matrix
  const startMatrix = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopMatrix = () => cancelAnimationFrame(animationRef.current);

  useEffect(() => {
    if (showConsole && matrixMode) startMatrix();
    return () => stopMatrix();
  }, [showConsole, matrixMode]);

  return (
    <Container>
      <ButtonGroup>
        <Button onClick={(e) => openConsole(e.ctrlKey)}>Login</Button>
        <Button onClick={(e) => openConsole(e.ctrlKey)}>Funcionalidade 1</Button>
        <Button onClick={(e) => openConsole(e.ctrlKey)}>Funcionalidade 2</Button>
      </ButtonGroup>

      {showConsole && (
        <ConsoleContainer>
          <ConsoleHeader>
            <HeaderTitle>
              Console {executadoEm && <span>• Execução: {formatTime(executadoEm)}</span>}
            </HeaderTitle>
            <CloseButton
              onClick={() => {
                setShowConsole(false);
                stopMatrix();
              }}
            >
              X
            </CloseButton>
          </ConsoleHeader>

          <ConsoleBody>
            {matrixMode ? (
              <MatrixCanvas ref={canvasRef} />
            ) : loading ? (
              <LoadingText>⏳ Carregando logs...</LoadingText>
            ) : (
              <LogContainer>
                {logs.length === 0 ? (
                  <p>Nenhum log encontrado.</p>
                ) : (
                  logs.map((log, i) => (
                    <LogLine key={i} ok={log.ok}>
                      <strong>[{formatTime(log.time)}]</strong> {log.step}: {log.message}
                      {log.url_visitada && (
                        <>
                          <br />
                          <span className="url">→ {log.url_visitada}</span>
                        </>
                      )}
                      {log.current_url && (
                        <>
                          <br />
                          <span className="url">→ {log.current_url}</span>
                        </>
                      )}
                    </LogLine>
                  ))
                )}
              </LogContainer>
            )}
          </ConsoleBody>
        </ConsoleContainer>
      )}
    </Container>
  );
}

/* Styled Components */

const Container = styled.div`
  height: 100vh;
  background-color: ${colors.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background-color: ${colors.lightGray};
  color: ${colors.darkBlue};
  font-weight: 500;
  transition: 0.3s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ConsoleContainer = styled.div`
  width: 50rem;
  height: 70vh;
  background: #111;
  color: #0f0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 90%;
    height: 50vh;
  }
`;

const ConsoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #333;
  font-family: monospace;

  span {
    color: #888;
    font-size: 0.85rem;
    margin-left: 0.5rem;
  }
`;

const HeaderTitle = styled.div`
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: #555;
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #777;
  }
`;

const ConsoleBody = styled.div`
  flex: 1;
  position: relative;
`;

const MatrixCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const LogContainer = styled.div`
  padding: 1rem;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const LogLine = styled.div`
  color: ${(p) => (p.ok ? "#0f0" : "#f55")};
  margin-bottom: 0.7rem;

  .url {
    color: #888;
    font-size: 0.8rem;
  }
`;

const LoadingText = styled.div`
  padding: 2rem;
  text-align: center;
  font-family: monospace;
  color: #0f0;
  font-size: 1rem;
`;
