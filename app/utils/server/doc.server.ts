import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

const FrontMatterTypeSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  alternateTitle: z.string().optional(),
  order: z.number().optional(),
  toc: z.boolean().optional(),
  hidden: z.boolean().optional(),
  slug: z.string().optional(), // auto-generated
  spacer: z.boolean().optional(), // auto-generated
  section: z.string().optional(), // auto-generated
})

const MetadataMeta = z.record(z.string(), FrontMatterTypeSchema)

const MetadataSchema = z.object({
  paths: z.record(z.string(), z.string()),
  hasIndex: z.boolean(),
  sections: z.array(z.string()),
  meta: MetadataMeta,
})

export type MetadataType = z.infer<typeof MetadataSchema>
export type MetadataMetaType = z.infer<typeof MetadataMeta>

const stripTrailingSlashes = (str: string): string => {
  return str.replace(/^\/|\/$/g, '')
}

export const getParsedMetadata = async (tag: string) => {
  if (process.env.NODE_ENV === 'development') {
    const content = await readFile(
      resolve(_dirname, '../../../', `posts/${tag}/metadata.json`),
      'utf-8'
    )

    if (!content) {
      return null
    }

    return MetadataSchema.parse(JSON.parse(content)) // - why tf does this throw an error???
    // return JSON.parse(content)
  }

  return null
}

export const tagHasIndex = (tag: string) => {
  if (process.env.NODE_ENV === 'development') {
    // use metadata to handle the cross-checking
    // const metadata = await getParsedMetadata(tag)
    // return metadata?.hasIndex
    // or
    return existsSync(resolve(_dirname, '../../../', `posts/${tag}/_index.mdx`))
  }

  return null
}

/**
 *
 * @param packageSlug - Slug of the package we're interested in
 * @param slug - Slug of the post we're interested in
 * @returns
 */
export const getPostContent = async (tag: string, slug: string) => {
  const metadata = await getParsedMetadata(tag)

  // If no metadata, something is inherently wrong!
  if (!metadata) {
    throw new Error(
      'No docs metadata found! Make sure to generate a metadata for your doc posts!'
    )
  }

  /**
   * If we are in development mode, we can just read the file from the file system.
   */
  if (process.env.NODE_ENV === 'development') {
    const content = await readFile(
      resolve(
        _dirname,
        '../../../',
        `posts/${tag}/${
          slug === '/'
            ? '_index'
            : `${metadata.paths[stripTrailingSlashes(slug)]}`
        }.mdx`
      ),
      'utf-8'
    )

    if (!content) {
      return null
    }

    return content
  }

  return null
}

export const redirectToFirstPost = async (tag: string) => {
  const paths = (await getParsedMetadata(tag))?.paths ?? {}
  return Object.keys(paths)[0]
}

export const getVersions = async () => {
  const content = await readFile(
    resolve(_dirname, '../../../', 'posts/versions.json'),
    'utf-8'
  )

  if (!content) {
    return null
  }

  return (JSON.parse(content) as Array<{ tag: string }>).map(
    version => version.tag
  )
}

// export const getPostMetaData = async (version: string = 'main') => {
//   /**
//    * If we are in development mode, we can just read the file from the file system.
//    */
//   if (process.env.NODE_ENV === 'development') {
//     /**
//      * Don't want to automate this part cause I don't feel like.
//      *
//      * Before you run `npm run dev`, run `npm run generator` first. This keeps the post metadata up to date,
//      * if you add a new post or delete, open another terminal and re-run. Then refresh your application to
//      * get the latest metadata.
//      *
//      * Todo: Generate metadata in development without the use of a github token.
//      */
//     const content = await readFile(
//       resolve(__dirname, '../', 'posts/metadata.json'),
//       'utf-8'
//     )

//     if (!content) {
//       return null
//     }
//     const parsed_content = JSON.parse(content)

//     return z.array(MetaDataObjectSchema).parse(parsed_content)
//   }

//   return null
// }
