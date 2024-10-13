import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedToPayComponent } from './need-to-pay.component';

describe('NeedToPayComponent', () => {
  let component: NeedToPayComponent;
  let fixture: ComponentFixture<NeedToPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedToPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
