import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const colors = {
  darkBlue: "#1F2937",
  lightGray: "#A3B1BA",
  buttonHover: "#374151",
};

export default function TesteUnitario() {
  const navigate = useNavigate();
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testRunning, setTestRunning] = useState(false);
  const consoleRef = useRef();
  const intervalRef = useRef(null);

  // Iniciar teste simulado
  const runTest = () => {
    if (testRunning) return; // previne múltiplos intervalos
    setShowConsole(true);
    setLogs([]);
    setTestRunning(true);

    intervalRef.current = setInterval(() => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Log de teste simulado`,
      ]);
    }, 1000);
  };

  // Parar teste
  const stopTest = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (testRunning) {
      setTestRunning(false);
      setLogs((prev) => [...prev, "=== Teste parado pelo usuário ==="]);
    }
  };

  // Scroll automático
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Limpar intervalo quando o componente desmonta
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Container>
      <Content>
        <Title>Teste Unitário</Title>
        <ButtonGroup>
          <Button primary onClick={runTest}>
            Login
          </Button>
          <Button primary onClick={runTest}>
            Funcionalidade 1
          </Button>
          <Button primary onClick={runTest}>
            Funcionalidade 2
          </Button>
        </ButtonGroup>
      </Content>

      {showConsole && (
        <ConsoleContainer>
          <ConsoleHeader>
            <HeaderTitle>Console de Logs</HeaderTitle>
            <HeaderButtons>
              {testRunning && <StopButton onClick={stopTest}>Parar Teste</StopButton>}
              <CloseButton
                onClick={() => {
                  stopTest(); // garante que o teste pare
                  setShowConsole(false); // fecha o console
                }}
              >
                X
              </CloseButton>
            </HeaderButtons>
          </ConsoleHeader>
          <ConsoleBody ref={consoleRef}>
            {logs.map((log, idx) => (
              <LogLine key={idx}>{log}</LogLine>
            ))}
          </ConsoleBody>
        </ConsoleContainer>
      )}
    </Container>
  );
}

/* =================== Styled Components =================== */

const Container = styled.div`
  height: 100vh;
  background-color: ${colors.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  color: ${colors.lightGray};
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Button = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background-color: ${(props) =>
    props.primary ? colors.lightGray : "#374151"};
  color: ${(props) => (props.primary ? colors.darkBlue : colors.lightGray)};
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) =>
      props.primary ? "#E5E7EB" : colors.buttonHover};
  }

  &:active {
    transform: scale(0.97);
  }
`;

/* =================== Console =================== */

const ConsoleContainer = styled.div`
  position: fixed;
  top: 60px; /* altura do Navbar */
  right: 20px;
  width: 40rem;
  height: calc(100vh - 100px);
  background: #111;
  color: #0f0;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
  overflow: hidden;
`;

const ConsoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  font-weight: bold;
  border-bottom: 1px solid #333;
`;

const HeaderTitle = styled.div`
  font-size: 1rem;
`;

const StopButton = styled.button`
  background: #e74c3c;
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ConsoleBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.9rem;
`;

const LogLine = styled.div`
  white-space: pre-wrap;
  margin-bottom: 0.2rem;
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: #555;
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #777;
  }
`;
