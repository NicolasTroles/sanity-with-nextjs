import client from "@/client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

function urlFor(source: string) {
  return imageUrlBuilder(client).image(source);
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <Image
          alt={value.alt || " "}
          src={urlFor(value).width(50).url()}
          width="50"
          height="100"
        />
      );
    },
  },
};

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { title, authorImage, authorName, body } = await getPost(params);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {title}
      <br />
      {authorName}
      <br />
      {authorImage && (
        <div>
          <Image
            alt={title}
            src={urlFor(authorImage).width(50).url()}
            width="50"
            height="50"
          />
        </div>
      )}
      <PortableText value={body} components={ptComponents} />
    </main>
  );
}

export async function generateStaticParams() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return paths.map((slug: string) => ({ params: { slug } }));
}

async function getPost(params: any) {
  const { slug = "" } = params;
  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{
      title, 
      body, 
      "authorName": author->name,
      "authorImage": author->image

    }
  `,
    { slug }
  );

  return post;
}
