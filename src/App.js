import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import web3 from "web3";
// import loadingImg from "../public/";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #fff;
  padding: 10px;
  font-weight: bold;
  color: #000;
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledConnectBtn = styled.button`
  margin: 0 auto;
  padding: 100px;
  border-radius: 10px;
  border: none;
  background-color: #fff;
  font-size: 40px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  box-shadow: 0 3px 20px rgb(0 0 0 / 16%);
  display: flex;
  align-items: center;
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });
  const [connectState, setConnectState] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [nftState, setnftState] = useState(false);
  const [polygonscanUrl, setpolygonscanUrl] = useState("");
  const [nftImgSrc, setnftImgSrc] = useState("");

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}`);
    setisLoading(true); //loading이미지 출력
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setisLoading(false); //loading이미지 출력
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        console.log(receipt.events);
        console.log(receipt.events.Transfer);
        console.log(receipt.events.Transfer.returnValues.tokenId);
        let tokenId = receipt.events.Transfer.returnValues.tokenId;
        console.log("tokenId : ", tokenId);
        setpolygonscanUrl(
          "https://mumbai.polygonscan.com/tx/" + receipt.transactionHash
        );
        setnftImgSrc(
          "https://gateway.pinata.cloud/ipfs/QmaT64tYpxj6rxmQVhAwhevqB8HCE8PKGcf8sBv8JGyF6M/" +
            tokenId +
            ".png"
        );
        setisLoading(false); //loading이미지 출력
        setnftState(true); //폴리곤 사이트 아이콘
        setFeedback(
          `${CONFIG.NFT_NAME} is yours! go visit PolygonScan to view it.`
          // `NFT is yours! go visit PolygonScan to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      console.log("blockchain.account: ", blockchain.account);
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const connectChange = () => {
    setConnectState(true);
  };

  return connectState ? (
    <s.StyledBody>
      <s.Styledpage>
        <s.StyledContent wd={"45%"}>
          {/* <s.StyledNftCard bw> */}
          <s.StyledNftImg>
            {isLoading ? (
              <img
                alt="now loading..."
                src="loading.gif"
                style={{
                  margin: "0 auto",
                  top: "50%",
                  left: "50%",
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : nftState ? (
              <img
                src={nftImgSrc}
                alt="nft"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  // margin: "0 auto 0",
                }}
              />
            ) : null}
          </s.StyledNftImg>
          {/* </s.StyledNftCard> */}
        </s.StyledContent>
        <s.StyledContent wd={"55%"}>
          <s.StyledNftTitle># KuHell-NFT</s.StyledNftTitle>
          <s.StyledNftContractinfo fs={"90px"}>
            {data.totalSupply} / {CONFIG.MAX_SUPPLY}
          </s.StyledNftContractinfo>
          <s.StyledNftContractinfo fs={"30px"}>
            {CONFIG.CONTRACT_ADDRESS}
          </s.StyledNftContractinfo>
          <s.StyledNftContractinfo>{feedback}</s.StyledNftContractinfo>
          <s.StyledNftContractinfo>
            {isLoading ? (
              <img
                alt="now loading..."
                src="loading.gif"
                style={{ margin: "1rem" }}
              />
            ) : nftState ? (
              <s.StyledHashLink>
                <s.StyledHashURL>
                  transactionID:
                  <a href={polygonscanUrl} target="_blank">
                    {polygonscanUrl}
                  </a>
                </s.StyledHashURL>
              </s.StyledHashLink>
            ) : null}
          </s.StyledNftContractinfo>
          <s.StyledNftBuyButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs();
              getData();
            }}
          >
            {claimingNft ? "BUSY" : "BUY"}
          </s.StyledNftBuyButton>
        </s.StyledContent>
      </s.Styledpage>
    </s.StyledBody>
  ) : (
    // <s.Screen>
    //   <s.Container
    //     flex={1}
    //     ai={"center"}
    //     // style={{ padding: 24, backgroundColor: "#f5f6fa" }}
    //     style={{ padding: 24, backgroundColor: "#000" }}
    //   >
    //     {/* <a href={CONFIG.MARKETPLACE_LINK}>
    //         <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
    //       </a> */}
    //     {/* <s.SpacerSmall /> */}
    //     <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
    //       <s.Container
    //         flex={2}
    //         jc={"center"}
    //         ai={"center"}
    //         style={{
    //           // backgroundColor: "white",
    //           backgroundColor: "black",
    //           padding: 24,
    //           borderRadius: 24,
    //           // border: "4px dashed var(--secondary)",
    //           boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.3)",
    //         }}
    //       >
    //         <s.TextTitle
    //           style={{
    //             textAlign: "center",
    //             fontSize: 50,
    //             fontWeight: "bold",
    //             color: "var(--accent-text)",
    //           }}
    //         >
    //           {data.totalSupply} / {CONFIG.MAX_SUPPLY}
    //         </s.TextTitle>
    //         <s.TextDescription
    //           style={{
    //             textAlign: "center",
    //             color: "var(--primary-text)",
    //           }}
    //         >
    //           <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
    //             {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
    //           </StyledLink>
    //         </s.TextDescription>
    //         <span
    //           style={{
    //             textAlign: "center",
    //           }}
    //         >
    //           <StyledButton
    //             onClick={(e) => {
    //               window.open("/config/roadmap.pdf", "_blank");
    //             }}
    //             style={{
    //               margin: "5px",
    //             }}
    //           >
    //             Roadmap
    //           </StyledButton>
    //           <StyledButton
    //             style={{
    //               margin: "5px",
    //             }}
    //             onClick={(e) => {
    //               window.open(CONFIG.MARKETPLACE_LINK, "_blank");
    //             }}
    //           >
    //             {CONFIG.MARKETPLACE}
    //           </StyledButton>
    //         </span>
    //         <s.SpacerSmall />
    //         {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
    //           <>
    //             <s.TextTitle
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               The sale has ended.
    //             </s.TextTitle>
    //             <s.TextDescription
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               You can still find {CONFIG.NFT_NAME} on
    //             </s.TextDescription>
    //             <s.SpacerSmall />
    //             <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
    //               {CONFIG.MARKETPLACE}
    //             </StyledLink>
    //           </>
    //         ) : (
    //           <>
    //             <s.TextTitle
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
    //               {CONFIG.NETWORK.SYMBOL}.
    //             </s.TextTitle>
    //             <s.SpacerXSmall />
    //             <s.TextDescription
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               Excluding gas fees.
    //             </s.TextDescription>
    //             <s.SpacerSmall />
    //             {blockchain.account === "" ||
    //             blockchain.smartContract === null ? (
    //               <s.Container ai={"center"} jc={"center"}>
    //                 <s.TextDescription
    //                   style={{
    //                     textAlign: "center",
    //                     color: "var(--accent-text)",
    //                   }}
    //                 >
    //                   Connect to the {CONFIG.NETWORK.NAME} network
    //                 </s.TextDescription>
    //                 <s.SpacerSmall />
    //                 {/* <StyledConnectBtn
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       dispatch(connect());
    //                       getData();
    //                     }}
    //                   >
    //                     뽑기 시작
    //                   </StyledConnectBtn> */}
    //                 {blockchain.errorMsg !== "" ? (
    //                   <>
    //                     <s.SpacerSmall />
    //                     <s.TextDescription
    //                       style={{
    //                         textAlign: "center",
    //                         color: "var(--accent-text)",
    //                       }}
    //                     >
    //                       {blockchain.errorMsg}
    //                     </s.TextDescription>
    //                   </>
    //                 ) : null}
    //               </s.Container>
    //             ) : (
    //               <>
    //                 <s.TextDescription
    //                   style={{
    //                     textAlign: "center",
    //                     color: "var(--accent-text)",
    //                   }}
    //                 >
    //                   {feedback}
    //                 </s.TextDescription>
    //                 <s.SpacerMedium />
    //                 <s.Container ai={"center"} jc={"center"} fd={"row"}>
    //                   <StyledRoundButton
    //                     style={{ lineHeight: 0.4 }}
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       decrementMintAmount();
    //                     }}
    //                   >
    //                     -
    //                   </StyledRoundButton>
    //                   <s.SpacerMedium />
    //                   <s.TextDescription
    //                     style={{
    //                       textAlign: "center",
    //                       color: "var(--accent-text)",
    //                     }}
    //                   >
    //                     {mintAmount}
    //                   </s.TextDescription>
    //                   <s.SpacerMedium />
    //                   <StyledRoundButton
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       incrementMintAmount();
    //                     }}
    //                   >
    //                     +
    //                   </StyledRoundButton>
    //                 </s.Container>
    //                 <s.SpacerSmall />
    //                 <s.Container ai={"center"} jc={"center"} fd={"row"}>
    //                   <StyledButton
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       claimNFTs();
    //                       getData();
    //                     }}
    //                   >
    //                     {claimingNft ? "BUSY" : "BUY"}
    //                   </StyledButton>
    //                 </s.Container>
    //               </>
    //             )}
    //           </>
    //         )}
    //       </s.Container>
    //     </ResponsiveWrapper>
    //   </s.Container>
    // </s.Screen>
    <s.StyledStartView>
      <StyledConnectBtn
        onClick={(e) => {
          e.preventDefault();
          dispatch(connect());
          getData();
          connectChange();
        }}
      >
        KuHell-NFT
      </StyledConnectBtn>
    </s.StyledStartView>
  );
}

export default App;
