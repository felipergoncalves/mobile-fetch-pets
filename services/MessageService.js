import createAxiosInstance from "../constants/axiosInstance";

export const MessageService = {
    /**
     * Busca as mensagens de um chat específico.
     * @param chat_id - O ID do chat.
     */
    async getMessages(chat_id) {
        try {
            const axiosInstance = await createAxiosInstance();
            const response = await axiosInstance.get(`/messages/${chat_id}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
            throw error;
        }
    },

    /**
     * Envia uma mensagem para um chat.
     * @param sender_id - ID do remetente.
     * @param receiver_id - ID do destinatário.
     * @param content - Conteúdo da mensagem.
     */
    async sendMessage(sender_id, receiver_id, content) {
        try {
            const axiosInstance = await createAxiosInstance();
            const response = await axiosInstance.post(`/messages`, {
                sender_id,
                receiver_id,
                content,
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            throw error;
        }
    },

    /**
     * Busca a lista de conversas do usuário.
     * @param userId - O ID do usuário atual.
     */
    async getConversations(userId) {
        try {
            const axiosInstance = await createAxiosInstance();
            const response = await axiosInstance.get(`/messages/conversations/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
            throw error;
        }
    }

};
