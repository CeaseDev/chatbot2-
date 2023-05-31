import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebIframeComponent } from './web-iframe.component';

describe('WebIframeComponent', () => {
  let component: WebIframeComponent;
  let fixture: ComponentFixture<WebIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
