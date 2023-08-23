import entities from 'entities'

// https://stackoverflow.com/questions/48766615
const htmlTagsRegex = /<(p|br)>/ig
const stripHtmlRegex = /(<([^>]+)>)/ig
// TODO - we can https://www.npmjs.com/package/htmlspecialchars to futher decode chars like &#160;

// This is a rather quick and dirty workaround for some fields returning HTML.
// A much better solution would be to render HTML (but webviews are expensive),
// or get text from the server.
export default (text: string): string => {
  if (!text) {
    return ''
  }
  const result = entities.decodeHTML(text)
    .replace(htmlTagsRegex, '\n\n') // A few tags become new lines
    .replace(stripHtmlRegex, '') // and remove other tags
    .trim()
  return result
}
