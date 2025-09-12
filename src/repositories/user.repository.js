const prisma = require("../config/db");

class UserRepository {
    async createUser(data) {
        return await prisma.user.create({ data });
    }
    async findbyEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    async findbyId(id) {
        return await prisma.user.findUnique({ where: { id } });
    }
}

module.exports = new UserRepository();