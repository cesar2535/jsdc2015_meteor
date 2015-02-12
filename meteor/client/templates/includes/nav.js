Template.nav.events({
  'click [data-action=nav-toggle]': function (event) {
    event.preventDefault();
    event.stopPropagation();
    $('[data-target=side-menu]').addClass('active');
  },
  'click [data-target=side-menu]': function (event) {
    event.preventDefault();
    event.stopPropagation();
  },
  'click [data-target=side-menu] li': function (event) {
    $('[data-target=side-menu]').removeClass('active');
  }
});