/**
 * 提取header内accept-language 并按权重进行排序
 * @param acceptLang headers['accept-language']
 */
export function parseAcceptLanguage(acceptLang: string) {
  // pl,fr-FR;q=0.3,en-US; q=0.1
  if (!acceptLang || !acceptLang.split) {
    return [];
  }
  const rawLangs: string[] = acceptLang.split(',');
  const langs: Array<{ lang: string; quality: number }> = rawLangs
    .map((rawLang: string): { lang: string, quality: number } => {
      const parts = rawLang.split(';');
      let q = 1;
      if (parts.length > 1 && parts[1].startsWith('q=')) {
        const qVal = parseFloat(parts[1].split('=')[1]);
        if (!isNaN(qVal)) {
          q = qVal;
        }
      }
      return { lang: parts[0].trim(), quality: q };
    });
  langs.sort((a, b) => a.quality - b.quality);
  return langs;
}
