define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var BlockerView = ComponentView.extend({

    events: {
      'click .js-click-scroll': 'goNext'
    },

    _isComplete: false,
    
    preRender: function() {

      Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
      });
      
      this.checkIfResetOnRevisit();
      
    },

    postRender: function() {
      this.setReadyStatus();

      this.setupInview();

      if($('.' + this.model.get('_id')).hasClass("is-complete")) {
        this.goNext();
      }

      this.listenTo(Adapt.course, 'bubble:change:_isComplete', this.setContent);

    },

    setupInview: function() {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        //this.setCompletionStatus();
        return;
      }

      this.setupInviewCompletion(selector);
      this.setupInviewContent('.blocker__inner');

    },

    setContent: function() {
     if(this._isComplete === false) {
       let screensComplete = 0;
      
        this.model.get('_blockers').forEach(function(screen, index) {
          const screenId = "" + screen._screen_id;
          if($('.' + screenId).hasClass("is-complete")) {
            screensComplete++;
          }

          // alert(Adapt.findById(screenId).get('_isComplete'));
          // if(Adapt.findById(screenId).get('_isComplete') === 1) {
          //   screensComplete++;
          // }

        });

        if(screensComplete === this.model.get('_blockers').length) {
          this.$(".blocker__header").addClass('u-display-none');
          this.$(".js-click-scroll").prop('disabled', false);
        }
      }
    },

    goNext: function() {

      this.setCompletionStatus();

    },

    getInviewElementSelector: function() {
      return '.component__inner';
      return null;
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  },
  {
    template: 'blocker'
  });

  return Adapt.register('blocker', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: BlockerView
  });
});
