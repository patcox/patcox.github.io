import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../config/site.ts';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap(p => p.data.tags ?? []))];
  return tags.map(tag => ({ params: { tag } }));
}

export async function GET(context) {
  const { tag } = context.params;
  const posts = (await getCollection('blog', ({ data }) =>
    !data.draft && (data.tags ?? []).includes(tag)
  )).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const label = tag.charAt(0).toUpperCase() + tag.slice(1);

  return rss({
    title: `${SITE.title} — ${label}`,
    description: `Posts tagged "${tag}" from ${SITE.title}`,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/writing/${post.slug}/`,
    })),
  });
}
