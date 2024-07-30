import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseParametersComponent } from './test-case-parameters.component';

describe('TestCaseParametersComponent', () => {
  let component: TestCaseParametersComponent;
  let fixture: ComponentFixture<TestCaseParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCaseParametersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCaseParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
