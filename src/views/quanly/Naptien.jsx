import { useEffect, useState } from "react";

function Naptien() {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [soTaiKhoan, setSoTaiKhoan] = useState("");
  const [amountToTransfer, setAmountToTransfer] = useState(1);

  const accessToken =
    "A21AALtqYropCrlcwpoLw_mkY_GyxHKppae2lner-3WF-v4bC0D-DbzKQ61Sb7Ci3TUAbL8HSd47BoTkelRwoJNEsEuMvxDzA";

  const fetchData = async () => {
    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v1/reporting/balances",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const balance = parseFloat(data.balances[0].available_balance.value);
      const soTaiKhoan = data.account_id;
      setAvailableBalance(balance);
      setSoTaiKhoan(soTaiKhoan);
      console.log("Dữ liệu json:", data);
      console.log("Số dư khả dụng:", balance);
      console.log("Số tài khoản là:", soTaiKhoan);
    } else {
      console.error("Không thể lấy dữ liệu từ PayPal.");
    }
  };

  const email = "test01@gmail.com";
  const sendPayout = async (recipientEmail, amount) => {
    if (amount > availableBalance) {
      console.error("Số tiền chuyển không hợp lệ, vượt quá số dư khả dụng.");
      return;
    }

    try {
      const response = await fetch(
        "https://api-m.sandbox.paypal.com/v1/payments/payouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            sender_batch_header: {
              email_subject: "You have a payout!",
              sender_batch_id:
                "batch_" + Math.random().toString(36).substring(7),
            },
            items: [
              {
                recipient_type: "EMAIL",
                amount: {
                  value: amount,
                  currency: "USD",
                },
                receiver: recipientEmail, // Đảm bảo đây là một email hợp lệ
                note: "Payout for services rendered",
                sender_item_id:
                  "item_" + Math.random().toString(36).substring(7),
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Payout successful:", data);
        await saveTransactionToDatabase(recipientEmail, amount);
        console.log("Số tiền là: ", amount);
        // Lưu giao dịch vào database
      } else {
        const errorData = await response.json(); // Lấy thông tin lỗi chi tiết
        console.error("Payout failed:", errorData); // Hiển thị lỗi chi tiết
        console.log(recipientEmail);
      }
    } catch (error) {
      console.error("Error during payout:", error);
    }
  };

  const saveTransactionToDatabase = async (recipientEmail, amount) => {
    try {
      const response = await fetch("http://localhost:8080/api/wallet/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: recipientEmail,
          so_tien: amount, // Đổi từ amount thành so_tien
          currency: "USD",
          so_tai_khoan: soTaiKhoan,
        }),
      });

      if (response.ok) {
        console.log("Transaction saved to database successfully.");
        console.log("Gửi giao dịch vào cơ sở dữ liệu với:", {
          email: recipientEmail,
          so_tien: amount, // Đổi từ amount thành so_tien
          currency: "USD",
          so_tai_khoan: soTaiKhoan,
        });
      } else {
        console.error("Failed to save transaction to database.");
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <button onClick={fetchData}>Liên kết với PayPal</button>
      <p>Số dư khả dụng trong ví của paypal: {availableBalance}</p>
      <input
        type="number"
        value={amountToTransfer}
        onChange={(e) => setAmountToTransfer(Number(e.target.value))}
        min="1"
        max={availableBalance}
      />
      <button onClick={() => sendPayout(email, amountToTransfer)}>
        Chuyển tiền vào ví
      </button>
    </div>
  );
}

export default Naptien;

// const saveAccountId = async (accountId) => {
//   try {
//     const response = await fetch("http://localhost:8080/api/wallet/save", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         so_tai_khoan: accountId,
//         so_tien: 0, // Hoặc một giá trị nào đó mà bạn muốn khởi tạo cho tài khoản
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Đã lưu account_id vào database.");
//       console.log(data);
//     } else {
//       console.error("Không thể lưu account_id vào database.");
//     }
//   } catch (error) {
//     console.error("Lỗi khi lưu account_id:", error);
//   }
// };
