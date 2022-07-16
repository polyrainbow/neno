// More info on JSON-LD (Linked Data):
// https://moz.com/blog/json-ld-for-beginners

export default function ($: cheerio.Root) {
  const $scriptTags = $('script');
  let extracted = {};

  try {
    $scriptTags.each(function (_i, el) {
      if ($(el).attr('type') && $(el).attr('type') === 'application/ld+json') {
        extracted = JSON.parse($(el).text());
      }
    });
  } catch (e) {
    return;
  }

  return extracted;
}
