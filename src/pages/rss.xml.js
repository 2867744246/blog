import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { withBase } from '../utils/base';

// 生成 /rss.xml 订阅源
export async function GET(context) {
	const posts = (await getCollection('posts')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
	return rss({
		title: SITE.title,
		description: SITE.description,
		// context.site 只含域名，手动拼上 base 使 channel 链接指向 /blog/
		site: new URL(withBase('/'), context.site),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			// @astrojs/rss 内部用 new URL(link, site) 拼接，以 / 开头的相对路径会丢弃 site 中的子路径，
			// 因此项目站点（base: '/blog'）下必须手动拼前缀
			link: withBase(`/posts/${post.id}/`),
		})),
	});
}
