'use strict';

const {
  getSearchResultFromBinding
} = require('./utils');

const {
  TRACE_HOST_API_DOMAIN,
  TRACE_SEARCH_QUERY_PATH,
  TRACE_SEARCH_QUERY_URL_PATH,
  FORMAT_SUPPORTED,
  HEADERS,
  REGEX_VALIDATION_URL
} = require('./constants');

const axios = require('axios');
const fileType = require('file-type');
const fs = require('fs');
const readChunk = require('read-chunk');

function searchAnime(imagePath) {
  if (!fs.existsSync(imagePath)) {
    return Promise.reject(new Error(`The system cannot find the path specified: '${imagePath}'`));
  }
  const statFile = fs.statSync(imagePath);
  if (!statFile.isFile()) {
    return Promise.reject(new Error(`The system find the path but this is not file: '${imagePath}'`));
  }
  const checkFileType = fileType(readChunk.sync(imagePath, 0, fileType.minimumBytes));
  if (!checkFileType) {
    return Promise.reject(
      new TypeError(`You should ensure your format file is: ${FORMAT_SUPPORTED}`)
    );
  }
  if (FORMAT_SUPPORTED.indexOf(checkFileType.ext) <= -1) {
    return Promise.reject(
      new TypeError(`You should ensure your format file is: ${FORMAT_SUPPORTED}`)
    );
  }
  const encImgToB64 = fs.readFileSync(imagePath, 'base64');
  const imgFormatB64 = `data:image/jpeg;base64,${encImgToB64}`;
  const buffer = Buffer.from(imgFormatB64.substring(imgFormatB64.indexOf(',') + 1));
  const bufferSize = Math.floor(buffer.length / (1024 ** 2) * 10);
  if (!bufferSize < 1) {
    return Promise.reject(new Error('You should ensure your Base64 encoded image is < 10MB'));
  }
  const options = {
    method: "POST",
    headers: HEADERS,
    data: JSON.stringify({ image: imgFormatB64 })
  };
  return axios(`${TRACE_HOST_API_DOMAIN}${TRACE_SEARCH_QUERY_PATH}`, options)
    .then(res => {
      return getSearchResultFromBinding(res.data);
    })
    .catch(err => {
      if (err.response) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    });
}

function searchAnimeWithURL(url) {
  if (!REGEX_VALIDATION_URL.test(url)) {
    return Promise.reject(new Error(`This is URL not valid: ${url}`));
  }
  const options = {
    method: 'GET',
    headers: { 'User-Agent': HEADERS['User-Agent'] }
  };
  return axios(`${TRACE_HOST_API_DOMAIN}${TRACE_SEARCH_QUERY_URL_PATH}` + url, options)
    .then(res => {
      return getSearchResultFromBinding(res.data);
    })
    .catch(err => {
      if (err.response) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    })
}

module.exports = {
  searchAnime,
  searchAnimeWithURL
};