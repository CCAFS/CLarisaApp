import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrayLiteratureComponent } from './grayLiterature.component';

describe('GrayLiteratureComponent', () => {
  let component: GrayLiteratureComponent;
  let fixture: ComponentFixture<GrayLiteratureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrayLiteratureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrayLiteratureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
