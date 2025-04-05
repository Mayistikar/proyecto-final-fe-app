import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { LoginClientService } from '../services/login-client.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let loginServiceSpy: jasmine.SpyObj<LoginClientService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    const loginSpy = jasmine.createSpyObj('LoginClientService', ['getUserRole']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: LoginClientService, useValue: loginSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    loginServiceSpy = TestBed.inject(LoginClientService) as jasmine.SpyObj<LoginClientService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    route = new ActivatedRouteSnapshot();
  });

  it('should allow access when user role matches expected role', () => {
    route.data = { expectedRole: 'admin' };
    loginServiceSpy.getUserRole.and.returnValue('admin');

    expect(guard.canActivate(route)).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user role does not match', () => {
    route.data = { expectedRole: 'admin' };
    loginServiceSpy.getUserRole.and.returnValue('user');

    expect(guard.canActivate(route)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});


