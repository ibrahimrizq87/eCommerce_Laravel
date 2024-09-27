import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectedProductsComponent } from './rejected-products.component';

describe('RejectedProductsComponent', () => {
  let component: RejectedProductsComponent;
  let fixture: ComponentFixture<RejectedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});