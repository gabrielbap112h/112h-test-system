import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";

const colors = {
  darkBlue: "#1F2937",
  lightGray: "#A3B1BA",
  buttonHover: "#374151",
};

export default function Home() {
  const navigate = useNavigate();

  // Lista de projetos
  const [projects, setProjects] = useState([
    { name: "BIC" },
    { name: "Sesc" },
    { name: "Via Araucária" },
  ]);

  // Modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewProjectName("");
  };

  const handleSaveProject = () => {
    if (newProjectName.trim() === "") return;
    setProjects([...projects, { name: newProjectName }]);
    closeModal();
  };

  return (
    <Container>
      <Content>
        <Title>Projetos</Title>
        <ButtonGroup>
          {projects.map((proj, idx) => (
            <Button
              key={idx}
              primary
              onClick={() => navigate("/testes")}
            >
              (Logo) {proj.name}
            </Button>
          ))}

          <Button onClick={openModal}>
            <FaPlus style={{ marginRight: "8px" }} /> Adicionar Projeto
          </Button>
        </ButtonGroup>
      </Content>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Novo Projeto</h2>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <Input
                placeholder="Nome do projeto"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button primary onClick={handleSaveProject}>
                Salvar
              </Button>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
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

/* =================== Modal =================== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;
