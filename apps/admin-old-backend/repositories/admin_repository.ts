import type { Prisma, PrismaClient } from "@prisma/client";
import BaseRepository from "./base_repository";

export default class AdminRepository extends BaseRepository {
	static instance: PrismaClient;

	static async createAdmin(props: Prisma.AdminCreateInput) {
		return AdminRepository.instance.admin.create({ data: props });
	}

	static async findAdminById(id: Prisma.AdminWhereUniqueInput["id"]) {
		return AdminRepository.instance.admin.findUnique({ where: { id } });
	}

	static async findAdminByUsername(
		username: Prisma.AdminWhereUniqueInput["username"],
	) {
		return AdminRepository.instance.admin.findUnique({ where: { username } });
	}

	static async allAdmins() {
		return AdminRepository.instance.admin.findMany();
	}

	static async reset() {
		return AdminRepository.instance.admin.deleteMany();
	}
}
