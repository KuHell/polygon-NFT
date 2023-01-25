import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--primary);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  padding: 50px;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  min-width: 100%;
  min-height: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 16px;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledStartView = styled.div`
  display: felx;
  padding: 20%;
  background-color: #f5f6fa;
  width: 100%;
  min-height: 100vh;
`;

export const Styledpage = styled.div`
  display: felx;
  padding: 100px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  // justify-content: space-between;
  width: 1440px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f5f6fa;
`;

export const StyledBody = styled.div`
  display: felx;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f5f6fa;
`;

export const StyledContent = styled.div`
  position: relative;
  display: block;
  align-items: center;
  justify-content: center;
  width: ${({ wd }) => (wd ? wd : "50%")};
  height: 96vh;
`;

export const StyledNftCard = styled.div`
  display: block;
  margin: 4vh auto;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 90%;
  border-radius: 20px;
  background-color: ${({ bw }) => (bw ? "#fff" : "none")};
  box-shadow: 0 3px 20px rgb(0 0 0 / 16%);
`;

export const StyledNftTitle = styled.div`
  margin: -2vh auto 5vh;
  display: block;
  text-align: center;
  width: ${({ wd }) => (wd ? wd : "50%")};
  font-size: 40px;
`;

export const StyledNftContractinfo = styled.div`
  margin: 5vh auto;
  display: block;
  text-align: center;
  font-size: 40px;
  font-size: ${({ fs }) => (fs ? fs : "40px")};
`;

export const StyledNftBuyButton = styled.div`
  // position: absolute;
  margin: 5vh auto;
  display: block;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 30px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  font-size: 40px;
  box-shadow: 0 3px 20px rgb(0 0 0 / 16%);
  // transform: translateY(380px);
  width: 100%;
`;

export const StyledHashLink = styled.div`
  padding: 20px;
  display: block;
  border-radius: 10px;
  box-shadow: 0 3px 20px rgb(0 0 0 / 6%);
  background-color: #fff;
  font-size: 20px;
`;

export const StyledHashURL = styled.p`
  display: block;
  width: 100%;
  font-size: 20px;
  // background-color: #000;
  overflow: hidden;
`;

export const StyledNftImg = styled.div`
  // margin: 5vh 0;
  padding: 40px 40px;
  display: block;
  width: 600px;
  height: 600px;
  justify-content: center;
  position: relative;
  background-color: #fff;
  box-shadow: 0 3px 20px rgb(0 0 0 / 16%);
  border-radius: 40px;
`;
