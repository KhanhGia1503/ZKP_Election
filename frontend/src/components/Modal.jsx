import React, { useState, useEffect } from "react";
import { postVote, getAllCccdHashes } from "../utils/handleFunction";
import successImg from "../assets/success.png";
import failImg from "../assets/fail.jpg";

const Modal = ({ voter, onClose }) => {
  const [cccd, setCccd] = useState("");
  const [otp, setOtp] = useState("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isSuccessNoti, setIsSuccessNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cccdHashes, setCccdHashes] = useState([]); // Lưu danh sách cccdHash
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số cccdHash hiện tại

  useEffect(() => {
    // Lấy danh sách cccdHash từ backend khi modal được mở
    const fetchCccdHashes = async () => {
      const cccdData = await getAllCccdHashes();
      setCccdHashes(cccdData);
    };

    fetchCccdHashes();
  }, []); // Tải danh sách cccdHash khi mở modal

  const handleSubmit = async () => {
    setErrorMessage("");

    // Kiểm tra nếu CCCD không có 12 ký tự hoặc không phải là số
    if (!cccd || cccd.length !== 12 || isNaN(cccd)) {
      setErrorMessage("Cần nhập đúng 12 số cho CCCD!");
      return; // Dừng lại nếu CCCD không hợp lệ
    }

    // Kiểm tra nếu OTP trống
    if (!otp) {
      setErrorMessage("Cần nhập OTP!");
      return; // Dừng lại nếu OTP không có giá trị
    }

    // Lấy cccdHash tương ứng từ danh sách
    const cccdHash = cccdHashes[currentIndex];
    console.log("Code run here now 2", cccdHash);
    try {
      // Gửi yêu cầu bầu cử và proof cho Circom
      const response = await postVote({ cccd, otp, cccdHash, candidateId: voter.id });
      console.log("I can see",response);
      if (response.success && response.isValid) {
        // Nếu bầu cử thành công và proof hợp lệ, tiếp tục
        setIsSuccessModalVisible(true);
        setIsSuccessNoti(true); // Hiển thị thông báo thành công

        // Xóa người dùng khỏi danh sách sau khi bầu cử thành công
        const updatedCccdHashes = cccdHashes.filter((_, index) => index !== currentIndex);
        setCccdHashes(updatedCccdHashes);

        if (updatedCccdHashes.length === 0) {
          alert("Đã hoàn thành tất cả các phiếu bầu!");
        } else {
          setCurrentIndex((prevIndex) => prevIndex + 1); // Chuyển sang cccdHash tiếp theo
        }
      } else {
        // Nếu proof không hợp lệ, tiếp tục kiểm tra người dùng tiếp theo
        alert("Phiếu bầu không hợp lệ, tiếp tục kiểm tra!");
        setCurrentIndex((prevIndex) => prevIndex + 1); // Tiếp tục kiểm tra người tiếp theo
      }
    } catch (error) {
      console.log("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setIsSuccessModalVisible(true);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    onClose(); // Đóng modal hiện tại khi đóng modal thành công
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Cử tri: {voter.name}</h2>
          <form
            style={{ display: "flex", flexDirection: "column", paddingLeft: "40px", paddingRight: "40px" }}
          >
            {errorMessage && (
              <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
            )}
            <div className="form-group">
              <label htmlFor="user_id">ID:</label>
              <input id="user_id" type="text" value={voter.id} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="cccd">Căn cước công dân:</label>
              <input
                id="cccd"
                type="number"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="otp">OTP:</label>
              <input
                id="otp"
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            >
              <button type="button" onClick={handleSubmit}>
                Bầu cử
              </button>
              <button type="button" onClick={onClose}>
                Đóng
              </button>
            </div>
          </form>
        </div>
      </div>

      {isSuccessModalVisible && (
        <div className="modal-overlay" onClick={handleSuccessModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={isSuccessNoti ? successImg : failImg} alt="Success or fail image" width={200} />
            <h2>{isSuccessNoti ? "Bầu cử thành công" : "Bầu cử thất bại"}</h2>
            <button type="button" onClick={handleSuccessModalClose}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
