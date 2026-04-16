/**
 * Returns "an" if the word starts with a vowel, "a" otherwise.
 */
export function indefiniteArticle(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}
