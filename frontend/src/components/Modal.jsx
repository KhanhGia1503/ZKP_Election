import React, { useState } from "react";
import { postVote } from "../utils/handleFunction";
import successImg from "../assets/success.png";
import failImg from "../assets/fail.jpg";

const Modal = ({ voter, onClose }) => {
    const [cccd, setCccd] = useState("");
    const [otp, setOtp] = useState("");
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isSuccessNoti, setIsSuccessNoti] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

        try {
            const response = await postVote({ id: voter.id, cccd, otp });
            if (response.success) {
                setIsSuccessModalVisible(true);
                setIsSuccessNoti(true) // Hiển thị modal thành công
            } else {
                alert("Bầu cử thất bại. Vui lòng thử lại!");
                setIsSuccessNoti(false)
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
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2>Cử tri: {voter.name}</h2>
                    <form style={{ display: "flex", flexDirection: "column", paddingLeft: '40px', paddingRight: '40px' }}>
                        {errorMessage && (
                            <div style={{ color: "red", marginTop: "10px" }}>
                                {errorMessage}
                            </div>
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
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
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
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={isSuccessNoti ? successImg : failImg} alt="Success or fail image" width={200} />
                        <h2>{isSuccessNoti ? 'Bầu cử thành công' : 'Bầu cử thất bại'}</h2>
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