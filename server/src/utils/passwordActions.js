import bcrypt from 'bcrypt';

export const getPasswordHash = async (password, rounds = 10) => {
    const result = await bcrypt.hash(password, rounds);
    return result;
};

export const verifyPassword = async (password, passwordHash) => {
    const result = await bcrypt.compare(password, passwordHash);
    return result;
};