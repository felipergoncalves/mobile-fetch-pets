import createAxiosInstance from "../constants/axiosInstance";

export const NotificationService = {

    async fetchNotificationsByUserId(userId, params) {
        const axiosInstance = await createAxiosInstance();

        return await axiosInstance.get(`/notifications/user/${userId}`, {params})
            .then(({data}) => {
                const result = data.data
                return {success: true, result};
            })
            .catch((error) => {
                return {success: false, msg: error.message};
            });
    },

    async createNotification(notification) {
        try {
            const axiosInstance = await createAxiosInstance();
            const response = await axiosInstance.post(`/notifications`, notification);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar uma notificação:", error);
            throw error;
        }
    },

    async updateNotification(notificationId, notification) {
        try {
            const axiosInstance = await createAxiosInstance();
            const response = await axiosInstance.patch(`/notifications/${notificationId}`, notification);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar uma notificação:", error);
            throw error;
        }
    },
};
