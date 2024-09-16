import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseManagementComponent } from './enterprise-management.component';

describe('EnterpriseManagementComponent', () => {
  let component: EnterpriseManagementComponent;
  let fixture: ComponentFixture<EnterpriseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterpriseManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterpriseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
