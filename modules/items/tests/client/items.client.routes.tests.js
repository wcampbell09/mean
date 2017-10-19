(function () {
  'use strict';

  describe('Items Route Tests', function () {
    // Initialize global variables
    var $scope,
      ItemsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ItemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ItemsService = _ItemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('items');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/items');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('items.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/items/client/views/list-items.client.view.html');
        });
      });
      
      describe('Create Route', function () {
        var createstate,
          ItemsController,
          mockItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('items.create');
          $templateCache.put('/modules/items/client/views/form-item.client.view.html', '');

          // Create mock item
          mockItem = new ItemsService();

          // Initialize Controller
          ItemsController = $controller('ItemsController as vm', {
            $scope: $scope,
            itemResolve: mockItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.itemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/items/create');
        }));

        it('should attach an item to the controller scope', function () {
          expect($scope.vm.item._id).toBe(mockItem._id);
          expect($scope.vm.item._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/items/client/views/form-item.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ItemsController,
          mockItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('items.edit');
          $templateCache.put('/modules/items/client/views/form-item.client.view.html', '');

          // Create mock items
          mockItem = new ItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Item about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ItemsController = $controller('ItemsController as vm', {
            $scope: $scope,
            itemResolve: mockItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:itemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.itemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            itemId: 1
          })).toEqual('/items/1/edit');
        }));

        it('should attach an item to the controller scope', function () {
          expect($scope.vm.item._id).toBe(mockItem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/items/client/views/form-item.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/items/client/views/list-items.client.view.html', '');

          $state.go('items.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('items/');
          $rootScope.$digest();

          expect($location.path()).toBe('/items');
          expect($state.current.templateUrl).toBe('/modules/items/client/views/list-items.client.view.html');
        }));
      });
    });
  });
}());
