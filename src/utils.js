'use strict';

const {
  TRACE_HOST_DOMAIN,
  TRACE_MEDIA_DOMAIN
} = require('./constants');


function SearchResult(
  CacheHit = null,
  RawDocsCount = null,
  RawDocsSearchTime = null,
  ReRankSearchTime = null,
  docs = null,
  limit = null,
  limit_ttl = null,
  quota = null,
  quota_ttl = null
) {
  this.CacheHit = CacheHit;
  this.RawDocsCount = RawDocsCount;
  this.RawDocsSearchTime = RawDocsSearchTime;
  this.ReRankSearchTime = ReRankSearchTime;
  this.docs = docs;
  this.limit = limit;
  this.limit_ttl = limit_ttl;
  this.quota = quota;
  this.quota_ttl = quota_ttl;
}

function getSearchResultFromBinding(json) {
  const {
    CacheHit, RawDocsCount, RawDocsSearchTime,
    ReRankSearchTime, docs, limit,
    limit_ttl, quota, quota_ttl
  } = json;

  if (docs.length > 0) {
    for (let doc of docs) {
      const encodedURI = encodeURIComponent(doc.filename);
      let newKey = {
        'imagepreview': `${TRACE_HOST_DOMAIN}/thumbnail.php?anilist_id=${doc.anilist_id}&file=${encodedURI}&t=${doc.at}&token=${doc.tokenthumb}`,
        'videopreview': `${TRACE_HOST_DOMAIN}/preview.php?anilist_id=${doc.anilist_id}&file=${encodedURI}&t=${doc.at}&token=${doc.tokenthumb}`,
        'naturalvideopreview': `${TRACE_MEDIA_DOMAIN}/video/${doc.anilist_id}/${encodedURI}?t=${doc.at}&token=${doc.tokenthumb}`,
        'naturalvideopreviewmute': `${TRACE_MEDIA_DOMAIN}/video/${doc.anilist_id}/${encodedURI}?t=${doc.at}&token=${doc.tokenthumb}&mute`
      };
      Object.assign(doc, newKey);
    }
  }
  return new SearchResult(CacheHit, RawDocsCount, RawDocsSearchTime,
    ReRankSearchTime, docs, limit,
    limit_ttl, quota, quota_ttl);
}

module.exports = {
  getSearchResultFromBinding
};
