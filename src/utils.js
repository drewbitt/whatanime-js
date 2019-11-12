'use strict';

const {
  TRACE_HOST_DOMAIN
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
      let newKey = {
        'imagepreview': `${TRACE_HOST_DOMAIN}/thumbnail.php?anilist_id=${doc.anilist_id}&file=${doc.file}&t=${doc.t}&token=${doc.tokenthumb}`,
        'videopreview': `${TRACE_HOST_DOMAIN}/${doc.anilist_id}/${doc.file}?start=${doc.start}&end=${doc.end}&token=${doc.token}`
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
