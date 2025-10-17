import React from "react";
import styled from "styled-components";
import { FaHome, FaSignOutAlt, FaUsers } from "react-icons/fa";
import Logo112H from "../assets/logo112h.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <Container isOpen={isOpen}>
        {/* Logo */}
        <Header>
          <Logo src={Logo112H} alt="112H Logo" />
        </Header>

        {/* Menu principal */}
        <Menu>
          <MenuItem active>
            <FaHome className="icon" />
            Home
          </MenuItem>
        </Menu>

        {/* Seção de usuário */}
        <UserSection>
          <SectionTitle>Usuário</SectionTitle>
          <CadastroUsuario onClick={() => navigate("/cadastro-usuario")}>
            <FaUsers className="icon" />Cadastro de Usuários
          </CadastroUsuario>
          <UserInfo>
            <Avatar src="https://i.pravatar.cc/40?u=marcel" alt="Marcel" />
            <UserDetails>
              <UserName>Marcel</UserName>
              <UserEmail>marcel@exemplo.com</UserEmail>
            </UserDetails>
          </UserInfo>
        </UserSection>

        {/* Rodapé */}
        <Footer>
          <LogoutButton>
            <FaSignOutAlt className="icon" />
            Sair
          </LogoutButton>
        </Footer>
      </Container>
    </>
  );
};

export default Sidebar;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
  transition: opacity 0.3s ease;
  z-index: 900;
`;

const Container = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const Header = styled.div`
  padding: 24px;
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  height: 40px;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0 24px;
  margin: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin-top: 8px;
  border-radius: 20px;
  font-weight: 500;
  color: ${({ active }) => (active ? "#000" : "#555")};
  background-color: ${({ active }) => (active ? "#e6e6e6ff" : "transparent")};
  cursor: pointer;
  transition: 0.2s ease;

  .icon {
    color: #374151;
  }

  &:hover {
    background-color: #a3a3a3ff;
  }
`;

const UserSection = styled.div`
  padding: 16px 24px;
`;

const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: #999;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

const CadastroUsuario = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  color: #555;
  cursor: pointer;
  .icon {
    color: #555;
  }
  &:hover {
    color: #000;
    .icon {
      color: #000;
    }
  }
  transition: 0.2s ease;
  padding: 6px 0;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #777;
`;

const Footer = styled.div`
  border-top: 1px solid #f0f0f0;
  padding: 20px 24px;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: #e74c3c;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  position: absolute;
  bottom: 20px;
  left: 24px;

  .icon {
    font-size: 16px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;
