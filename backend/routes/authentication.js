const express = require("express");
const circomlibjs = require("circomlibjs");
const Candidate = require("../models/CandidateModel"); // Model ứng viên
const Voter = require("../models/VoterModel"); // Model cử tri
const router = express.Router();

router.post("/vote", async (req, res) => {
  const { cccd, otp, candidateId } = req.body;

  // Kiểm tra input
  if (!cccd || !otp || !candidateId) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
  }

  try {
    // 1. Tạo Poseidon hash từ cccd và otp
    const poseidon = await circomlibjs.buildPoseidon();
    const cccdBigInt = BigInt(cccd);
    const otpBigInt = BigInt(otp);
    const cccdHash = poseidon.F.toString(poseidon([cccdBigInt, otpBigInt]));

    // 2. Kiểm tra xem cccdHash có hợp lệ không (đã đăng ký trước đó)
    const voter = await Voter.findOne({ cccdHash });
    if (!voter) {
      return res
        .status(400)
        .json({ success: false, message: "Cử tri không hợp lệ!" });
    }

    // 3. Tạo mã hóa phiếu bầu (hash từ candidateId)
    const voteHash = poseidon.F.toString(poseidon([BigInt(candidateId), 123n]));

    // 4. Cập nhật phiếu bầu cho ứng viên
    const candidate = await Candidate.findOne({ candidateHash: voteHash });
    if (candidate) {
      // Nếu ứng viên đã tồn tại, cộng phiếu
      candidate.totalVotes += 1;
      await candidate.save();
    } else {
      // Nếu ứng viên chưa tồn tại, tạo mới
      const newCandidate = new Candidate({
        candidateHash: voteHash,
        totalVotes: 1,
      });
      await newCandidate.save();
    }

    // 5. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Bầu cử thành công!",
      encryptedVote: voteHash,
    });
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý phiếu bầu:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
});

module.exports = router;
