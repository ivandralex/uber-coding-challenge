'use strict';

describe('Service: FoodTruck', function () {

  // load the service's module
  beforeEach(module('uberCodingChallengeApp'));

  // instantiate service
  var FoodTruck;
  beforeEach(inject(function (_FoodTruck_) {
    FoodTruck = _FoodTruck_;
  }));

  it('should do something', function () {
    expect(!!FoodTruck).toBe(true);
  });

});
