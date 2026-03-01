import api from "../../lib/api";

/**
 * Set a new 4-digit transaction PIN for the user
 * @param {string} pin - A 4-digit PIN string
 * @returns {Promise<Object>} Response data
 */
export const setTransactionPin = async (pin) => {
    const response = await api.post("/security/set-pin", { pin });
    return response.data;
};

/**
 * Verify the user's 4-digit transaction PIN
 * @param {string} pin - A 4-digit PIN string
 * @returns {Promise<Object>} Response data
 */
export const verifyTransactionPin = async (pin) => {
    const response = await api.post("/security/verify-pin", { pin });
    return response.data;
};

/**
 * Change the user's 4-digit transaction PIN
 * @param {string} oldPin - The current 4-digit PIN
 * @param {string} newPin - The new 4-digit PIN
 * @returns {Promise<Object>} Response data
 */
export const changeTransactionPin = async (oldPin, newPin) => {
    const response = await api.post("/security/change-pin", { oldPin, newPin });
    return response.data;
};
