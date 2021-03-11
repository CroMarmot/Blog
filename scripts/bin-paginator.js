'use strict';
// replace default paginator
const {Pagination} = require('@cromarmot/pagination');

function binPaginatorHelper(options = {}) {
  const current = options.current || this.page.current || 0;
  const total = options.total || this.page.total || 1;
  const endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
  const midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
  const { space = '&hellip;', transform } = options;
  const base = options.base || this.page.base || '';
  const format = options.format || `${this.config.pagination_dir}/%d/`;
  const prevText = options.prev_text || 'Prev';
  const nextText = options.next_text || 'Next';
  const prevNext = options.hasOwnProperty('prev_next') ? options.prev_next : true;

  if (!current) return '';

  const currentPage = `<span class="page-number current">${transform ? transform(current) : current}</span>`;

  const link = i => this.url_for(i === 1 ? base : base + format.replace('%d', i));

  const pageLink = i => `<a class="page-number" href="${link(i)}">${transform ? transform(i) : i}</a>`;

  let result = '';
  // Display the link to the previous page
  if (prevNext && current > 1) {
    result += `<a class="extend prev" rel="prev" href="${link(current - 1)}">${prevText}</a>`;
  }

  if (options.show_all) {
    // Display pages on the left side of the current page
    for (let i = 1; i < current; i++) {
      result += pageLink(i);
    }

    // Display the current page
    result += currentPage;

    // Display pages on the right side of the current page
    for (let i = current + 1; i <= total; i++) {
      result += pageLink(i);
    }
  } else {
    const idxList = (new Pagination()).setRange(1, total, current).list;
    const spaceHtml = `<span class="space">${space}</span>`;

    // Display pages on the left edge
    idxList.forEach((i)=>{
      if(i == current){
        result += currentPage;
      }else{
        result += pageLink(i);
      }
    });
  }

  // Display the link to the next page
  if (prevNext && current < total) {
    result += `<a class="extend next" rel="next" href="${link(current + 1)}">${nextText}</a>`;
  }

  return result;
}

hexo.extend.helper.register('paginator', binPaginatorHelper);
