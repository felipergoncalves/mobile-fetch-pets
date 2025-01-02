import CryptoJS from 'crypto-js';

export const generateChatUUID = (user1_id, user2_id) => {
    // Combina os IDs de forma consistente
    const combined = [user1_id, user2_id].sort().join('');

    // Gera um hash MD5 a partir do valor combinado
    const hash = CryptoJS.MD5(combined).toString();

    // Formata o hash como UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
};
