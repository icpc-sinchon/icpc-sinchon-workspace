import type { PrismaClient } from "@prisma/client";
import Connection from "../db_client/connection";

/**
 * Abstract class for all repositories
 *
 * This class is responsible for creating a new instance of PrismaClient
 * And it should be treated as singleton class
 */
export default abstract class BaseRepository {
	protected prisma: PrismaClient;
	private static _instance: BaseRepository;

	/* Constructs a new instance of the repository
	 *
	 * @constructor
	 * @param {string} env - The environment of the application
	 */
	constructor() {
		const connection = new Connection();
		this.prisma = connection.prismaClient;
	}

	/* Returns the instance of Singleton class
	 *
	 * @returns {PrismaClient} - The instance of PrismaClient
	 */
	static get instance() {
		if (!BaseRepository._instance) {
			BaseRepository._instance = new (class extends BaseRepository {})();
		}
		return BaseRepository._instance.prisma;
	}
}
