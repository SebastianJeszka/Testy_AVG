import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';
import { LoaderComponent } from '../components/loader/loader.component';
import { NgxIbeLoaderComponent } from '@ngx-ibe/core/loader';

const HTTP_ERROR_EVENT = 'http-error';

@Directive({
  selector: '[loading]'
})
export class LoadingDirective implements OnDestroy {
  loadingFactory: ComponentFactory<NgxIbeLoaderComponent>;
  loadingComponent: ComponentRef<NgxIbeLoaderComponent>;
  eventSubscription: Subscription;
  private _loading: boolean;

  @Input()
  set loading(loading: boolean) {
    this._loading = loading;
    this.vcRef.clear();
    if (loading) {
      this.loadingComponent = this.vcRef.createComponent(this.loadingFactory);
    } else {
      this.vcRef.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private eventService: EventService
  ) {
    this.loadingFactory = this.componentFactoryResolver.resolveComponentFactory(NgxIbeLoaderComponent);
    this.eventSubscription = this.eventService.event$.subscribe((event: any) => {
      if (event.name === HTTP_ERROR_EVENT && this._loading) {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
