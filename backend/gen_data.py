import json
import subprocess

# Hàm tính Poseidon hash cho cccd và otp
def poseidon_hash(cccd, otp):
    # Gọi SnarkJS từ Python để tính toán Poseidon hash
    result = subprocess.run(
        ["node", "poseidon_hash.js", str(cccd), str(otp)],
        capture_output=True,
        text=True
    )
    
    # Trả về kết quả hash từ SnarkJS
    if result.returncode == 0:
        return result.stdout.strip()  # Xử lý kết quả trả về
    else:
        raise Exception(f"Lỗi tính toán hash Poseidon: {result.stderr}, Output: {result.stdout}")

# Lưu hash vào file
def save_hash_to_file(hash_value):
    # Đọc danh sách hash từ file
    try:
        with open("hash_list.json", "r") as f:
            hash_list = json.load(f)
    except FileNotFoundError:
        hash_list = []

    # Thêm hash mới vào danh sách
    hash_list.append(hash_value)

    # Lưu lại danh sách hash vào file
    with open("hash_list.json", "w") as f:
        json.dump(hash_list, f)

# Ví dụ sử dụng
def main():
    # 5 bộ cccd và otp khác nhau
    test_cases = [
        {"cccd": 123123123, "otp": 456456456},
    ]
    
    # Tính toán Poseidon hash cho mỗi cặp cccd và otp
    for case in test_cases:
        cccd = case["cccd"]
        otp = case["otp"]
        
        # Tính toán Poseidon hash
        try:
            public_hash = poseidon_hash(cccd, otp)
            # Lưu hash vào file
            save_hash_to_file(public_hash)
            print(f"Hash công khai cho CCCD {cccd} và OTP {otp}: {public_hash}")
        except Exception as e:
            print(f"Error calculating hash for CCCD {cccd} and OTP {otp}: {e}")

if __name__ == '__main__':
    main()
