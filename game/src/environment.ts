// @ts-expect-error arg exists from LÖVE
const args: string[] = arg;

export const Environment = {
	IS_DEBUG: os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") === "1" && args[1] === "debug",
};
