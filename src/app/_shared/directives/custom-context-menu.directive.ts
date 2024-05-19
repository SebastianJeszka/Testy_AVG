import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { CustomContextMenuItem, CustomContextMenuEmitValue } from 'src/app/_shared/models/custom-context-menu.model';
import { ContextMenuContainerComponent } from 'src/app/_shared/components/custom-context-menu/custom-context-menu.component';

@Directive({
  selector: '[customContextMenu]'
})
export class CustomContextMenuDirective {
  @Input('customContextMenu') options: {
    modifyDataKeyInModel: string;
    contextMenuItems: CustomContextMenuItem<string>[];
  };

  @Output() contextMenuOutputEvent: EventEmitter<CustomContextMenuEmitValue<string>> = new EventEmitter<
    CustomContextMenuEmitValue<string>
  >();

  private contextMenuRef: ComponentRef<ContextMenuContainerComponent>;

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    this.createContextMenu(event);
    event.preventDefault();
    event.stopPropagation();
  }

  createContainerContextMenu(event: MouseEvent) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextMenuContainerComponent);

    this.contextMenuRef = this.viewContainerRef.createComponent(componentFactory);

    this.contextMenuRef.instance.contextMenuItems = this.options.contextMenuItems;
    this.contextMenuRef.instance.openActionEvent = event;

    const emitSubscription = this.contextMenuRef.instance.contextMenuOutputEvent.subscribe((value: string) => {
      value && this.contextMenuOutputEvent.emit({ model: this.options.modifyDataKeyInModel, value });
      this.contextMenuRef.destroy();
      emitSubscription.unsubscribe();
    });

    const host = this.el.nativeElement;
    host.insertBefore(this.contextMenuRef.location.nativeElement, host.firstChild);
  }

  createContextMenu(event: MouseEvent) {
    this.removeContextMenu();
    this.createContainerContextMenu(event);
  }

  removeContextMenu() {
    if (this.contextMenuRef) {
      this.contextMenuRef.destroy();
    }
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    this.removeContextMenu();
  }
}
