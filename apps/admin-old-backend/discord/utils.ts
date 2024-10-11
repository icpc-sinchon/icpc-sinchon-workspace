import type { GuildMember } from "discord.js";
import StudentRepository from "repositories/student_repository";

export function getDiscordNickname(member: GuildMember) {
	return member.nickname || member.user.globalName || member.user.username;
}

export async function getStudentIdFromNickname(nickname: string) {
	const bojHandle = nickname.match(/\(([^)]+)\)/);
	if (bojHandle) {
		const student = await StudentRepository.findStudentByBojHandle(
			bojHandle[1],
		);
		if (student) {
			return student.id;
		}
	}
	return null;
}

export function getBojHandleFromNickname(nickname: string) {
	const bojHandle = nickname.match(/\(([^)]+)\)/);
	return bojHandle ? bojHandle[1] : null;
}
