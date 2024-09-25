import type { GuildMember, VoiceState } from "discord.js";
import type { CommonConfig, LectureConfig } from "./config";

import { getDiscordNickname } from "./utils";
import { checkAttendance, logConnection } from "./handleMessage";

// 음성 채널 접속/퇴장 이벤트 처리
export function handleVoiceStateUpdate(
	oldState: VoiceState,
	newState: VoiceState,
	commonConfig: CommonConfig,
	noviceConfig: LectureConfig,
	advancedConfig: LectureConfig,
) {
	const now = new Date();

	// 음성 채널에 입장한 경우
	if (newState.channelId && newState.member) {
		if (newState.channelId === noviceConfig.targetChannelId) {
			noviceConfig.userJoinTimes.set(newState.id, now);
			handleEnterVoiceChannel(newState.member, commonConfig, noviceConfig);
		} else if (newState.channelId === advancedConfig.targetChannelId) {
			handleEnterVoiceChannel(newState.member, commonConfig, advancedConfig);
		}
	}
	// 음성 채널에서 퇴장한 경우
	else if (oldState.channelId && oldState.member) {
		if (oldState.channelId === noviceConfig.targetChannelId) {
			handleLeaveVoiceChannel(oldState.member, commonConfig, noviceConfig);
		} else if (oldState.channelId === advancedConfig.targetChannelId) {
			handleLeaveVoiceChannel(oldState.member, commonConfig, advancedConfig);
		}
	}
}

function handleEnterVoiceChannel(
	member: GuildMember,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	const nickname = getDiscordNickname(member);
	const now = new Date();
	console.log(
		`${nickname} 님이 ${lectureConfig.level} 채널에 접속했습니다. 현재 시각: ${now.toLocaleString()}`,
	);
	lectureConfig.userJoinTimes.set(member.id, now);

	if (lectureConfig.isLoggingConnections) {
		logConnection(nickname, now, "join", lectureConfig);
	}
	checkAttendance(member.id, nickname, now, commonConfig, lectureConfig);
}

function handleLeaveVoiceChannel(
	member: GuildMember,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	const joinTime = lectureConfig.userJoinTimes.get(member.id);
	if (!joinTime) {
		return;
	}
	lectureConfig.userJoinTimes.delete(member.id);

	const nickname = getDiscordNickname(member);
	const now = new Date();
	console.log(
		`${nickname} 님이 ${lectureConfig.level} 채널에서 퇴장하셨습니다. 현재 시각: ${now.toLocaleString()}`,
	);

	if (lectureConfig.isLoggingConnections) {
		logConnection(nickname, now, "leave", lectureConfig);
	}
}
