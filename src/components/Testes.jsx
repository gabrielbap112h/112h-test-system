import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";

const colors = {
  darkBlue: "#1F2937", // cor principal da logo
  lightGray: "#A3B1BA", // cor secundária
  buttonHover: "#374151", // azul escuro mais claro para hover
};

export default function Testes() {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title>Testes</Title>
        <ButtonGroup>
          <Button primary onClick={() => navigate("/teste-unitario")}>
            Teste Unitário
          </Button>
          <Button primary onClick={() => navigate("/teste-geral")}>
            Teste Geral
          </Button>
          <Button primary onClick={() => navigate("/teste-manual")}>
            Teste Manual
          </Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
}

// Container centraliza o conteúdo na tela
const Container = styled.div`
  height: 100vh;
  background-color: ${colors.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Content mantém o bloco centralizado e limpo
const Content = styled.div`
  text-align: center;
`;

// Título minimalista
const Title = styled.h1`
  color: ${colors.lightGray};
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 500;
`;

// Grupo de botões
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Botões estilizados
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

  &:hover {
    background-color: ${(props) =>
      props.primary ? "#E5E7EB" : colors.buttonHover};
  }

  &:active {
    transform: scale(0.97);
  }
`;
