import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UIRouter } from '@uirouter/core';
import { Ng2LocationServices } from '../../src/location/locationService';

@Component({ selector: 'test', template: '' })
class TestComponent {
  constructor(public locationStrategy: LocationStrategy) {}
}

type Strategy = typeof HashLocationStrategy | typeof PathLocationStrategy;
describe('locationService', () => {
  const setup = (LocationStrategyClass: Strategy) => {
    const router = new UIRouter();
    const fixture = TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [],
      providers: [
        { provide: LocationStrategy, useClass: LocationStrategyClass },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }).createComponent(TestComponent);
    fixture.detectChanges();
    const locationStrategy = fixture.componentInstance.locationStrategy;

    return { router, fixture, locationStrategy };
  };

  const expectUrlReadAfterWrite = (strategy: Strategy, url: string) => {
    const { router, locationStrategy } = setup(HashLocationStrategy);
    const locationServices = new Ng2LocationServices(router, locationStrategy, false);

    // Set the URL
    locationServices._set(null, null, url, false);
    // Read it back
    expect(locationServices._get()).toBe(url);
    // Read it directly from Angular LocationStrategy
    expect(locationStrategy.path()).toBe(url);
  };

  describe('+ HashLocationStrategy', () => {
    it('should read/write the url path', () => {
      expectUrlReadAfterWrite(HashLocationStrategy, '/foo');
    });

    it('should read/write query params', () => {
      expectUrlReadAfterWrite(HashLocationStrategy, '/foo?query1=value1');
    });

    it('should read/write multiple query params', () => {
      expectUrlReadAfterWrite(HashLocationStrategy, '/foo?query1=value1&query2=value2');
    });

    it('should read/write multiple query params of the same name', () => {
      expectUrlReadAfterWrite(HashLocationStrategy, '/foo?query1=value1&query1=value2');
    });

    it('should read/write multiple path + query params + hash', () => {
      expectUrlReadAfterWrite(HashLocationStrategy, '/foo?query1=value1&query1=value2#hashvalue');
    });
  });

  describe('+ HashLocationStrategy', () => {
    it('should read/write the url path', () => {
      expectUrlReadAfterWrite(PathLocationStrategy, '/foo');
    });

    it('should read/write query params', () => {
      expectUrlReadAfterWrite(PathLocationStrategy, '/foo?query1=value1');
    });

    it('should read/write multiple query params', () => {
      expectUrlReadAfterWrite(PathLocationStrategy, '/foo?query1=value1&query2=value2');
    });

    it('should read/write multiple query params of the same name', () => {
      expectUrlReadAfterWrite(PathLocationStrategy, '/foo?query1=value1&query1=value2');
    });

    it('should read/write multiple path + query params + hash', () => {
      expectUrlReadAfterWrite(PathLocationStrategy, '/foo?query1=value1&query1=value2#hashvalue');
    });
  });
});
