// 项目站点部署在子路径（GitHub Pages 仓库改名为 blog 后为 /blog），
// 站内绝对链接需通过此函数拼接 base 前缀；未配置 base 时 BASE_URL 为 '/'，拼接结果不变
export function withBase(path: string): string {
	// BASE_URL 取自 astro.config.mjs 的 base 配置，去掉尾部斜杠避免出现双斜杠
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return base + path;
}
