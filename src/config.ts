// 站点元信息
export const SITE = {
	title: '我的博客',
	author: 'xxx',
	description: '随便写写',
	// 站点实际访问地址（项目站点部署在 /blog 子路径）；RSS/sitemap/canonical 实际读取 astro.config.mjs 的 site + base
	url: 'https://2867744246.github.io/blog',
	social: {
		github: 'https://github.com/2867744246',
	},
	// 首页分页大小
	itemsPerPage: 10,
} as const;
