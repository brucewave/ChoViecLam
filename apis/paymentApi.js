import axios from 'axios';
import base64 from 'base-64'; // Import base-64

const paypalService = {
    payment: async (price, description, returnUrl, cancelUrl) => {
        try {
            const requestBody1 = {
                grant_type: 'client_credentials',
            };

            // Gửi yêu cầu lấy Access Token
            const response1 = await axios.post(
                'https://api.sandbox.paypal.com/v1/oauth2/token',
                requestBody1,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${base64.encode(
                            `AeyFK0Tomu06wnDGB4dmS3LMICoI_YezaWZBdHy6upiZ3S1YBDbmeJdKEQG2hXKnNf-XYcCE2lOgpVd2:EGAT2t45s_W_D3vF73RkfG_TJcGKg1FeBoLeygeexDcokCNYXeLPmxqQSJ3Tba7WA3CwzW80rZnQ8-Uj`
                        )}`, // Use base-64 encoding
                    },
                }
            );

            // Lấy Access Token từ phản hồi
            const accessToken = response1.data.access_token;

            // Tạo đối tượng dữ liệu yêu cầu
            const requestBody = {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal',
                },
                transactions: [
                    {
                        amount: {
                            currency: 'USD',
                            total: 2,
                        },
                        description,
                    },
                ],
                redirect_urls: {
                    return_url: returnUrl,
                    cancel_url: cancelUrl,
                },
            };

            console.log('Request Body:', requestBody);

            // Gửi yêu cầu tạo thanh toán PayPal
            const response = await axios.post(
                'https://api.sandbox.paypal.com/v1/payments/payment',
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // Lấy URL thanh toán từ phản hồi
            const { links } = response.data;
            const approvalUrl = links.find((link) => link.rel === 'approval_url').href;

            // Trả về URL thanh toán cho client
            return { approvalUrl, accessToken };
        } catch (error) {
            console.error('Error creating PayPal payment:', error.response ? error.response.data : error);
            throw new Error('Internal server error');
        }
    },

    executePayment: async (paymentId, token, PayerID) => {
        try {
            // Gửi yêu cầu execute payment
            const requestBody2 = {
                payer_id: PayerID,
            };
            const response2 = await axios.post(
                `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
                requestBody2,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Kiểm tra kết quả execute payment
            const { state } = response2.data;
            if (state === 'approved') {
                // Thanh toán thành công
                return { message: 'Payment successful' };
            } else {
                // Thanh toán thất bại
                return { message: 'Payment failed' };
            }
        } catch (error) {
            console.error('Error executing PayPal payment:', error);
            throw new Error('Internal server error');
        }
    }
}

export default paypalService;
