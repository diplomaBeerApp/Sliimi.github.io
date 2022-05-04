import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerPhotoComponent } from './beer-photo.component';

describe('BeerPhotoComponent', () => {
  let component: BeerPhotoComponent;
  let fixture: ComponentFixture<BeerPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeerPhotoComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
