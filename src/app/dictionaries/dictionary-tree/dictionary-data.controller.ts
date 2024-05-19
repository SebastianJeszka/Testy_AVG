import { BehaviorSubject } from 'rxjs';
import { Branch } from 'src/app/_shared/components/tree/branch.model';

export class DictionaryDataController {
  dataChange = new BehaviorSubject<Branch[]>([]);

  get data(): Branch[] {
    return this.dataChange.value;
  }

  initialize(data) {
    this.dataChange.next(data);
  }

  insertSubTerm(node: Branch, name: string) {
    this.dataChange.next(this.addNewBranch(this.data, node, name));
  }

  insertRootTerm(term: string) {
    const newBranch: Branch = {
      name: term,
      active: false,
      checked: false,
      level: 0,
      id: null,
      indeterminate: false,
      children: []
    };
    this.data.push(newBranch);
    this.dataChange.next(this.data);
  }

  removeTerm(node: Branch) {
    this.dataChange.next(this.removeBranch(this.data, node));
  }

  private removeBranch(data: Branch[], searchBranch: Branch) {
    return data.filter((item) => {
      item.children = this.removeBranch(item.children, searchBranch);
      if (item.name !== searchBranch.name) {
        return item;
      }
    });
  }

  private addNewBranch(data: Branch[], parent: Branch, title: string) {
    return data.map((item) => {
      if (item.name === parent.name) {
        item.children.push({
          id: null,
          name: title,
          level: parent.level + 1,
          active: false,
          checked: false,
          indeterminate: false,
          children: []
        });
      } else {
        item.children = this.addNewBranch(item.children, parent, title);
      }

      return item;
    });
  }

  isUnique(newName: string, parent: Branch = null) {
    if (parent) {
      return !parent.children.find((item) => item.name === newName);
    } else {
      return !this.data.find((item) => item.name === newName);
    }
  }
}
