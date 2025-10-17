import React from "react";
import styled from "styled-components";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import Logo112H from "../assets/logo112h.png";
import { useNavigate } from "react-router-dom";

// ✅ Navbar funcional com Menu e Logout
const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          <FaBars size={20} />
        </MenuButton>

        <LogoWrapper onClick={() => navigate("/")}>
          <Logo src={Logo112H} alt="112H Logo" />
        </LogoWrapper>
      </LeftSection>

      <RightSection>
        <LogoutButton>
          <FaSignOutAlt size={18} />
        </LogoutButton>
      </RightSection>
    </NavContainer>
  );
};

/* ================== Styled Components ================== */

const NavContainer = styled.nav`
  width: 100%;
  height: 60px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  background: #374151;
  border: none;
  color: white;
  padding: 10px;
  margin-left: 2rem;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 35px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogoutButton = styled.button`
  border: none;
  background: transparent;
  color: #374151;
  cursor: pointer;
  transition: 0.2s;
  margin-right: 2rem;

  &:hover {
    transform: scale(1.1);
  }
`;

export default Navbar;
