import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCasesManagementComponent } from './test-cases-management.component';

describe('TestCasesManagementComponent', () => {
  let component: TestCasesManagementComponent;
  let fixture: ComponentFixture<TestCasesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCasesManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCasesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
