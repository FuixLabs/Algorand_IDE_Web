import queryString from 'query-string';

function pushToUrl(key, value, history) {
    let searchObj = queryString.parse(history.location.search);
    searchObj[key] = value;
    history.push({
        search: queryString.stringify(searchObj),
    });
}

function getFromUrl(key) {
    let searchObj = queryString.parse(window.location.search);
    return searchObj[key];
}

export { pushToUrl, getFromUrl };
