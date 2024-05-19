import {
  Component,
  Input,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from './branch.model';
import { TreePartDirective } from './tree-part.directive';

@Component({
  selector: 'mc-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements AfterContentInit {
  @Input() data: Branch[] = [];
  @Input() transform = (v, i) => v;
  @Input() toggleItem = (item: Branch) => this.toggleItemAction(item);

  @Output() toggle = new EventEmitter<Branch>();

  @ContentChildren(TreePartDirective)
  templates: QueryList<TreePartDirective>;

  branchTemplate: TemplateRef<TreePartDirective>;
  extraTemplate: TemplateRef<TreePartDirective>;

  constructor(private http: HttpClient) {}

  ngAfterContentInit() {
    this.templates.forEach((child: TreePartDirective) => {
      switch (child.role) {
        case TreeParts.main:
          this.branchTemplate = child.template;
          break;

        case TreeParts.extra:
          this.extraTemplate = child.template;
          break;

        default:
          this.branchTemplate = child.template;
          break;
      }
    });
  }

  trackByFn(index, item) {
    return item.id || index;
  }

  private toggleItemAction(item: Branch) {
    if (item.loading) {
      return false;
    }

    item.active = !item.active;

    if (!item.children) {
      item.children = [];
    }
    if (!item.children.length && item.childUrl && typeof item.childUrl == 'string') {
      item.loading = true;
      this.http.get(item.childUrl).subscribe(
        (res: any) => {
          item.loading = false;
          item.children = this.transform(res.list, item);
        },
        () => {
          item.loading = false;
          item.active = false;
        }
      );
    }

    this.toggle.emit(item);
  }
}

export enum TreeParts {
  main = 'main',
  extra = 'extra'
}
