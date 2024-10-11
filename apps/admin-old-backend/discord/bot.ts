import pkg, { ActivityType } from "discord.js";
const { Client, GatewayIntentBits, Events } = pkg;

import { handleMessage } from "./handleMessage";
import dotenv from "dotenv";
import { advancedConfig, commonConfig, noviceConfig } from "./config";
import { handleVoiceStateUpdate } from "./handleVoiceStateUpdate";
import { getLectureSchedule, setupExistingLectureSchedule } from "./lecture";

dotenv.config();

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
});

export function startBot() {
	client.once(Events.ClientReady, () => {
		if (!client.user) {
			console.error("client.user is undefined");
			return;
		}
		console.log(`${client.user.tag} 봇이 켜졌습니다.`);
		client.user.setPresence({
			status: "online",
			activities: [{ name: "출석", type: ActivityType.Playing }],
		});
		// 초급, 중급 스케줄 모두 세팅하도록
		const noviceLectureSchedule = getLectureSchedule(noviceConfig);
		setupExistingLectureSchedule(
			noviceLectureSchedule,
			commonConfig,
			noviceConfig,
		);

		const advancedLectureSchedule = getLectureSchedule(advancedConfig);
		setupExistingLectureSchedule(
			advancedLectureSchedule,
			commonConfig,
			advancedConfig,
		);
	});

	client.on(Events.MessageCreate, (message) => {
		// 알람 채널의 메시지만 처리, 봇 메시지는 무시
		if (
			message.channelId !== commonConfig.alarmChannelId ||
			message.author.bot
		) {
			return;
		}
		handleMessage(message, commonConfig, noviceConfig, advancedConfig);
	});

	client.on(Events.VoiceStateUpdate, (oldState, newState) => {
		handleVoiceStateUpdate(
			oldState,
			newState,
			commonConfig,
			noviceConfig,
			advancedConfig,
		);
	});

	client.login(process.env.DISCORD_TOKEN);
}
