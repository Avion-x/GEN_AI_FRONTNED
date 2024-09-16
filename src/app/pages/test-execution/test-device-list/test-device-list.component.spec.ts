import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDeviceListComponent } from './test-device-list.component';

describe('TestDeviceListComponent', () => {
  let component: TestDeviceListComponent;
  let fixture: ComponentFixture<TestDeviceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDeviceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
