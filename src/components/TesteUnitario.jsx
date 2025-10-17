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
  const canvasRef = useRef();
  const animationRef = useRef();

  // Iniciar o console
  const openConsole = (ctrl) => {
    setShowConsole(true);
    setMatrixMode(ctrl); // Ctrl+click ativa Matrix
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

  const stopMatrix = () => {
    cancelAnimationFrame(animationRef.current);
  };

  // Limpar animação ao fechar console
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
            <HeaderTitle>Console</HeaderTitle>
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
            {matrixMode ? <MatrixCanvas ref={canvasRef} /> : <p>Logs aqui...</p>}
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
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
