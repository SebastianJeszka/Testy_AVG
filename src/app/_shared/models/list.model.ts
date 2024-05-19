export class List<T> {
  count: number;
  items: T[] = [];

  constructor(count?, items?) {
    this.count = count;
    this.items = items ? items : [];
  }
}

export const splitListForPages = function (list: List<any>, perPage: number = 10) {
  let pageCounter = 0,
    itemCounter = 0;
  const listPages = {};
  list.items.forEach((item, i: number) => {
    itemCounter++;
    if (!Array.isArray(listPages[pageCounter])) {
      listPages[pageCounter] = [];
    }
    listPages[pageCounter].push(item);
    if (itemCounter === perPage) {
      pageCounter++;
      itemCounter = 0;
    }
  });

  return listPages;
};
