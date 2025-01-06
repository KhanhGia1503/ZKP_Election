const express = require("express");
const snarkjs = require("snarkjs");
const connectDB = require("./config/db");
const Candidate = require("./models/CandidateModel.js");
const Voter = require("./models/VoterModel");
const verificationKey = require("./circuits/verification_key.json");
const path = require("path");

const app = express()
connectDB();

app.get("/", (req, res) => {
    res.send("This is election zkp")
})

const PORT = process.env.PORT || 5800

app.listen(PORT, () => console.log(`Project run on port ${PORT}`))

app.post("/vote", async (req, res) => {
    const { proof, publicSignals } = req.body;  // Proof và public signals từ frontend
    if (!proof || !publicSignals) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
    }

    try {
        // 1. Xác minh Proof với verificationKey
        const { isProofValid } = await snarkjs.groth16.verify(
            verificationKey,  // Verification key
            publicSignals,     // Các public signals
            proof              // Proof
        );
        if (!isProofValid) {
            return res.status(400).json({ success: false, message: "Proof không hợp lệ!" });
        }
        // 2. Lấy giá trị isValid từ publicSignals[0] để xác minh cử tri hợp lệ
        const isVoterValid = publicSignals[0];
        if (!isVoterValid) {
            return res.status(400).json({ success: false, message: "Cử tri không hợp lệ!" });
        }
        // 3. Lấy encryptedVote từ publicSignals[1]
        const encryptedVote = publicSignals[1];  // publicSignals[1] là encryptedVote (mã hóa phiếu bầu)
        // 4. Cập nhật phiếu bầu cho ứng viên
        const candidate = await Candidate.findOne({ candidateHash: encryptedVote });
        if (candidate) {
            // Nếu ứng viên đã tồn tại, cộng phiếu
            candidate.totalVotes += 1;
            await candidate.save();
        } else {
            // Nếu ứng viên chưa tồn tại, tạo mới
            const newCandidate = new Candidate({
                candidateHash: encryptedVote,
                totalVotes: 1,
            });
            await newCandidate.save();
        }

        // 5. Trả kết quả
        return res.status(200).json({
            success: true,
            message: "Bầu cử thành công!",
            encryptedVote: encryptedVote,
        });
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý phiếu bầu:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
    }
});

app.get("/voters", async (req, res) => {
    try {
        // Lấy tất cả các cccdHash từ cơ sở dữ liệu
        const voters = await Voter.find({}, { cccdHash: 1, _id: 0 }); // Chỉ lấy trường cccdHash

        // Trả về danh sách cccdHash
        return res.status(200).json(voters);
    } catch (error) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

app.use("/public", express.static(path.join(__dirname, "circuits")));