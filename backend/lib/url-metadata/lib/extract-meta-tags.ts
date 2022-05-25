export default function ($) {
  const $metaTags = $('meta');
  const extracted = {};

  $metaTags.each(function (_i, el) {
    if ($(el).attr('content')) {
      if ($(el).attr('name')) {
        extracted[$(el).attr('name')] = $(el).attr('content');
      }
      if ($(el).attr('property')) {
        extracted[$(el).attr('property')] = $(el).attr('content');
      }
      if ($(el).attr('itemprop')) {
        extracted[$(el).attr('itemprop')] = $(el).attr('content');
      }
    }
  });

  return extracted;
}
