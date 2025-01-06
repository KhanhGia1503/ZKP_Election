import axios from "axios";
import snarkjs from "snarkjs";

const api = axios.create({
  baseURL: "http://localhost:5800",  
});

export const postVote = async ({ cccd, otp, cccdHash, candidateId }) => {
  try {
    const input = {
      cccd: BigInt(cccd),
      otp: BigInt(otp),
      cccdHash: BigInt(cccdHash.cccdHash),
      candidateId: BigInt(candidateId),
    };
    console.log("run================", input);
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "http://localhost:5800/public/voting_js/voting.wasm",
      "http://localhost:5800/public/voting_final.zkey"
    );
 
    const response = await api.post("/api/vote", {
      proof,
      publicSignals, 
    });

    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gửi vote:", error);
    return { success: false, message: "Lỗi gửi vote!" }; 
  }
};

export const getAllCccdHashes = async () => {
  try {
    const response = await api.get("http://localhost:5800/voters");
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy cccdHash:", error);
  }
};
